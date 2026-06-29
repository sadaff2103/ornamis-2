import { motion } from "motion/react";
import { RefreshCw, AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { useGoldPrice } from "../contexts/GoldPriceContext";
import { formatPrice, getTimeSinceUpdate } from "../utils/goldPriceService";

interface GoldPriceBadgeProps {
    /** Which purity to display (default: 22K) */
    displayPurity?: "24K" | "22K" | "18K";
}

export function GoldPriceBadge({
    displayPurity = "22K",
}: GoldPriceBadgeProps) {
    const { rates, loading, refreshRates } = useGoldPrice();

    // Loading state
    if (loading && !rates) {
        return (
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    <RefreshCw className="size-3.5 text-[#d4af37]" />
                </motion.div>
                <span className="text-xs text-white/70">Loading...</span>
            </div>
        );
    }

    const currentPricePerGram = displayPurity === "24K" ? rates?.gold24k : displayPurity === "22K" ? rates?.gold22k : rates?.gold18k;
    const currentPrice10g = currentPricePerGram ? currentPricePerGram * 10 : 0;
    const isLive = rates?.source === "api" || rates?.source === "cache";

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-3 bg-white/10 backdrop-blur-sm hover:bg-white/15 px-4 py-1.5 rounded-full border border-white/20 cursor-pointer transition-all"
                        onClick={() => refreshRates()}
                    >
                        {/* LIVE Indicator */}
                        <div className="flex items-center gap-1.5">
                            <motion.div
                                className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400' : 'bg-yellow-400'}`}
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [1, 0.7, 1],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            />
                            <span className="text-[10px] text-white/90 font-semibold uppercase tracking-wider">
                                {isLive ? 'LIVE' : 'DEMO'}
                            </span>
                        </div>

                        {/* Divider */}
                        <div className="w-px h-4 bg-white/20" />

                        {/* Gold Icon */}
                        <svg
                            viewBox="0 0 24 24"
                            className="size-4 text-[#d4af37]"
                            fill="currentColor"
                        >
                            <path d="M12 2L4 7v3h2v9H4v3h16v-3h-2v-9h2V7l-8-5zm-2 17H8v-9h2v9zm4 0h-2v-9h2v9zm4-11H6V8.5l6-3.75L18 8.5V8z" />
                        </svg>

                        {/* Purity Label */}
                        <span className="text-xs text-[#d4af37] font-semibold">
                            Au {displayPurity}
                        </span>

                        {/* Price */}
                        <span className="text-sm text-white font-bold">
                            {loading ? (
                                <motion.span
                                    animate={{ opacity: [1, 0.5, 1] }}
                                    transition={{ duration: 0.5, repeat: Infinity }}
                                >
                                    {formatPrice(currentPrice10g)}
                                </motion.span>
                            ) : (
                                formatPrice(currentPrice10g)
                            )}
                        </span>

                        {/* Unit */}
                        <span className="text-[10px] text-white/60">/10g</span>

                        {/* Carousel Dots */}
                        <div className="hidden sm:flex items-center gap-1 ml-1">
                            {["24K", "22K", "18K"].map((p) => (
                                <div key={p} className={`w-1.5 h-1.5 rounded-full ${p === displayPurity ? 'bg-[#d4af37] w-3 scale-110' : 'bg-white/30'} transition-all duration-300`} />
                            ))}
                        </div>
                    </motion.div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-[#2a1f14] border-[#d4af37]/30">
                    <div className="text-xs space-y-1 p-1">
                        <div className="font-semibold text-[#d4af37] mb-2">{isLive ? 'Live Global Rates' : 'Simulated Rates'}</div>
                        <div className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-1.5 min-w-[140px]">
                            <span className="text-white/70">24K (99.9%):</span>
                            <span className="text-white font-medium">{formatPrice((rates?.gold24k || 0) * 10)}</span>
                            <span className="text-white/70">22K (91.6%):</span>
                            <span className="text-white font-medium">{formatPrice((rates?.gold22k || 0) * 10)}</span>
                            <span className="text-white/70">18K (75.0%):</span>
                            <span className="text-white font-medium">{formatPrice((rates?.gold18k || 0) * 10)}</span>
                        </div>
                        <div className="pt-2 mt-2 border-t border-white/10 flex items-center gap-2">
                            {isLive ? (
                                <>
                                    <span className="w-2 h-2 bg-green-400 rounded-full" />
                                    <span className="text-green-400 text-[10px] uppercase tracking-wider">Live Market Sync ✓</span>
                                </>
                            ) : (
                                <>
                                    <AlertCircle className="size-3 text-yellow-500" />
                                    <span className="text-yellow-500 text-[10px]">Approximate market rates</span>
                                </>
                            )}
                        </div>
                        <div className="text-white/40 text-[10px] mt-1">
                            Updated: {rates ? getTimeSinceUpdate(rates.lastUpdated) : "N/A"}
                        </div>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
