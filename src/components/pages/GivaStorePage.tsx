import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ExternalLink, Filter, Star, Heart, MapPin, Sparkles, ChevronRight } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { BackButton } from "../BackButton";
import { allProducts } from "../../data/productCollections";
import { CollectionProductCard } from "../CollectionProductCard";
import { SkeletonProductCard } from "../SkeletonProductCard";



interface GivaStorePageProps {
  onNavigate: (page: string, params?: any) => void;
  onBack?: () => void;
}

interface Location {
  name: string;
  address: string;
  mapUrl: string;
}

const locations: Location[] = [
  {
    name: "GIVA Silver & Gold Jewellery | GVK 1 Mall",
    address: "Banjara Hills, Hyderabad",
    mapUrl: "https://www.google.com/maps/search/GIVA+Silver+Gold+Jewellery+GVK+1+Mall+Banjara+Hills+Hyderabad"
  },
  {
    name: "GIVA Silver & Gold Jewellery | Himayatnagar",
    address: "Himayatnagar, Hyderabad",
    mapUrl: "https://www.google.com/maps/search/GIVA+Silver+Gold+Jewellery+Himayatnagar+Hyderabad"
  },
  {
    name: "GIVA Silver & Gold Jewellery | Panjagutta",
    address: "Punjagutta Metro Station, Hyderabad",
    mapUrl: "https://www.google.com/maps/search/GIVA+Silver+Gold+Jewellery+Panjagutta+Hyderabad"
  },
  {
    name: "GIVA Silver & Gold Jewellery | DSL Virtue Mall",
    address: "Uppal (Cricket Stadium area), Hyderabad",
    mapUrl: "https://www.google.com/maps/search/GIVA+Silver+Gold+Jewellery+DSL+Virtue+Mall+Uppal+Hyderabad"
  },
  {
    name: "GIVA Silver & Gold Jewellery | Tolichowki",
    address: "Tolichowki, Hyderabad",
    mapUrl: "https://www.google.com/maps/search/GIVA+Silver+Gold+Jewellery+Tolichowki+Hyderabad"
  },
  {
    name: "GIVA Silver & Gold Jewellery | Kukatpally",
    address: "Kukatpally, Hyderabad",
    mapUrl: "https://www.google.com/maps/search/GIVA+Silver+Gold+Jewellery+Kukatpally+Hyderabad"
  },
  {
    name: "GIVA Silver & Gold Jewellery | Dilsukhnagar",
    address: "Dilsukhnagar, Hyderabad",
    mapUrl: "https://www.google.com/maps/search/GIVA+Silver+Gold+Jewellery+Dilsukhnagar+Hyderabad"
  },
  {
    name: "GIVA Silver & Gold Jewellery | MG Road",
    address: "MG Road, Hyderabad",
    mapUrl: "https://www.google.com/maps/search/GIVA+Silver+Gold+Jewellery+MG+Road+Hyderabad"
  },
  {
    name: "GIVA Silver & Gold Jewellery | Musarambagh",
    address: "Musarambagh, Hyderabad",
    mapUrl: "https://www.google.com/maps/search/GIVA+Silver+Gold+Jewellery+Musarambagh+Hyderabad"
  },
  {
    name: "GIVA Silver & Gold Jewellery Store | Gachibowli",
    address: "Gachibowli, Hyderabad",
    mapUrl: "https://www.google.com/maps/search/GIVA+Silver+Gold+Jewellery+Store+Gachibowli+Hyderabad"
  },
  {
    name: "GIVA Silver & Gold Jewellery | Somajiguda",
    address: "Somajiguda, Hyderabad",
    mapUrl: "https://www.google.com/maps/search/GIVA+Silver+Gold+Jewellery+Somajiguda+Hyderabad"
  },
  {
    name: "GIVA Silver & Gold Jewellery | Attapur",
    address: "Attapur, Hyderabad",
    mapUrl: "https://www.google.com/maps/search/GIVA+Silver+Gold+Jewellery+Attapur+Hyderabad"
  },
  {
    name: "GIVA Silver & Gold Jewellery Store | Vanasthalipuram",
    address: "Vanasthalipuram, Hyderabad",
    mapUrl: "https://www.google.com/maps/search/GIVA+Silver+Gold+Jewellery+Store+Vanasthalipuram+Hyderabad"
  },
  {
    name: "GIVA Silver & Gold Jewellery | Sarath City",
    address: "Sarath City, Hyderabad",
    mapUrl: "https://www.google.com/maps/search/GIVA+Silver+Gold+Jewellery+Sarath+City+Hyderabad"
  },
  {
    name: "GIVA Silver & Gold Jewellery Store | Habsiguda",
    address: "Habsiguda, Hyderabad",
    mapUrl: "https://www.google.com/maps/search/GIVA+Silver+Gold+Jewellery+Store+Habsiguda+Hyderabad"
  },
  {
    name: "GIVA Silver & Gold Jewellery | Kothapet",
    address: "Kothapet, Hyderabad",
    mapUrl: "https://www.google.com/maps/search/GIVA+Silver+Gold+Jewellery+Kothapet+Hyderabad"
  },
  {
    name: "GIVA Silver & Gold Jewellery Store | Madeenaguda",
    address: "Madeenaguda, Hyderabad",
    mapUrl: "https://www.google.com/maps/search/GIVA+Silver+Gold+Jewellery+Store+Madeenaguda+Hyderabad"
  },
  {
    name: "GIVA Silver & Gold Jewellery | Kompally",
    address: "Kompally, Hyderabad",
    mapUrl: "https://www.google.com/maps/search/GIVA+Silver+Gold+Jewellery+Kompally+Hyderabad"
  },
  {
    name: "GIVA Silver & Gold Jewellery | Kondapur",
    address: "Kondapur, Hyderabad",
    mapUrl: "https://www.google.com/maps/search/GIVA+Silver+Gold+Jewellery+Kondapur+Hyderabad"
  }
];






