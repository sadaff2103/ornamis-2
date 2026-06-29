/**
 * AdvanceBookingModal
 *
 * A rich confirmation + Razorpay payment modal for the "Pay Advance to Book" feature.
 *
 * Price breakdown (30% advance):
 *   - 5%  → Platform charges (non-refundable)
 *   - 25% → Booking advance (credited at pickup)
 *   - 70% → Remaining — paid in-store
 *
 * Razorpay is loaded from their CDN (no npm package needed) and invoked
 * directly in the browser via window.Razorpay.
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Store,
  CreditCard,
  CheckCircle2,
  Lock,
  AlertTriangle,
  Package,
  Shield,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Card } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useBooking } from "../contexts/BookingContext";
import { computeAdvanceBreakdown, type BookingItem } from "../services/bookingService";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdvanceBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** All items to book (all from same store, or single item) */
  items: BookingItem[];
  onSuccess?: (bookingRef: string) => void;
}

// ─── Razorpay types (window global) ──────────────────────────────────────────

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

export function AdvanceBookingModal({
  isOpen,
  onClose,
  items,
  onSuccess,
}: AdvanceBookingModalProps) {
  const { createBooking } = useBooking();
  const [step, setStep] = useState<"confirm" | "processing" | "success">("confirm");
  const [successRef, setSuccessRef] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStep("confirm");
      setError(null);
      // Disable body scroll when modal is open
      document.body.style.overflow = "hidden";
    } else {
      // Re-enable scroll when modal is closed
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || items.length === 0) return null;

  const totalPrice = items.reduce((sum, item) => sum + item.productPrice * item.quantity, 0);
  const { advanceAmount, platformCharges, bookingAdvance, remainingAmount } = computeAdvanceBreakdown(totalPrice);
  const storeName = items[0]?.storeName ?? "Store";

  const handlePayNow = async () => {
    setError(null);
    setStep("processing");
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setError("Payment gateway failed to load.");
        setStep("confirm");
        return;
      }
      const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_placeholder";
      const options = {
        key: RAZORPAY_KEY,
        amount: Math.round(advanceAmount * 100),
        currency: "INR",
        name: "Ornamis Secure Checkout",
        description: `Advance for ${storeName}`,
        handler: async (response: any) => {
          try {
            const booking = await createBooking(items, response.razorpay_order_id, response.razorpay_payment_id);
            setSuccessRef(booking.bookingRef);
            setStep("success");
            onSuccess?.(booking.bookingRef);
          } catch (err) {
            setError("Payment successful, but booking recording failed.");
            setStep("confirm");
          }
        },
        theme: { color: "#d4af37" },
        modal: { ondismiss: () => setStep("confirm") },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError("Unexpected error occurred.");
      setStep("confirm");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="fixed inset-0 bg-[#0a0a0a] z-[9999] flex flex-col overflow-hidden"
        >
          {/* Top Header - Amazon Style */}
          <header className="h-20 bg-[#1a1612] border-b border-[#d4af37]/20 flex items-center justify-between px-8 shrink-0">
            <div className="flex items-center gap-4">
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-[#d4b896]">
                <X className="size-6" />
              </button>
              <div className="h-8 w-[1px] bg-[#d4af37]/20 mx-2" />
              <div>
                <h1 className="font-['Cinzel',serif] text-[#f4e5b8] text-xl tracking-wider uppercase">Secure Checkout</h1>
                <p className="text-[10px] text-[#d4b896]/50 font-bold uppercase tracking-[0.2em]">Step 2 of 2: Confirm Booking</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[#d4b896]/60 text-xs font-bold uppercase tracking-widest">
              <Lock className="size-4 text-[#d4af37]" />
              Secure 256-Bit SSL
            </div>
          </header>

          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 p-8 lg:p-12">
              
              {/* Left Column - Items & Store Info */}
              <div className="lg:col-span-8 space-y-10">
                {step !== "success" ? (
                  <>
                    {/* Store Header */}
                    <div className="p-6 rounded-3xl bg-[#14110e] border border-[#d4af37]/10 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-[#d4af37]/10 flex items-center justify-center">
                          <Store className="size-6 text-[#d4af37]" />
                        </div>
                        <div>
                          <h2 className="text-[#f4e5b8] text-lg font-bold">Pick up from {storeName}</h2>
                          <p className="text-[#d4b896]/50 text-xs">Exclusively reserved for you upon advance payment</p>
                        </div>
                      </div>
                      <Badge className="bg-[#d4af37] text-black border-none font-bold">RESERVING {items.length} PIECES</Badge>
                    </div>

                    {/* Products List */}
                    <div className="space-y-4">
                      <h3 className="text-[#d4b896] text-xs font-bold uppercase tracking-[0.2em] px-1">Review Your Selection</h3>
                      <div className="space-y-3">
                        {items.map((item) => (
                          <div key={item.productId} className="flex gap-6 p-6 rounded-3xl bg-white/[0.02] border border-white/5 group hover:border-[#d4af37]/30 transition-all">
                            <div className="size-24 rounded-2xl overflow-hidden border border-white/10 bg-black/40 shrink-0">
                              <ImageWithFallback src={item.productImage} alt={item.productName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className="flex-1 space-y-2">
                              <div className="flex justify-between items-start">
                                <h4 className="text-[#f4e5b8] text-lg font-serif">{item.productName}</h4>
                                <span className="text-[#d4af37] font-bold text-lg">{INR(item.productPrice * item.quantity)}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <Badge variant="outline" className="text-[10px] border-white/10 text-[#d4b896]/60">{item.category}</Badge>
                                <span className="text-[10px] text-[#d4b896]/40 uppercase tracking-widest">Quantity: {item.quantity}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Security Notice */}
                    <div className="p-6 rounded-3xl bg-blue-500/[0.03] border border-blue-500/10 flex gap-4 items-start">
                      <Shield className="size-6 text-blue-400 shrink-0" />
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-blue-200">Ornamis Guarantee</p>
                        <p className="text-xs text-blue-200/50 leading-relaxed">
                          Your reservation deposit is fully protected. If you decide not to proceed with the purchase at the store after inspection, 
                          the reservation amount (25%) is fully refundable. Platform charges (5%) are non-refundable.
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Success View - Full Width in Left Col for better layout */
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-12 text-center space-y-8 bg-[#14110e] border border-[#d4af37]/30 rounded-[3rem]">
                    <div className="flex justify-center">
                      <div className="size-32 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center relative">
                        <CheckCircle2 className="size-16 text-[#d4af37]" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h2 className="font-['Cinzel',serif] text-[#f4e5b8] text-4xl uppercase tracking-tighter">Reservation Confirmed</h2>
                      <p className="text-[#d4b896]/60 text-lg">Your jewelry is waiting for you at <strong>{storeName}</strong>.</p>
                    </div>
                    <div className="max-w-md mx-auto p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-6">
                      <div>
                        <span className="text-[10px] text-[#d4af37] font-bold uppercase tracking-[0.3em] block mb-2">Booking Reference ID</span>
                        <span className="text-3xl font-mono font-bold text-[#f4e5b8] tracking-[0.2em]">{successRef}</span>
                      </div>
                      <Separator className="bg-white/5" />
                      <div className="text-left space-y-4">
                        <div className="flex items-start gap-4">
                          <Package className="size-5 text-[#d4af37] shrink-0 mt-1" />
                          <p className="text-sm text-[#d4b896]/80 leading-relaxed">
                            Show this ID at <strong>{storeName}</strong>. You only need to pay the remaining <strong>{INR(remainingAmount)}</strong> to collect your jewelry.
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button onClick={onClose} className="w-full max-w-sm h-14 bg-white/5 hover:bg-white/10 text-[#f4e5b8] border border-white/10 rounded-2xl text-lg font-bold transition-all">
                      Go to Dashboard
                    </Button>
                  </motion.div>
                )}
              </div>

              {/* Right Column - Order Summary (Sticky) */}
              {step !== "success" && (
                <div className="lg:col-span-4">
                  <div className="sticky top-12 space-y-6">
                    <Card className="p-8 bg-[#1a1612] border-[#d4af37]/30 shadow-2xl rounded-[2.5rem] overflow-hidden relative">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
                      
                      <h3 className="text-[#f4e5b8] text-xl font-bold mb-8 uppercase tracking-widest font-serif">Order Summary</h3>
                      
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <div className="flex justify-between text-sm text-[#d4b896]">
                            <span>Jewelry Subtotal</span>
                            <span className="text-[#f4e5b8] font-bold">{INR(totalPrice)}</span>
                          </div>
                          <div className="flex justify-between text-sm text-[#d4b896]">
                            <span>Convenience Fee</span>
                            <span className="text-[#f4e5b8] font-bold">Included</span>
                          </div>
                        </div>

                        <Separator className="bg-[#d4af37]/10" />

                        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#d4af37]/20 to-[#14110e] border border-[#d4af37]/30 space-y-6">
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-[10px] text-[#d4af37] font-bold uppercase tracking-widest">Pay Advance Now</span>
                              <Badge className="bg-[#d4af37] text-black text-[9px] border-none font-bold">30% SECURED</Badge>
                            </div>
                            <p className="text-4xl font-bold text-[#f4e5b8] font-serif">{INR(advanceAmount)}</p>
                          </div>

                          <div className="space-y-3 pt-4 border-t border-[#d4af37]/10">
                            <div className="flex justify-between text-[11px] text-[#d4b896]/60">
                              <span>Platform Surcharge (5%)</span>
                              <span>{INR(platformCharges)}</span>
                            </div>
                            <div className="flex justify-between text-[11px] text-[#d4b896]/60">
                              <span>Reservation Deposit (25%)</span>
                              <span>{INR(bookingAdvance)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center px-2">
                          <span className="text-[#d4b896]/40 text-xs font-bold uppercase tracking-wider">Due at Store (70%)</span>
                          <span className="text-[#f4e5b8] font-bold">{INR(remainingAmount)}</span>
                        </div>

                        {error && (
                          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                            <AlertTriangle className="size-4 shrink-0" />
                            {error}
                          </div>
                        )}

                        <Button
                          onClick={handlePayNow}
                          disabled={step === "processing"}
                          className="w-full h-16 text-lg font-bold shadow-[0_15px_30px_rgba(212,175,55,0.15)] active:scale-[0.98] transition-all group"
                          style={{
                            background: "linear-gradient(135deg, #d4af37 0%, #f4e5b8 100%)",
                            color: "#1a1510",
                            border: "none",
                            borderRadius: "1.25rem"
                          }}
                        >
                          {step === "processing" ? (
                            <div className="flex items-center gap-3">
                              <div className="size-6 border-2 border-[#1a1510]/30 border-t-[#1a1510] rounded-full animate-spin" />
                              Connecting...
                            </div>
                          ) : (
                            <div className="flex items-center gap-3">
                              <CreditCard className="size-6" />
                              Pay {INR(advanceAmount)} Advance
                            </div>
                          )}
                        </Button>

                        <div className="pt-4 flex flex-col items-center gap-3">
                          <img src="https://razorpay.com/assets/razorpay-glyph.svg" alt="Razorpay" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer" />
                          <p className="text-[9px] text-[#d4b896]/30 uppercase tracking-[0.2em] text-center">
                            Secure 256-bit SSL Encrypted Payment
                          </p>
                        </div>
                      </div>
                    </Card>

                    <button onClick={onClose} className="w-full text-[#d4b896]/40 hover:text-[#f4e5b8] text-xs font-bold uppercase tracking-[0.3em] transition-all py-4">
                      ← Back to Cart
                    </button>
                  </div>
                </div>
              )}
            </div>
          </main>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
