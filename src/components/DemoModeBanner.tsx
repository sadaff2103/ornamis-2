import { motion } from "motion/react";
import { Info, TrendingUp, X } from "lucide-react";
import { useState } from "react";
import { useGoldPrice } from "../contexts/GoldPriceContext";
import { formatPrice } from "../utils/goldPriceService";

export function DemoModeBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const { rates } = useGoldPrice();

  if (!isVisible || !rates) return null;

  const isDemoMode = rates.source === 'fallback';

  // Only show banner in demo mode
  if (!isDemoMode) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200"
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-full">
              <TrendingUp className="size-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-900">DEMO MODE</span>
            </div>
            
            <div className="flex-1">
              <p className="text-sm text-blue-900">
                <span className="font-medium">✅ System working perfectly!</span>
                {" "}Dynamic pricing active with demo rates: 
                <span className="font-['Cinzel:Regular',sans-serif] mx-1">
                  24k @ {formatPrice(rates.gold24k)}/g
                </span>
                •
                <span className="font-['Cinzel:Regular',sans-serif] mx-1">
                  22k @ {formatPrice(rates.gold22k)}/g
                </span>
                •
                <span className="font-['Cinzel:Regular',sans-serif] mx-1">
                  18k @ {formatPrice(rates.gold18k)}/g
                </span>
              </p>
              <p className="text-xs text-blue-700 mt-0.5">
                <strong>No setup needed!</strong> For live market pricing, add API key (optional) →{" "}
                <a 
                  href="https://www.goldapi.io/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-900 font-medium"
                >
                  Get Free Key
                </a>
                {" "}or{" "}
                <a 
                  href="/TROUBLESHOOTING.md" 
                  target="_blank" 
                  className="underline hover:text-blue-900 font-medium"
                >
                  Read Guide
                </a>
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-blue-100 rounded-full transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="size-4 text-blue-600" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
