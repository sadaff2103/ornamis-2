import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Award, Filter, Heart, ShoppingCart, Sparkles, MapPin, ExternalLink, Star, Shield, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useShop } from "../../contexts/ShopContext";
import { useBooking } from "../../contexts/BookingContext";
import { BackButton } from "../BackButton";
import { jauhariProducts, type JProduct } from "../../data/jauhariProducts";
import jauhariBanner from "../../assets/538b9b23ce4d8c09d0b8e92e310e7d2e3c19b378.png";
import jauhariLogo from "../../assets/33b7dbe6beb71c1bd77b96d6c0b3aff59848e6aa.png";

// ─── Types ──────────────────────────────────────────────────────────────────

interface JauhariStorePageProps {
  onNavigate?: (page: string, params?: any) => void;
  onBack?: () => void;
}

// ─── Store Location ─────────────────────────────────────────────────────────

const LOCATION = {
  name: "Jauhari Jewellery (Crafted Just For You)",
  address: "Toli Chowki, Hyderabad",
  mapUrl: "https://www.google.com/maps/search/Jauhari+Jewellery+Crafted+Just+For+You+Toli+Chowki+Hyderabad",
};

// ─── Product data (34 products, hand-verified) ───────────────────────────────
const products: JProduct[] = jauhariProducts;

// ─── Image Carousel Component ─────────────────────────────────────────────────

