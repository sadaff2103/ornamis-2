import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, SlidersHorizontal, X, Star, Heart, ShoppingCart } from "lucide-react";
import { buildProductIndex, fuzzySearch } from "../../utils/searchUtils";
import { useShop } from "../../contexts/ShopContext";
import type { Product } from "../../contexts/ShopContext";
import { BackButton } from "../BackButton";

interface SearchResultsPageProps {
    onNavigate: (page: string, params?: any) => void;
    onBack?: () => void;
    initialQuery?: string;
}

const CATEGORIES = ["All", "Rings", "Necklaces", "Earrings", "Bracelets", "Sets", "Pendants"];
const STORES = ["All", "GIVA", "Palmonas", "Khan Jewellers"];
const SORT_OPTIONS = [
    { value: "relevance", label: "Relevance" },
    { value: "price-asc", label: "Price: Low → High" },
    { value: "price-desc", label: "Price: High → Low" },
    { value: "rating", label: "Top Rated" },
    { value: "newest", label: "Newest" },
];

function SkeletonCard() {
    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
            <div className="aspect-square bg-gray-200" />
            <div className="p-4 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-9 bg-gray-200 rounded mt-3" />
            </div>
        </div>
    );
}

export function SearchResultsPage({ onNavigate, onBack, initialQuery = "" }: SearchResultsPageProps) {
    const { searchQuery, addToCart, toggleWishlist, isInWishlist, isInCart, addRecentSearch } = useShop();
    const [loading, setLoading] = useState(true);
    const query = initialQuery || searchQuery;
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedStore, setSelectedStore] = useState("All");
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 800000]);
    const [sortBy, setSortBy] = useState("relevance");
    const [showFilters, setShowFilters] = useState(false);
    const [cartAnimating, setCartAnimating] = useState<string | null>(null);

    const allProducts = useMemo(() => buildProductIndex(), []);

    // Simulate loading on first render
    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, [query]);

    const filteredProducts = useMemo(() => {
        let results: Product[] = query.trim()
            ? fuzzySearch(query, allProducts)
            : allProducts;

        // Category filter
        if (selectedCategory !== "All") {
            results = results.filter(
                (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
            );
        }

        // Store filter
        if (selectedStore !== "All") {
            results = results.filter((p) =>
                p.storeName?.toLowerCase().includes(selectedStore.toLowerCase())
            );
        }

        // Price range filter
        results = results.filter(
            (p) => p.priceValue >= priceRange[0] && p.priceValue <= priceRange[1]
        );

        // Sort
        switch (sortBy) {
            case "price-asc":
                results = [...results].sort((a, b) => a.priceValue - b.priceValue);
                break;
            case "price-desc":
                results = [...results].sort((a, b) => b.priceValue - a.priceValue);
                break;
            case "rating":
                results = [...results].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
                break;
            case "newest":
                results = [...results].filter((p) => p.isNew).concat(
                    results.filter((p) => !p.isNew)
                );
                break;
        }

        return results;
    }, [query, allProducts, selectedCategory, selectedStore, priceRange, sortBy]);

    const handleAddToCart = (product: Product) => {
        setCartAnimating(product.id);
        addToCart(product);
        setTimeout(() => setCartAnimating(null), 1500);
    };

    const handleProductClick = (product: Product) => {
        addRecentSearch(product.title);
        onNavigate("product", { productId: product.id });
    };

    const activeFiltersCount = [
        selectedCategory !== "All",
        selectedStore !== "All",
        priceRange[0] > 0 || priceRange[1] < 800000,
    ].filter(Boolean).length;

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#f6f3f0] to-white">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-3 mb-3">
                        <BackButton label="Back" onClick={onBack} />
                        <BackButton onNavigate={onNavigate} targetPage="home" label="Home" type="home" />
                    </div>
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex-1 flex items-center gap-3 min-w-[200px]">
                            <Search className="size-5 text-[#492f0e] flex-shrink-0" />
                            <h1 className="text-[#492f0e] font-bold text-lg">
                                {query ? `Results for "${query}"` : "All Jewelry"}
                            </h1>
                            <span className="text-sm text-gray-500">
                                {loading ? "Searching…" : `${filteredProducts.length} items`}
                            </span>
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors text-sm font-medium ${showFilters || activeFiltersCount > 0
                                ? "border-[#492f0e] bg-[#492f0e] text-white"
                                : "border-gray-300 text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            <SlidersHorizontal className="size-4" />
                            Filters
                            {activeFiltersCount > 0 && (
                                <span className="bg-white text-[#492f0e] text-xs rounded-full px-1.5 font-bold">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </button>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#492f0e]/30"
                        >
                            {SORT_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex gap-6">
                    {/* Filter Sidebar */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.aside
                                initial={{ opacity: 0, x: -20, width: 0 }}
                                animate={{ opacity: 1, x: 0, width: 260 }}
                                exit={{ opacity: 0, x: -20, width: 0 }}
                                transition={{ duration: 0.2 }}
                                className="flex-shrink-0 overflow-hidden"
                            >
                                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sticky top-[90px]" style={{ minWidth: 240 }}>
                                    <div className="flex items-center justify-between mb-5">
                                        <h3 className="font-bold text-[#492f0e]">Filters</h3>
                                        <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-gray-600">
                                            <X className="size-4" />
                                        </button>
                                    </div>

                                    {/* Category */}
                                    <div className="mb-5">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Category</p>
                                        <div className="space-y-1.5">
                                            {CATEGORIES.map((cat) => (
                                                <label key={cat} className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="category"
                                                        value={cat}
                                                        checked={selectedCategory === cat}
                                                        onChange={() => setSelectedCategory(cat)}
                                                        className="accent-[#492f0e]"
                                                    />
                                                    <span className="text-sm text-gray-700">{cat}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <hr className="border-gray-100 my-4" />

                                    {/* Store */}
                                    <div className="mb-5">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Store</p>
                                        <div className="space-y-1.5">
                                            {STORES.map((store) => (
                                                <label key={store} className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="store"
                                                        value={store}
                                                        checked={selectedStore === store}
                                                        onChange={() => setSelectedStore(store)}
                                                        className="accent-[#492f0e]"
                                                    />
                                                    <span className="text-sm text-gray-700">{store}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <hr className="border-gray-100 my-4" />

                                    {/* Price Range */}
                                    <div className="mb-5">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Price Range</p>
                                        <div className="space-y-2">
                                            {[
                                                { label: "Under ₹10K", min: 0, max: 10000 },
                                                { label: "₹10K – ₹1L", min: 10000, max: 100000 },
                                                { label: "₹1L – ₹3L", min: 100000, max: 300000 },
                                                { label: "₹3L – ₹6L", min: 300000, max: 600000 },
                                                { label: "Above ₹6L", min: 600000, max: 800000 },
                                                { label: "All Prices", min: 0, max: 800000 },
                                            ].map((r) => (
                                                <button
                                                    key={r.label}
                                                    onClick={() => setPriceRange([r.min, r.max])}
                                                    className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${priceRange[0] === r.min && priceRange[1] === r.max
                                                        ? "bg-[#492f0e] text-white"
                                                        : "hover:bg-[#f6f3f0] text-gray-700"
                                                        }`}
                                                >
                                                    {r.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => {
                                            setSelectedCategory("All");
                                            setSelectedStore("All");
                                            setPriceRange([0, 800000]);
                                            setSortBy("relevance");
                                        }}
                                        className="w-full py-2 text-sm text-[#492f0e] border border-[#492f0e] rounded-lg hover:bg-[#f6f3f0] transition-colors font-medium"
                                    >
                                        Clear All Filters
                                    </button>
                                </div>
                            </motion.aside>
                        )}
                    </AnimatePresence>

                    {/* Product Grid */}
                    <div className="flex-1 min-w-0">
                        {/* Active Filter Chips */}
                        {activeFiltersCount > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {selectedCategory !== "All" && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#492f0e] text-white text-xs rounded-full">
                                        {selectedCategory}
                                        <button onClick={() => setSelectedCategory("All")}><X className="size-3" /></button>
                                    </span>
                                )}
                                {selectedStore !== "All" && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#492f0e] text-white text-xs rounded-full">
                                        {selectedStore}
                                        <button onClick={() => setSelectedStore("All")}><X className="size-3" /></button>
                                    </span>
                                )}
                                {(priceRange[0] > 0 || priceRange[1] < 800000) && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#492f0e] text-white text-xs rounded-full">
                                        Price filtered
                                        <button onClick={() => setPriceRange([0, 800000])}><X className="size-3" /></button>
                                    </span>
                                )}
                            </div>
                        )}

                        {loading ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            /* Empty State */
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-20"
                            >
                                <Search className="size-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-[#492f0e] text-xl font-bold mb-2">No results found</h3>
                                <p className="text-gray-500 mb-6">
                                    No jewelry matches "{query}" with your current filters.
                                </p>
                                <button
                                    onClick={() => {
                                        setSelectedCategory("All");
                                        setSelectedStore("All");
                                        setPriceRange([0, 800000]);
                                    }}
                                    className="px-6 py-2 bg-[#492f0e] text-white rounded-lg hover:bg-[#362312] transition-colors text-sm font-medium"
                                >
                                    Clear Filters
                                </button>
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {filteredProducts.map((product, i) => {
                                    const inWishlist = isInWishlist(product.id);
                                    const inCart = isInCart(product.id);
                                    const isAdding = cartAnimating === product.id;
                                    return (
                                        <motion.div
                                            key={product.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: Math.min(i * 0.04, 0.3) }}
                                            className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                                        >
                                            {/* Image */}
                                            <div
                                                className="relative aspect-square overflow-hidden bg-[#f5f1ed] cursor-pointer"
                                                onClick={() => handleProductClick(product)}
                                            >
                                                <img
                                                    src={product.image}
                                                    alt={product.title}
                                                    loading="lazy"
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                                {/* Store badge */}
                                                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full">
                                                    <span className="text-[10px] font-semibold text-[#492f0e]">{product.storeName}</span>
                                                </div>

                                                {/* New badge */}
                                                {product.isNew && (
                                                    <div className="absolute top-2 right-10 bg-[#d4af37] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                        NEW
                                                    </div>
                                                )}

                                                {/* Wishlist button */}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                                                    className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white rounded-full transition-all shadow-sm"
                                                >
                                                    <Heart
                                                        className={`size-4 transition-colors ${inWishlist ? "fill-red-500 text-red-500" : "text-gray-400"
                                                            }`}
                                                    />
                                                </button>
                                            </div>

                                            {/* Content */}
                                            <div className="p-3">
                                                <p className="text-[10px] text-[#b39978] font-semibold uppercase tracking-wider mb-1">
                                                    {product.category}
                                                </p>
                                                <h3
                                                    className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1 cursor-pointer hover:text-[#492f0e] transition-colors"
                                                    onClick={() => handleProductClick(product)}
                                                >
                                                    {product.title}
                                                </h3>

                                                {product.rating && (
                                                    <div className="flex items-center gap-1 mb-2">
                                                        <Star className="size-3 fill-[#d4af37] text-[#d4af37]" />
                                                        <span className="text-xs text-gray-500">{product.rating}</span>
                                                        {product.reviewCount && (
                                                            <span className="text-xs text-gray-400">({product.reviewCount})</span>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="flex items-center justify-between mt-2">
                                                    <p className="font-bold text-[#492f0e] text-sm">{product.price}</p>
                                                </div>

                                                {/* Add to Cart */}
                                                <button
                                                    onClick={() => handleAddToCart(product)}
                                                    disabled={inCart || isAdding}
                                                    className={`mt-2 w-full py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-300 ${isAdding
                                                        ? "bg-green-500 text-white"
                                                        : inCart
                                                            ? "bg-gray-100 text-gray-500 cursor-default"
                                                            : "bg-[#492f0e] hover:bg-[#362312] text-white active:scale-95"
                                                        }`}
                                                >
                                                    <ShoppingCart className="size-3.5" />
                                                    {isAdding ? "✓ Added!" : inCart ? "In Cart" : "Add to Cart"}
                                                </button>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
