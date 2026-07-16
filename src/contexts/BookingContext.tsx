/* @refresh reset */
/**
 * BookingContext — provides booking state & actions to the entire app.
 *
 * Usage:
 *   const { bookings, bookedProductIds, createBooking, releaseBooking } = useBooking();
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import {
  createBooking as svcCreateBooking,
  getUserBookings,
  getAllBookings,
  releaseBooking as svcReleaseBooking,
  type Booking,
  type BookingItem,
} from "../services/bookingService";

// ─── Context Shape ────────────────────────────────────────────────────────────

interface BookingContextType {
  /** All bookings for the current user */
  bookings: Booking[];
  /** All bookings (admin use) */
  allBookings: Booking[];
  /** Set of productIds that are currently booked (any user) */
  bookedProductIds: Set<string>;
  /** Whether bookings are loading */
  isLoadingBookings: boolean;
  /** Create a booking after successful Razorpay payment */
  createBooking: (
    items: BookingItem[],
    razorpayOrderId?: string,
    razorpayPaymentId?: string
  ) => Promise<Booking>;
  /** Admin: release a booking back to Available */
  releaseBooking: (bookingId: string) => Promise<void>;
  /** Refetch user bookings from Firebase */
  refreshBookings: () => Promise<void>;
  /** Refetch admin bookings from Firebase */
  refreshAllBookings: () => Promise<void>;
  /** Check if a productId is in the booked set (fast, in-memory) */
  isBooked: (productId: string) => boolean;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function BookingProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [bookedProductIds, setBookedProductIds] = useState<Set<string>>(new Set());
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);

  // ── Load user bookings whenever auth state changes ─────────────────────────

  const refreshBookings = useCallback(async () => {
    if (!user?.id) {
      setBookings([]);
      return;
    }
    setIsLoadingBookings(true);
    try {
      const data = await getUserBookings(user.id);
      setBookings(data);
    } finally {
      setIsLoadingBookings(false);
    }
  }, [user?.id]);

  const refreshAllBookings = useCallback(async () => {
    const data = await getAllBookings();
    setAllBookings(data);
  }, []);

  // We load booked-product IDs on mount and after every booking action
  const refreshBookedIds = useCallback(async () => {
    try {
      // Fetch the whole bookedProducts node
      const { ref: fbRef, get } = await import("firebase/database");
      const { db } = await import("../lib/firebaseClient");
      const snap = await get(fbRef(db, "bookedProducts"));
      if (!snap.exists()) {
        setBookedProductIds(new Set());
        return;
      }
      setBookedProductIds(new Set(Object.keys(snap.val())));
    } catch {
      setBookedProductIds(new Set());
    }
  }, []);

  useEffect(() => {
    refreshBookedIds();
  }, [refreshBookedIds]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshBookings();
    } else {
      setBookings([]);
    }
  }, [isAuthenticated, refreshBookings]);

  // ── Actions ───────────────────────────────────────────────────────────────

  const createBooking = async (
    items: BookingItem[],
    razorpayOrderId?: string,
    razorpayPaymentId?: string
  ): Promise<Booking> => {
    if (!user) throw new Error("Not authenticated");
    const booking = await svcCreateBooking(
      user.id,
      user.email,
      user.name,
      items,
      razorpayOrderId,
      razorpayPaymentId
    );
    await refreshBookings();
    await refreshBookedIds();
    return booking;
  };

  const releaseBooking = async (bookingId: string): Promise<void> => {
    await svcReleaseBooking(bookingId);
    await refreshAllBookings();
    await refreshBookedIds();
  };

  const isBooked = (productId: string) => bookedProductIds.has(productId);

  return (
    <BookingContext.Provider
      value={{
        bookings,
        allBookings,
        bookedProductIds,
        isLoadingBookings,
        createBooking,
        releaseBooking,
        refreshBookings,
        refreshAllBookings,
        isBooked,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within a BookingProvider");
  return ctx;
}