function ImageCarousel({ images, productName }: { images: string[]; productName: string }) {
  const [current, setCurrent] = useState(0);
  const prev = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent(c => (c - 1 + images.length) % images.length);
  }, [images.length]);
  const next = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent(c => (c + 1) % images.length);
  }, [images.length]);

  return (
    <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#1a1510] to-[#0a0a0a] select-none">
      <AnimatePresence mode="wait" initial={false}>
        <motion.img
          key={current}
          src={images[current]}
          alt={`${productName} – view ${current + 1}`}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          draggable={false}
        />
      </AnimatePresence>

      {/* Prev / Next arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-[#0a0a0a]/70 text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0a0a0a] transition-all z-10"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-[#0a0a0a]/70 text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0a0a0a] transition-all z-10"
          >
            <ChevronRight className="size-4" />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={e => { e.stopPropagation(); setCurrent(i); }}
                className={`rounded-full transition-all ${i === current
                  ? "w-4 h-1.5 bg-[#d4af37]"
                  : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
                  }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main Store Page ───────────────────────────────────────────────────────────

export function JauhariStorePage({ onNavigate, onBack }: JauhariStorePageProps) {
  const { isBooked } = useBooking();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedMetal, setSelectedMetal] = useState<string>("All");
  const [priceRange, setPriceRange] = useState<string>("All");
  const [showExclusiveOnly, setShowExclusiveOnly] = useState<boolean>(false);
  const [showLocations, setShowLocations] = useState<boolean>(false);

  const { addToCart, toggleWishlist, isInWishlist } = useShop();

  const categories = ["All", "Rings", "Necklaces", "Earrings", "Bracelets", "Sets"];
  const metals = ["All", "Gold", "Rose Gold", "White Gold"];
  const priceRanges = [
    { label: "All", min: 0, max: Infinity },
    { label: "Under ₹1,00,000", min: 0, max: 100000 },
    { label: "₹1L – ₹3L", min: 100000, max: 300000 },
    { label: "₹3L – ₹6L", min: 300000, max: 600000 },
    { label: "Above ₹6L", min: 600000, max: Infinity },
  ];

  const filteredProducts = products.filter(p => {
    const catOk = selectedCategory === "All" || p.category === selectedCategory;
    const metalOk = selectedMetal === "All" || p.metal === selectedMetal;
    const range = priceRanges.find(r => r.label === priceRange);
    const priceOk = !range || (p.priceValue >= range.min && p.priceValue < range.max);
    const exOk = !showExclusiveOnly || p.isExclusive || p.isLimited;
    return catOk && metalOk && priceOk && exOk;
  });

  const handleToggleWishlist = (product: JProduct) => {
    toggleWishlist({
      id: product.id,
      image: product.images[0],
      title: product.name,
      price: product.price,
      priceValue: product.priceValue,
      category: product.category,
      material: product.material,
      style: product.style,
      storeName: "Jauhari",
      storeSlug: "jauhari",
    });
  };

  const handleAddToCart = (e: React.MouseEvent, product: JProduct) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      image: product.images[0],
      title: product.name,
      price: product.price,
      priceValue: product.priceValue,
      category: product.category,
      material: product.material,
      style: product.style,
      storeName: "Jauhari",
      storeSlug: "jauhari",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#1a1510] to-[#2a1f14]">
      {/* Navigation Buttons */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <div className="flex items-center gap-3 mb-2">
          <BackButton label="Back" onClick={onBack} />
          <BackButton onNavigate={onNavigate} targetPage="home" label="Home" type="home" />
        </div>
      </div>
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 text-sm text-[#d4b896]/60">
          <button onClick={() => onNavigate!("home")} className="hover:text-[#d4af37] transition-colors">
            Home
          </button>
          <ChevronRight className="size-4" />
          <button onClick={() => onNavigate!("stores")} className="hover:text-[#d4af37] transition-colors">
            Stores
          </button>
          <ChevronRight className="size-4" />
          <span className="text-[#d4af37] font-semibold">Jauhari</span>
        </div>
      </div>
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <div
        className="relative py-20 px-4 overflow-hidden"
      >
        {/* Banner Background */}
        <div className="absolute inset-0">
          <img src={jauhariBanner} alt="Jauhari Banner" className="absolute inset-0 w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1510]/80 to-[#2a1f14]" />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {/* Logo medallion */}
            <div
              className="inline-flex items-center justify-center w-32 h-32 mb-8 rounded-full overflow-hidden border-4 border-[#d4af37]/30 shadow-2xl"
              style={{
                background: "linear-gradient(135deg, #1a1510 0%, #2a1f14 100%)",
              }}
            >
              <img src={jauhariLogo} alt="Jauhari Logo" className="w-full h-full object-cover" />
            </div>

            <Badge
              className="mb-6 px-6 py-2"
              style={{
                background: "linear-gradient(135deg, #d4af37 0%, #f4e5b8 100%)",
                color: "#2a1f14",
                border: "none",
                fontSize: "13px",
                letterSpacing: "0.08em",
                fontWeight: 700,
              }}
            >
              <Award className="size-4 mr-2" />
              MASTER BRAND · TOLI CHOWKI, HYDERABAD
            </Badge>

            <h1
              className="font-['Cinzel',serif] mb-4"
              style={{
                fontSize: "clamp(40px, 6vw, 72px)",
                letterSpacing: "0.12em",
                fontWeight: 700,
                background: "linear-gradient(135deg, #f4e5b8 0%, #d4af37 50%, #f4e5b8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Jauhari Collections
            </h1>

            <p
              className="font-['Cinzel',serif] text-[#d4b896] max-w-3xl mx-auto mb-8"
              style={{ fontSize: "clamp(15px, 2vw, 19px)", letterSpacing: "0.06em", lineHeight: 1.8 }}
            >
              Crafted Just For You — Heritage Hyderabadi Jewellery
              <br />
              <span className="text-[#b8985f] text-sm">
                {products.length} exclusive pieces
              </span>
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
              {[
                { icon: <Shield className="size-4" />, text: "Certified Pure Gold" },
                { icon: <Star className="size-4 fill-[#f4e5b8]" />, text: "5.0 Elite Rating" },
                { icon: <Sparkles className="size-4" />, text: "Bridal Specialists" },
              ].map(b => (
                <Badge
                  key={b.text}
                  className="flex items-center gap-2 px-5 py-2.5"
                  style={{
                    background: "rgba(212,175,55,0.15)",
                    color: "#f4e5b8",
                    border: "1px solid rgba(212,175,55,0.4)",
                    fontSize: "13px",
                    letterSpacing: "0.06em",
                  }}
                >
                  {b.icon} {b.text}
                </Badge>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Store Location */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <Card
            className="p-6"
            style={{ background: "linear-gradient(135deg, #2a1f14 0%, #3d2f1f 100%)", border: "1px solid #d4af37" }}
          >
            <button
              onClick={() => setShowLocations(!showLocations)}
              className="w-full flex items-center justify-between hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center gap-2">
                <MapPin className="size-5 text-[#d4af37]" />
                <h2 className="font-['Cinzel',serif] text-[#f4e5b8] text-lg font-semibold tracking-wide">
                  Visit Our Hyderabad Showroom
                </h2>
              </div>
              <span className="text-[#d4af37] text-xl">{showLocations ? "−" : "+"}</span>
            </button>

            <AnimatePresence>
              {showLocations && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="max-w-sm mx-auto mt-6">
                    <Card
                      className="p-6"
                      style={{ background: "linear-gradient(135deg, #1a1510 0%, #2a1f14 100%)", border: "1px solid #d4af37" }}
                    >
                      <h3 className="font-['Cinzel',serif] text-[#f4e5b8] text-base font-semibold mb-2">{LOCATION.name}</h3>
                      <p className="font-['Cinzel',serif] text-[#d4b896] text-sm mb-4 tracking-wide">{LOCATION.address}</p>
                      <Button
                        size="sm"
                        className="w-full"
                        style={{
                          background: "linear-gradient(135deg, #d4af37 0%, #f4e5b8 100%)",
                          color: "#2a1f14",
                          border: "none",
                          fontSize: "12px",
                          letterSpacing: "0.05em",
                          fontWeight: 600,
                        }}
                        onClick={() => window.open(LOCATION.mapUrl, "_blank")}
                      >
                        <span className="font-['Cinzel',serif]">View on Google Maps</span>
                        <ExternalLink className="size-3 ml-2" />
                      </Button>
                    </Card>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>

        <div className="flex gap-8 items-start">
          {/* Filter Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="w-[280px] flex-shrink-0 sticky top-24"
          >
            <Card
              className="p-6 space-y-6 max-h-[calc(100vh-7rem)] overflow-y-auto"
              style={{ background: "linear-gradient(135deg, #2a1f14 0%, #3d2f1f 100%)", border: "1px solid #d4af37" }}
            >
              <div className="flex items-center gap-2 pb-4 border-b border-[#d4af37]/30">
                <Filter className="size-5 text-[#d4af37]" />
                <h3 className="font-['Cinzel',serif] text-[#f4e5b8] text-base font-semibold tracking-wider">
                  Refine Your Selection
                </h3>
              </div>

              <FilterSelect label="Category" value={selectedCategory} onChange={setSelectedCategory} options={categories} />
              <FilterSelect label="Precious Metal" value={selectedMetal} onChange={setSelectedMetal} options={metals} />
              <FilterSelect label="Investment Range" value={priceRange} onChange={setPriceRange} options={priceRanges.map(r => r.label)} />

              <div>
                <label className="block font-['Cinzel',serif] text-[#d4b896] mb-2 text-xs font-semibold tracking-wider uppercase">
                  Collection
                </label>
                <button
                  onClick={() => setShowExclusiveOnly(!showExclusiveOnly)}
                  className={`w-full px-4 py-2.5 rounded-lg border font-['Cinzel',serif] transition-all text-xs tracking-wide ${showExclusiveOnly
                    ? "bg-[#d4af37] text-[#1a1510] border-[#d4af37]"
                    : "bg-[#1a1510] text-[#f4e5b8] border-[#d4af37]/30"
                    }`}
                >
                  {showExclusiveOnly ? "✓ Exclusive & Limited" : "All Collections"}
                </button>
              </div>

              <div className="pt-4 border-t border-[#d4af37]/30 text-center">
                <p className="font-['Cinzel',serif] text-[#d4b896] text-xs tracking-wide">
                  {filteredProducts.length} masterpiece{filteredProducts.length !== 1 ? "s" : ""}
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Product Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Sparkles className="size-12 text-[#d4af37]/40 mb-4" />
                <p className="font-['Cinzel',serif] text-[#d4b896] text-lg">No pieces match your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product, idx) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                  >
                    <Card
                      className="h-full group overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 flex flex-col relative cursor-pointer"
                      style={{
                        background: "linear-gradient(135deg, #2a1f14 0%, #3d2f1f 100%)",
                        border: "1px solid #d4af37",
                        boxShadow: "0 4px 20px rgba(212,175,55,0.08)",
                      }}
                      onClick={() => onNavigate!("product", { productId: product.id })}
                    >
                      {/* Image carousel */}
                      <ImageCarousel images={product.images} productName={product.name} />

                      {/* Badges row */}
                      <div className="absolute top-2 left-2 flex gap-1.5 flex-wrap pointer-events-none">
                        {isBooked(product.id) && (
                          <Badge className="text-[9px] px-2 py-0.5 font-bold tracking-wider"
                            style={{ background: "#1a1510", color: "#d4af37", border: "1px solid #d4af37" }}>
                            RESERVED
                          </Badge>
                        )}
                        {product.isExclusive && !isBooked(product.id) && (
                          <Badge className="text-[9px] px-2 py-0.5 font-bold tracking-wider"
                            style={{ background: "rgba(212,175,55,0.9)", color: "#1a1510", border: "none" }}>
                            EXCLUSIVE
                          </Badge>
                        )}
                        {product.isLimited && !isBooked(product.id) && (
                          <Badge className="text-[9px] px-2 py-0.5 font-bold tracking-wider"
                            style={{ background: "rgba(200,50,50,0.9)", color: "#fff", border: "none" }}>
                            LIMITED
                          </Badge>
                        )}
                      </div>

                      {/* Wishlist button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleToggleWishlist(product); }}
                        className="absolute top-2 right-2 p-2 rounded-full bg-[#2a1f14]/80 backdrop-blur-sm hover:bg-[#d4af37] transition-all duration-300 z-10"
                      >
                        <Heart
                          className={`size-4 transition-colors ${isInWishlist(product.id)
                            ? "fill-[#d4af37] text-[#d4af37]"
                            : "text-[#d4af37]"
                            }`}
                        />
                      </button>

                      <div className="p-5 flex flex-col flex-1">
                        <p className="font-['Cinzel',serif] text-[#b8985f] text-[10px] tracking-[0.15em] uppercase mb-1">
                          {product.category}
                        </p>
                        <h3 className="font-['Cinzel',serif] text-[#f4e5b8] font-semibold mb-4 leading-snug text-sm">
                          {product.name}
                        </h3>

                        <div className="flex items-center gap-2 mt-auto pt-4 border-t border-[#d4af37]/20">
                          <p className="font-['Cinzel',serif] font-bold text-[#d4af37] text-base flex-1">
                            {product.price}
                          </p>
                          {isBooked(product.id) ? (
                            <Badge className="bg-red-500/20 text-red-500 border-red-500/40 text-[10px] py-1 px-3">
                              Reserved
                            </Badge>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                title="Virtual Try-On"
                                onClick={(e: React.MouseEvent) => { e.stopPropagation(); onNavigate?.("jauhari-tryon", { productId: product.id }); }}
                                className="h-8 px-2"
                                style={{ background: "rgba(212,175,55,0.15)", color: "#d4af37", border: "1px solid #d4af37", fontSize: "11px", fontWeight: 700 }}
                              >
                                <Eye className="size-3.5" />
                              </Button>
                              <Button
                                size="sm"
                                onClick={(e: React.MouseEvent) => handleAddToCart(e, product)}
                                className="h-8 px-3"
                                style={{ background: "linear-gradient(135deg, #d4af37 0%, #f4e5b8 100%)", color: "#2a1f14", border: "none", fontSize: "11px", fontWeight: 700 }}
                              >
                                <ShoppingCart className="size-3.5 mr-1" />
                                Add
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Heritage Info Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-16"
            >
              <Card
                className="p-8"
                style={{
                  background: "linear-gradient(135deg, #2a1f14 0%, #1a1510 100%)",
                  border: "1px solid rgba(212, 175, 55, 0.3)",
                }}
              >
                <div className="text-center mb-6">
                  <h3
                    className="font-['Cinzel',serif] text-[#f4e5b8] mb-3"
                    style={{
                      fontSize: "clamp(20px, 3vw, 28px)",
                      letterSpacing: "0.06em",
                      fontWeight: 600,
                    }}
                  >
                    Experience Heritage Hyderabadi Jewellery
                  </h3>
                  <p
                    className="font-['Cinzel',serif] text-[#d4b896] max-w-2xl mx-auto mb-6"
                    style={{
                      fontSize: "clamp(13px, 1.8vw, 15px)",
                      letterSpacing: "0.03em",
                      lineHeight: 1.7,
                    }}
                  >
                    These are representative products from Jauhari - Crafted just for you. For the complete heritage collection, exact pricing,
                    and personalized bridal consultations, please visit our Toli Chowki showroom or our official website.
                  </p>

                  <Button
                    size="lg"
                    className="group/cta"
                    style={{
                      background: "linear-gradient(135deg, #d4af37 0%, #f4e5b8 100%)",
                      color: "#1a1510",
                      border: "none",
                      fontSize: "14px",
                      letterSpacing: "0.06em",
                      fontWeight: 600,
                    }}
                    onClick={() => window.open('https://www.jauhari.in', '_blank')}
                  >
                    <span className="font-['Cinzel',serif]">Visit Jauhari Official Site</span>
                    <ExternalLink className="size-4 ml-2 transition-transform group-hover/cta:translate-x-1" />
                  </Button>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-6 border-t border-[#d4af37]/20">
                  <Badge
                    className="px-4 py-2"
                    style={{
                      background: "rgba(212, 175, 55, 0.1)",
                      color: "#f4e5b8",
                      border: "1px solid rgba(212, 175, 55, 0.3)",
                      fontSize: "11px",
                      letterSpacing: "0.04em",
                    }}
                  >
                    ✓ BIS Hallmarked Gold
                  </Badge>
                  <Badge
                    className="px-4 py-2"
                    style={{
                      background: "rgba(212, 175, 55, 0.1)",
                      color: "#f4e5b8",
                      border: "1px solid rgba(212, 175, 55, 0.3)",
                      fontSize: "11px",
                      letterSpacing: "0.04em",
                    }}
                  >
                    ✓ Certified Diamonds
                  </Badge>
                  <Badge
                    className="px-4 py-2"
                    style={{
                      background: "rgba(212, 175, 55, 0.1)",
                      color: "#f4e5b8",
                      border: "1px solid rgba(212, 175, 55, 0.3)",
                      fontSize: "11px",
                      letterSpacing: "0.04em",
                    }}
                  >
                    ✓ Handcrafted Excellence
                  </Badge>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label className="block font-['Cinzel',serif] text-[#d4b896] mb-2 text-xs font-semibold tracking-wider uppercase">
        {label}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-lg border border-[#d4af37]/30 bg-[#1a1510] font-['Cinzel',serif] text-[#f4e5b8] focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition-all text-xs"
      >
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
