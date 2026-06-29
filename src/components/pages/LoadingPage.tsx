import { motion } from "motion/react";
import loadingImage from 'figma:asset/6174de01bf6f134370479b76016423555ee87dee.png';

export function LoadingPage() {
  return (
    <div 
      className="fixed inset-0 flex items-center justify-center px-4 py-8"
      style={{
        background: "linear-gradient(180deg, #f5f0e8 0%, #faf7f2 50%, #f8f4ed 100%)"
      }}
    >
      <motion.div 
        className="flex flex-col items-center text-center w-full max-w-4xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Title Section */}
        <div className="mb-8">
          {/* Main Title - ORNAMIS */}
          <motion.h1 
            className="font-['Cinzel',serif] mb-3"
            style={{
              fontSize: "clamp(28px, 5vw, 52px)", // Mobile: 28-32px, Tablet: 36-42px, Laptop: 48-52px
              color: "#2a1f14",
              letterSpacing: "0.1em",
              lineHeight: 1.2,
              fontWeight: 600
            }}
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            ORNAMIS
          </motion.h1>
          
          {/* Subtitle - FASHION METADATA */}
          <motion.p 
            className="font-['Cinzel',serif]"
            style={{
              fontSize: "clamp(9px, 1.5vw, 12px)",
              color: "#6b5947",
              letterSpacing: "0.3em",
              fontWeight: 400,
              marginBottom: "1.5rem"
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            FASHION METADATA
          </motion.p>
        </div>
        
        {/* Tagline Section */}
        <motion.div 
          className="mb-10 space-y-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <p 
            className="font-['Cinzel',serif]"
            style={{
              fontSize: "clamp(11px, 1.8vw, 15px)",
              color: "#3d2f1f",
              letterSpacing: "0.04em",
              lineHeight: 1.7,
              fontWeight: 400
            }}
          >
            DISCOVER THE STORY BEHIND EVERY PIECE
          </p>
          <p 
            className="font-['Cinzel',serif]"
            style={{
              fontSize: "clamp(11px, 1.8vw, 15px)",
              color: "#3d2f1f",
              letterSpacing: "0.04em",
              lineHeight: 1.7,
              fontWeight: 400
            }}
          >
            — EXPLORE THE DETAILS THAT MAKE EACH ONE UNIQUE.
          </p>
        </motion.div>
        
        {/* Jewelry Elements with Shadow */}
        <motion.div
          className="relative w-full max-w-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {/* Jewelry Images */}
          <div className="relative z-10">
            <img 
              src={loadingImage} 
              alt="Elegant jewelry pieces" 
              className="w-full h-auto object-contain"
              style={{
                filter: "brightness(1.02) contrast(1.03)",
                maxHeight: "400px"
              }}
            />
          </div>
          
          {/* Oval Drop Shadow at Bottom */}
          <div 
            className="absolute left-1/2 -translate-x-1/2 w-4/5 h-8"
            style={{
              bottom: "-1.5rem",
              background: "radial-gradient(ellipse, rgba(42, 31, 20, 0.15) 0%, rgba(42, 31, 20, 0.08) 40%, transparent 70%)",
              filter: "blur(12px)",
              zIndex: 0
            }}
          />
        </motion.div>

        {/* Minimal Loading Indicator */}
        <motion.div
          className="mt-12 flex gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: "#c4a574"
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.9, 1.1, 0.9],
              }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}