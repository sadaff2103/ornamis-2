import { motion } from "motion/react";
import { BackButton } from "../BackButton";
import { useEffect, useState } from "react";
import {
  Package,
  Heart,
  User,
  Settings,
  ShoppingBag,
  Sparkles,
  Camera,
  Calendar,
  Clock,
  ArrowRight,
  ChevronRight,
  Gift,
  Gem,
  Store,
  MapPin
} from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { useAuth } from "../../contexts/AuthContext";
import { useShop } from "../../contexts/ShopContext";
import { GoldPriceSettings } from "../GoldPriceSettings";
import { useBooking } from "../../contexts/BookingContext";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface CustomerDashboardProps {
  user: { name: string; email: string };
  onNavigate: (page: string) => void;
  onBack?: () => void;
}


export function CustomerDashboard({ user, onNavigate, onBack }: CustomerDashboardProps) {
  const { isAuthenticated } = useAuth();
  const { cart, wishlist } = useShop();
  const { bookings, isLoadingBookings } = useBooking();
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      onNavigate("login");
    }
  }, [isAuthenticated, onNavigate]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#fcf9f2] text-[#492f0e] selection:bg-[#492f0e]/10">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-[#d4af37]/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-[#492f0e]/5 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        {/* Navigation Buttons */}
        <div className="flex items-center gap-4 mb-16">
          <BackButton label="Back" onClick={onBack} className="border-[#492f0e]/20 text-[#492f0e]" />
          <BackButton onNavigate={onNavigate} targetPage="home" label="Home" type="home" className="border-[#492f0e]/20 text-[#492f0e]" />
        </div>

        {/* Welcome Section */}
        <header className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-10"
          >
            <div className="relative">
              <div className="flex items-center gap-3 text-[#d4af37] mb-4">
                <Clock className="size-4" />
                <span className="text-[10px] font-['Cinzel'] font-bold uppercase tracking-[0.4em]">{greeting}</span>
              </div>
              <h1 className="font-['Cinzel',serif] text-5xl md:text-6xl text-[#362312] mb-4 tracking-tight uppercase">
                Welcome, {user.name}
              </h1>
              <p className="text-[#492f0e]/60 max-w-lg font-serif italic text-lg leading-relaxed">
                Your personalized Ornamis boutique is curated with your unique style in mind.
              </p>
              <div className="h-[1px] w-40 bg-[#d4af37] mt-8" />
            </div>

            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => onNavigate("ai-designer")}
                className="bg-[#492f0e] hover:bg-[#2d1b0f] text-white rounded-none px-10 h-14 shadow-xl font-['Cinzel'] text-xs tracking-widest uppercase transition-all active:scale-95"
              >
                <Sparkles className="size-4 mr-3 text-[#d4af37]" />
                Design Jewelry
              </Button>
              <Button
                onClick={() => onNavigate("cart")}
                variant="outline"
                className="border-[#492f0e]/20 bg-white/50 backdrop-blur-md rounded-none px-10 h-14 hover:bg-white text-[#492f0e] font-['Cinzel'] text-xs tracking-widest uppercase"
              >
                <ShoppingBag className="size-4 mr-3" />
                Vault ({cart.length})
              </Button>
            </div>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Feed */}
          <div className="lg:col-span-8 space-y-16">

            {/* Real-time Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { label: "Treasures", value: wishlist.length, icon: Heart, delay: 0 },
                { label: "Acquisitions", value: "3", icon: Package, delay: 0.1 },
                { label: "Bag", value: cart.length, icon: ShoppingBag, delay: 0.2 },
                { label: "Bookings", value: bookings.filter(b => b.bookingStatus === "Booked").length, icon: Gem, delay: 0.3 },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: stat.delay }}
                >
                  <Card className="p-8 bg-white border border-[#492f0e]/5 shadow-[8px_8px_0_rgba(61,43,31,0.02)] hover:shadow-[12px_12px_0_rgba(61,43,31,0.04)] transition-all group rounded-none">
                    <stat.icon className="size-5 text-[#492f0e]/40 group-hover:text-[#d4af37] transition-colors" />
                    <p className="text-3xl font-['Cinzel',serif] text-[#492f0e] mb-1 tabular-nums">{stat.value}</p>
                    <p className="text-[10px] text-[#492f0e]/40 font-['Cinzel'] font-bold uppercase tracking-widest">{stat.label}</p>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Saved Designs Gallery Preview */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-['Cinzel',serif] text-2xl text-[#492f0e] tracking-wide uppercase">Your AI Creations</h3>
                <Button variant="link" className="text-[#492f0e] font-['Cinzel'] text-[10px] tracking-widest uppercase p-0 hover:no-underline hover:text-[#d4af37] transition-colors" onClick={() => onNavigate("ai-designer")}>
                  Manage Designs <ChevronRight className="size-4 ml-1" />
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <Card className="relative overflow-hidden group cursor-pointer aspect-[16/9] rounded-none border-none shadow-[20px_20px_60px_rgba(0,0,0,0.1)]">
                  <img
                    src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    alt="Saved design"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f05]/90 via-[#1a0f05]/20 to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <p className="text-white font-['Cinzel',serif] text-xl tracking-wider mb-1 uppercase">Emerald Gala Set</p>
                    <p className="text-[#d4af37]/70 text-[10px] font-['Cinzel'] tracking-widest uppercase">Manifested Jan 12, 2026</p>
                  </div>
                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <Badge className="bg-[#d4af37] text-[#492f0e] rounded-none border-none font-bold uppercase tracking-widest text-[9px] px-3 py-1 shadow-lg">Ready to Craft</Badge>
                  </div>
                </Card>
                <div className="flex flex-col gap-4">
                  <div className="flex-1 bg-white border border-dashed border-[#492f0e]/20 rounded-none p-8 flex flex-col justify-center items-center text-center group hover:bg-[#492f0e]/5 transition-all">
                    <Sparkles className="size-10 text-[#d4af37]/20 mb-4 group-hover:scale-110 transition-transform" />
                    <p className="text-[11px] font-['Cinzel'] tracking-widest text-[#492f0e]/40 uppercase mb-4">Create something new</p>
                    <Button variant="link" onClick={() => onNavigate("ai-designer")} className="text-[#492f0e] font-bold p-0 h-auto hover:text-[#d4af37] transition-colors underline decoration-[#d4af37]/30 underline-offset-8">Start Designing</Button>
                  </div>
                </div>
              </div>
            </section>

            {/* My Bookings Section */}
            <section>
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#492f0e]/10">
                <h3 className="font-['Cinzel',serif] text-2xl text-[#492f0e] tracking-wide uppercase flex items-center gap-3">
                  <Gem className="size-6 text-[#d4af37]" />
                  Reservations
                </h3>
                {bookings.length > 0 && (
                  <div className="px-4 py-1 bg-[#492f0e] text-white text-[9px] font-['Cinzel'] tracking-[0.3em] uppercase">
                    {bookings.filter(b => b.bookingStatus === "Booked").length} ACTIVE_VAULTS
                  </div>
                )}
              </div>

              {isLoadingBookings ? (
                <div className="flex items-center justify-center py-20">
                  <div className="size-8 border-[1px] border-[#492f0e]/10 border-t-[#3d2b1f] rounded-full animate-spin" />
                </div>
              ) : bookings.length === 0 ? (
                <Card className="p-16 text-center bg-white border border-[#492f0e]/5 rounded-none shadow-[10px_10px_0_rgba(61,43,31,0.02)]">
                  <Gem className="size-12 text-[#492f0e]/10 mx-auto mb-6" />
                  <p className="text-sm font-serif italic text-[#492f0e]/50 mb-8 max-w-sm mx-auto">No reservations currently held. Reserve jewelry with an imperial advance.</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onNavigate("collections")}
                    className="border-[#492f0e]/20 text-[#492f0e] rounded-none font-['Cinzel'] tracking-widest text-[10px] uppercase px-10 h-12 hover:bg-[#492f0e]/5"
                  >
                    Browse Collections
                  </Button>
                </Card>
              ) : (
                <div className="space-y-8">
                  {bookings.map((booking) => (
                    <Card
                      key={booking.id}
                      className="overflow-hidden bg-white border border-[#492f0e]/10 rounded-none shadow-[20px_20px_60px_rgba(0,0,0,0.05)]"
                    >
                      {/* Booking header */}
                      <div className="px-8 py-5 flex items-center justify-between bg-[#492f0e]">
                        <div className="flex items-center gap-3">
                          <Store className="size-4 text-[#d4af37]" />
                          <span className="text-[#d4af37] text-[10px] font-['Cinzel'] font-bold uppercase tracking-widest">{booking.storeName}</span>
                        </div>
                        <div className="flex items-center gap-6">
                          <span className="text-[10px] text-white/40 font-mono tracking-tighter uppercase">{booking.bookingRef}</span>
                          <Badge
                            className={`text-[9px] border-none rounded-none font-['Cinzel'] tracking-widest uppercase px-3 py-1 ${
                              booking.bookingStatus === "Booked"
                                ? "bg-[#d4af37] text-[#492f0e]"
                                : "bg-white/10 text-white/40"
                            }`}
                          >
                            {booking.bookingStatus}
                          </Badge>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="p-8 space-y-6">
                        {booking.items.map((item) => (
                          <div key={item.productId} className="flex gap-6 items-center">
                            <div className="w-20 h-20 bg-[#fcf9f2] border border-[#492f0e]/5 p-2 flex-shrink-0">
                              <ImageWithFallback
                                src={item.productImage}
                                alt={item.productName}
                                className="w-full h-full object-cover sepia-[0.3] contrast-[1.1]"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-['Cinzel'] font-bold text-lg text-[#492f0e] uppercase tracking-tight line-clamp-1">{item.productName}</p>
                              <p className="text-[10px] text-[#492f0e]/40 font-['Cinzel'] tracking-widest uppercase">{item.category}</p>
                            </div>
                            <p className="text-xl font-bold text-[#492f0e] tabular-nums">
                              ₹{item.productPrice.toLocaleString("en-IN")}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Payment summary */}
                      <div className="px-8 pb-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="p-6 bg-[#fcf9f2] border border-[#492f0e]/5">
                          <p className="text-[9px] text-[#d4af37] uppercase tracking-[0.3em] font-bold mb-2">Advance Held</p>
                          <p className="text-2xl font-bold text-[#492f0e] font-['Cinzel'] tabular-nums">
                            ₹{booking.advanceAmount.toLocaleString("en-IN")}
                          </p>
                          <p className="text-[10px] font-serif italic text-[#492f0e]/40 mt-1">30% Commitment Provided</p>
                        </div>
                        <div className="p-6 bg-white border border-[#492f0e]/5">
                          <p className="text-[9px] text-[#492f0e]/40 uppercase tracking-[0.3em] font-bold mb-2">Settlement Due</p>
                          <p className="text-2xl font-bold text-[#492f0e] font-['Cinzel'] tabular-nums">
                            ₹{booking.remainingAmount.toLocaleString("en-IN")}
                          </p>
                          <p className="text-[10px] font-serif italic text-[#492f0e]/40 mt-1">Payable in Guild Showroom</p>
                        </div>
                      </div>

                      {/* Pickup instructions */}
                      <div className="mx-8 mb-8 p-6 bg-[#492f0e]/5 border-l-2 border-[#d4af37]">
                        <p className="text-[10px] text-[#492f0e] font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                          <MapPin className="size-3 text-[#d4af37]" />
                          Showroom Directions
                        </p>
                        <p className="text-sm text-[#492f0e]/70 leading-relaxed font-serif italic">{booking.pickupInstructions}</p>
                      </div>

                      {/* Date */}
                      <div className="px-8 pb-6 text-right border-t border-[#492f0e]/5 pt-4">
                        <p className="text-[9px] font-['Cinzel'] tracking-widest text-[#492f0e]/30 uppercase">
                          ARCHIVED ON {new Date(booking.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-12">

            {/* Loyalty Milestone Card */}
            <Card className="p-10 bg-[#492f0e] text-white border-none shadow-[0_30px_60px_rgba(26,15,5,0.3)] relative overflow-hidden group rounded-none">
              <div className="absolute top-[-20%] right-[-10%] size-60 bg-[#d4af37]/10 blur-[100px] rounded-full group-hover:bg-[#d4af37]/20 transition-all duration-1000" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-12">
                  <Badge className="bg-[#d4af37] text-[#492f0e] border-none font-bold uppercase tracking-[0.2em] text-[9px] rounded-none px-4 py-1 shadow-lg">Gold Status</Badge>
                  <Gift className="size-5 text-[#d4af37]" />
                </div>
                <div className="mb-10">
                  <p className="text-white/40 text-[9px] font-['Cinzel'] uppercase tracking-[0.4em] mb-3">Loyalty Progress</p>
                  <p className="text-lg font-['Cinzel'] mb-5 tracking-wide">760 / 1000 Pts to <span className="text-[#d4af37]">Platinum</span></p>
                  <Progress value={76} className="h-[2px] bg-white/10 rounded-none overflow-hidden [&>div]:bg-[#d4af37]" />
                </div>
                <Button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-['Cinzel'] tracking-[0.3em] uppercase h-14 rounded-none transition-all">
                  Inspect Privileges
                </Button>
              </div>
            </Card>

            {/* Appointment Card */}
            <Card className="p-10 bg-white border border-[#492f0e]/5 shadow-[10px_10px_0_rgba(61,43,31,0.02)] rounded-none">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-[#fcf9f2] border border-[#492f0e]/10 text-[#492f0e]">
                  <Calendar className="size-5" />
                </div>
                <h4 className="font-['Cinzel',serif] text-lg text-[#492f0e] uppercase tracking-widest">Appointments</h4>
              </div>
              <div className="p-6 bg-[#fcf9f2] border border-[#492f0e]/5 mb-8">
                <p className="text-[9px] text-[#d4af37] font-bold uppercase tracking-[0.3em] mb-2">Upcoming Manifestation</p>
                <p className="text-md font-bold text-[#492f0e] uppercase tracking-tight">Showroom Viewing</p>
                <p className="text-xs text-[#492f0e]/40 font-serif italic">Tomorrow at 14:00</p>
              </div>
              <Button variant="outline" className="w-full rounded-none border-[#492f0e]/20 text-[#492f0e] font-['Cinzel'] text-[10px] tracking-widest uppercase h-14 hover:bg-[#492f0e]/5">
                Request New Visit
              </Button>
            </Card>

            {/* Quick Actions Grid */}
            <section className="space-y-6">
              <h4 className="font-['Cinzel',serif] text-[10px] text-[#492f0e]/30 uppercase tracking-[0.5em] px-1">Imperial Tools</h4>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { label: "Virtual Try-On", icon: Camera, page: "universal-tryon" },
                  { label: "Archived Orders", icon: Package, page: "orders" },
                  { label: "Account Decree", icon: Settings, page: "settings" },
                  { label: "Style Heritage", icon: User, page: "profile" },
                ].map((tool) => (
                  <button
                    key={tool.label}
                    onClick={() => onNavigate(tool.page)}
                    className="flex items-center gap-6 p-6 bg-white border border-transparent hover:border-[#d4af37]/30 hover:bg-[#fcf9f2] transition-all group text-left shadow-[4px_4px_0_rgba(61,43,31,0.02)]"
                  >
                    <div className="p-2 text-[#492f0e]/30 group-hover:text-[#492f0e] transition-colors">
                      <tool.icon className="size-5" />
                    </div>
                    <span className="text-xs font-['Cinzel'] font-bold text-[#492f0e]/80 uppercase tracking-widest">{tool.label}</span>
                    <ArrowRight className="size-4 ml-auto text-[#492f0e]/10 group-hover:text-[#d4af37] group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </section>

            {/* Dynamic Pricing Settings */}
            <GoldPriceSettings />

            {/* Imperial Seal */}
            <div className="flex flex-col items-center pt-10 opacity-10">
              <div className="h-[1px] w-12 bg-[#492f0e] mb-4" />
              <p className="font-['Cinzel'] text-[8px] tracking-[0.8em] uppercase">Authentic Ornamis</p>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}
