import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ExternalLink, Filter, Star, MapPin, Shield, Gem } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { BackButton } from "../BackButton";
import { allProducts } from "../../data/productCollections";
import { CollectionProductCard } from "../CollectionProductCard";


interface PalmonasStorePageProps {
  onNavigate?: (page: string, params?: any) => void;
  onBack?: () => void;
}

interface Location {
  name: string;
  address: string;
  mapUrl: string;
  website?: string;
}

const locations: Location[] = [
  {
    name: "PALMONAS | Demifine Jewellery | Silver | Lab Grown Diamonds",
    address: "Nexus Hyderabad Mall, Kukatpally, Hyderabad",
    mapUrl: "https://www.google.com/maps/search/PALMONAS+Demifine+Jewellery+Nexus+Hyderabad+Mall+Kukatpally",
    website: "https://www.palmonas.com/"
  },
  {
    name: "Palmonas - Himayatnagar",
    address: "Himayatnagar, Hyderabad",
    mapUrl: "https://www.google.com/maps/search/Palmonas+Himayatnagar+Hyderabad",
    website: "https://www.palmonas.com/"
  }
];





// Palmonas products from unified collection
const palmonasStoreProducts = allProducts.filter(p => p.store === 'Palmonas');

export function PalmonasStorePage({ onNavigate, onBack }: PalmonasStorePageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedMetal, setSelectedMetal] = useState<string>("All");
  const [priceRange, setPriceRange] = useState<string>("All");
  const [showLocations, setShowLocations] = useState<boolean>(false);

  const categories = ["All", "Rings", "Necklaces", "Earrings", "Bracelets", "Sets"];
  const metals = ["All", "Gold", "White Gold", "Rose Gold", "Platinum"];
  const priceRanges = [
    { label: "All", min: 0, max: Infinity },
    { label: "Under ₹2,00,000", min: 0, max: 200000 },
    { label: "₹2,00,000 - ₹4,00,000", min: 200000, max: 400000 },
    { label: "Above ₹4,00,000", min: 400000, max: Infinity },
  ];

  const filteredProducts = useMemo(() => {
    return palmonasStoreProducts.filter((product) => {
      const categoryMatch = selectedCategory === "All" || product.category === selectedCategory;
      const metalMatch = selectedMetal === "All" || product.metal === selectedMetal;
      const selectedPriceRange = priceRanges.find(r => r.label === priceRange);
      const priceMatch = !selectedPriceRange ||
        (product.priceValue >= selectedPriceRange.min && product.priceValue < selectedPriceRange.max);
      return categoryMatch && metalMatch && priceMatch;
    });
  }, [selectedCategory, selectedMetal, priceRange]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#1a1510] to-[#2a1f14]">
      {/* Navigation Buttons */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <div className="flex items-center gap-3 mb-2">
          {/* Browser Back Button - Uses SPA navigation */}
          <BackButton label="Back" onClick={onBack} />

          {/* Explicit Home Button */}
          <BackButton
            onNavigate={onNavigate}
            targetPage="home"
            label="Home"
            type="home"
          />
        </div>
      </div>

      {/* Hero Section */}
      <div
        className="relative py-16 px-4"
        style={{
          backgroundImage: "url('/shrapal.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Very subtle overlay for better text readability without hiding the model */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-50/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Palmonas Logo Placeholder */}
            <div className="inline-flex items-center justify-center w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-[#d4af37] to-[#f4e5a6] shadow-xl border-4 border-white/20">
              <div className="text-center">
                <Gem className="size-12 text-[#1a1510] mx-auto mb-1" />
                <p
                  className="font-['Cinzel',serif] text-[#1a1510]"
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.08em",
                    fontWeight: 800,
                  }}
                >
                  PALMONAS
                </p>
              </div>
            </div>

            <h1
              className="font-['Cinzel',serif] mb-4"
              style={{
                fontSize: "clamp(36px, 5vw, 64px)",
                letterSpacing: "0.08em",
                fontWeight: 600,
                color: "#f4e5b8",
                textShadow: "0 2px 10px rgba(0,0,0,0.5)",
              }}
            >
              Palmonas Jewellers
            </h1>

            <p
              className="font-['Cinzel',serif] max-w-3xl mx-auto mb-6"
              style={{
                fontSize: "clamp(14px, 2vw, 18px)",
                letterSpacing: "0.04em",
                lineHeight: 1.7,
                color: "#d4b896",
                textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
              }}
            >
              Exquisite Craftsmanship & Timeless Elegance
              <br />
              Celebrating fine jewelry artistry since 1985
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
              <Badge
                className="flex items-center gap-2 px-4 py-2"
                style={{
                  background: "rgba(26, 21, 16, 0.85)",
                  color: "#f4e5b8",
                  border: "1px solid rgba(212, 175, 55, 0.3)",
                  fontSize: "12px",
                  letterSpacing: "0.04em",
                }}
              >
                <Shield className="size-4" />
                Certified Gemstones
              </Badge>
              <Badge
                className="flex items-center gap-2 px-4 py-2"
                style={{
                  background: "rgba(26, 21, 16, 0.85)",
                  color: "#f4e5b8",
                  border: "1px solid rgba(212, 175, 55, 0.3)",
                  fontSize: "12px",
                  letterSpacing: "0.04em",
                }}
              >
                <Star className="size-4 fill-amber-500 text-amber-500" />
                4.9 Rating
              </Badge>
              <Badge
                className="flex items-center gap-2 px-4 py-2"
                style={{
                  background: "rgba(26, 21, 16, 0.85)",
                  color: "#f4e5b8",
                  border: "1px solid rgba(212, 175, 55, 0.3)",
                  fontSize: "12px",
                  letterSpacing: "0.04em",
                }}
              >
                <MapPin className="size-4" />
                125+ Stores
              </Badge>
            </div>

            <p
              className="text-xs italic"
              style={{
                fontSize: "11px",
                letterSpacing: "0.02em",
                color: "#d4b896",
              }}
            >
              * Images shown are representative. Visit official website for actual products.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* Store Locations Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <Card
            className="p-6"
            style={{
              background: "linear-gradient(135deg, #1a1510 0%, #2a1f14 100%)",
              border: "1px solid #d4af37",
            }}
          >
            <button
              onClick={() => setShowLocations(!showLocations)}
              className="w-full flex items-center justify-between hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center gap-2">
                <MapPin className="size-5 text-[#d4af37]" />
                <h2
                  className="font-['Cinzel',serif] text-[#f4e5b8]"
                  style={{
                    fontSize: "18px",
                    letterSpacing: "0.06em",
                    fontWeight: 600,
                  }}
                >
                  Our 2 Locations in Hyderabad
                </h2>
              </div>
              <span className="text-[#d4af37] text-xl">{showLocations ? '−' : '+'}</span>
            </button>

            <AnimatePresence>
              {showLocations && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p
                    className="font-['Cinzel',serif] text-[#d4b896] my-6 text-center"
                    style={{
                      fontSize: "14px",
                      letterSpacing: "0.03em",
                      lineHeight: 1.6,
                      fontWeight: 600,
                    }}
                  >
                    Specializing in demifine, silver & lab-grown diamond jewellery. Visit our Hyderabad stores for the complete collection.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {locations.map((location, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 * index }}
                      >
                        <Card
                          className="p-6 h-full hover:shadow-xl transition-all duration-300"
                          style={{
                            background: "#1a1510",
                            border: "1px solid #d4af37",
                          }}
                        >
                          <h3
                            className="font-['Cinzel',serif] text-[#e89ac7] mb-3"
                            style={{
                              fontSize: "15px",
                              letterSpacing: "0.03em",
                              fontWeight: 600,
                              lineHeight: 1.4,
                            }}
                          >
                            {location.name}
                          </h3>
                          <p
                            className="font-['Cinzel',serif] text-[#5a4a38] text-sm mb-4"
                            style={{ letterSpacing: "0.02em" }}
                          >
                            {location.address}
                          </p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="flex-1 group/map"
                              style={{
                                background: "linear-gradient(135deg, #d4af37 0%, #a4862a 100%)",
                                color: "#1a1510",
                                border: "none",
                                fontSize: "11px",
                                letterSpacing: "0.05em",
                                fontWeight: 700,
                              }}
                              onClick={() => window.open(location.mapUrl, '_blank')}
                            >
                              <span className="font-['Cinzel',serif]">Google Maps</span>
                              <ExternalLink className="size-3 ml-2 transition-transform group-hover/map:translate-x-1" />
                            </Button>
                            {location.website && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 group/site"
                                style={{
                                  borderColor: "#d4af37",
                                  color: "#f4e5b8",
                                  fontSize: "11px",
                                  letterSpacing: "0.05em",
                                  fontWeight: 600,
                                }}
                                onClick={() => window.open(location.website, '_blank')}
                              >
                                <span className="font-['Cinzel',serif]">Website</span>
                                <ExternalLink className="size-3 ml-2 transition-transform group-hover/site:translate-x-1" />
                              </Button>
                            )}
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>

        {/* Filters Section */}
        {/* Main Content: Sidebar + Products Grid - FLEXBOX LAYOUT */}
        <div className="flex gap-8">
          {/* Left Sidebar - Filters */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-[280px] flex-shrink-0 sticky top-24 self-start"
          >
            <Card
              className="p-6 space-y-6 max-h-[calc(100vh-7rem)] overflow-y-auto"
              style={{
                background: "linear-gradient(135deg, #1a1510 0%, #2a1f14 100%)",
                border: "1px solid #d4af37",
              }}
            >
              <div className="flex items-center gap-2 pb-4 border-b border-[#d4af37]/30">
                <Filter className="size-5 text-[#d4af37]" />
                <h3
                  className="font-['Cinzel',serif] text-[#f4e5b8]"
                  style={{
                    fontSize: "18px",
                    letterSpacing: "0.06em",
                    fontWeight: 600,
                  }}
                >
                  Refine Your Selection
                </h3>
              </div>

              {/* Category Filter */}
              <div>
                <label
                  className="block font-['Cinzel',serif] text-[#d4b896] mb-2"
                  style={{ fontSize: "13px", letterSpacing: "0.04em", fontWeight: 600 }}
                >
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#d4af37]/30 bg-[#1a1510] font-['Cinzel',serif] text-[#f4e5b8] focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition-all"
                  style={{ fontSize: "13px" }}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Metal Filter */}
              <div>
                <label
                  className="block font-['Cinzel',serif] text-[#d4b896] mb-2"
                  style={{ fontSize: "13px", letterSpacing: "0.04em", fontWeight: 600 }}
                >
                  Metal Type
                </label>
                <select
                  value={selectedMetal}
                  onChange={(e) => setSelectedMetal(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#d4af37]/30 bg-[#1a1510] font-['Cinzel',serif] text-[#f4e5b8] focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition-all"
                  style={{ fontSize: "13px" }}
                >
                  {metals.map((metal) => (
                    <option key={metal} value={metal}>
                      {metal}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label
                  className="block font-['Cinzel',serif] text-[#d4b896] mb-2"
                  style={{ fontSize: "13px", letterSpacing: "0.04em", fontWeight: 600 }}
                >
                  Price Range
                </label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#d4af37]/30 bg-[#1a1510] font-['Cinzel',serif] text-[#f4e5b8] focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition-all"
                  style={{ fontSize: "13px" }}
                >
                  {priceRanges.map((range) => (
                    <option key={range.label} value={range.label}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bridal/Collection toggle removed - now using unified products */}
              {/* Product Count */}
              <div className="pt-4 border-t border-[#d4af37]/30">
                <p
                  className="font-['Cinzel',serif] text-[#d4b896] text-center"
                  style={{ fontSize: "13px" }}
                >
                  Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Right Column - Products Grid */}
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <CollectionProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  onNavigate={onNavigate!}
                />
              ))}
            </div>

            {/* No Results Message */}
            {
              filteredProducts.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <Card
                    className="inline-block px-12 py-8"
                    style={{
                      background: "linear-gradient(135deg, #1a1510 0%, #2a1f14 100%)",
                      border: "1px solid #d4af37",
                    }}
                  >
                    <Filter className="size-12 text-[#b8985f] mx-auto mb-4" />
                    <h3
                      className="font-['Cinzel',serif] text-[#f4e5b8] mb-2"
                      style={{
                        fontSize: "20px",
                        letterSpacing: "0.06em",
                        fontWeight: 600,
                      }}
                    >
                      No Products Found
                    </h3>
                    <p
                      className="font-['Cinzel',serif] text-[#d4b896]"
                      style={{
                        fontSize: "14px",
                        letterSpacing: "0.03em",
                        fontWeight: 600,
                      }}
                    >
                      Try adjusting your filters to see more results
                    </p>
                  </Card>
                </motion.div>
              )
            }

            {/* Bottom Info Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-16"
            >
              <Card
                className="p-8"
                style={{
                  background: "linear-gradient(135deg, #d4af37 0%, #a4862a 100%)",
                  border: "none",
                }}
              >
                <div className="text-center mb-6">
                  <h3
                    className="font-['Cinzel',serif] text-[#1a1510] mb-3"
                    style={{
                      fontSize: "clamp(20px, 3vw, 28px)",
                      letterSpacing: "0.06em",
                      fontWeight: 700,
                    }}
                  >
                    Visit Palmonas Official Website
                  </h3>
                  <p
                    className="font-['Cinzel',serif] text-[#1a1510]/80 max-w-2xl mx-auto mb-6"
                    style={{
                      fontSize: "clamp(13px, 1.8vw, 15px)",
                      letterSpacing: "0.03em",
                      lineHeight: 1.7,
                      fontWeight: 600,
                    }}
                  >
                    These are representative products. For the complete collection, exact pricing,
                    and availability, please visit the official Palmonas Jewellers website or your nearest store.
                  </p>

                  <Button
                    size="lg"
                    className="group/cta"
                    style={{
                      background: "#1a1510",
                      color: "#d4af37",
                      border: "none",
                      fontSize: "14px",
                      letterSpacing: "0.06em",
                      fontWeight: 700,
                    }}
                    onClick={() => window.open('https://www.palmonas.com/', '_blank')}
                  >
                    <span className="font-['Cinzel',serif]">Visit Palmonas Official Site</span>
                    <ExternalLink className="size-4 ml-2 transition-transform group-hover/cta:translate-x-1" />
                  </Button>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-6 border-t border-white/20">
                  <Badge
                    className="px-4 py-2"
                    style={{
                      background: "rgba(255, 255, 255, 0.15)",
                      color: "white",
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                      fontSize: "11px",
                      letterSpacing: "0.04em",
                    }}
                  >
                    âœ“ Certified Gemstones
                  </Badge>
                  <Badge
                    className="px-4 py-2"
                    style={{
                      background: "rgba(255, 255, 255, 0.15)",
                      color: "white",
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                      fontSize: "11px",
                      letterSpacing: "0.04em",
                    }}
                  >
                    âœ“ Lifetime Exchange
                  </Badge>
                  <Badge
                    className="px-4 py-2"
                    style={{
                      background: "rgba(255, 255, 255, 0.15)",
                      color: "white",
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                      fontSize: "11px",
                      letterSpacing: "0.04em",
                    }}
                  >
                    âœ“ Trusted Since 1985
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
