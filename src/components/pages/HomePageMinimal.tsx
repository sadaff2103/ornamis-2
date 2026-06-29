import { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { Search, Home, Grid3x3, ShoppingCart, User, ChevronRight, Star } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { allProducts, type UnifiedProduct } from "../../data/productCollections";
import { getTimeSeed, getTimeSeededSubset } from "../../utils/shuffleUtils";

interface HomePageMinimalProps {
  onNavigate: (page: string, params?: any) => void;
  onBack?: () => void;
}

const carouselItems = [
  {
    id: 1,
    title: "New Collection",
    subtitle: "Discover luxury",
    color: "#f5f5f0",
  },
  {
    id: 2,
    title: "Gold Jewelry",
    subtitle: "Timeless elegance",
    color: "#fef9f3",
  },
  {
    id: 3,
    title: "Diamond Sets",
    subtitle: "Shine bright",
    color: "#f9f7f5",
  },
];

const featuredBrands = [
  {
    id: 1,
    name: "Jauhari",
    description: "Master Luxury Collection",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1758995115518-26f90aa61b97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  },
  {
    id: 2,
    name: "Giva",
    description: "Modern Silver Jewelry",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1758888262906-1a9c65b2288c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  },
  {
    id: 3,
    name: "Palmonas",
    description: "Exquisite Craftsmanship",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1758995115867-4ef47c98824e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  },
];

const categories = [
  { name: "Rings", icon: "💍", page: "rings" },
  { name: "Necklaces", icon: "📿", page: "necklaces" },
  { name: "Earrings", icon: "💎", page: "earrings" },
  { name: "Bracelets", icon: "⭐", page: "bracelets" },
];

export function HomePageMinimal({ onNavigate }: HomePageMinimalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeSeed, setTimeSeed] = useState(getTimeSeed());

  // Auto-refresh seed every minute to trigger re-renders at the 10-min mark
  useEffect(() => {
    const interval = setInterval(() => {
      const newSeed = getTimeSeed();
      if (newSeed !== timeSeed) {
        setTimeSeed(newSeed);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [timeSeed]);

  // Get a stable subset of 4 products that changes every 10 minutes
  const trendingProducts = useMemo(() => {
    return getTimeSeededSubset(allProducts, 4);
  }, [timeSeed]);


  return (
    <div className="min-h-screen bg-white">
      {/* Top Header - Minimal */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="px-4 py-3 flex items-center justify-between max-w-screen-xl mx-auto">
          {/* Logo */}
          <h1 className="font-['Cinzel:Regular',serif] text-xl text-gray-900">
            ORNAMIS
          </h1>

          {/* Search Icon */}
          <button
            className="p-2 hover:bg-gray-50 rounded-full transition-colors"
            onClick={() => onNavigate("collections")}
          >
            <Search className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20">
        {/* Compact Carousel Banner */}
        <section className="px-4 py-6">
          <div className="max-w-screen-xl mx-auto">
            <div className="relative overflow-hidden rounded-2xl" style={{ height: "180px" }}>
              {carouselItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="absolute inset-0 flex items-center justify-center"
                  initial={false}
                  animate={{
                    x: `${(index - currentSlide) * 100}%`,
                    opacity: index === currentSlide ? 1 : 0.3,
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  style={{ backgroundColor: item.color }}
                >
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">{item.subtitle}</p>
                    <h2 className="font-['Cinzel:Regular',serif] text-2xl text-gray-900">
                      {item.title}
                    </h2>
                  </div>
                </motion.div>
              ))}

              {/* Dots Indicator */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
                {carouselItems.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${index === currentSlide ? "bg-gray-900 w-6" : "bg-gray-300"
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Quick Categories */}
        <section className="px-4 py-4">
          <div className="max-w-screen-xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-900">Shop by Category</h3>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => onNavigate(category.page)}
                  className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <span className="text-2xl">{category.icon}</span>
                  <span className="text-xs text-gray-700">{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Stores Section */}
        <section className="px-4 py-6 bg-gray-50">
          <div className="max-w-screen-xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-medium text-gray-900">Featured Stores</h3>
              <button className="text-xs text-gray-600 flex items-center gap-1 hover:text-gray-900">
                View All
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredBrands.map((store) => (
                <motion.div
                  key={store.id}
                  whileHover={{ y: -2 }}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer"
                  onClick={() => onNavigate("collections")}
                >
                  {/* Store Image */}
                  <div className="h-32 overflow-hidden bg-gray-100">
                    <img
                      src={store.image}
                      alt={store.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Store Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-medium text-gray-900">{store.name}</h4>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-gray-600">{store.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">{store.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Collections - Compact */}
        <section className="px-4 py-6">
          <div className="max-w-screen-xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-medium text-gray-900">Trending Now</h3>
              <button
                className="text-xs text-gray-600 flex items-center gap-1 hover:text-gray-900"
                onClick={() => onNavigate("collections")}
              >
                See All
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {trendingProducts.map((product: UnifiedProduct) => (
                <div
                  key={product.id}
                  className="group cursor-pointer"
                  onClick={() => onNavigate("product", { productId: product.id })}
                >
                  <div className="aspect-square bg-white rounded-xl mb-2 overflow-hidden border border-gray-100 shadow-sm relative">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {product.isNew && (
                      <Badge className="absolute top-2 left-2 bg-black/80 text-white text-[10px] border-none">
                        New
                      </Badge>
                    )}
                  </div>
                  <p className="text-[13px] font-medium text-gray-900 mb-0.5 truncate">{product.name}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-gray-500">{product.price}</p>
                    <p className="text-[10px] text-gray-400 font-serif italic">{product.store}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Promotional Banner - Minimal */}
        <section className="px-4 py-6">
          <div className="max-w-screen-xl mx-auto">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-center">
              <h3 className="font-['Cinzel:Regular',serif] text-xl text-white mb-2">
                Design Your Dream Jewelry
              </h3>
              <p className="text-sm text-gray-300 mb-4">
                Try our AI-powered jewelry designer
              </p>
              <Button
                onClick={() => onNavigate("ai-designer")}
                className="bg-white text-gray-900 hover:bg-gray-100"
                size="sm"
              >
                Start Designing
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Navigation - Simple Icons */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="max-w-screen-xl mx-auto px-4 py-3">
          <div className="flex items-center justify-around">
            <button
              onClick={() => onNavigate("home")}
              className="flex flex-col items-center gap-1 text-gray-900"
            >
              <Home className="w-5 h-5" />
              <span className="text-xs">Home</span>
            </button>

            <button
              onClick={() => onNavigate("collections")}
              className="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-900"
            >
              <Grid3x3 className="w-5 h-5" />
              <span className="text-xs">Categories</span>
            </button>

            <button
              onClick={() => onNavigate("cart")}
              className="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-900 relative"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="text-xs">Cart</span>
              <Badge className="absolute -top-1 -right-2 w-4 h-4 p-0 flex items-center justify-center bg-red-500 text-white text-[10px]">
                0
              </Badge>
            </button>

            <button
              onClick={() => onNavigate("dashboard")}
              className="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-900"
            >
              <User className="w-5 h-5" />
              <span className="text-xs">Profile</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}