import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    SlidersHorizontal,
    Search,
    X,
    Package,
} from "lucide-react";
import { BackButton } from "./BackButton";

import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { FilterSidebar, FilterState } from "./FilterSidebar";
import { CollectionProductCard } from "./CollectionProductCard";
import { SkeletonProductCard } from "./SkeletonProductCard";
import type { UnifiedProduct } from "../data/allProducts";
import { getTimeSeed, getTimeSeededShuffle } from "../utils/shuffleUtils";


interface CatalogPageLayoutProps {
    title: string;
    subtitle: string;
    categoryKey: string; // for FilterSidebar
    products: UnifiedProduct[];
    onNavigate: (page: string, params?: any) => void;
    onBack?: () => void;
    backgroundGradient?: string;
}

const BG_STYLE = {
    backgroundImage:
        "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 1569 3635\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(4.8037e-15 181.75 -78.45 1.1129e-14 784.5 1817.5)\\'><stop stop-color=\\'rgba(219,192,167,1)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(184,157,129,1)\\' offset=\\'0.25\\'/><stop stop-color=\\'rgba(148,121,91,1)\\' offset=\\'0.5\\'/><stop stop-color=\\'rgba(112,85,53,1)\\' offset=\\'0.75\\'/><stop stop-color=\\'rgba(94,67,34,1)\\' offset=\\'0.875\\'/><stop stop-color=\\'rgba(76,49,14,1)\\' offset=\\'1\\'/></radialGradient></defs></svg>')",
};

const DEFAULT_FILTERS: FilterState = {
    categories: [],
    priceRange: [0, 500000],
    materials: [],
    styles: [],
    sellers: [],
};

function useDebounce<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debounced;
}

