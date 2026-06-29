/**
 * Booking Service — Firebase Realtime Database
 * Handles "Pay Advance to Book" feature for high-value jewelry
 *
 * Advance breakdown (30% total):
 *   - 5%  → Platform charges (Ornamis)
 *   - 25% → Booking advance (refundable on pickup)
 */

import { ref, get, set, update, push, query, orderByChild, equalTo } from "firebase/database";
import { db } from "../lib/firebaseClient";

// ─── Constants ────────────────────────────────────────────────────────────────

export const ADVANCE_PERCENT = 0.30;      // 30% total advance
export const PLATFORM_PERCENT = 0.05;     // 5% platform charges (non-refundable)
export const BOOKING_ADVANCE_PERCENT = 0.25; // 25% booking advance (paid in advance, credited at pickup)

// ─── Types ────────────────────────────────────────────────────────────────────

export type BookingStatus = "Booked" | "Available" | "Released";

export interface BookingItem {
  productId: string;
  productName: string;
  productImage: string;
  productPrice: number;
  storeName: string;
  storeSlug: string;
  category: string;
  quantity: number;
}

export interface Booking {
  id: string;
  items: BookingItem[];            // one or more items (grouped by store)
  totalPrice: number;
  advanceAmount: number;           // 30% of totalPrice
  platformCharges: number;         // 5% of totalPrice
  bookingAdvance: number;          // 25% of totalPrice (credited at pickup)
  remainingAmount: number;         // 70% to pay in-store
  userId: string;
  userEmail: string;
  userName: string;
  bookingStatus: BookingStatus;
  isBooked: boolean;
  createdAt: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  storeName: string;               // primary store (all items from same store)
  storeSlug: string;
  bookingRef: string;              // human-readable e.g. "BK-20240429-A3F2"
  pickupInstructions: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateBookingRef(): string {
  const date = new Date();
  const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BK-${dateStr}-${random}`;
}

function calcAmounts(totalPrice: number) {
  const advanceAmount = Math.round(totalPrice * ADVANCE_PERCENT);
  const platformCharges = Math.round(totalPrice * PLATFORM_PERCENT);
  const bookingAdvance = Math.round(totalPrice * BOOKING_ADVANCE_PERCENT);
  const remainingAmount = totalPrice - advanceAmount;
  return { advanceAmount, platformCharges, bookingAdvance, remainingAmount };
}

// ─── CRUD Operations ──────────────────────────────────────────────────────────

/**
 * Create a new booking after successful Razorpay payment.
 * Items should all belong to the same store (grouped upstream).
 */
export async function createBooking(
  userId: string,
  userEmail: string,
  userName: string,
  items: BookingItem[],
  razorpayOrderId?: string,
  razorpayPaymentId?: string
): Promise<Booking> {
  const totalPrice = items.reduce(
    (sum, item) => sum + item.productPrice * item.quantity,
    0
  );
  const amounts = calcAmounts(totalPrice);
  const storeName = items[0]?.storeName ?? "Store";
  const storeSlug = items[0]?.storeSlug ?? "stores";
  const bookingRef = generateBookingRef();
  const pickupInstructions = `Visit ${storeName} with booking reference ${bookingRef}. Show your booking confirmation and complete the remaining payment of ₹${amounts.remainingAmount.toLocaleString("en-IN")} to collect your jewelry.`;

  const newBookingRef = push(ref(db, "bookings"));
  const id = newBookingRef.key!;

  const booking: Booking = {
    id,
    items,
    totalPrice,
    ...amounts,
    userId,
    userEmail,
    userName,
    bookingStatus: "Booked",
    isBooked: true,
    createdAt: new Date().toISOString(),
    razorpayOrderId,
    razorpayPaymentId,
    storeName,
    storeSlug,
    bookingRef,
    pickupInstructions,
  };

  await set(newBookingRef, booking);

  // Mark each product as booked in a separate /bookedProducts node for O(1) lookup
  const bookedProductsUpdate: Record<string, any> = {};
  for (const item of items) {
    bookedProductsUpdate[`bookedProducts/${item.productId}`] = {
      bookingId: id,
      userId,
      bookingStatus: "Booked",
    };
  }
  await update(ref(db), bookedProductsUpdate);

  return booking;
}

/**
 * Get all bookings for a specific user.
 */
export async function getUserBookings(userId: string): Promise<Booking[]> {
  try {
    const bookingsRef = ref(db, "bookings");
    const userBookingsQuery = query(bookingsRef, orderByChild("userId"), equalTo(userId));
    const snap = await get(userBookingsQuery);
    if (!snap.exists()) return [];
    return Object.values(snap.val() as Record<string, Booking>).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch {
    return [];
  }
}

/**
 * Get ALL bookings (admin only).
 */
export async function getAllBookings(): Promise<Booking[]> {
  try {
    const snap = await get(ref(db, "bookings"));
    if (!snap.exists()) return [];
    return Object.values(snap.val() as Record<string, Booking>).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch {
    return [];
  }
}

/**
 * Admin: release a booking — makes products available again.
 */
export async function releaseBooking(bookingId: string): Promise<void> {
  const bookingSnap = await get(ref(db, `bookings/${bookingId}`));
  if (!bookingSnap.exists()) throw new Error("Booking not found");

  const booking = bookingSnap.val() as Booking;
  const updates: Record<string, any> = {};

  updates[`bookings/${bookingId}/bookingStatus`] = "Released";
  updates[`bookings/${bookingId}/isBooked`] = false;

  for (const item of booking.items) {
    updates[`bookedProducts/${item.productId}`] = null; // delete
  }

  await update(ref(db), updates);
}

/**
 * Check if a single product is already booked (fast lookup).
 */
export async function isProductBooked(productId: string): Promise<boolean> {
  try {
    const snap = await get(ref(db, `bookedProducts/${productId}`));
    return snap.exists();
  } catch {
    return false;
  }
}

/**
 * Get booking status of multiple products in one call.
 * Returns a map of productId → true if booked.
 */
export async function getBulkBookingStatus(
  productIds: string[]
): Promise<Record<string, boolean>> {
  try {
    const snap = await get(ref(db, "bookedProducts"));
    if (!snap.exists()) return {};
    const data = snap.val() as Record<string, any>;
    const result: Record<string, boolean> = {};
    for (const id of productIds) {
      result[id] = !!data[id];
    }
    return result;
  } catch {
    return {};
  }
}

/**
 * Compute advance amount breakdown for a given price.
 */
export function computeAdvanceBreakdown(totalPrice: number) {
  return calcAmounts(totalPrice);
}
