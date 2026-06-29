import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calculator, Sparkles, Info, TrendingUp, RefreshCw } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useGoldPrice } from "../contexts/GoldPriceContext";
import { formatPrice } from "../utils/goldPriceService";

interface PriceEstimatorProps {
  className?: string;
}

// Static costs for non-diamond gemstones (fixed reference values in INR)
const OTHER_GEMSTONE_COSTS: Record<string, number> = {
  emerald: 45000,
  ruby: 55000,
  sapphire: 40000,
  pearl: 15000,
};

export function PriceEstimator({ className = "" }: PriceEstimatorProps) {
  const { marketRates, loading, refreshRates, calculateUnified } = useGoldPrice();

  const [metalType, setMetalType] = useState<string>("gold");
  const [purity, setPurity] = useState<string>("22k");
  const [weight, setWeight] = useState<string>("10");
  const [gemstone, setGemstone] = useState<string>("none");
  const [diamondCarats, setDiamondCarats] = useState<string>("0.5");
  const [makingCharges, setMakingCharges] = useState<string>("15");
  const [showBreakdown, setShowBreakdown] = useState<boolean>(false);

  const estimation = useMemo(() => {
    if (!marketRates) return null;

    return calculateUnified({
      metalType: metalType as 'gold' | 'platinum' | 'silver',
      goldWeight: parseFloat(weight) || 0,
      goldPurity: purity as '24k' | '22k' | '18k' | '950' | '925',
      diamondCarats: gemstone === 'diamond' ? parseFloat(diamondCarats) || 0 : 0,
      makingChargesPercent: parseFloat(makingCharges) || 0,
      gemstonesOtherCost: (gemstone !== 'none' && gemstone !== 'diamond')
        ? (OTHER_GEMSTONE_COSTS[gemstone] || 0)
        : 0,
      includeGST: true
    });
  }, [marketRates, metalType, weight, purity, gemstone, diamondCarats, makingCharges, calculateUnified]);

  const ratesSource = marketRates?.gold.source || 'fallback';
  const diamondSource = marketRates?.diamond.source || 'fallback';

  const getBreakdown = () => {
    if (!estimation) return [];

    const items = [
      { label: `${metalType.toUpperCase()} (${purity}) - ${weight}g`, amount: estimation.goldCost },
      { label: `Making Charges (${makingCharges}%)`, amount: estimation.makingCharges },
    ];

    if (gemstone === 'diamond' && estimation.diamondCost > 0) {
      items.push({ label: `Diamond (${diamondCarats}ct) Live Rate`, amount: estimation.diamondCost });
    } else if (gemstone !== 'none' && gemstone !== 'diamond') {
      items.push({ label: `${gemstone.charAt(0).toUpperCase() + gemstone.slice(1)} Cost`, amount: estimation.otherCosts });
    }

    items.push({ label: "GST (3%)", amount: estimation.gst });
    return items;
  };

  return (
    <Card
      className={`relative overflow-hidden ${className}`}
      style={{
        background: "linear-gradient(135deg, #2a1f14 0%, #3d2f1f 100%)",
        border: "2px solid #d4af37",
        boxShadow: "0 8px 32px rgba(212, 175, 55, 0.2)",
      }}
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#f4e5b8]/5 rounded-full blur-2xl" />

      <div className="relative p-6 md:p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="size-6 text-[#d4af37]" />
              <h3
                className="font-['Cinzel',serif] text-[#f4e5b8]"
                style={{
                  fontSize: "clamp(18px, 2.5vw, 24px)",
                  letterSpacing: "0.06em",
                  fontWeight: 600,
                }}
              >
                Price Estimator
              </h3>
            </div>
            <p
              className="font-['Cinzel',serif] text-[#d4b896] text-xs"
              style={{ letterSpacing: "0.03em" }}
            >
              Unified Gold & Diamond Estimation
            </p>
          </div>

          <div className="flex flex-col items-end gap-1">
            <Badge
              className="flex items-center gap-1 cursor-pointer hover:opacity-80 active:scale-95 transition-all"
              onClick={() => refreshRates()}
              style={{
                background: loading
                  ? "linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)"
                  : ['api', 'cache'].includes(ratesSource) || ['api', 'cache'].includes(diamondSource)
                    ? "linear-gradient(135deg, #22c55e 0%, #4ade80 100%)"
                    : "linear-gradient(135deg, #d4af37 0%, #f4e5b8 100%)",
                color: "#2a1f14",
                border: "none",
                fontSize: "10px",
                letterSpacing: "0.05em",
                fontWeight: 600,
              }}
            >
              {loading ? (
                <>
                  <RefreshCw className="size-3 animate-spin" />
                  SYNCING
                </>
              ) : (
                <>
                  <TrendingUp className="size-3" />
                  {['api', 'cache'].includes(ratesSource) || ['api', 'cache'].includes(diamondSource) ? 'LIVE MARKET' : 'DEMO MODE'}
                </>
              )}
            </Badge>
            {marketRates && (
              <span className="text-[9px] text-[#d4b896] uppercase font-['Cinzel',serif]">
                Updated {marketRates.lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Metal Type */}
          <div>
            <label
              className="block font-['Cinzel',serif] text-[#d4b896] mb-2 text-sm"
              style={{ letterSpacing: "0.04em" }}
            >
              Metal Type
            </label>
            <select
              value={metalType}
              onChange={(e) => {
                setMetalType(e.target.value);
                if (e.target.value === "gold") setPurity("22k");
                if (e.target.value === "platinum") setPurity("950");
                if (e.target.value === "silver") setPurity("925");
              }}
              className="w-full px-4 py-2.5 rounded-lg border border-[#d4af37]/30 bg-[#1a1510] font-['Cinzel',serif] text-[#f4e5b8] focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-sm"
            >
              <option value="gold">Gold</option>
              <option value="platinum">Platinum</option>
              <option value="silver">Silver</option>
            </select>
          </div>

          {/* Purity */}
          <div>
            <label
              className="block font-['Cinzel',serif] text-[#d4b896] mb-2 text-sm"
              style={{ letterSpacing: "0.04em" }}
            >
              Purity
            </label>
            <select
              value={purity}
              onChange={(e) => setPurity(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-[#d4af37]/30 bg-[#1a1510] font-['Cinzel',serif] text-[#f4e5b8] focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-sm"
            >
              {metalType === "gold" && (
                <>
                  <option value="24k">24K (99.9%)</option>
                  <option value="22k">22K (91.6%)</option>
                  <option value="18k">18K (75%)</option>
                </>
              )}
              {metalType === "platinum" && <option value="950">950 (95%)</option>}
              {metalType === "silver" && <option value="925">925 Sterling</option>}
            </select>
          </div>

          {/* Weight */}
          <div>
            <label
              className="block font-['Cinzel',serif] text-[#d4b896] mb-2 text-sm"
              style={{ letterSpacing: "0.04em" }}
            >
              Weight (grams)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              min="0"
              step="0.1"
              className="w-full px-4 py-2.5 rounded-lg border border-[#d4af37]/30 bg-[#1a1510] font-['Cinzel',serif] text-[#f4e5b8] focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-sm"
              placeholder="10.0"
            />
          </div>

          {/* Making Charges */}
          <div>
            <label
              className="block font-['Cinzel',serif] text-[#d4b896] mb-2 text-sm"
              style={{ letterSpacing: "0.04em" }}
            >
              Making Charges (%)
            </label>
            <input
              type="number"
              value={makingCharges}
              onChange={(e) => setMakingCharges(e.target.value)}
              min="0"
              step="1"
              className="w-full px-4 py-2.5 rounded-lg border border-[#d4af37]/30 bg-[#1a1510] font-['Cinzel',serif] text-[#f4e5b8] focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-sm"
              placeholder="15"
            />
          </div>

          {/* Gemstone Selection */}
          <div className={gemstone === 'diamond' ? 'md:col-span-1' : 'md:col-span-2'}>
            <label
              className="block font-['Cinzel',serif] text-[#d4b896] mb-2 text-sm"
              style={{ letterSpacing: "0.04em" }}
            >
              Gemstone
            </label>
            <select
              value={gemstone}
              onChange={(e) => setGemstone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-[#d4af37]/30 bg-[#1a1510] font-['Cinzel',serif] text-[#f4e5b8] focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-sm"
            >
              <option value="none">No Gemstone</option>
              <option value="diamond">Diamond (Live Price)</option>
              <option value="emerald">Emerald</option>
              <option value="ruby">Ruby</option>
              <option value="sapphire">Sapphire</option>
              <option value="pearl">Pearl</option>
            </select>
          </div>

          {/* Diamond Carats - Only visible if Diamond is selected */}
          {gemstone === 'diamond' && (
            <div>
              <label
                className="block font-['Cinzel',serif] text-[#d4b896] mb-2 text-sm"
                style={{ letterSpacing: "0.04em" }}
              >
                Carats (ct)
              </label>
              <input
                type="number"
                value={diamondCarats}
                onChange={(e) => setDiamondCarats(e.target.value)}
                min="0.01"
                step="0.01"
                className="w-full px-4 py-2.5 rounded-lg border border-[#d4af37]/30 bg-[#1a1510] font-['Cinzel',serif] text-[#f4e5b8] focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-sm"
                placeholder="0.5"
              />
            </div>
          )}
        </div>

        {/* Estimated Price Display */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="p-6 rounded-xl mb-4 shadow-inner"
          style={{
            background: "linear-gradient(135deg, #d4af37 0%, #f4e5b8 100%)",
          }}
        >
          <div className="flex items-center justify-between mb-3 border-b border-[#2a1f14]/10 pb-2">
            <div className="flex flex-col">
              <p className="text-[10px] font-bold text-[#2a1f14]/60 uppercase tracking-tighter">Raw Market Value</p>
              <p className="font-['Cinzel',serif] text-[#2a1f14] text-lg font-bold">
                {estimation ? formatPrice(estimation.goldCost) : '---'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-[#2a1f14]/60 uppercase tracking-tighter">Live Rate / g</p>
              <p className="font-['Cinzel',serif] text-[#2a1f14] text-sm font-bold">
                {marketRates ? formatPrice(
                  purity === '24k' ? marketRates.gold.gold24k : 
                  purity === '22k' ? marketRates.gold.gold22k : 
                  marketRates.gold.gold18k
                ) : '---'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between mb-1">
            <p
              className="font-['Cinzel',serif] text-[#2a1f14] text-xs"
              style={{ letterSpacing: "0.06em", fontWeight: 700 }}
            >
              ESTIMATED JEWELRY TOTAL
            </p>
            <Sparkles className="size-4 text-[#2a1f14]" />
          </div>
          <p
            className="font-['Cinzel',serif] text-[#2a1f14]"
            style={{
              fontSize: "clamp(24px, 4vw, 32px)",
              letterSpacing: "0.02em",
              fontWeight: 800,
            }}
          >
            {estimation ? formatPrice(estimation.totalPrice) : '---'}
          </p>
          <p
            className="font-['Cinzel',serif] text-[#3d2f1f] text-[10px] mt-1 font-bold italic"
            style={{ letterSpacing: "0.01em" }}
          >
            Includes {makingCharges}% making + 3% GST
          </p>
        </motion.div>

        {/* View Breakdown Button */}
        <Button
          onClick={() => setShowBreakdown(!showBreakdown)}
          variant="outline"
          className="w-full mb-4"
          style={{
            borderColor: "#d4af37",
            color: "#f4e5b8",
            background: "transparent",
            fontSize: "13px",
            letterSpacing: "0.05em",
          }}
        >
          <Info className="size-4 mr-2" />
          {showBreakdown ? "Hide" : "View"} Market Breakdown
        </Button>

        {/* Price Breakdown */}
        <AnimatePresence>
          {showBreakdown && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div
                className="p-4 rounded-lg border border-[#d4af37]/30 mb-4"
                style={{ background: "rgba(212, 175, 55, 0.05)" }}
              >
                <div className="flex items-center justify-between mb-3 border-b border-[#d4af37]/20 pb-2">
                  <p
                    className="font-['Cinzel',serif] text-[#f4e5b8] text-sm"
                    style={{ letterSpacing: "0.05em", fontWeight: 600 }}
                  >
                    Valuation Details
                  </p>
                  <span className="text-[10px] text-green-400 font-bold uppercase tracking-widest">
                    Live SYNC ✓
                  </span>
                </div>
                {getBreakdown().map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-[#d4af37]/10 last:border-0">
                    <span
                      className="font-['Cinzel',serif] text-[#d4b896] text-xs"
                      style={{ letterSpacing: "0.03em" }}
                    >
                      {item.label}
                    </span>
                    <span
                      className="font-['Cinzel',serif] text-[#f4e5b8] text-sm"
                      style={{ letterSpacing: "0.03em", fontWeight: 600 }}
                    >
                      {formatPrice(item.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info Note */}
        <div className="flex items-start gap-2 p-3 rounded-lg" style={{ background: "rgba(212, 175, 55, 0.05)" }}>
          <Info className="size-4 text-[#d4af37] mt-0.5 flex-shrink-0" />
          <p
            className="font-['Cinzel',serif] text-[#b8985f] text-xs leading-relaxed"
            style={{ letterSpacing: "0.02em" }}
          >
            Estimated using live market data for {purity} Gold {gemstone === 'diamond' ? 'and GIA Diamond index' : ''}. Actual prices at checkout may vary based on daily fluctuations.
          </p>
        </div>
      </div>
    </Card>
  );
}
