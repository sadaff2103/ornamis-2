import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

interface PriceData {
  metal: string;
  price: number;
  change: number;
  changePercent: number;
  symbol: string;
}

export function LivePriceTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prices, setPrices] = useState<PriceData[]>([
    {
      metal: "24K Gold",
      price: 6500,
      change: 45,
      changePercent: 0.7,
      symbol: "Au 24K",
    },
    {
      metal: "22K Gold",
      price: 5950,
      change: 38,
      changePercent: 0.64,
      symbol: "Au 22K",
    },
    {
      metal: "18K Gold",
      price: 4875,
      change: 30,
      changePercent: 0.62,
      symbol: "Au 18K",
    },
    {
      metal: "Platinum",
      price: 3200,
      change: -15,
      changePercent: -0.47,
      symbol: "Pt 950",
    },
    {
      metal: "Silver",
      price: 85,
      change: 1.5,
      changePercent: 1.8,
      symbol: "Ag 925",
    },
  ]);

  // Rotate through different metals every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % prices.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [prices.length]);

  // Simulate live price updates every 10 seconds
  useEffect(() => {
    const updateInterval = setInterval(() => {
      setPrices((prevPrices) =>
        prevPrices.map((price) => {
          // Random fluctuation between -0.5% to +0.5%
          const fluctuation = (Math.random() - 0.5) * 0.01;
          const newPrice = Math.round(price.price * (1 + fluctuation));
          const change = newPrice - price.price;
          const changePercent = ((change / price.price) * 100);

          return {
            ...price,
            price: newPrice,
            change: parseFloat(change.toFixed(2)),
            changePercent: parseFloat(changePercent.toFixed(2)),
          };
        })
      );
    }, 10000);

    return () => clearInterval(updateInterval);
  }, []);

  const currentPrice = prices[currentIndex];
  const isPositive = currentPrice.change >= 0;

  return (
    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/20">
      {/* Live Indicator */}
      <div className="flex items-center gap-1.5">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.7, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-2 h-2 rounded-full bg-green-400"
        />
        <span className="text-[10px] text-white/90 font-['Cinzel',serif] uppercase tracking-wider">
          Live
        </span>
      </div>

      {/* Divider */}
      <div className="w-px h-4 bg-white/20" />

      {/* Price Data */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-3"
        >
          {/* Metal Symbol */}
          <div className="flex items-center gap-1.5">
            <Activity className="size-3.5 text-[#d4af37]" />
            <span className="text-xs text-white/90 font-['Cinzel',serif] font-semibold tracking-wide">
              {currentPrice.symbol}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-white font-['Cinzel',serif] font-bold">
              ₹{currentPrice.price.toLocaleString("en-IN")}
            </span>
            <span className="text-[9px] text-white/60 font-['Cinzel',serif]">
              /gram
            </span>
          </div>

          {/* Change */}
          <div
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${
              isPositive
                ? "bg-green-500/20 text-green-300"
                : "bg-red-500/20 text-red-300"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="size-3" />
            ) : (
              <TrendingDown className="size-3" />
            )}
            <span className="text-[10px] font-['Cinzel',serif] font-semibold">
              {isPositive ? "+" : ""}
              {currentPrice.change.toFixed(2)}
            </span>
            <span className="text-[9px] font-['Cinzel',serif]">
              ({isPositive ? "+" : ""}
              {currentPrice.changePercent.toFixed(2)}%)
            </span>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Rotation Dots */}
      <div className="hidden sm:flex items-center gap-1 ml-1">
        {prices.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              index === currentIndex
                ? "bg-[#d4af37] w-3"
                : "bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