// Giva products from the unified product collection
const givaStoreProducts = allProducts.filter(p => p.store === 'Giva');

export function GivaStorePage({ onNavigate, onBack }: GivaStorePageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [priceRange, setPriceRange] = useState<string>("All");
  const [showLocations, setShowLocations] = useState<boolean>(false);
  const [isLoading] = useState(false);

  const categories = ["All", "Rings", "Necklaces", "Earrings", "Bracelets", "Sets"];
  const priceRanges = [
    { label: "All", min: 0, max: Infinity },
    { label: "Under ₹3,000", min: 0, max: 3000 },
    { label: "₹3,000 - ₹5,000", min: 3000, max: 5000 },
    { label: "Above ₹5,000", min: 5000, max: Infinity },
  ];

  const filteredProducts = useMemo(() => {
    return givaStoreProducts.filter((product) => {
      const categoryMatch = selectedCategory === "All" || product.category === selectedCategory;
      const selectedPriceRange = priceRanges.find(r => r.label === priceRange);
      const priceMatch = !selectedPriceRange ||
        (product.priceValue >= selectedPriceRange.min && product.priceValue < selectedPriceRange.max);
      return categoryMatch && priceMatch;
    });
  }, [selectedCategory, priceRange]);

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

      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 text-sm text-[#d4b896]">
          <button onClick={() => onNavigate("home")} className="hover:text-[#f4e5b8] transition-colors">
            Home
          </button>
          <ChevronRight className="size-4" />
          <button onClick={() => onNavigate("stores")} className="hover:text-[#f4e5b8] transition-colors">
            Stores
          </button>
          <ChevronRight className="size-4" />
          <span className="text-[#f4e5b8] font-semibold">Giva</span>
        </div>
      </div>

      {/* Hero Section */}
      <div
        className="relative py-20 px-4 overflow-hidden"
        style={{
          backgroundImage: "url('/gimme.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Blurred background layer */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/gimme.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: "blur(4px)",
            transform: "scale(1.1)",
          }}
        ></div>
        {/* Enhanced overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1510]/80 via-[#2a1f14]/70 to-[#1a1510]/80"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Enhanced Giva Logo */}
            <div className="inline-flex items-center justify-center w-32 h-32 mb-4 rounded-full bg-gradient-to-br from-[#d4af37] to-[#f4e5a6] shadow-2xl border-4 border-white/20">
              <div className="text-center">
                <Sparkles className="size-14 text-[#1a1510] mx-auto mb-2" strokeWidth={2.5} />
                <p
                  className="font-['Cinzel',serif] text-[#1a1510]"
                  style={{
                    fontSize: "16px",
                    letterSpacing: "0.15em",
                    fontWeight: 700,
                  }}
                >
                  GIVA
                </p>
              </div>
            </div>

            {/* Main Heading with better contrast */}
            <h1
              className="font-['Cinzel',serif] text-[#f4e5b8] drop-shadow-lg"
              style={{
                fontSize: "clamp(42px, 6vw, 72px)",
                letterSpacing: "0.1em",
                fontWeight: 700,
                textShadow: "0 2px 10px rgba(0,0,0,0.5)",
              }}
            >
              GIVA COLLECTIONS
            </h1>

            {/* Subtitle with enhanced readability */}
            <div className="max-w-2xl mx-auto bg-[#1a1510]/95 backdrop-blur-md rounded-2xl px-8 py-6 border-2 border-[#d4af37]/30 shadow-2xl">
              <p
                className="font-['Cinzel',serif] text-[#f4e5b8] font-bold"
                style={{
                  fontSize: "clamp(18px, 2.5vw, 24px)",
                  letterSpacing: "0.05em",
                  lineHeight: 1.8,
                  fontWeight: 700,
                }}
              >
                Modern Silver Jewelry for Everyday Elegance
              </p>
              <p
                className="font-['Cinzel',serif] text-[#d4b896] mt-2 font-semibold"
                style={{
                  fontSize: "clamp(15px, 2vw, 19px)",
                  letterSpacing: "0.03em",
                  lineHeight: 1.6,
                  fontWeight: 600,
                }}
              >
                Contemporary designs that blend style with affordability
              </p>
            </div>

            {/* Enhanced Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Badge
                className="flex items-center gap-2 px-5 py-3 shadow-lg"
                style={{
                  background: "rgba(26, 21, 16, 0.95)",
                  color: "#f4e5b8",
                  border: "2px solid rgba(212, 175, 55, 0.3)",
                  fontSize: "13px",
                  letterSpacing: "0.05em",
                  fontWeight: 600,
                }}
              >
                <Heart className="size-4 fill-[#d4af37] text-[#d4af37]" />
                925 Sterling Silver
              </Badge>
              <Badge
                className="flex items-center gap-2 px-5 py-3 shadow-lg"
                style={{
                  background: "rgba(26, 21, 16, 0.95)",
                  color: "#f4e5b8",
                  border: "2px solid rgba(212, 175, 55, 0.3)",
                  fontSize: "13px",
                  letterSpacing: "0.05em",
                  fontWeight: 600,
                }}
              >
                <Star className="size-4 fill-amber-500 text-amber-500" />
                4.6 Rating
              </Badge>
              <Badge
                className="flex items-center gap-2 px-5 py-3 shadow-lg"
                style={{
                  background: "rgba(26, 21, 16, 0.95)",
                  color: "#f4e5b8",
                  border: "2px solid rgba(212, 175, 55, 0.3)",
                  fontSize: "13px",
                  letterSpacing: "0.05em",
                  fontWeight: 600,
                }}
              >
                <MapPin className="size-4 fill-[#d4af37] text-[#d4af37]" />
                19 Stores in Hyderabad
              </Badge>
            </div>

            <p
              className="text-white/80 text-xs italic bg-black/20 backdrop-blur-sm inline-block px-4 py-2 rounded-full"
              style={{
                fontSize: "12px",
                letterSpacing: "0.03em",
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
                  className="font-['Cinzel',serif] text-[#d4af37]"
                  style={{
                    fontSize: "18px",
                    letterSpacing: "0.06em",
                    fontWeight: 600,
                  }}
                >
                  Our 19 Locations in Hyderabad
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
                    className="font-['Cinzel',serif] text-[#0d9488] my-6 text-center"
                    style={{
                      fontSize: "14px",
                      letterSpacing: "0.03em",
                      lineHeight: 1.6,
                    }}
                  >
                    Visit any of our stores across Hyderabad for the complete GIVA silver and gold jewelry collection
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {locations.map((location, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.02 }}
                      >
                        <Card
                          className="p-4 h-full hover:shadow-lg transition-all duration-300"
                          style={{
                            background: "#1a1510",
                            border: "1px solid #d4af37",
                          }}
                        >
                          <h3
                            className="font-['Cinzel',serif] text-[#f4e5b8] mb-2"
                            style={{
                              fontSize: "13px",
                              letterSpacing: "0.03em",
                              fontWeight: 600,
                              lineHeight: 1.4,
                            }}
                          >
                            {location.name}
                          </h3>
                          <p
                            className="font-['Cinzel',serif] text-[#d4b896] text-xs mb-3"
                            style={{ letterSpacing: "0.02em" }}
                          >
                            {location.address}
                          </p>
                          <Button
                            size="sm"
                            className="w-full group/map"
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
                            <span className="font-['Cinzel',serif]">View on Google Maps</span>
                            <ExternalLink className="size-3 ml-2 transition-transform group-hover/map:translate-x-1" />
                          </Button>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>

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
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonProductCard key={i} />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <CollectionProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    onNavigate={onNavigate}
                  />
                ))}
              </div>
            )}

            {filteredProducts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <Card
                  className="inline-block px-12 py-8"
                  style={{ background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)", border: "1px solid #99f6e4" }}
                >
                  <Filter className="size-12 text-[#0f766e] mx-auto mb-4" />
                  <h3 className="font-['Cinzel',serif] text-[#14b8a6] mb-2 text-xl font-semibold">No Products Found</h3>
                  <p className="font-['Cinzel',serif] text-[#0d9488] text-sm">Try adjusting your filters</p>
                  <Button className="mt-4" onClick={() => { setSelectedCategory("All"); setPriceRange("All"); }}>Clear Filters</Button>
                </Card>
              </motion.div>
            )}
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
                    Visit Giva Official Website
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
                    and availability, please visit the official Giva website or your nearest store.
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
                    onClick={() => window.open('https://www.giva.co/', '_blank')}
                  >
                    <span className="font-['Cinzel',serif]">Visit Giva.co</span>
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
                    ✓ 925 Sterling Silver
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
                    ✓ Easy Returns
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
                    ✓ Affordable Luxury
                  </Badge>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div >
  );
}

