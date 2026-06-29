import { useState, forwardRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, ShoppingCart, Store, ExternalLink, Sparkles } from "lucide-react";

import { Badge } from "./ui/badge";
import { STORE_INFO } from "../data/allProducts";
import type { UnifiedProduct } from "../data/allProducts";
import { useShop } from "../contexts/ShopContext";
import type { Product } from "../contexts/ShopContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useBooking } from "../contexts/BookingContext";

interface CollectionProductCardProps {
    product: UnifiedProduct;
    index?: number;
    onNavigate: (page: string, params?: any) => void;
}

/** Store → page route slug mapping */
const STORE_SLUG_MAP: Record<string, string> = {
    "Giva": "giva",
    "Palmonas": "palmonas",
    "Khan Jewellers": "khans",
    "Jauhari": "jauhari",
};

/** Convert a UnifiedProduct into the ShopContext Product shape */
export function toShopProduct(p: UnifiedProduct): Product {
    return {
        id: p.id,
        title: p.name,
        price: p.price,
        priceValue: p.priceValue,
        image: p.imageUrl,
        category: p.category,
        material: [p.metal],
        style: [],
        description: p.description,
        storeName: p.store,
        storeSlug: STORE_SLUG_MAP[p.store] ?? "giva",
        isNew: p.isNew,
    };
}

