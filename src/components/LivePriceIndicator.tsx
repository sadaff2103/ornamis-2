import { motion } from "motion/react";
import { TrendingUp, RefreshCw, AlertCircle, Clock } from "lucide-react";
import { useGoldPrice } from "../contexts/GoldPriceContext";
import { formatPrice, getTimeSinceUpdate } from "../utils/goldPriceService";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "./ui/hover-card";

export function LivePriceIndicator() {
  const { rates, loading, refreshRates } = useGoldPrice();

  if (!rates) return null;

  const isLive = rates.source === 'api';
  const isCached = rates.source === 'cache';
  const isFallback = rates.source === 'fallback';

  return (
    <div className="bg-gradient-to-r from-[#492f0e]/10 to-[#6c5c4c]/10 border border-[#492f0e]/20 rounded-lg p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {isFallback ? (
              <AlertCircle className="size-5 text-orange-500" />
            ) : (
              <TrendingUp className="size-5 text-green-600" />
            )}
          </motion.div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-['Cinzel:Regular',sans-serif] text-[#492f0e]">
                Live Gold Rates
              </h4>
              <Badge
                variant={isLive ? "default" : "secondary"}
                className={`text-xs ${
                  isLive
                    ? "bg-green-100 text-green-700"
                    : isCached
                    ? "bg-blue-100 text-blue-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {isLive ? "LIVE" : isCached ? "CACHED" : "FALLBACK"}
              </Badge>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <HoverCard>
                <HoverCardTrigger>
                  <span className="hover:underline cursor-help">
                    24k: {formatPrice(rates.gold24k)}/g
                  </span>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h5 className="font-['Cinzel:Regular',sans-serif] text-[#492f0e]">
                      Gold Rate Breakdown
                    </h5>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>24 Karat (99.9% pure):</span>
                        <strong>{formatPrice(rates.gold24k)}/gram</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>22 Karat (91.67% pure):</span>
                        <strong>{formatPrice(rates.gold22k)}/gram</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>18 Karat (75% pure):</span>
                        <strong>{formatPrice(rates.gold18k)}/gram</strong>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                      Rates are updated every 30 minutes from international gold markets.
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>

              <span>22k: {formatPrice(rates.gold22k)}/g</span>
              <span>18k: {formatPrice(rates.gold18k)}/g</span>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <Clock className="size-3 text-gray-400" />
              <span className="text-xs text-gray-500">
                Updated {getTimeSinceUpdate(rates.lastUpdated)}
              </span>
            </div>
          </div>
        </div>

        <Button
          onClick={refreshRates}
          disabled={loading}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {isFallback && (
        <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-xs text-orange-800 flex items-start gap-2">
            <AlertCircle className="size-4 flex-shrink-0 mt-0.5" />
            <span>
              Live gold rates are currently unavailable. Showing approximate market rates. 
              Actual prices may vary. Please contact us for accurate quotes.
            </span>
          </p>
        </div>
      )}

      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">
          💡 <strong>Price Transparency:</strong> All jewelry prices are calculated using live gold rates plus making charges, 
          gemstone costs, and applicable taxes. Final prices may vary based on exact specifications.
        </p>
      </div>
    </div>
  );
}
