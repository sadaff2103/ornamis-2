import { motion } from "motion/react";
import { JewelryCarousel } from "../JewelryCarousel";
import { ProductCard } from "../ProductCard";
import { Button } from "../ui/button";
import { Sparkles, Camera, ShieldCheck, TrendingUp, ArrowRight } from "lucide-react";
import { PriceEstimator } from "../PriceEstimator";
import { useState, useEffect, useMemo } from "react";
import { allProducts } from "../../data/productCollections";
import { getTimeSeed, getTimeSeededSubset } from "../../utils/shuffleUtils";
import imgPhoto from "figma:asset/c6837340e56187a7dd771e3d8b72bf8a52d53697.png";
import imgRing21 from "figma:asset/f6df2dc13ec2df0bd10d2e3b0c478f7460c1ed28.png";
import imgImage7 from "figma:asset/54726e7fc7d6afc77636d762a41a64b549adfa15.png";
import imgImage8 from "figma:asset/6c66ad760f1920c6675520e43bd3fa10aefcfdc3.png";
import imgEarringsImg from "figma:asset/ab5c452fc682f6bf39c8e4b9bbde4eb909b12078.png";

interface HomePageProps {
  onNavigate: (page: string, params?: any) => void;
  onBack?: () => void;
}

// Featured products logic is now handled dynamically inside the component


// Featured products logic will be inside the component