export const CollectionProductCard = forwardRef<HTMLDivElement, CollectionProductCardProps>(({
    product,
    index = 0,
    onNavigate,
}, ref) => {
    const { toggleWishlist, addToCart, isInWishlist, isInCart } = useShop();
    const { isBooked } = useBooking();
    const [cartAdded, setCartAdded] = useState(false);
    const shopProduct = toShopProduct(product);
    const inWishlist = isInWishlist(product.id);
    const inCart = isInCart(product.id);
    const reserved = isBooked(product.id);
    const storeSlug = STORE_SLUG_MAP[product.store] ?? "giva";

    const storeInfo = STORE_INFO[product.store] ?? {
        name: product.store,
        color: "#492f0e",
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (reserved) return;
        addToCart(shopProduct);
        setCartAdded(true);
        setTimeout(() => setCartAdded(false), 1500);
    };

    const handleWishlist = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleWishlist(shopProduct);
    };

    const handleViewStore = (e: React.MouseEvent) => {
        e.stopPropagation();
        onNavigate(storeSlug);
    };

    const handleProductClick = () => {
        onNavigate("product", { productId: product.id });
    };

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + index * 0.05, duration: 0.35 }}
            className="group relative bg-gradient-to-b from-[#1a1510] to-[#2a1f14] rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-[#d4af37]/10 hover:border-[#d4af37]/30 cursor-pointer flex flex-col"
            onClick={handleProductClick}
        >
            {/* NEW badge */}
            {product.isNew && !reserved && (
                <div className="absolute top-0 right-0 z-20 bg-gradient-to-r from-[#d4af37] to-[#f4e5a6] text-[#1E1E1E] px-3 py-1 rounded-bl-xl rounded-tr-xl shadow-lg">
                    <span className="text-[10px] font-bold tracking-widest uppercase">NEW</span>
                </div>
            )}

            {/* RESERVED badge */}
            {reserved && (
                <div className="absolute top-0 right-0 z-20 px-3 py-1 rounded-bl-xl rounded-tr-xl shadow-lg"
                    style={{ background: "linear-gradient(135deg, #1a1510 0%, #2a1f14 100%)", border: "1px solid rgba(212,175,55,0.5)" }}
                >
                    <span className="text-[10px] font-bold tracking-widest uppercase text-[#d4af37]">⬥ Reserved</span>
                </div>
            )}

            {/* Image Area */}
            <div className="relative aspect-square overflow-hidden bg-black/20 flex-shrink-0">
                <ImageWithFallback
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1510]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Wishlist button — always topright */}
                <button
                    onClick={handleWishlist}
                    aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                    className={`absolute top-3 right-3 z-10 p-2 rounded-full shadow-md transition-all duration-300 ${inWishlist
                        ? "bg-[#d4af37]"
                        : "bg-[#2a1f14]/80 backdrop-blur-sm hover:bg-[#d4af37] opacity-60 group-hover:opacity-100"
                        }`}
                >
                    <Heart
                        className={`size-5 transition-colors duration-300 ${inWishlist
                            ? "fill-[#1a1510] text-[#1a1510]"
                            : "text-[#d4af37]"
                            }`}
                    />
                </button>

                {/* Store badge */}
                <div className="absolute top-3 left-3 z-10">
                    <Badge
                        className="text-[#1E1E1E] text-[10px] font-bold shadow-sm border-none"
                        style={{ background: "linear-gradient(to right, #d4af37, #f4e5a6)" }}
                    >
                        <Store className="size-2.5 mr-1" />
                        {storeInfo.name.toUpperCase()}
                    </Badge>
                </div>

                {/* Metal badge on hover */}
                <div className="absolute bottom-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Badge className="bg-[#1a1510]/90 text-[#f4e5b8] text-[10px] border border-[#d4af37]/30">{product.metal}</Badge>
                </div>

                {/* Quick Add to Cart on hover */}
                <button
                    onClick={handleAddToCart}
                    disabled={reserved}
                    className={`absolute bottom-3 right-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold shadow-md transition-all duration-300 opacity-0 group-hover:opacity-100 ${
                        reserved
                            ? "bg-[#d4af37]/10 text-[#d4af37]/50 cursor-not-allowed"
                            : cartAdded
                                ? "bg-green-600 text-white"
                                : inCart
                                    ? "bg-white/10 text-white/50 cursor-default"
                                    : "bg-gradient-to-br from-[#d4af37] to-[#f4e5b8] text-[#1a1510] hover:scale-105"
                    }`}
                >
                    <ShoppingCart className="size-3.5" />
                    {reserved ? "Reserved" : cartAdded ? "✓ Added!" : inCart ? "In Cart" : "Quick Add"}
                </button>
            </div>

            {/* Card Content */}
            <div className="p-4 flex flex-col flex-1">
                <p className="text-[10px] text-[#f4e5b8]/60 font-semibold uppercase tracking-widest mb-1">
                    {product.category}
                </p>
                <h3 className="text-sm font-medium text-[#f4e5b8] line-clamp-2 mb-2 group-hover:text-[#d4af37] transition-colors leading-relaxed">
                    {product.name}
                </h3>

                <div className="flex items-center justify-between mt-auto mb-3">
                    <p className="font-bold text-[#d4af37] text-lg tracking-tight">{product.price}</p>
                    <AnimatePresence>
                        {inWishlist && (
                            <motion.span
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                className="text-[10px] text-[#d4af37] font-semibold flex items-center gap-1"
                            >
                                <Heart className="size-3 fill-[#d4af37]" /> Saved
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>

                {/* Action Buttons Row */}
                <div className="flex gap-2">
                    {/* AR Try-On Button - Only for supported categories */}
                    {["Necklaces", "Earrings", "Rings", "Bracelets"].includes(product.category) && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onNavigate("universal-tryon", {
                                    productId: product.id,
                                    brandId: product.store.toLowerCase().replace(' ', '-')
                                });

                            }}
                            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-[11px] font-bold hover:bg-[#d4af37]/20 transition-all active:scale-95 group/ar"
                            title="Virtual Try-On"
                        >
                            <Sparkles className="size-3.5 group-hover/ar:animate-pulse" />
                            Try On
                        </button>
                    )}

                    {/* Add to Cart */}
                    <button
                        onClick={handleAddToCart}
                        disabled={reserved}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[11px] font-bold transition-all active:scale-95 ${
                            reserved
                                ? "bg-[#d4af37]/10 text-[#d4af37]/40 border border-[#d4af37]/20 cursor-not-allowed"
                                : cartAdded
                                    ? "bg-green-600 text-white"
                                    : inCart
                                        ? "bg-white/5 text-[#f4e5b8]/40 border border-[#f4e5b8]/10"
                                        : "bg-gradient-to-br from-[#d4af37] to-[#f4e5b8] text-[#1a1510] hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] shadow-lg"
                        }`}
                    >
                        <ShoppingCart className="size-3.5" />
                        {reserved ? "Reserved" : cartAdded ? "Added!" : inCart ? "In Cart" : "Add to Cart"}
                    </button>

                    {/* View Store */}
                    {/* Icon only if AR button is present to save space */}
                    <button
                        onClick={handleViewStore}
                        className={`flex items-center justify-center rounded-lg border border-[#d4af37]/30 text-[#d4af37] font-bold hover:bg-[#d4af37]/10 transition-all active:scale-95 ${["Necklaces", "Earrings", "Rings", "Bracelets"].includes(product.category)
                            ? "px-2.5 py-2.5"
                            : "px-3 py-2.5 gap-1 text-xs"
                            }`}
                        title={`Visit ${product.store}`}
                    >
                        <ExternalLink className="size-3.5" />
                        {!["Necklaces", "Earrings", "Rings", "Bracelets"].includes(product.category) && "Store"}
                    </button>
                </div>

            </div>
        </motion.div>
    );
});
