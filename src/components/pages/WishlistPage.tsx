import { motion } from "motion/react";
import { Heart, ShoppingCart, Trash2, Share2 } from "lucide-react";
import { useEffect } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { useShop } from "../../contexts/ShopContext";
import { useAuth } from "../../contexts/AuthContext";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { BackButton } from "../BackButton";

interface WishlistPageProps {
  onNavigate: (page: string) => void;
  onBack?: () => void;
}

export function WishlistPage({ onNavigate, onBack }: WishlistPageProps) {
  const { wishlist, removeFromWishlist, addToCart, isInCart } = useShop();
  const { isAuthenticated } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      onNavigate("login");
    }
  }, [isAuthenticated, onNavigate]);

  // Return null while checking authentication
  if (!isAuthenticated) {
    return null;
  }

  const handleAddToCart = (product: any) => {
    addToCart(product);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#1a1510] to-[#2a1f14] py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Navigation Buttons */}
        <div className="flex items-center gap-3 mb-4">
          <BackButton label="Back" onClick={onBack} />
          <BackButton
            onNavigate={onNavigate}
            targetPage="home"
            label="Home"
            type="home"
          />
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-['Cinzel',serif] text-[#f4e5b8] mb-2 flex items-center gap-3">
                <Heart className="size-8 text-[#d4af37]" />
                My Wishlist
              </h1>
              <p className="text-[#d4b896]">
                {wishlist.length === 0
                  ? "Your wishlist is empty"
                  : `${wishlist.length} ${wishlist.length === 1 ? "item" : "items"} saved for later`}
              </p>
            </div>
            {wishlist.length > 0 && (
              <Button variant="outline" className="gap-2 border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37]/10">
                <Share2 className="size-4" />
                Share Wishlist
              </Button>
            )}
          </div>
        </motion.div>

        {wishlist.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-16 text-center">
              <div className="max-w-md mx-auto">
                <Heart className="size-20 text-gray-300 mx-auto mb-6" />
                <h2 className="text-[#492f0e] mb-4">Your Wishlist is Empty</h2>
                <p className="text-gray-600 mb-8">
                  Start adding items you love to your wishlist. Click the heart icon on any product to save it here.
                </p>
                <Button
                  onClick={() => onNavigate("collections")}
                  className="bg-[#492f0e] hover:bg-[#362312]"
                >
                  Browse Collections
                </Button>
              </div>
            </Card>
          </motion.div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group overflow-hidden hover:shadow-xl transition-all">
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#f6f3f0] to-[#e8e4df]">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                    />

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-red-500 hover:text-white rounded-full transition-all shadow-lg"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="size-4" />
                    </button>

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 bg-[#1E1E1E]/80 backdrop-blur-sm text-white px-3 py-1 rounded-full">
                      <span className="font-['Cinzel:Regular',sans-serif] text-xs">{product.category}</span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-['Cinzel:Regular',sans-serif] text-[#1E1E1E] line-clamp-2 min-h-[48px]">
                        {product.title}
                      </h3>
                      {product.description && (
                        <p className="text-[#492f0e]/70 text-sm mt-1 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {product.material.slice(0, 3).map((mat: string) => (
                        <Badge key={mat} variant="secondary" className="text-xs">
                          {mat}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                      <p className="font-['Cinzel:Regular',sans-serif] text-[#492f0e] text-lg">
                        {product.price}
                      </p>
                    </div>

                    {/* Add to Cart Button */}
                    <Button
                      onClick={() => handleAddToCart(product)}
                      disabled={isInCart(product.id)}
                      className="w-full h-10 text-[13px] font-bold shadow-lg shadow-[#d4af37]/10 transition-all active:scale-95"
                      style={{
                        background: isInCart(product.id) ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #d4af37 0%, #f4e5b8 100%)",
                        color: isInCart(product.id) ? "#d4b896/40" : "#1a1510",
                        border: "none",
                      }}
                    >
                      <ShoppingCart className="size-4 mr-2" />
                      {isInCart(product.id) ? "In Cart" : "Add to Cart"}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Add All to Cart Button */}
        {wishlist.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex justify-center"
          >
            <Button
              onClick={() => {
                wishlist.forEach((product) => addToCart(product));
              }}
              className="h-12 px-8 text-[15px] font-bold shadow-lg shadow-[#d4af37]/10 transition-all active:scale-95"
              style={{
                background: "linear-gradient(135deg, #d4af37 0%, #f4e5b8 100%)",
                color: "#1a1510",
                border: "none",
              }}
              size="lg"
            >
              <ShoppingCart className="size-5 mr-1" />
              Add All to Cart
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
