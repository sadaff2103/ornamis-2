import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { GoldRates, calculateJewelryPrice, JewelrySpecs, JewelryPriceBreakdown } from "../utils/goldPriceService";
import { fetchAllMarketRates, MarketRates, UnifiedEstimation, EstimationSpecs, calculateUnifiedEstimation } from "../utils/marketPriceService";
import { toast } from "sonner";

interface GoldPriceContextType {
  rates: GoldRates | null;
  marketRates: MarketRates | null;
  loading: boolean;
  error: string | null;
  refreshRates: () => Promise<void>;
  calculatePrice: (specs: JewelrySpecs) => JewelryPriceBreakdown | null;
  calculateUnified: (specs: EstimationSpecs) => UnifiedEstimation | null;
}

const GoldPriceContext = createContext<GoldPriceContextType | undefined>(undefined);

export function GoldPriceProvider({ children }: { children: ReactNode }) {
  const [marketRates, setMarketRates] = useState<MarketRates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRates = useCallback(async (showToast = false) => {
    try {
      setLoading(true);
      setError(null);
      const allRates = await fetchAllMarketRates();
      setMarketRates(allRates);

      if (showToast) {
        const hasLive = allRates.gold.source === 'api' || allRates.diamond.source === 'api';
        if (hasLive) {
          toast.success("🔴 Live market rates updated from global exchanges");
        } else if (allRates.gold.source === 'cache') {
          toast.info("💾 Using cached market rates");
        } else {
          toast.success("✅ Market pricing system ready");
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch market rates";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Welcome message
    console.log('%c💎 ORNAMIS Market Pricing System', 'color: #b39978; font-weight: bold; font-size: 16px; font-family: Cinzel, serif;');
    console.log('%cInitializing unified pricing (Gold + Diamonds)...', 'color: #666;');
    console.log(' ');

    // Load rates on mount
    loadRates(false);

    // Set up auto-refresh every 30 minutes
    const interval = setInterval(() => {
      loadRates(false);
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [loadRates]);

  const refreshRates = async () => {
    await loadRates(true);
  };

  const calculatePrice = (specs: JewelrySpecs): JewelryPriceBreakdown | null => {
    if (!marketRates) return null;
    return calculateJewelryPrice(marketRates.gold, specs);
  };

  const calculateUnified = (specs: EstimationSpecs): UnifiedEstimation | null => {
    if (!marketRates) return null;
    return calculateUnifiedEstimation(marketRates, specs);
  };

  return (
    <GoldPriceContext.Provider
      value={{
        rates: marketRates?.gold || null,
        marketRates,
        loading,
        error,
        refreshRates,
        calculatePrice,
        calculateUnified,
      }}
    >
      {children}
    </GoldPriceContext.Provider>
  );
}

export function useGoldPrice() {
  const context = useContext(GoldPriceContext);
  if (context === undefined) {
    throw new Error("useGoldPrice must be used within a GoldPriceProvider");
  }
  return context;
}
