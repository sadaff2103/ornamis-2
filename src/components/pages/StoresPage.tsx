import { motion } from "motion/react";
import { Store, Crown, MapPin, Star, Sparkles, ArrowRight } from "lucide-react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { BackButton } from "../BackButton";

interface StoreCardData {
  name: string;
  featured?: boolean;
  badge?: string;
  description: string;
  locations: number;
  rating: number;
  imageUrl: string;
  pageName: string;
}

interface StoresPageProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

const stores: StoreCardData[] = [
  {
    name: "Jauhari",
    featured: true,
    badge: "Master Brand",
    description: "Premium handcrafted jewelry with timeless elegance. Experience luxury and tradition in every piece, curated for the discerning connoisseur.",
    locations: 50,
    rating: 4.9,
    imageUrl: "/jauhari_store_card_1768932770617.png",
    pageName: "jauhari",
  },
  {
    name: "Khan Jewellers",
    description: "Established jewelry brand known for extensive collections and heritage craftsmanship",
    locations: 5,
    rating: 4.7,
    imageUrl: "/khan_jewellers_cover_new.png",
    pageName: "khans",
  },
  {
    name: "Palmonas",
    description: "Exquisite craftsmanship and timeless elegance in contemporary jewelry designs",
    locations: 2,
    rating: 4.9,
    imageUrl: "/palmonas_cover_new.png",
    pageName: "palmonas",
  },
  {
    name: "Giva",
    description: "Modern silver jewelry for everyday elegance with contemporary minimalist aesthetics",
    locations: 19,
    rating: 4.6,
    imageUrl: "/giva_cover_new.png",
    pageName: "giva",
  },
];

