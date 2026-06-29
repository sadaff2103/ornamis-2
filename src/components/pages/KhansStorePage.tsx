import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Crown, Award, Filter, Sparkles, Shield } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { BackButton } from "../BackButton";
import { allProducts } from "../../data/productCollections";
import { CollectionProductCard } from "../CollectionProductCard";

interface KhansStorePageProps {
    onNavigate: (page: string, params?: any) => void;
    onBack?: () => void;
}

// Khan Jewellers products from unified collection
const khanStoreProducts = allProducts.filter(p => p.store === 'Khan Jewellers');

export function KhansStorePage({ onNavigate, onBack }: KhansStorePageProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [selectedMetal, setSelectedMetal] = useState<string>("All");
    const [priceRange, setPriceRange] = useState<string>("All");

    const categories = ["All", "Rings", "Necklaces", "Earrings", "Bracelets"];
    const metals = ["All", "Platinum", "Gold", "White Gold", "Rose Gold"];
    const priceRanges = [
        { label: "All", min: 0, max: Infinity },
        { label: "Under ₹2,00,000", min: 0, max: 200000 },
        { label: "₹2,00,000 - ₹3,00,000", min: 200000, max: 300000 },
        { label: "Above ₹3,00,000", min: 300000, max: Infinity },
    ];

    const filteredProducts = useMemo(() => {
        return khanStoreProducts.filter((product) => {
            const categoryMatch = selectedCategory === "All" || product.category === selectedCategory;
            const metalMatch = selectedMetal === "All" || product.metal === selectedMetal;
            const selectedPriceRange = priceRanges.find(r => r.label === priceRange);
            const priceMatch = !selectedPriceRange ||
                (product.priceValue >= selectedPriceRange.min && product.priceValue < selectedPriceRange.max);
            return categoryMatch && metalMatch && priceMatch;
        });
    }, [selectedCategory, selectedMetal, priceRange]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#1a1510] to-[#2a1f14]">
            {/* Navigation Buttons */}
            <div className="max-w-7xl mx-auto px-4 pt-8">
                <div className="flex items-center gap-3">
                    <BackButton label="Back" onClick={onBack} />
                    <BackButton onNavigate={onNavigate} targetPage="home" label="Home" type="home" />
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-[#1a1510] via-[#2a1f14] to-[#1a1510] text-[#f4e5b8] py-20 mb-12 border-b border-[#d4af37]/30">
                <div className="absolute inset-0 bg-[#d4af37]/5" />
                <div className="relative max-w-7xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Crown className="size-20 mx-auto mb-6 text-[#d4af37]" />
                        <h1 className="text-6xl font-bold mb-6 font-['Cinzel',serif] tracking-widest text-[#f4e5b8] drop-shadow-[0_2px_10px_rgba(212,175,55,0.4)]">
                            Khan Jewellers
                        </h1>
                        <p className="text-2xl mb-8 max-w-2xl mx-auto text-[#d4b896] font-medium">
                            Premium Luxury Jewelry Collection
                        </p>
                        <div className="flex items-center justify-center gap-10 text-sm font-semibold tracking-wider text-[#d4af37]">
                            <div className="flex items-center gap-3">
                                <Shield className="size-6" />
                                <span>BIS Hallmarked</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Award className="size-6" />
                                <span>Certified Diamonds</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Sparkles className="size-6" />
                                <span>Exclusive Designs</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 pb-16">
                {/* Filters Section */}
                <Card
                    className="p-8 mb-12 shadow-2xl"
                    style={{
                        background: "linear-gradient(135deg, #1a1510 0%, #2a1f14 100%)",
                        border: "1px solid #d4af37",
                    }}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <Filter className="size-6 text-[#d4af37]" />
                        <h2 className="text-2xl font-bold font-['Cinzel',serif] text-[#f4e5b8] tracking-wide">Filter Products</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {/* Category Filter */}
                        <div>
                            <label className="block text-sm font-bold text-[#d4b896] mb-3 uppercase tracking-wider">Category</label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-4 py-3 bg-[#1a1510] border border-[#d4af37]/30 rounded-lg text-[#f4e5b8] font-medium outline-none focus:ring-2 focus:ring-[#d4af37] transition-all"
                            >
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Metal Filter */}
                        <div>
                            <label className="block text-sm font-bold text-[#d4b896] mb-3 uppercase tracking-wider">Metal</label>
                            <select
                                value={selectedMetal}
                                onChange={(e) => setSelectedMetal(e.target.value)}
                                className="w-full px-4 py-3 bg-[#1a1510] border border-[#d4af37]/30 rounded-lg text-[#f4e5b8] font-medium outline-none focus:ring-2 focus:ring-[#d4af37] transition-all"
                            >
                                {metals.map((metal) => (
                                    <option key={metal} value={metal}>{metal}</option>
                                ))}
                            </select>
                        </div>

                    </div>
                </Card>

                {/* Products Grid */}
                <div className="mb-10 text-center">
                    <h2 className="text-3xl font-bold text-[#f4e5b8] mb-3 font-['Cinzel',serif] tracking-wider">
                        {filteredProducts.length} Premium Pieces
                    </h2>
                    <p className="text-[#d4b896] font-medium">Discover our exquisite collection of luxury jewelry</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product, index) => (
                        <CollectionProductCard
                            key={product.id}
                            product={product}
                            index={index}
                            onNavigate={onNavigate}
                        />
                    ))}
                </div>

                {/* No Products Found */}
                {filteredProducts.length === 0 && (
                    <Card
                        className="p-12 text-center"
                        style={{
                            background: "rgba(26, 21, 16, 0.5)",
                            border: "1px solid rgba(212, 175, 55, 0.3)",
                        }}
                    >
                        <p className="text-xl text-[#d4b896] mb-6">No products found matching your filters</p>
                        <Button
                            onClick={() => {
                                setSelectedCategory("All");
                                setSelectedMetal("All");
                                setPriceRange("All");
                            }}
                            style={{
                                background: "linear-gradient(135deg, #d4af37 0%, #f4e5b8 100%)",
                                color: "#2a1f14",
                                border: "none",
                            }}
                        >
                            Clear All Filters
                        </Button>
                    </Card>
                )}
            </div>
        </div>
    );
}
