import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import imgNecklace from "figma:asset/41a4eaba0b8ee8647674e7e9763f8ebcc4703779.png";
import imgEarrings from "figma:asset/cc400f14e6fa85dc5b850aa69c13866c3417eccb.png";
import imgRing from "figma:asset/cc4ad9fe9835d3fe71b8d18dc1141a05baf3ea5f.png";

interface IntroScreenProps {
  onComplete: () => void;
}

const slides = [
  {
    id: 1,
    image: imgEarrings,
    alt: "Elegant Earrings",
    rotation: -4.5,
    scale: 1.3,
  },
  {
    id: 2,
    image: imgNecklace,
    alt: "Luxury Necklace",
    rotation: -4.5,
    scale: 1,
  },
  {
    id: 3,
    image: imgRing,
    alt: "Diamond Ring",
    rotation: 35,
    scale: 0.85,
  },
];

export function IntroScreen({ onComplete }: IntroScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Auto-advance slides every 1.8 seconds (faster)
    const timer = setInterval(() => {
      setCurrentSlide((prev) => {
        if (prev < slides.length - 1) {
          return prev + 1;
        } else {
          // After last slide, complete intro quickly
          setTimeout(onComplete, 300);
          return prev;
        }
      });
    }, 1800);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #faf8f5 0%, #f0ebe3 40%, #e8dfd5 100%)"
      }}
    >
      <div className="relative w-full max-w-6xl mx-auto px-4">
        {/* Logo and Tagline */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-4"
        >
          <h1
            className="text-5xl md:text-6xl lg:text-7xl mb-2 relative inline-block"
            style={{
              fontFamily: "'Playfair Display', 'Cinzel Decorative', serif",
              fontWeight: 900,
              color: "#6b4423",
              textShadow: "0 2px 4px rgba(107, 68, 35, 0.3)",
              letterSpacing: "0.05em"
            }}
          >
            {/* Animated ORNAMIS letters */}
            {"ORNAMIS".split("").map((letter, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 50, rotateX: -90 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  rotateX: 0,
                }}
                transition={{
                  delay: 0.3 + index * 0.1,
                  duration: 0.6,
                  type: "spring",
                  stiffness: 200,
                  damping: 10
                }}
                whileHover={{
                  scale: 1.2,
                  color: "#8B4513",
                  textShadow: "0 0 20px rgba(139, 69, 19, 0.5)",
                  transition: { duration: 0.2 }
                }}
                className="relative inline-block"
              >
                {letter}
              </motion.span>
            ))}
          </h1>
          <p
            className="text-base md:text-lg lg:text-xl"
            style={{
              fontFamily: "'Cormorant Garamond', 'Cinzel Decorative', serif",
              fontStyle: "italic",
              fontWeight: 300,
              color: "#8B6F47",
              textShadow: "0 1px 2px rgba(107, 68, 35, 0.15)",
              letterSpacing: "0.1em"
            }}
          >
            fashion metadata
          </p>
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-base md:text-lg lg:text-xl text-center mb-8 max-w-4xl mx-auto leading-relaxed"
          style={{
            fontFamily: "'Cormorant Garamond', 'Cinzel Decorative', serif",
            fontStyle: "italic",
            fontWeight: 400,
            color: "#6b4423",
            textShadow: "0 1px 3px rgba(107, 68, 35, 0.2)"
          }}
        >
          <p className="mb-0">Discover the story behind every piece</p>
          <p>– explore the details that make each one unique.</p>
        </motion.div>

        {/* Jewelry Slideshow with Shadow */}
        <div className="relative h-[350px] md:h-[450px] flex items-center justify-center">
          {/* Ellipse Shadow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 1 }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2"
          >
            <svg
              width="600"
              height="80"
              viewBox="0 0 738 98"
              fill="none"
              className="w-[300px] md:w-[500px] lg:w-[600px]"
            >
              <ellipse
                cx="368.667"
                cy="48.7565"
                rx="368.667"
                ry="48.7565"
                fill="url(#paint0_linear_intro)"
                style={{ transform: "rotate(-2.6deg)", transformOrigin: "center" }}
              />
              <defs>
                <linearGradient
                  id="paint0_linear_intro"
                  x1="368.667"
                  y1="0"
                  x2="368.667"
                  y2="97.513"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#D4CABD" />
                  <stop offset="1" stopColor="#6C5C4C" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

          {/* Jewelry Images Carousel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={slides[currentSlide].id}
              initial={{ opacity: 0, y: 50, rotate: slides[currentSlide].rotation - 10 }}
              animate={{
                opacity: 1,
                y: 0,
                rotate: slides[currentSlide].rotation,
                scale: slides[currentSlide].scale
              }}
              exit={{ opacity: 0, y: -50, rotate: slides[currentSlide].rotation + 10 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[280px] md:w-[400px] lg:w-[500px] h-[300px] md:h-[400px]"
            >
              <img
                src={slides[currentSlide].image}
                alt={slides[currentSlide].alt}
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="flex justify-center gap-2 mt-6"
        >
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide
                ? "w-8 bg-[#492f0e]"
                : "w-2 bg-[#492f0e]/30"
                }`}
            />
          ))}
        </motion.div>

        {/* Progress indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-[#492f0e] text-sm opacity-60"
          >
            ↓
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}