export function StoresPage({ onNavigate, onBack }: StoresPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf8f5] via-[#f5f1ed] to-[#f0ebe3]">
      {/* Navigation Buttons */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <div className="flex items-center gap-3">
          <BackButton label="Back" onClick={onBack} />
          <BackButton
            onNavigate={onNavigate}
            targetPage="home"
            label="Home"
            type="home"
          />
        </div>
      </div>

      {/* Hero Section with Background */}
      <div className="relative py-24 px-4 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/jewelry_store_hero_1768932738851.png"
            alt="Jewelry stores background"
            className="w-full h-full object-cover opacity-75"
          />
          {/* Dark gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-amber-950/70 via-amber-900/60 to-amber-950/70"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/95 shadow-2xl border-4 border-white/20 mb-4">
              <Store className="size-10 text-amber-900" strokeWidth={2.5} />
            </div>

            {/* Heading */}
            <h1
              className="font-['Cinzel',serif] text-white drop-shadow-2xl"
              style={{
                fontSize: "clamp(40px, 6vw, 64px)",
                letterSpacing: "0.12em",
                fontWeight: 700,
                textShadow: "0 4px 20px rgba(0,0,0,0.6)",
              }}
            >
              OUR STORES
            </h1>

            {/* Subtitle */}
            <div className="max-w-3xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl px-8 py-5 border-2 border-amber-200 shadow-2xl">
              <p
                className="font-['Cinzel',serif] text-gray-900 font-bold"
                style={{
                  fontSize: "clamp(14px, 2vw, 18px)",
                  letterSpacing: "0.04em",
                  lineHeight: 1.7,
                  fontWeight: 600,
                }}
              >
                Discover exquisite jewelry from India's most trusted brands
              </p>
              <p
                className="font-['Cinzel',serif] text-gray-700 mt-2"
                style={{
                  fontSize: "clamp(12px, 1.8vw, 15px)",
                  letterSpacing: "0.03em",
                  lineHeight: 1.6,
                }}
              >
                Each store brings you craftsmanship, quality, and timeless elegance
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-5 pt-4">
              <div className="bg-white/90 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-lg">
                <p className="font-['Cinzel',serif] text-amber-900 font-bold" style={{ fontSize: "12px", letterSpacing: "0.05em" }}>
                  <span className="text-xl font-bold">4</span> Partner Stores
                </p>
              </div>
              <div className="bg-white/90 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-lg">
                <p className="font-['Cinzel',serif] text-amber-900 font-bold" style={{ fontSize: "12px", letterSpacing: "0.05em" }}>
                  <span className="text-xl font-bold">75+</span> Locations
                </p>
              </div>
              <div className="bg-white/90 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-lg">
                <p className="font-['Cinzel',serif] text-amber-900 font-bold" style={{ fontSize: "12px", letterSpacing: "0.05em" }}>
                  <span className="text-xl font-bold">4.8</span> Avg Rating
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content - Wider Container with More Padding */}
      <div className="max-w-8xl mx-auto px-8 md:px-16 py-24">
        {/* Master Store Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crown className="size-10 text-[#d4af37]" strokeWidth={2.5} />
            <h2
              className="font-['Cinzel',serif] text-[#2a1f14]"
              style={{
                fontSize: "clamp(28px, 4vw, 40px)",
                letterSpacing: "0.1em",
                fontWeight: 700,
              }}
            >
              OUR MASTER STORE
            </h2>
            <Crown className="size-10 text-[#d4af37]" strokeWidth={2.5} />
          </div>
        </motion.div>

        {/* Featured Store - Jauhari */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-40"
        >
          <Card
            className="relative overflow-hidden border-0 transition-all duration-500 hover:shadow-2xl cursor-pointer group"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #fefdfb 100%)",
            }}
            onClick={() => onNavigate && onNavigate("jauhari")}
          >
            {/* Master Brand Badge */}
            <div className="absolute top-6 right-6 z-20">
              <Badge
                className="flex items-center gap-2 px-5 py-2.5 shadow-2xl"
                style={{
                  background: "linear-gradient(135deg, #d4af37 0%, #b8985f 100%)",
                  color: "white",
                  border: "none",
                  fontSize: "14px",
                  letterSpacing: "0.08em",
                  fontWeight: 700,
                }}
              >
                <Crown className="size-5" />
                MASTER BRAND
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-0">
              {/* Image Side */}
              <div className="relative h-96 md:h-auto overflow-hidden bg-gradient-to-br from-amber-50 to-gray-100">
                <img
                  src={stores[0].imageUrl}
                  alt="Jauhari premium jewelry collection"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    console.error("Failed to load image:", stores[0].imageUrl);
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23f0ebe3' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' fill='%23d4af37' font-size='20' font-family='Arial'%3EJauhari%3C/text%3E%3C/svg%3E";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-white/90 md:to-white"></div>
              </div>

              {/* Content Side */}
              <div className="p-12 md:p-16 flex flex-col justify-center bg-gradient-to-br from-white via-amber-50/30 to-white">
                <div className="flex items-center gap-3 mb-6">
                  <Crown className="size-10 text-[#d4af37]" strokeWidth={2} />
                  <h2
                    className="font-['Cinzel',serif] text-[#2a1f14]"
                    style={{
                      fontSize: "clamp(32px, 4vw, 44px)",
                      letterSpacing: "0.1em",
                      fontWeight: 700,
                    }}
                  >
                    JAUHARI
                  </h2>
                </div>

                <p
                  className="font-['Cinzel',serif] text-[#5a4a38] mb-8"
                  style={{
                    fontSize: "clamp(13px, 1.8vw, 15px)",
                    letterSpacing: "0.03em",
                    lineHeight: 1.8,
                  }}
                >
                  {stores[0].description}
                </p>

                <div className="flex flex-wrap items-center gap-5 mb-8">
                  <div className="flex items-center gap-2 bg-amber-50 px-4 py-2.5 rounded-full">
                    <MapPin className="size-4 text-[#d4af37]" />
                    <span
                      className="font-['Cinzel',serif] text-[#2a1f14] font-semibold"
                      style={{ fontSize: "13px", letterSpacing: "0.04em" }}
                    >
                      {stores[0].locations}+ Locations
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-amber-50 px-4 py-2.5 rounded-full">
                    <Star className="size-4 text-[#d4af37] fill-[#d4af37]" />
                    <span
                      className="font-['Cinzel',serif] text-[#2a1f14] font-bold"
                      style={{ fontSize: "13px", letterSpacing: "0.04em" }}
                    >
                      {stores[0].rating} Rating
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[#d4af37] group-hover:gap-4 transition-all">
                  <span className="font-['Cinzel',serif] font-bold uppercase" style={{ fontSize: "13px", letterSpacing: "0.08em" }}>
                    Explore Collection
                  </span>
                  <ArrowRight className="size-5" />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Partner Stores Section Header - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mb-24"
        >
          <h2
            className="font-['Cinzel',serif] text-[#2a1f14]"
            style={{
              fontSize: "clamp(28px, 4vw, 40px)",
              letterSpacing: "0.12em",
              fontWeight: 800,
            }}
          >
            OUR PARTNER STORES
          </h2>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mt-4"></div>
        </motion.div>

        {/* Other Stores Grid - Premium Spacious Layout with Locked Heights */}
        <div className="overflow-x-auto pb-8 -mx-8 md:-mx-16 px-8 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-24 mb-20 min-w-min">
            {stores.filter(store => !store.featured).map((store, index) => (
              <motion.div
                key={store.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="min-w-[320px] md:min-w-0"
              >
                <Card
                  className="relative h-full transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer group overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #fefdfb 0%, #f8f4ed 100%)",
                    border: "1px solid #e8dfd5",
                    minHeight: "650px",
                  }}
                  onClick={() => onNavigate && onNavigate(store.pageName)}
                >
                  {/* Cover Image Background - 75% visible */}
                  <div className="absolute inset-0">
                    <img
                      src={store.imageUrl}
                      alt={`${store.name} background`}
                      className="w-full h-full object-cover opacity-75"
                    />
                    {/* Gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>
                  </div>

                  {/* Content with proper z-index and generous padding */}
                  <div className="relative z-10 p-12 flex flex-col h-full justify-between">
                    {/* Store Name with strong visibility */}
                    <h3
                      className="font-['Cinzel',serif] text-white mb-6 drop-shadow-2xl"
                      style={{
                        fontSize: "clamp(26px, 3vw, 32px)",
                        letterSpacing: "0.1em",
                        fontWeight: 700,
                        textShadow: "0 2px 8px rgba(0,0,0,0.8), 0 4px 16px rgba(0,0,0,0.6)",
                      }}
                    >
                      {store.name}
                    </h3>

                    {/* Description with background - Increased padding and 2-line truncation */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg px-7 py-7 mb-8 flex-grow">
                      <p
                        className="font-['Cinzel',serif] text-[#2a1f14] line-clamp-2"
                        style={{
                          fontSize: "13px",
                          letterSpacing: "0.02em",
                          lineHeight: 1.7,
                        }}
                      >
                        {store.description}
                      </p>
                    </div>

                    {/* Bottom section with consistent alignment */}
                    <div>
                      {/* Stats with background - Fixed gap */}
                      <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/30">
                        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2.5 rounded-full">
                          <MapPin className="size-4 text-[#d4af37]" />
                          <span
                            className="font-['Cinzel',serif] text-[#2a1f14] font-semibold"
                            style={{ fontSize: "12px", letterSpacing: "0.03em" }}
                          >
                            {store.locations}+ Stores
                          </span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2.5 rounded-full">
                          <Star className="size-4 text-[#d4af37] fill-[#d4af37]" />
                          <span
                            className="font-['Cinzel',serif] text-[#2a1f14] font-bold"
                            style={{ fontSize: "12px", letterSpacing: "0.03em" }}
                          >
                            {store.rating}
                          </span>
                        </div>
                      </div>

                      {/* CTA matching website theme */}
                      <button className="flex items-center justify-center gap-2 bg-[#3d2f1f] hover:bg-[#2a1f14] px-6 py-3 rounded-lg transition-all shadow-md group/btn w-full">
                        <span
                          className="font-['Cinzel',serif] font-bold uppercase text-white"
                          style={{ fontSize: "12px", letterSpacing: "0.08em" }}
                        >
                          View Collection
                        </span>
                        <ArrowRight className="size-4 text-white group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Section - Optimized Spacing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-24"
        >
          <Card
            className="p-10 md:p-14 text-center relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #2a1f14 0%, #3d2f1f 100%)",
              border: "none",
            }}
          >
            {/* Decorative Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-6">
              <Sparkles className="size-8 text-white" strokeWidth={2} />
            </div>

            <h2
              className="font-['Cinzel',serif] text-white mb-6"
              style={{
                fontSize: "clamp(28px, 4vw, 42px)",
                letterSpacing: "0.1em",
                fontWeight: 700,
              }}
            >
              EXPLORE OUR PARTNER STORES
            </h2>
            <p
              className="font-['Cinzel',serif] text-white/80 max-w-2xl mx-auto mb-8"
              style={{
                fontSize: "clamp(14px, 2vw, 16px)",
                letterSpacing: "0.03em",
                lineHeight: 1.8,
              }}
            >
              Visit any of our trusted partner stores to experience premium jewelry collections with expert guidance
            </p>
            <button
              className="inline-flex items-center gap-3 bg-white hover:bg-gray-100 text-[#2a1f14] px-8 py-4 rounded-lg transition-all shadow-xl font-['Cinzel',serif] font-bold uppercase"
              style={{ fontSize: "13px", letterSpacing: "0.1em" }}
              onClick={() => onNavigate && onNavigate("collections")}
            >
              Discover All Collections
              <ArrowRight className="size-5" />
            </button>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}