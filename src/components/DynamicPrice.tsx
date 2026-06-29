import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TrendingUp, Info, ChevronDown, ChevronUp } from "lucide-react";
import { useGoldPrice } from "../contexts/GoldPriceContext";
import { formatPrice } from "../utils/goldPriceService";
import { Product } from "../contexts/ShopContext";
import { Badge } from "./ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

interface DynamicPriceProps {
  product: Product;
  className?: string;
  showBreakdown?: boolean;
}

export function DynamicPrice({ product, className = "", showBreakdown = false }: DynamicPriceProps) {
  const { rates, calculatePrice } = useGoldPrice();
  const [isOpen, setIsOpen] = useState(false);

  // If product doesn't have gold specs or dynamic pricing is disabled, show static price
  if (!product.isDynamicPricing || !product.goldSpecs) {
    return (
      <div className={className}>
        <p className="font-['Cinzel:Regular',sans-serif] text-[#492f0e]">
          {product.price}
        </p>
      </div>
    );
  }

  // Calculate dynamic price
  const priceBreakdown = rates ? calculatePrice({
    goldWeight: product.goldSpecs.weight,
    purity: product.goldSpecs.purity,
    makingChargesPercent: product.goldSpecs.makingCharges,
    gemstonesCost: product.goldSpecs.gemstonesCost,
    includeGST: true,
  }) : null;

  if (!priceBreakdown) {
    return (
      <div className={className}>
        <p className="font-['Cinzel:Regular',sans-serif] text-[#492f0e]">
          {product.price}
        </p>
        <p className="text-xs text-gray-500">Loading live price...</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-2 flex-wrap">
        <motion.p
          key={priceBreakdown.totalPrice}
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          className="font-['Cinzel:Regular',sans-serif] text-[#492f0e] text-lg"
        >
          {formatPrice(priceBreakdown.totalPrice)}
        </motion.p>
        <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs gap-1">
          <TrendingUp className="size-3" />
          LIVE
        </Badge>
      </div>

      {showBreakdown && (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-2">
          <CollapsibleTrigger className="flex items-center gap-1 text-xs text-gray-600 hover:text-[#492f0e] transition-colors">
            <Info className="size-3" />
            <span>Price breakdown</span>
            {isOpen ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 p-3 bg-[#f6f3f0] rounded-lg space-y-2 text-xs"
              >
                <div className="flex justify-between">
                  <span className="text-gray-600">Gold ({product.goldSpecs.purity}, {product.goldSpecs.weight}g):</span>
                  <span className="font-medium">{formatPrice(priceBreakdown.goldCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Making charges ({product.goldSpecs.makingCharges}%):</span>
                  <span className="font-medium">{formatPrice(priceBreakdown.makingCharges)}</span>
                </div>
                {priceBreakdown.gemstonesCost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gemstones:</span>
                    <span className="font-medium">{formatPrice(priceBreakdown.gemstonesCost)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">GST (3%):</span>
                  <span className="font-medium">{formatPrice(priceBreakdown.gst)}</span>
                </div>
                <div className="border-t border-gray-300 pt-2 flex justify-between">
                  <span className="text-[#492f0e] font-['Cinzel:Regular',sans-serif]">Total:</span>
                  <span className="text-[#492f0e] font-['Cinzel:Regular',sans-serif]">
                    {formatPrice(priceBreakdown.totalPrice)}
                  </span>
                </div>
                <p className="text-gray-500 text-[10px] mt-2">
                  * Price based on live gold rates and may fluctuate with market changes
                </p>
              </motion.div>
            </AnimatePresence>
          </CollapsibleContent>
        </Collapsible>
      )}

      {!showBreakdown && (
        <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
          <TrendingUp className="size-3" />
          Based on live gold rates • {product.goldSpecs.weight}g {product.goldSpecs.purity}
        </p>
      )}
    </div>
  );
}
