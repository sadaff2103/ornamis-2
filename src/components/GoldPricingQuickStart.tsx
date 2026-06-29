import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle, TrendingUp, Info } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { useGoldPrice } from "../contexts/GoldPriceContext";
import { formatPrice } from "../utils/goldPriceService";

const DISMISSED_KEY = 'ornamis_quickstart_dismissed';

export function GoldPricingQuickStart() {
  const [isVisible, setIsVisible] = useState(false);
  const { rates } = useGoldPrice();

  useEffect(() => {
    // Check if user has already dismissed this
    const dismissed = localStorage.getItem(DISMISSED_KEY);
    if (!dismissed && rates?.source === 'fallback') {
      // Show after a short delay
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [rates]);

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, 'true');
    setIsVisible(false);
  };

  const handleDontShowAgain = () => {
    handleDismiss();
  };

  if (!rates || rates.source !== 'fallback') return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleDismiss}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="max-w-2xl w-full"
          >
            <Card className="p-6 relative">
              <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close"
              >
                <X className="size-5 text-gray-500" />
              </button>

              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <CheckCircle className="size-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-['Cinzel:Regular',sans-serif] text-[#492f0e]">
                      Gold Pricing System Active ✅
                    </h3>
                    <p className="text-sm text-gray-600">Your ORNAMIS platform is ready to use!</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="size-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-900 mb-1">
                        Demo Mode Active
                      </p>
                      <p className="text-sm text-blue-800">
                        Currently using approximate gold rates for testing and development:
                      </p>
                      <div className="mt-2 space-y-1 text-sm font-['Cinzel:Regular',sans-serif]">
                        <p className="text-blue-900">
                          • 24k Gold: {formatPrice(rates.gold24k)}/gram
                        </p>
                        <p className="text-blue-900">
                          • 22k Gold: {formatPrice(rates.gold22k)}/gram
                        </p>
                        <p className="text-blue-900">
                          • 18k Gold: {formatPrice(rates.gold18k)}/gram
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="size-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-900 mb-1">
                        All Features Working
                      </p>
                      <ul className="text-sm text-green-800 space-y-1">
                        <li>✓ Dynamic jewelry pricing</li>
                        <li>✓ Price breakdowns and transparency</li>
                        <li>✓ Cart calculations with GST</li>
                        <li>✓ Full shopping experience</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Info className="size-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-purple-900 mb-2">
                        Want Live Market Pricing? (Optional)
                      </p>
                      <ol className="text-sm text-purple-800 space-y-1 list-decimal list-inside">
                        <li>Get free API key from <a href="https://www.goldapi.io/" target="_blank" rel="noopener noreferrer" className="underline font-medium">GoldAPI.io</a></li>
                        <li>Add to <code className="bg-purple-100 px-1 rounded">.env</code> file: <code className="bg-purple-100 px-1 rounded">VITE_GOLD_API_KEY=your_key</code></li>
                        <li>Restart server to see live pricing badge</li>
                      </ol>
                      <p className="text-xs text-purple-700 mt-2">
                        See <a href="/TROUBLESHOOTING.md" target="_blank" className="underline font-medium">TROUBLESHOOTING.md</a> for detailed setup
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDontShowAgain}
                  className="text-gray-600"
                >
                  Don't show again
                </Button>
                <Button
                  onClick={handleDismiss}
                  className="bg-[#492f0e] hover:bg-[#5c3a12] text-white"
                >
                  Got it, let's start!
                </Button>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
