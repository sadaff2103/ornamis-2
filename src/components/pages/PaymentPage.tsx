/**
 * PaymentPage
 *
 * A dedicated, full-page payment screen for "Pay Advance to Book" flow.
 * This receives booking items as props (passed from CartPage via App.tsx state)
 * and handles the full Razorpay payment + Firebase booking creation lifecycle.
 *
 * Flow:
 *   CartPage → onNavigate("payment", { items }) → PaymentPage → Razorpay → BookingContext → Dashboard
 */

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Lock,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Store,
  Shield,
  Package,
  Gem,
  RefreshCcw,
} from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useBooking } from "../../contexts/BookingContext";
import { useAuth } from "../../contexts/AuthContext";
import { computeAdvanceBreakdown, type BookingItem } from "../../services/bookingService";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PaymentPageProps {
  onNavigate: (page: string, params?: any) => void;
  onBack?: () => void;
  items: BookingItem[];
}

// ─── Razorpay global type ─────────────────────────────────────────────────────

declare global {
  interface Window {
    Razorpay: any;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const INR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

type PayStep = "review" | "processing" | "success" | "failed";

export function PaymentPage({ onNavigate, onBack, items }: PaymentPageProps) {
  const { createBooking } = useBooking();
  const { user } = useAuth();

  const [step, setStep] = useState<PayStep>("review");
  const [bookingRef, setBookingRef] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Lock body scroll while on this page
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  // Guard: if no items passed, go back to cart
  useEffect(() => {
    if (!items || items.length === 0) {
      toast.error("No items found for payment. Please return to your cart.");
      onNavigate("cart");
    }
  }, [items, onNavigate]);

  if (!items || items.length === 0) return null;

  // ── Derived financial values ────────────────────────────────────────────────

  const totalPrice = items.reduce((sum, item) => sum + item.productPrice * item.quantity, 0);
  const { advanceAmount, platformCharges, bookingAdvance, remainingAmount } =
    computeAdvanceBreakdown(totalPrice);
  const storeName = items[0]?.storeName ?? "Store";

  // ── Payment handler ─────────────────────────────────────────────────────────

  const handlePay = async () => {
    setErrorMsg("");
    setStep("processing");

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setErrorMsg("Payment gateway could not be loaded. Please check your internet connection.");
        setStep("failed");
        return;
      }

      const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_placeholder";

      const options = {
        key: RAZORPAY_KEY,
        amount: Math.round(advanceAmount * 100), // paise
        currency: "INR",
        name: "Ornamis",
        description: `Advance Booking — ${storeName}`,
        prefill: {
          name: user?.email?.split("@")[0] ?? "",
          email: user?.email ?? "",
        },
        notes: {
          storeName,
          productIds: items.map((i) => i.productId).join(","),
        },
        theme: { color: "#d4af37" },
        handler: async (response: any) => {
          try {
            const booking = await createBooking(
              items,
              response.razorpay_order_id,
              response.razorpay_payment_id
            );
            setBookingRef(booking.bookingRef);
            setStep("success");
            toast.success("Reservation confirmed! 🎉");
          } catch (err) {
            setErrorMsg(
              "Payment was received but booking could not be saved. Please contact support with your payment ID: " +
                response.razorpay_payment_id
            );
            setStep("failed");
          }
        },
        modal: {
          ondismiss: () => {
            if (step === "processing") setStep("review");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (res: any) => {
        setErrorMsg(res?.error?.description || "Payment failed. Please try again.");
        setStep("failed");
      });
      rzp.open();
    } catch (err) {
      setErrorMsg("An unexpected error occurred. Please try again.");
      setStep("failed");
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 bg-[#fcf9f2] z-[9999] flex flex-col overflow-hidden text-[#492f0e] selection:bg-[#492f0e]/10">
      {/* ── Top Navigation Bar ── */}
      <header className="h-16 bg-white border-b border-[#492f0e]/10 flex items-center justify-between px-6 lg:px-10 shrink-0">
        <button
          onClick={step === "success" ? () => onNavigate("dashboard") : (onBack ?? (() => onNavigate("cart")))}
          className="flex items-center gap-2 text-[#492f0e]/60 hover:text-[#362312] transition-colors text-sm font-bold uppercase tracking-wider"
        >
          <ArrowLeft className="size-4" />
          {step === "success" ? "My Bookings" : "Back to Cart"}
        </button>

        <div className="flex items-center gap-2">
          <Gem className="size-4 text-[#d4af37]" />
          <span className="font-['Cinzel',serif] text-[#362312] text-base tracking-widest uppercase">
            Ornamis
          </span>
        </div>

        <div className="flex items-center gap-2 text-[#492f0e]/40 text-xs font-bold uppercase tracking-widest">
          <Lock className="size-3.5 text-[#d4af37]" />
          <span className="hidden sm:block">256-bit Secure</span>
        </div>
      </header>

      {/* ── Step Indicator ── */}
      {step !== "success" && step !== "failed" && (
        <div className="bg-white border-b border-[#492f0e]/5 px-6 py-3 flex items-center gap-6 shrink-0">
          {["Cart", "Review Order", "Payment", "Confirmation"].map((label, i) => {
            const isActive = i === 1 || (i === 2 && step === "processing");
            const isDone = i === 0;
            return (
              <div key={label} className="flex items-center gap-2">
                <div className={`size-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                  isDone ? "bg-[#d4af37] text-black" :
                  isActive ? "bg-[#d4af37]/20 border border-[#d4af37] text-[#d4af37]" :
                  "bg-white/5 text-[#d4b896]/30"
                }`}>
                  {isDone ? "✓" : i + 1}
                </div>
                <span className={`text-[11px] font-bold uppercase tracking-wider hidden sm:block ${
                  isActive ? "text-[#362312]" : isDone ? "text-[#d4af37]" : "text-[#492f0e]/30"
                }`}>{label}</span>
                {i < 3 && <div className="w-8 h-[1px] bg-white/5 hidden sm:block" />}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-y-auto">
        {/* ── SUCCESS SCREEN ── */}
        {step === "success" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="h-full flex items-center justify-center p-8"
          >
            <div className="max-w-lg w-full text-center space-y-8">
              <div className="flex justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.15 }}
                  className="size-32 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center relative"
                >
                  <CheckCircle2 className="size-16 text-[#d4af37]" />
                  <motion.div
                    animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="absolute inset-0 rounded-full border border-[#d4af37]/30"
                  />
                </motion.div>
              </div>

              <div className="space-y-2">
                <h1 className="font-['Cinzel',serif] text-[#362312] text-4xl uppercase tracking-tighter">
                  Reservation Confirmed
                </h1>
                <p className="text-[#492f0e]/60 text-lg">
                  Your jewelry is exclusively reserved at{" "}
                  <strong className="text-[#362312]">{storeName}</strong>.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-white border border-[#492f0e]/10 space-y-6 text-left shadow-xl">
                <div className="text-center">
                  <span className="text-[9px] text-[#d4af37] font-bold uppercase tracking-[0.3em] block mb-2">
                    Booking Reference ID
                  </span>
                  <span className="text-3xl font-mono font-bold text-[#362312] tracking-[0.15em]">
                    {bookingRef}
                  </span>
                </div>

                <Separator className="bg-[#492f0e]/10" />

                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#492f0e]/60">Amount Paid</span>
                    <span className="text-[#d4af37] font-bold">{INR(advanceAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#492f0e]/60">Balance at Store</span>
                    <span className="text-[#362312] font-bold">{INR(remainingAmount)}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-[#d4af37]/5 rounded-2xl border border-[#d4af37]/10">
                  <Package className="size-5 text-[#d4af37] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#d4b896]/80 leading-relaxed">
                    Visit <strong>{storeName}</strong> with booking ID{" "}
                    <strong className="text-[#d4af37]">{bookingRef}</strong> and pay the
                    remaining <strong>{INR(remainingAmount)}</strong> to collect your jewelry.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => onNavigate("dashboard")}
                  className="flex-1 h-14 text-base font-bold"
                  style={{ background: "linear-gradient(135deg, #d4af37 0%, #f4e5b8 100%)", color: "#1a1510", border: "none" }}
                >
                  View My Bookings
                </Button>
                <Button
                  onClick={() => onNavigate("collections")}
                  variant="outline"
                  className="flex-1 h-14 border-[#492f0e]/20 text-[#492f0e] hover:bg-[#492f0e]/5"
                >
                  Browse More
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── FAILURE SCREEN ── */}
        {step === "failed" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full flex items-center justify-center p-8"
          >
            <div className="max-w-md w-full text-center space-y-8">
              <div className="flex justify-center">
                <div className="size-24 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="size-12 text-red-400" />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="font-['Cinzel',serif] text-[#362312] text-2xl">Payment Failed</h2>
                <p className="text-[#492f0e]/60 text-sm leading-relaxed">{errorMsg}</p>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => { setStep("review"); setErrorMsg(""); }}
                  className="w-full h-14 text-base font-bold flex items-center gap-2"
                  style={{ background: "linear-gradient(135deg, #d4af37 0%, #f4e5b8 100%)", color: "#1a1510", border: "none" }}
                >
                  <RefreshCcw className="size-5" />
                  Try Again
                </Button>
                <Button
                  onClick={() => onNavigate("cart")}
                  variant="ghost"
                  className="w-full text-[#d4b896]/50 hover:text-[#f4e5b8] text-sm"
                >
                  ← Return to Cart
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── REVIEW + PROCESSING SCREENS ── */}
        {(step === "review" || step === "processing") && (
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-12 min-h-full">
            {/* Left: Order Review */}
            <div className="lg:col-span-7 p-6 lg:p-12 space-y-8 border-b lg:border-b-0 lg:border-r border-[#492f0e]/5">
              {/* Store pickup info */}
              <div className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-[#492f0e]/10 shadow-sm">
                <div className="size-12 rounded-2xl bg-[#d4af37]/10 flex items-center justify-center shrink-0">
                  <Store className="size-6 text-[#d4af37]" />
                </div>
                <div>
                  <h2 className="text-[#362312] text-base font-bold">Pick up from {storeName}</h2>
                  <p className="text-[#492f0e]/50 text-xs mt-0.5">
                    Exclusively reserved for you upon advance payment
                  </p>
                </div>
                <Badge className="ml-auto bg-[#d4af37] text-black border-none font-bold text-[10px] shrink-0">
                  {items.length} {items.length === 1 ? "PIECE" : "PIECES"}
                </Badge>
              </div>

              {/* Product list */}
              <div className="space-y-3">
                <h3 className="text-[#492f0e]/50 text-[10px] font-bold uppercase tracking-[0.2em]">
                  Order Items
                </h3>
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex gap-5 p-5 rounded-2xl bg-white border border-[#492f0e]/5 group hover:border-[#d4af37]/20 transition-all shadow-sm"
                  >
                    <div className="size-20 rounded-xl overflow-hidden bg-[#fcf9f2] border border-[#492f0e]/10 shrink-0">
                      <ImageWithFallback
                        src={item.productImage}
                        alt={item.productName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <h4 className="text-[#362312] font-bold text-sm leading-snug line-clamp-2">
                        {item.productName}
                      </h4>
                      <p className="text-[#492f0e]/40 text-[10px] uppercase tracking-widest">
                        {item.category}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-[#492f0e]/40 bg-[#492f0e]/5 px-2 py-0.5 rounded-full">
                          Qty: {item.quantity}
                        </span>
                        <span className="text-[#d4af37] font-bold text-sm">
                          {INR(item.productPrice * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Ornamis Guarantee */}
              <div className="p-5 rounded-2xl bg-blue-500/[0.04] border border-blue-500/10 flex gap-4 items-start">
                <Shield className="size-5 text-blue-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-blue-300">Ornamis Buyer Guarantee</p>
                  <p className="text-[11px] text-blue-300/50 leading-relaxed">
                    Your reservation deposit (25%) is fully refundable if you decide not to
                    proceed after in-store inspection. Platform charges (5%) are non-refundable
                    and cover the cost of exclusively holding this item for you.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Payment Summary */}
            <div className="lg:col-span-5 p-6 lg:p-12 flex flex-col justify-center">
              <div className="space-y-6">
                <div>
                  <h3 className="text-[#492f0e]/50 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                    Payment Summary
                  </h3>

                  <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#492f0e]/60">Jewelry Subtotal</span>
                        <span className="text-[#362312] font-bold">{INR(totalPrice)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#492f0e]/60">Platform Surcharge (5%)</span>
                        <span className="text-[#362312]">{INR(platformCharges)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-[#d4af37] font-bold">
                        <span>Reservation Deposit (25%)</span>
                        <span>{INR(bookingAdvance)}</span>
                      </div>
                  </div>
                </div>

                <Separator className="bg-[#d4af37]/10" />

                {/* Advance to pay now */}
                <div className="p-6 rounded-3xl bg-white border border-[#d4af37]/25 space-y-2 shadow-inner">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-[#d4af37] font-bold uppercase tracking-widest">
                      Pay Now (Advance)
                    </span>
                    <Badge className="bg-[#d4af37] text-[#492f0e] border-none text-[9px] font-bold">30%</Badge>
                  </div>
                  <p className="text-5xl font-bold text-[#362312] font-serif">{INR(advanceAmount)}</p>
                </div>

                <div className="flex justify-between text-sm px-1">
                  <span className="text-[#492f0e]/40 text-xs uppercase tracking-wider font-bold">
                    Remaining at Store (70%)
                  </span>
                  <span className="text-[#362312]/50 font-bold">{INR(remainingAmount)}</span>
                </div>

                {/* CTA Button */}
                <Button
                  onClick={handlePay}
                  disabled={step === "processing"}
                  className="w-full h-16 text-lg font-bold shadow-[0_20px_40px_rgba(212,175,55,0.12)] active:scale-[0.98] transition-all"
                  style={{
                    background: "linear-gradient(135deg, #d4af37 0%, #f4e5b8 100%)",
                    color: "#1a1510",
                    border: "none",
                    borderRadius: "1rem",
                  }}
                >
                  {step === "processing" ? (
                    <div className="flex items-center gap-3">
                      <div className="size-6 border-2 border-[#1a1510]/30 border-t-[#1a1510] rounded-full animate-spin" />
                      Connecting to Razorpay...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <CreditCard className="size-6" />
                      Pay {INR(advanceAmount)} to Reserve
                    </div>
                  )}
                </Button>

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-4 text-[9px] text-[#492f0e]/30 uppercase tracking-[0.15em]">
                  <span className="flex items-center gap-1">
                    <Lock className="size-3" /> SSL Encrypted
                  </span>
                  <span>·</span>
                  <span>PCI COMPLIANT</span>
                  <span>·</span>
                  <span>RAZORPAY SECURED</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