export function HomePage({ onNavigate }: HomePageProps) {
  const [timeSeed, setTimeSeed] = useState(getTimeSeed());

  useEffect(() => {
    const interval = setInterval(() => {
      const newSeed = getTimeSeed();
      if (newSeed !== timeSeed) {
        setTimeSeed(newSeed);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [timeSeed]);

  // Get dynamic arrivals from allProducts
  const newArrivals = useMemo(() => {
    return getTimeSeededSubset(allProducts, 4).map(p => ({
      id: p.id,
      image: p.imageUrl,
      title: p.name,
      price: p.priceValue,
      seller: p.store,
      category: p.category,
      rating: 4.8 + (Math.random() * 0.2), // Random stable-looking rating
      isNew: p.isNew,
      isFeatured: p.isExclusive || p.isLimited
    }));
  }, [timeSeed]);

  // Featured products for carousel
  const carouselProducts = useMemo(() => {
    // Pick premium/exclusive products for the main stage
    const premium = allProducts.filter(p =>
      p.isExclusive || p.isLimited || p.priceValue > 150000 || p.store === 'Jauhari'
    );
    const pool = premium.length >= 5 ? premium : allProducts;

    return getTimeSeededSubset(pool, 5).map((p, idx) => ({
      id: idx + 1,
      image: p.imageUrl,
      title: p.name,
      price: p.price,
      category: `${p.store} • ${p.category}`,
    }));
  }, [timeSeed]);

  return (
    <div className="min-h-screen">
      {/* Hero Section with imported background */}
      <section className="relative h-[500px] overflow-hidden" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 1440 1134\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(4.4087e-15 56.7 -72 3.4719e-15 720 567)\\'><stop stop-color=\\'rgba(246,243,240,1)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(213,204,191,1)\\' offset=\\'0.5\\'/><stop stop-color=\\'rgba(181,164,143,1)\\' offset=\\'1\\'/></radialGradient></defs></svg>')" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center w-full">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="font-['Cinzel_Decorative',serif] text-[#362312] mb-4">
                Where Technology
                <br />
                Meets Elegance,
                <br />
                Tailored for You.
              </h1>
              <p className="text-[#492f0e] mb-6">
                Discover the story behind every piece – explore the details that make each one unique.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="bg-[#492f0e] hover:bg-[#362312] text-white"
                  onClick={() => onNavigate("collections")}
                >
                  Explore Collections
                  <ArrowRight className="ml-2 size-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[#492f0e] text-[#492f0e] hover:bg-[#492f0e] hover:text-white"
                  onClick={() => onNavigate("ai-designer")}
                >
                  <Sparkles className="mr-2 size-5" />
                  AI Designer
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative h-[400px] hidden lg:block"
            >
              <img
                src={imgPhoto}
                alt="Featured Jewelry"
                className="absolute inset-0 w-full h-full object-contain drop-shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Price Estimator Section */}
      <section className="py-16 bg-gradient-to-b from-white via-[#faf8f5] to-[#f6f3f0]">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-['Cinzel_Decorative',serif] text-[#492f0e] mb-3">
              Price Estimator
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get instant estimates for your jewelry based on metal type, weight, and gemstones
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <PriceEstimator />
          </motion.div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-12 bg-gradient-to-b from-[#f6f3f0] to-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-['Cinzel_Decorative',serif] text-[#492f0e] mb-3">
              Shop by Category
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our curated collections
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
            {/* RINGS */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              onClick={() => onNavigate("rings")}
              className="group relative overflow-hidden rounded-[30px] h-[320px] shadow-lg hover:shadow-2xl transition-all"
            >
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <img
                  alt="Rings"
                  className="absolute h-[172.33%] left-[-2.56%] max-w-none top-[-55.68%] w-full object-cover"
                  src={imgRing21}
                />
              </div>
              <div className="absolute bg-gradient-to-b bottom-0 from-[#332518] left-0 opacity-70 right-0 to-[#f0cec4] top-0 group-hover:opacity-80 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="font-['Cinzel_Decorative',serif] text-[#eee6d9] text-5xl md:text-6xl lg:text-7xl">
                  RINGS
                </p>
              </div>
            </motion.button>

            {/* NECKLACES */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              onClick={() => onNavigate("necklaces")}
              className="group relative overflow-hidden rounded-[30px] h-[320px] shadow-lg hover:shadow-2xl transition-all"
            >
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <img
                  alt="Necklaces"
                  className="absolute inset-0 w-full h-full object-cover"
                  src={imgImage8}
                />
              </div>
              <div className="absolute bg-gradient-to-b from-[#f0cec4] inset-0 opacity-[0.74] to-[#332518] group-hover:opacity-80 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="font-['Cinzel_Decorative',serif] text-[#eee6d9] text-5xl md:text-6xl lg:text-7xl">
                  NECKLACE
                </p>
              </div>
            </motion.button>

            {/* BRACELETS */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              onClick={() => onNavigate("bracelets")}
              className="group relative overflow-hidden rounded-[30px] h-[320px] shadow-lg hover:shadow-2xl transition-all"
            >
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <img
                  alt="Bracelets"
                  className="absolute h-[163.16%] left-0 max-w-none top-[-20.46%] w-full object-cover"
                  src={imgImage7}
                />
              </div>
              <div className="absolute bg-gradient-to-b bottom-0 from-[#f0cec4] left-0 opacity-[0.86] right-0 to-[#332518] top-0 group-hover:opacity-90 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="font-['Cinzel_Decorative',serif] text-[#eee6d9] text-5xl md:text-6xl lg:text-7xl">
                  BRACELETS
                </p>
              </div>
            </motion.button>

            {/* EARRINGS */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              onClick={() => onNavigate("earrings")}
              className="group relative overflow-hidden rounded-[30px] h-[320px] shadow-lg hover:shadow-2xl transition-all"
            >
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <img
                  alt="Earrings"
                  className="absolute inset-0 w-full h-full object-cover"
                  src={imgEarringsImg}
                />
              </div>
              <div className="absolute bg-gradient-to-b from-[#332518] inset-0 opacity-70 to-[#f0cec4] group-hover:opacity-80 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="font-['Cinzel_Decorative',serif] text-[#eee6d9] text-5xl md:text-6xl lg:text-7xl">
                  EARRINGS
                </p>
              </div>
            </motion.button>
          </div>

          <div className="h-[400px] rounded-2xl overflow-hidden shadow-2xl">
            <JewelryCarousel items={carouselProducts} />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Sparkles,
                title: "AI Designer",
                desc: "Create custom jewelry designs with AI",
                color: "#b39978",
              },
              {
                icon: Camera,
                title: "AR Try-On",
                desc: "See how jewelry looks on you",
                color: "#492f0e",
              },
              {
                icon: ShieldCheck,
                title: "Verified Sellers",
                desc: "Only trusted and verified sellers",
                color: "#6c5c4c",
              },
              {
                icon: TrendingUp,
                title: "Smart Recommendations",
                desc: "Personalized just for you",
                color: "#b39978",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-5 rounded-lg hover:bg-[#f5f1ed] transition-colors"
              >
                <div
                  className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-3"
                  style={{ backgroundColor: `${feature.color}20` }}
                >
                  <feature.icon className="size-7" style={{ color: feature.color }} />
                </div>
                <h3 className="mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Virtual Try-On Section */}
      <section
        className="py-16 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #2a1a08 0%, #492f0e 50%, #6c4c2f 100%)" }}
      >
        {/* Decorative orbs */}
        <div className="absolute top-[-80px] right-[-80px] w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(179,153,120,0.25) 0%, transparent 70%)" }} />
        <div className="absolute bottom-[-60px] left-[-60px] w-[300px] h-[300px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(73,47,14,0.5) 0%, transparent 70%)" }} />

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#f5c842] animate-pulse" />
                <span className="text-white/90 text-sm font-medium tracking-wide">NEW FEATURE</span>
              </div>

              <h2 className="font-['Cinzel_Decorative',serif] text-white text-3xl md:text-4xl leading-tight mb-4">
                Virtual Try-On
                <br />
                <span className="text-[#d4af78]">Before You Buy</span>
              </h2>

              <p className="text-white/70 text-base mb-8 max-w-md leading-relaxed">
                Experience jewelry like never before. Use your camera or upload a photo to see exactly how each piece looks on you — no guesswork, just confidence.
              </p>

              <div className="flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="bg-[#d4af78] hover:bg-[#b39560] text-[#2a1a08] font-semibold shadow-lg hover:shadow-xl transition-all"
                  onClick={() => onNavigate("ar-tryon")}
                >
                  <Camera className="mr-2 size-5" />
                  Try On Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/40 text-white hover:bg-white/10 transition-all"
                  onClick={() => onNavigate("universal-tryon")}
                >
                  Upload a Photo
                </Button>
              </div>
            </motion.div>

            {/* Right: Feature cards */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                {
                  icon: "📷",
                  title: "Live Camera",
                  desc: "See jewelry on yourself in real-time with AR overlay",
                  delay: 0,
                },
                {
                  icon: "🖼️",
                  title: "Photo Upload",
                  desc: "Upload any photo and try on hundreds of pieces",
                  delay: 0.1,
                },
                {
                  icon: "🔍",
                  title: "Zoom & Scale",
                  desc: "Adjust size and opacity for a perfect preview",
                  delay: 0.2,
                },
                {
                  icon: "💾",
                  title: "Save & Share",
                  desc: "Download your virtual try-on photos instantly",
                  delay: 0.3,
                },
              ].map((card) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: card.delay }}
                  whileHover={{ scale: 1.04, y: -2 }}
                  onClick={() => onNavigate("ar-tryon")}
                  className="cursor-pointer bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 hover:bg-white/15 hover:border-white/30 transition-all"
                >
                  <div className="text-3xl mb-3">{card.icon}</div>
                  <h4 className="text-white font-semibold text-sm mb-1">{card.title}</h4>
                  <p className="text-white/60 text-xs leading-relaxed">{card.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-12 bg-gradient-to-b from-white to-[#f6f3f0]">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-['Cinzel_Decorative',serif] text-[#492f0e] mb-3">
              New Arrivals
            </h2>
            <p className="text-gray-600">Fresh pieces from our verified sellers</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {newArrivals.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="cursor-pointer"
                onClick={() => onNavigate("product", { productId: product.id })}
              >
                <ProductCard {...product} />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button
              size="lg"
              variant="outline"
              className="border-[#492f0e] text-[#492f0e] hover:bg-[#492f0e] hover:text-white"
              onClick={() => onNavigate("collections")}
            >
              View All Products
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-[#492f0e] to-[#6c5c4c] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-['Cinzel_Decorative',serif] mb-4">
              THE SMART SOLUTION
              <br />
              TO PERFECT JEWELRY CHOICES
            </h2>
            <p className="text-white/80 mb-6 max-w-2xl mx-auto">
              In a world where technology and fashion are often seen as distinct domains, our platform bridges this gap by combining both to create a unique and personalized experience for women in choosing the perfect jewelry for any occasion or outfit.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                size="lg"
                className="bg-white text-[#492f0e] hover:bg-white/90"
                onClick={() => onNavigate("ai-designer")}
              >
                <Sparkles className="mr-2 size-5" />
                Try AI Designer
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#492f0e]"
                onClick={() => onNavigate("universal-tryon")}
              >
                <Camera className="mr-2 size-5" />
                Try AR Virtual Try-On
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}