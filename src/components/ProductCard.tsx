import { motion } from "motion/react";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface ProductCardProps {
  id: string;
  image: string;
  title: string;
  price: number;
  seller: string;
  category: string;
  rating?: number;
  isNew?: boolean;
  isFeatured?: boolean;
  onQuickView?: () => void;
  onAddToCart?: () => void;
  onAddToWishlist?: () => void;
}

export function ProductCard({
  image,
  title,
  price,
  seller,
  category,
  rating = 4.5,
  isNew = false,
  isFeatured = false,
  onQuickView,
  onAddToCart,
  onAddToWishlist,
}: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all"
    >
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-2">
        {isNew && <Badge className="bg-[#b39978] hover:bg-[#9a8567]">New</Badge>}
        {isFeatured && <Badge className="bg-[#492f0e] hover:bg-[#362312]">Featured</Badge>}
      </div>

      {/* Quick Actions */}
      <div className="absolute top-2 right-2 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="icon"
          onClick={onAddToWishlist}
          className="size-9 rounded-full bg-[#2a1f14]/80 backdrop-blur-md border border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37] hover:text-[#1a1510] transition-all shadow-lg"
        >
          <Heart className="size-4" />
        </Button>
        <Button
          size="icon"
          onClick={onQuickView}
          className="size-9 rounded-full bg-[#2a1f14]/80 backdrop-blur-md border border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37] hover:text-[#1a1510] transition-all shadow-lg"
        >
          <Eye className="size-4" />
        </Button>
      </div>

      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-[#f5f1ed]">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-[#b39978] mb-1">{category}</p>
        <h3 className="mb-1 line-clamp-1">{title}</h3>
        <p className="text-sm text-gray-600 mb-2">by {seller}</p>

        <div className="flex items-center justify-between">
          <p className="text-[#492f0e]">₹{price.toLocaleString('en-IN')}</p>
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">★</span>
            <span className="text-sm">{rating}</span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={onAddToCart}
          className="w-full mt-3 h-12 text-[15px] font-bold shadow-lg shadow-[#d4af37]/10 transition-all active:scale-95"
          style={{
            background: "linear-gradient(135deg, #d4af37 0%, #f4e5b8 100%)",
            color: "#1a1510",
            border: "none",
          }}
        >
          <ShoppingCart className="size-5 mr-2" />
          Add to Cart
        </Button>
      </div>
    </motion.div>
  );
}
