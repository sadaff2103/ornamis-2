import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ShoppingCart, Heart, Truck, Shield, RotateCcw, Star, ChevronRight, Store as StoreIcon, ExternalLink, Sparkles, Gem, Lock } from "lucide-react";

import { Button } from "../ui/button";

import { Card } from "../ui/card";
import { allProducts as collectionProducts } from "../../data/productCollections";
import { useShop } from "../../contexts/ShopContext";
import { BackButton } from "../BackButton";
import { AdvanceBookingModal } from "../AdvanceBookingModal";
import { useBooking } from "../../contexts/BookingContext";
import { computeAdvanceBreakdown, type BookingItem } from "../../services/bookingService";

interface ProductDetailPageProps {
    productId: string;
    onNavigate: (page: string, params?: any) => void;
    onBack?: () => void;
}

interface CartConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onViewCart: () => void;
    productName: string;
}

// Add to Cart Confirmation Modal
function CartConfirmModal({ isOpen, onClose, onViewCart, productName }: CartConfirmModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
                    >
                        <Card className="p-6 bg-white shadow-2xl">
                            {/* Close button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="size-5" />
                            </button>

                            {/* Success icon */}
                            <div className="flex justify-center mb-4">
                                <div className="size-16 rounded-full bg-green-100 flex items-center justify-center">
                                    <ShoppingCart className="size-8 text-green-600" />
                                </div>
                            </div>

                            {/* Message */}
                            <h3 className="text-xl font-semibold text-center mb-2 font-['Cinzel',serif]">
                                Item Added to Cart!
                            </h3>
                            <p className="text-center text-gray-600 mb-6 text-sm">
                                {productName} has been added to your cart
                            </p>

                            {/* Action buttons */}
                            <div className="flex gap-3">
                                <Button
                                    onClick={onViewCart}
                                    className="flex-1"
                                    style={{
                                        background: "linear-gradient(135deg, #6b4423 0%, #8B4513 100%)",
                                        color: "white",
                                    }}
                                >
                                    View Cart
                                </Button>
                                <Button
                                    onClick={onClose}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    Continue Shopping
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export function ProductDetailPage({ productId, onNavigate, onBack }: ProductDetailPageProps) {
    const { toggleWishlist, isInWishlist } = useShop();
    const { isBooked } = useBooking();

    /** Route slug for each store */
    const STORE_SLUG_MAP: Record<string, string> = {
        "Khan Jewellers": "khans",
        "Giva": "giva",
        "GIVA": "giva",
        "Palmonas": "palmonas",
        "Jauhari": "jauhari",
    };

    const STORE_COLORS: Record<string, string> = {
        "Khan Jewellers": "#800020",
        "Giva": "#8B4513",
        "GIVA": "#8B4513",
        "Palmonas": "#4B0082",
        "Jauhari": "#D4AF37",
    };

    // Single source of truth: look up product from productCollections.ts
    const collectionProduct = collectionProducts.find(p => p.id === productId);
    let productData: any = undefined;
    if (collectionProduct) {
        productData = {
            id: collectionProduct.id,
            name: collectionProduct.name,
            category: collectionProduct.category,
            description: collectionProduct.description,
            price: collectionProduct.price,
            priceValue: collectionProduct.priceValue,
            metal: collectionProduct.metal,
            imageUrl: collectionProduct.imageUrl,
            images: collectionProduct.images || [collectionProduct.imageUrl],
            weight: collectionProduct.weight ?? 'N/A',
            purity: '',
            stoneType: 'N/A',
            brand: collectionProduct.store,
            rating: 4.7,
            reviewCount: 128,
            availability: 'In Stock',
            deliveryDays: '3-5',
        };
    }

    // Fallback if product not found
    if (!productData) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#faf8f5] to-[#f0ebe3] flex items-center justify-center">
                <Card className="p-8 text-center">
                    <h2 className="text-2xl font-bold text-[#6b4423] mb-4">Product Not Found</h2>
                    <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
                    <Button onClick={() => onNavigate("home")}>Return to Home</Button>
                </Card>
            </div>
        );
    }
    const product = {
        ...productData,
        rating: productData.rating || 4.7,
        reviewCount: productData.reviewCount || 128,
        availability: productData.availability || "In Stock",
        deliveryDays: productData.deliveryDays || "3-5",
    };

    const [selectedSize, setSelectedSize] = useState<string>("");
    const [quantity, setQuantity] = useState(1);
    const [showCartModal, setShowCartModal] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [mainImage, setMainImage] = useState(product.imageUrl);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [isZooming, setIsZooming] = useState(false);

    const productIsBooked = isBooked(product.id);

    // Prepare booking item from current product
    const bookingItem: BookingItem = {
        productId: product.id,
        productName: product.name,
        productImage: product.imageUrl,
        productPrice: product.priceValue,
        storeName: (product as any).brand ?? "Store",
        storeSlug: STORE_SLUG_MAP[(product as any).brand] ?? "stores",
        category: product.category,
        quantity,
    };

    const { advanceAmount } = computeAdvanceBreakdown(product.priceValue * quantity);

    const formatPrice = (n: number) =>
        new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

    // Universal wishlist — works for every product ID, persists via localStorage
    const shopProduct = {
        id: product.id,
        title: product.name,
        price: product.price,
        priceValue: product.priceValue,
        image: product.imageUrl,
        category: product.category,
        material: [product.metal],
        style: [],
        description: product.description,
        storeName: (product as any).brand ?? '',
    };
    const isWishlisted = isInWishlist(product.id);
    const handleToggleWishlist = () => toggleWishlist(shopProduct);


    // Available sizes for jewelry
    const sizes = [
        "Extra Small (XS)",
        "Small (S)",
        "Medium (M)",
        "Large (L)",
        "Extra Large (XL)",
        "6", "7", "8", "9", "10", "11", "12", // Ring sizes
    ];

    // Images: use real ones if available, otherwise placeholders (for other brands)
    const galleryImages = product.images.map((url: string, idx: number) => ({
        id: idx,
        url,
        label: idx === 0 ? "Front View" : `View ${idx + 1}`,
        isPlaceholder: false
    }));

    // If only one image, we can add placeholders for others if desired, 
    // but the user specifically asked for "similar sliding images" which implies using the ones Jauhari has.
    const displayImages = galleryImages.length > 1 ? galleryImages : [
        galleryImages[0],
        { id: 1, url: "/jewelry/placeholder-side.jpg", label: "Side View", isPlaceholder: true },
        { id: 2, url: "/jewelry/placeholder-detail.jpg", label: "Close Up", isPlaceholder: true },
        { id: 3, url: "/jewelry/placeholder-model.jpg", label: "On Model", isPlaceholder: true },
    ].slice(0, 4);

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert("Please select a size before adding to cart");
            return;
        }

        // Add to cart logic here with size
        console.log("Adding to cart:", {
            ...product,
            selectedSize,
            quantity,
        });

        setShowCartModal(true);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isZooming) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        setZoomPosition({ x, y });
    };

    return (
        <div className="min-h-screen transition-colors duration-500 bg-gradient-to-b from-[#0a0a0a] via-[#1a1510] to-[#2a1f14]">
            {/* Navigation Buttons */}
            <div className="max-w-7xl mx-auto px-4 pt-8">
                <div className="flex items-center gap-3">
                    <BackButton
                        onClick={onBack}
                        label="Back"
                    />
                    <BackButton onNavigate={onNavigate} targetPage="home" label="Home" type="home" />
                </div>
            </div>

            {/* Add to Cart Confirmation Modal */}
            <CartConfirmModal
                isOpen={showCartModal}
                onClose={() => setShowCartModal(false)}
                onViewCart={() => onNavigate("cart")}
                productName={product.name}
            />

            {/* Advance Booking Modal */}
            <AdvanceBookingModal
                isOpen={showBookingModal}
                onClose={() => setShowBookingModal(false)}
                items={[bookingItem]}
                onSuccess={() => {
                    setShowBookingModal(false);
                    onNavigate("dashboard");
                }}
            />

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm mb-6 text-[#d4b896]">
                    <button
                        onClick={() => onNavigate("home")}
                        className="hover:text-[#f4e5b8]"
                    >
                        Home
                    </button>
                    <ChevronRight className="size-4" />
                    <button
                        onClick={() => onNavigate("collections")}
                        className="hover:text-[#f4e5b8]"
                    >
                        {product.category}
                    </button>
                    <ChevronRight className="size-4" />
                    <span className="text-[#f4e5b8]">{product.name}</span>
                </div>

                {/* Main Product Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Left: Image Gallery */}
                    <div className="space-y-4">
                        {/* Main Image with Zoom */}
                        <div
                            className="relative aspect-square rounded-lg overflow-hidden cursor-zoom-in shadow-lg bg-[#1a1510] border border-[#d4af37]"
                            onMouseEnter={() => setIsZooming(true)}
                            onMouseLeave={() => setIsZooming(false)}
                            onMouseMove={handleMouseMove}
                        >
                            <img
                                src={mainImage}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                style={{
                                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                                    transform: isZooming ? "scale(2)" : "scale(1)",
                                    transition: isZooming ? "none" : "transform 0.3s ease",
                                }}
                            />

                            {isZooming && (
                                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                    Hover to zoom
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Grid */}
                        <div className="grid grid-cols-4 gap-3">
                            {displayImages.map((img: any) => (
                                <button
                                    key={img.id}
                                    onClick={() => !img.isPlaceholder && setMainImage(img.url)}
                                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${mainImage === img.url
                                        ? "border-[#d4af37] ring-2 ring-[#d4af37]/30"
                                        : "border-[#d4af37]/30 hover:border-[#d4af37]/60"
                                        } ${img.isPlaceholder ? "opacity-40" : ""}`}
                                    disabled={img.isPlaceholder}
                                >
                                    <img
                                        src={img.url}
                                        alt={img.label}
                                        className="w-full h-full object-cover"
                                    />
                                    {img.isPlaceholder && (
                                        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                                            <span className="text-xs text-gray-400 text-center px-1">
                                                Coming<br />Soon
                                            </span>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Sticky Product Summary */}
                    <div className="lg:sticky lg:top-8 h-fit space-y-6">
                        {/* Brand & Store Badge */}
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                            <p className="text-sm text-[#d4b896]">{(product as any).brand ?? ''}</p>
                            {(product as any).brand && (
                                <button
                                    onClick={() => {
                                        const slug = STORE_SLUG_MAP[(product as any).brand] ?? 'stores';
                                        onNavigate(slug);
                                    }}
                                    className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-white text-[10px] font-bold shadow-sm hover:opacity-90 transition-opacity"
                                    style={{ backgroundColor: STORE_COLORS[(product as any).brand] ?? '#492f0e' }}
                                >
                                    <StoreIcon className="size-2.5" />
                                    {(product as any).brand}
                                </button>
                            )}
                        </div>
                        <h1
                            className="text-3xl font-bold font-['Cinzel',serif] mb-2 text-[#f4e5b8]"
                        >
                            {product.name}
                        </h1>

                        {/* Rating */}
                        <div className="flex items-center gap-2">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`size-4 ${i < Math.floor(product.rating)
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-gray-300"
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-gray-600">
                                {product.rating} ({product.reviewCount} reviews)
                            </span>
                        </div>
                        {/* Price */}
                        <div className="py-4 border-y border-[#d4af37]/30">
                            <div className="text-3xl font-bold font-['Cinzel',serif] text-[#d4af37]">
                                {product.price}
                            </div>
                            <p className="text-sm mt-1 text-[#d4b896]">(Incl. of all taxes)</p>
                        </div>

                        {/* Product Details */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-[#d4b896]">Metal</p>
                                <p className="font-semibold text-[#f4e5b8]">{product.purity} {product.metal}</p>
                            </div>
                            <div>
                                <p className="text-sm text-[#d4b896]">Weight</p>
                                <p className="font-semibold text-[#f4e5b8]">{product.weight}</p>
                            </div>
                            <div>
                                <p className="text-sm text-[#d4b896]">Stone</p>
                                <p className="font-semibold text-[#f4e5b8]">{product.stoneType}</p>
                            </div>
                            <div>
                                <p className="text-sm text-[#d4b896]">Carat</p>
                                <p className="font-semibold text-[#f4e5b8]">{(product as any).stoneCarat ?? 'N/A'}</p>
                            </div>
                        </div>

                        {/* Product Description */}
                        <div className="py-4 border-y border-[#d4af37]/30">
                            <h3 className="text-lg font-semibold mb-3 text-[#f4e5b8]">Description</h3>
                            <p className="leading-relaxed text-sm text-[#d4b896]">
                                {product.description || "No description available for this product."}
                            </p>
                        </div>

                        {/* Size Selector */}
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-[#f4e5b8]">
                                Select Size <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={selectedSize}
                                onChange={(e) => setSelectedSize(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg outline-none transition-all bg-[#1a1510] border border-[#d4af37]/30 text-[#f4e5b8] focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37]"
                            >
                                <option value="">Choose a size</option>
                                {sizes.map((size) => (
                                    <option key={size} value={size}>
                                        {size}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Quantity */}
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-[#f4e5b8]">
                                Quantity
                            </label>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="size-10 rounded-lg transition-all bg-[#1a1510] border border-[#d4af37]/30 text-[#f4e5b8] hover:bg-[#d4af37]/10"
                                >
                                    −
                                </button>
                                <span className="text-lg font-semibold w-12 text-center text-[#f4e5b8]">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="size-10 rounded-lg transition-all bg-[#1a1510] border border-[#d4af37]/30 text-[#f4e5b8] hover:bg-[#d4af37]/10"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            {/* Reserved banner */}
                            {productIsBooked && (
                                <div
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl"
                                    style={{
                                        background: "linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(244,229,184,0.06) 100%)",
                                        border: "1px solid rgba(212,175,55,0.4)",
                                    }}
                                >
                                    <Lock className="size-5 text-[#d4af37] flex-shrink-0" />
                                    <div>
                                        <p className="text-[#d4af37] font-bold text-sm">⬥ Reserved</p>
                                        <p className="text-[#d4b896] text-xs">This jewelry is exclusively reserved and not available for others.</p>
                                    </div>
                                </div>
                            )}

                            <Button
                                onClick={handleAddToCart}
                                disabled={productIsBooked}
                                className="w-full h-12 text-[15px] font-bold shadow-lg shadow-[#d4af37]/10 transition-all active:scale-95 disabled:opacity-40"
                                style={{
                                    background: productIsBooked ? "rgba(212,175,55,0.2)" : "linear-gradient(135deg, #d4af37 0%, #f4e5b8 100%)",
                                    color: "#1a1510",
                                    border: "none",
                                }}
                            >
                                <ShoppingCart className="size-5 mr-2" />
                                {productIsBooked ? "Not Available" : "Add to Cart"}
                            </Button>

                            {/* Pay Advance to Book */}
                            <Button
                                onClick={() => setShowBookingModal(true)}
                                disabled={productIsBooked}
                                className="w-full h-12 text-[15px] font-bold transition-all active:scale-95 disabled:opacity-40"
                                style={{
                                    background: productIsBooked
                                        ? "rgba(255,255,255,0.05)"
                                        : "linear-gradient(135deg, #1a1510 0%, #2a1f14 100%)",
                                    color: productIsBooked ? "rgba(212,175,55,0.4)" : "#d4af37",
                                    border: "1px solid rgba(212,175,55,0.4)",
                                }}
                            >
                                <Gem className="size-5 mr-2" />
                                {productIsBooked
                                    ? "Already Reserved"
                                    : `Pay Advance to Book — ${formatPrice(advanceAmount)}`
                                }
                            </Button>

                            {/* Universal AR Try-On Button */}
                            {["Necklaces", "Earrings", "Rings", "Bracelets"].includes(product.category) && (
                                <Button
                                    onClick={() => onNavigate("universal-tryon", {
                                        productId: product.id,
                                        brandId: product.brand.toLowerCase().replace(' ', '-')
                                    })}

                                    variant="outline"
                                    className="w-full h-12 text-[15px] font-bold border-2 transition-all border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10 group/ar shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                                >
                                    <Sparkles className="size-5 mr-2 group-hover/ar:animate-pulse" />
                                    Virtual Try-On (AR)
                                </Button>
                            )}

                            <Button
                                onClick={handleToggleWishlist}

                                variant="outline"
                                className={`w-full h-12 text-[15px] font-bold border transition-all active:scale-95 ${isWishlisted
                                    ? "bg-[#d4af37] text-[#1a1510] border-[#d4af37]"
                                    : "bg-[#2a1f14]/40 backdrop-blur-sm text-[#d4af37] border-[#d4af37]/30 hover:bg-[#d4af37]/10 hover:border-[#d4af37]/60"
                                    }`}
                            >
                                <Heart
                                    className={`size-5 mr-2 ${isWishlisted ? "fill-[#1a1510] text-[#1a1510]" : "text-[#d4af37]"}`}
                                />
                                {isWishlisted ? "Saved to Wishlist" : "Add to Wishlist"}
                            </Button>

                            {/* Explore Store */}
                            {(product as any).brand && (
                                <Button
                                    onClick={() => {
                                        const slug = STORE_SLUG_MAP[(product as any).brand] ?? 'stores';
                                        onNavigate(slug);
                                    }}
                                    variant="outline"
                                    className="w-full h-12 text-base font-semibold border-2 transition-all border-[#d4af37]/30 text-[#f4e5b8] hover:bg-[#d4af37]/10"
                                >
                                    <StoreIcon className="size-5 mr-2" />
                                    🏬 Explore Store
                                    <ExternalLink className="size-4 ml-2 opacity-80" />
                                </Button>
                            )}
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#d4af37]/30">
                            <div className="text-center">
                                <Truck className="size-6 mx-auto mb-1 text-[#d4af37]" />
                                <p className="text-xs text-[#d4b896]">Free Delivery</p>
                            </div>
                            <div className="text-center">
                                <RotateCcw className="size-6 mx-auto mb-1 text-[#d4af37]" />
                                <p className="text-xs text-[#d4b896]">7 Day Returns</p>
                            </div>
                            <div className="text-center">
                                <Shield className="size-6 mx-auto mb-1 text-[#d4af37]" />
                                <p className="text-xs text-[#d4b896]">BIS Hallmark</p>
                            </div>
                        </div>

                        {/* Availability */}
                        <div className="rounded-lg p-3 border transition-all bg-[#d4af37]/5 border-[#d4af37]/30">
                            <p className="text-sm font-semibold text-[#d4af37]">
                                ✓ {product.availability}
                            </p>
                            <p className="text-xs mt-1 text-[#d4b896]">
                                Delivery in {product.deliveryDays} business days
                            </p>
                        </div>
                    </div>
                </div>

                {/* Product Description */}
                <Card
                    className="p-6 mb-8 transition-all"
                    style={{
                        background: "linear-gradient(135deg, #2a1f14 0%, #3d2f1f 100%)",
                        border: "1px solid #d4af37"
                    }}
                >
                    <h2 className="text-2xl font-bold font-['Cinzel',serif] mb-4 text-[#f4e5b8]">
                        Product Description
                    </h2>
                    <p className="leading-relaxed text-[#d4b896]">
                        {product.description}
                    </p>
                </Card>

                {/* Specifications */}
                <Card
                    className="p-6 mb-8 transition-all"
                    style={{
                        background: "linear-gradient(135deg, #2a1f14 0%, #3d2f1f 100%)",
                        border: "1px solid #d4af37"
                    }}
                >
                    <h2 className="text-2xl font-bold font-['Cinzel',serif] mb-4 text-[#f4e5b8]">
                        Specifications
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1 py-2 border-b md:col-span-2 border-[#d4af37]/30">
                            <span className="text-[#d4b896] text-sm">Description</span>
                            <span className="font-semibold text-sm text-[#f4e5b8]">{product.description || "No description available"}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-[#d4af37]/30">
                            <span className="text-[#d4b896]">Jewelry Type</span>
                            <span className="font-semibold text-[#f4e5b8]">{product.category}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-[#d4af37]/30">
                            <span className="text-[#d4b896]">Metal Purity</span>
                            <span className="font-semibold text-[#f4e5b8]">{product.purity}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-[#d4af37]/30">
                            <span className="text-[#d4b896]">Gross Weight</span>
                            <span className="font-semibold text-[#f4e5b8]">{product.weight}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-[#d4af37]/30">
                            <span className="text-[#d4b896]">Stone Type</span>
                            <span className="font-semibold text-[#f4e5b8]">{product.stoneType}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-[#d4af37]/30">
                            <span className="text-[#d4b896]">Total Carat</span>
                            <span className="font-semibold text-[#f4e5b8]">{(product as any).stoneCarat ?? 'N/A'}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-[#d4af37]/30">
                            <span className="text-[#d4b896]">Number of Stones</span>
                            <span className="font-semibold text-[#f4e5b8]">{(product as any).stoneCount ?? 'N/A'}</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
