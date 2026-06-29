import { motion } from "motion/react";
import { ShoppingBag, Trash2, Plus, Minus, Tag, TrendingUp, Gem, Store, ChevronRight, Lock } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useShop } from "../../contexts/ShopContext";
import { useGoldPrice } from "../../contexts/GoldPriceContext";
import { useAuth } from "../../contexts/AuthContext";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { DynamicPrice } from "../DynamicPrice";
import { toast } from "sonner";
import { BackButton } from "../BackButton";
import { computeAdvanceBreakdown, type BookingItem } from "../../services/bookingService";
import { useBooking } from "../../contexts/BookingContext";

interface CartPageProps {
  onNavigate: (page: string) => void;
  onBack?: () => void;
}

export function CartPage({ onNavigate, onBack }: CartPageProps) {
  const { cart, removeFromCart, updateQuantity, clearCart } = useShop();
  const { calculatePrice } = useGoldPrice();
  const { isAuthenticated } = useAuth();
  const { isBooked } = useBooking();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  // Group cart items by store for combined booking
  const cartByStore = useMemo(() => {
    const groups: Record<string, typeof cart> = {};
    for (const item of cart) {
      const store = item.storeName ?? "Unknown Store";
      if (!groups[store]) groups[store] = [];
      groups[store].push(item);
    }
    return groups;
  }, [cart]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      onNavigate("login");
    }
  }, [isAuthenticated, onNavigate]);

  // Return null while checking authentication
  if (!isAuthenticated) {
    return null;
  }

  // Calculate cart total with dynamic pricing
  const calculateCartTotal = () => {
    return cart.reduce((total, item) => {
      if (item.isDynamicPricing && item.goldSpecs && calculatePrice) {
        const priceBreakdown = calculatePrice({
          goldWeight: item.goldSpecs.weight,
          purity: item.goldSpecs.purity,
          makingChargesPercent: item.goldSpecs.makingCharges,
          gemstonesCost: item.goldSpecs.gemstonesCost,
          includeGST: true,
        });
        return total + (priceBreakdown?.totalPrice || item.priceValue) * item.quantity;
      }
      return total + item.priceValue * item.quantity;
    }, 0);
  };

  const cartTotal = calculateCartTotal();
  const discount = promoApplied ? cartTotal * 0.1 : 0;
  const shipping = cartTotal > 250000 ? 0 : 5000;
  const finalTotal = cartTotal - discount + shipping;

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === "ornamis10") {
      setPromoApplied(true);
      toast.success("Promo code applied! 10% discount added.");
    } else {
      toast.error("Invalid promo code");
    }
  };

  const handleBookAll = () => {
    const allItems: BookingItem[] = cart
      .filter(item => !isBooked(item.id))
      .map(item => ({
        productId: item.id,
        productName: item.title,
        productImage: item.image,
        productPrice: item.priceValue,
        storeName: item.storeName ?? "Store",
        storeSlug: item.storeSlug ?? "stores",
        category: item.category,
        quantity: item.quantity,
      }));
    if (allItems.length === 0) {
      toast.info("All items are already booked.");
      return;
    }
    // Navigate to the dedicated payment page, passing items as params
    onNavigate("payment", { items: allItems });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#1a1510] to-[#2a1f14] py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Navigation Buttons */}
        <div className="flex items-center gap-3 mb-8">
          <BackButton label="Back" onClick={onBack} />
          <BackButton onNavigate={onNavigate} targetPage="home" label="Home" type="home" />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="font-['Cinzel',serif] text-[#f4e5b8] text-3xl mb-2 flex items-center gap-4">
            <ShoppingBag className="size-10 text-[#d4af37]" />
            Jewelry Cart
          </h1>
          <p className="text-[#d4b896]/60 text-sm tracking-wide uppercase">
            {cart.length === 0 ? "Your cart is empty" : `${cart.length} EXQUISITE PIECES SELECTED`}
          </p>
        </motion.div>

        {cart.length === 0 ? (
          <Card className="p-20 text-center border-[#d4af37]/20 bg-[#1a1510]/40">
            <ShoppingBag className="size-20 text-[#d4af37]/20 mx-auto mb-6" />
            <h2 className="font-['Cinzel',serif] text-[#f4e5b8] mb-4">Your Cart is Empty</h2>
            <Button onClick={() => onNavigate("collections")} className="bg-[#d4af37] text-black hover:bg-[#f4e5b8]">
              Browse Collections
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* LEFT: Items List */}
            <div className="lg:col-span-8 space-y-10">
              {Object.entries(cartByStore).map(([storeName, storeItems], groupIdx) => (
                <motion.div
                  key={storeName}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: groupIdx * 0.1 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-3 px-1">
                    <Store className="size-5 text-[#d4af37]" />
                    <h2 className="font-['Cinzel',serif] text-[#f4e5b8] text-lg font-bold tracking-widest uppercase">
                      {storeName}
                    </h2>
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-[#d4af37]/30 to-transparent" />
                  </div>

                  <div className="space-y-4">
                    {storeItems.map((item) => {
                      const itemPrice = item.priceValue * item.quantity;
                      const itemAdvance = computeAdvanceBreakdown(itemPrice).advanceAmount;
                      const itemRemaining = itemPrice - itemAdvance;

                      return (
                        <Card key={item.id} className="p-5 border-[#d4af37]/15 bg-[#1a1510]/60 overflow-hidden relative group">
                          {isBooked(item.id) && (
                            <div className="absolute top-0 right-0 z-10 bg-[#d4af37] text-black text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase">
                              ⬥ Reserved
                            </div>
                          )}
                          <div className="flex gap-6">
                            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden border border-[#d4af37]/20 flex-shrink-0 bg-black/40">
                              <ImageWithFallback src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                            </div>

                            <div className="flex-1 flex flex-col justify-between py-1">
                              <div>
                                <div className="flex justify-between items-start">
                                  <h3 className="font-['Cinzel',serif] text-[#f4e5b8] text-base sm:text-lg mb-1">{item.title}</h3>
                                  <button onClick={() => removeFromCart(item.id)} className="text-[#d4b896]/30 hover:text-red-400 transition-colors">
                                    <Trash2 className="size-4" />
                                  </button>
                                </div>
                                <div className="flex items-center gap-3 mb-4">
                                  <Badge className="bg-white/5 text-[#d4b896] border-white/10 text-[10px]">{item.category}</Badge>
                                  <span className="text-[10px] text-[#d4b896]/60 uppercase tracking-widest">{item.material[0]}</span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 bg-black/30 rounded-lg p-1 border border-white/5">
                                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-white/10 text-[#d4af37]" disabled={item.quantity <= 1}>
                                    <Minus className="size-3" />
                                  </button>
                                  <span className="w-8 text-center text-sm font-bold text-[#f4e5b8]">{item.quantity}</span>
                                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-white/10 text-[#d4af37]">
                                    <Plus className="size-3" />
                                  </button>
                                </div>
                                <div className="text-right">
                                  <DynamicPrice product={item} className="text-lg font-bold text-[#d4af37]" />
                                  {item.isDynamicPricing && (
                                    <span className="text-[9px] text-green-400 font-bold flex items-center justify-end gap-1 uppercase">
                                      <TrendingUp className="size-2.5" /> Market Price
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-5 pt-4 border-t border-[#d4af37]/10 flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 flex items-center justify-between px-4 py-2 rounded-xl bg-[#d4af37]/5 border border-[#d4af37]/10">
                              <span className="text-[10px] text-[#d4b896] uppercase font-bold tracking-wider">Advance (30%)</span>
                              <span className="text-sm font-bold text-[#d4af37]">{formatPrice(itemAdvance)}</span>
                            </div>
                            <div className="flex-1 flex items-center justify-between px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                              <span className="text-[10px] text-[#d4b896]/60 uppercase font-bold tracking-wider">In-Store (70%)</span>
                              <span className="text-sm font-bold text-[#f4e5b8]">{formatPrice(itemRemaining)}</span>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
              
              <div className="flex justify-center pt-6">
                <Button variant="ghost" onClick={clearCart} className="text-[#d4b896]/40 hover:text-red-400 text-xs gap-2">
                  <Trash2 className="size-4" /> Clear Cart
                </Button>
              </div>
            </div>

            {/* RIGHT: Sidebar Summary */}
            <div className="lg:col-span-4 space-y-6 sticky top-24">
              <Card className="p-6 border-[#d4af37]/30 bg-[#1a1510]/80 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-50" />
                
                <h3 className="font-['Cinzel',serif] text-[#f4e5b8] text-xl mb-6 flex items-center justify-between">
                  Order Summary
                  <Gem className="size-5 text-[#d4af37]" />
                </h3>

                <div className="space-y-4">
                  {/* Pricing rows */}
                  <div className="flex justify-between text-sm text-[#d4b896]">
                    <span>Cart Total ({cart.length} items)</span>
                    <span className="text-[#f4e5b8] font-bold">{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#d4b896]">
                    <span>Platform Surcharge</span>
                    <span className="text-[#f4e5b8] font-bold">{formatPrice(shipping)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-400">
                      <span>Discount (10%)</span>
                      <span className="font-bold">-{formatPrice(discount)}</span>
                    </div>
                  )}

                  {/* Promo code */}
                  <div className="flex gap-2 pt-1">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#d4af37]/50" />
                      <Input
                        placeholder="Promo Code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="bg-white/5 border-white/10 text-[#f4e5b8] h-10 pl-9"
                      />
                    </div>
                    <Button onClick={handleApplyPromo} variant="outline" className="h-10 border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37]/10">Apply</Button>
                  </div>

                  <Separator className="bg-[#d4af37]/10" />

                  {/* Order total */}
                  <div className="flex justify-between items-center">
                    <span className="text-[#d4b896] text-sm">Order Total</span>
                    <span className="text-[#f4e5b8] font-bold text-xl">{formatPrice(finalTotal)}</span>
                  </div>

                  {/* Advance breakdown — informational only */}
                  <div className="p-4 rounded-xl bg-[#d4af37]/5 border border-[#d4af37]/10 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#d4b896]/70 uppercase tracking-wider font-bold">Advance Now (30%)</span>
                      <span className="text-[#d4af37] font-bold">{formatPrice(computeAdvanceBreakdown(cartTotal - discount).advanceAmount)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-[#d4b896]/40 uppercase tracking-wider font-bold">Balance at Store (70%)</span>
                      <span className="text-[#f4e5b8]/60 font-bold">{formatPrice(computeAdvanceBreakdown(cartTotal - discount).remainingAmount)}</span>
                    </div>
                  </div>

                  {/* Single CTA — clicking this takes user to full-screen checkout */}
                  <Button
                    onClick={handleBookAll}
                    className="w-full h-14 text-base font-bold transition-all active:scale-95 group"
                    style={{ background: "linear-gradient(135deg, #d4af37 0%, #f4e5b8 100%)", color: "#1a1510", border: "none" }}
                  >
                    Pay {formatPrice(computeAdvanceBreakdown(cartTotal - discount).advanceAmount)} Advance
                    <ChevronRight className="size-5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>

                  {/* Security note */}
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-950/20 border border-blue-500/10">
                    <Lock className="size-4 text-blue-400 mt-0.5 shrink-0" />
                    <p className="text-[10px] text-blue-200/70 leading-relaxed">
                      Secured by Razorpay. Paying the advance exclusively reserves this jewelry for you at the store.
                    </p>
                  </div>
                </div>
              </Card>

              <Button onClick={() => onNavigate("collections")} variant="ghost" className="w-full text-[#d4b896] hover:text-[#f4e5b8] text-xs uppercase tracking-widest">
                Explore More Collections
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