export function CatalogPageLayout({
    title,
    subtitle,
    categoryKey,
    products,
    onNavigate,
    onBack,
}: CatalogPageLayoutProps) {
    const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [localQuery, setLocalQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const searchRef = useRef<HTMLInputElement>(null);

    const debouncedQuery = useDebounce(localQuery, 300);

    const [timeSeed, setTimeSeed] = useState(getTimeSeed());

    // Simulate initial load
    useEffect(() => {
        const t = setTimeout(() => setIsLoading(false), 400);
        return () => clearTimeout(t);
    }, []);

    // Sync seed every minute
    useEffect(() => {
        const interval = setInterval(() => {
            const newSeed = getTimeSeed();
            if (newSeed !== timeSeed) {
                setTimeSeed(newSeed);
            }
        }, 60000);
        return () => clearInterval(interval);
    }, [timeSeed]);


    const filteredProducts = useMemo(() => {
        // Start with a shuffled list based on the 10-minute seed
        let result = getTimeSeededShuffle(products);

        // Local search filter (case-insensitive, multi-field)
        if (debouncedQuery.trim()) {
            const q = debouncedQuery.toLowerCase().trim();
            result = result.filter(
                (p) =>
                    p.name.toLowerCase().includes(q) ||
                    p.category.toLowerCase().includes(q) ||
                    p.store.toLowerCase().includes(q) ||
                    p.metal.toLowerCase().includes(q) ||
                    p.description.toLowerCase().includes(q)
            );
        }

        // Sidebar filters
        result = result.filter(
            (p) =>
                p.priceValue >= filters.priceRange[0] &&
                p.priceValue <= filters.priceRange[1]
        );
        if (filters.materials.length > 0) {
            result = result.filter((p) => filters.materials.includes(p.metal));
        }
        if (filters.sellers.length > 0) {
            result = result.filter((p) => filters.sellers.includes(p.store));
        }

        return result;
    }, [products, debouncedQuery, filters]);

    const handleClearSearch = useCallback(() => {
        setLocalQuery("");
        searchRef.current?.focus();
    }, []);

    const handleClearFilters = useCallback(() => {
        setFilters(DEFAULT_FILTERS);
        setLocalQuery("");
    }, []);

    const hasActiveFilters =
        localQuery.trim() !== "" ||
        filters.materials.length > 0 ||
        filters.sellers.length > 0 ||
        filters.priceRange[0] > 0 ||
        filters.priceRange[1] < 500000;

    return (
        <div className="min-h-screen relative pb-20" style={BG_STYLE}>
            {/* Header bar */}
            <div className="relative pt-8 pb-4">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center gap-3">
                        <BackButton label="Back" onClick={onBack || (() => onNavigate("collections"))} />
                        <BackButton onNavigate={onNavigate} targetPage="home" label="Home" type="home" />

                        <div className="flex-1" />

                        <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="lg:hidden bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                                >
                                    <SlidersHorizontal className="size-4 mr-2" />
                                    Filters
                                    {hasActiveFilters && (
                                        <span className="ml-1 bg-[#d4af37] text-[#1E1E1E] text-[10px] rounded-full size-4 flex items-center justify-center font-bold">
                                            !
                                        </span>
                                    )}
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] p-0 overflow-y-auto">
                                <FilterSidebar
                                    onFilterChange={setFilters}
                                    onClose={() => setMobileFiltersOpen(false)}
                                    mobile={true}
                                    currentCategory={categoryKey}
                                    onNavigate={onNavigate}
                                />
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>

            {/* Title */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-7xl mx-auto px-4 mb-4 mt-6"
            >
                <h2 className="text-white text-4xl md:text-6xl font-bold font-serif underline decoration-white/30">
                    {title}
                </h2>
            </motion.div>

            {/* Subtitle + Search */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="max-w-7xl mx-auto px-4 mb-8 space-y-4"
            >
                <p className="text-white/80 text-base md:text-lg max-w-3xl">{subtitle}</p>

                {/* Real-time local search bar */}
                <div className="max-w-2xl relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-white/50 pointer-events-none" />
                    <input
                        ref={searchRef}
                        type="text"
                        value={localQuery}
                        onChange={(e) => setLocalQuery(e.target.value)}
                        placeholder={`Search ${title.toLowerCase()} by name, material, store…`}
                        className="w-full pl-12 pr-10 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/15 transition-all"
                    />
                    {localQuery && (
                        <button
                            onClick={handleClearSearch}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                        >
                            <X className="size-4" />
                        </button>
                    )}
                </div>

                <p className="text-white/60 text-sm">
                    Showing{" "}
                    <span className="text-white font-semibold">{filteredProducts.length}</span>{" "}
                    of {products.length}{" "}
                    {categoryKey}
                    {debouncedQuery && (
                        <> matching <span className="text-[#f4e5a6]">"{debouncedQuery}"</span></>
                    )}
                </p>
            </motion.div>

            {/* Main Grid + Sidebar */}
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex gap-6 lg:gap-8">
                    {/* Desktop FilterSidebar */}
                    <motion.aside
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="hidden lg:block w-72 flex-shrink-0"
                    >
                        <div className="sticky top-4">
                            <FilterSidebar
                                onFilterChange={setFilters}
                                currentCategory={categoryKey}
                                onNavigate={onNavigate}
                            />
                        </div>
                    </motion.aside>

                    {/* Products */}
                    <div className="flex-1 min-w-0">
                        <div className="bg-[#e1ccb1]/90 backdrop-blur-sm rounded-xl p-4 md:p-8 shadow-inner">
                            {isLoading ? (
                                /* Skeleton loading state */
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <SkeletonProductCard key={i} />
                                    ))}
                                </div>
                            ) : filteredProducts.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                                    <AnimatePresence mode="popLayout">
                                        {filteredProducts.map((product, index) => (
                                            <CollectionProductCard
                                                key={product.id}
                                                product={product}
                                                index={index}
                                                onNavigate={onNavigate}
                                            />
                                        ))}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                /* Empty state */
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-20"
                                >
                                    <Package className="size-16 text-[#492f0e]/30 mx-auto mb-4" />
                                    <p className="text-[#492f0e] text-xl font-bold mb-2">
                                        No {categoryKey} match your search
                                    </p>
                                    <p className="text-[#492f0e]/60 mb-6 text-sm">
                                        Try different keywords or clear your filters
                                    </p>
                                    <Button
                                        onClick={handleClearFilters}
                                        className="bg-[#492f0e] hover:bg-[#362312] text-white"
                                    >
                                        Clear All Filters
                                    </Button>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-16 bg-gradient-to-r from-[#351d06] to-[#c99c72] py-12"
            >
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
                        <div>
                            <h3 className="text-lg mb-4 font-semibold">Explore</h3>
                            <div className="space-y-2 text-sm">
                                {(["rings", "necklaces", "earrings", "bracelets"] as const).map(
                                    (cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => onNavigate(cat)}
                                            className="block capitalize hover:underline text-white/80 hover:text-white transition-colors"
                                        >
                                            {cat}
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg mb-4 font-semibold">Contact Us</h3>
                            <div className="space-y-1 text-sm text-white/80">
                                <p>admin@ornamis.com</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-start md:items-end">
                            <p className="text-sm text-white/80">© 2025 www.OrnaMIS.com</p>
                            <button
                                onClick={() => onNavigate("privacy")}
                                className="text-sm text-white/60 hover:text-white transition-colors"
                            >
                                privacy | terms & conditions
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
