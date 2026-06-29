import { useState, useRef, useEffect } from "react";
import { Menu, User, ShoppingBag, Heart, Sparkles, LogIn, LogOut, X, Plus, Minus, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { SearchBar } from "./SearchBar";
import { GoldPriceBadge } from "./GoldPriceBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { useShop } from "../contexts/ShopContext";
import { motion, AnimatePresence } from "motion/react";

interface HeaderProps {
  onNavigate: (page: string, params?: { productId?: string }) => void;
  currentPage: string;
  user: { name: string; role: string } | null;
  onLogout: () => void;
  cartCount?: number;
  wishlistCount?: number;
}

export function Header({ onNavigate, currentPage, user, onLogout }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMiniCart, setShowMiniCart] = useState(false);
  const { getCartCount, wishlist, cart, removeFromCart, updateQuantity } = useShop();
  const cartCount = getCartCount();
  const wishlistCount = wishlist.length;
  const miniCartRef = useRef<HTMLDivElement>(null);

  // Close mini-cart on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (miniCartRef.current && !miniCartRef.current.contains(e.target as Node)) {
        setShowMiniCart(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navLinks = [
    { label: "Home", page: "home" },
    { label: "Collections", page: "collections" },
    { label: "Stores", page: "stores" },
    { label: "Study by Ornament", page: "study-ornaments" },
    { label: "AI Designer", page: "ai-designer", icon: Sparkles },
    { label: "AR Try-On", page: "universal-tryon" },
    { label: "About", page: "about" },
  ];

  const cartTotal = cart.reduce((sum, item) => sum + item.priceValue * item.quantity, 0);
  const formatPrice = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const previewItems = cart.slice(0, 3);

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-[#492f0e] to-[#6c5c4c] shadow-lg">
      {/* Top Bar */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between gap-4 text-xs text-white/80">
            <p className="hidden sm:block">Welcome to ORNAMIS - Where Elegance Meets Technology</p>
            <p className="sm:hidden text-[10px]">ORNAMIS - Elegance Meets Technology</p>
            <div className="flex items-center gap-4">
              <GoldPriceBadge displayPurity="22K" />
              {user && (
                <p className="hidden lg:block">
                  Welcome, <span className="text-[#f0cec4]">{user.name}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Brand */}
          <button
            onClick={() => onNavigate("home")}
            className="flex-shrink-0 text-2xl md:text-3xl font-serif font-bold text-[#d4af37] hover:text-[#f9d77e] transition-colors duration-300 tracking-wider"
          >
            ORNAMIS
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.label}
                  onClick={() => onNavigate(link.page)}
                  className={`flex items-center gap-2 transition-colors font-semibold ${currentPage === link.page ? "text-white" : "text-white/70 hover:text-white"
                    }`}
                >
                  {Icon && <Icon className="size-4" />}
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-md">
            <SearchBar
              onSearch={(query) => {
                if (query.trim()) onNavigate("search");
              }}
              onNavigateToSearch={() => onNavigate("search")}
              onNavigateToProduct={(productId) => onNavigate("product", { productId })}
              placeholder="Search jewelry..."
            />
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-2">
            {/* Wishlist */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white/80 hover:text-white hover:bg-white/10 relative"
              onClick={() => onNavigate("wishlist")}
            >
              <Heart className="size-5" />
              <AnimatePresence>
                {wishlistCount > 0 && (
                  <motion.div
                    key="wishlist-badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1"
                  >
                    <Badge className="size-5 p-0 flex items-center justify-center bg-red-500 text-[10px]">
                      {wishlistCount}
                    </Badge>
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>

            {/* Cart with mini-cart */}
            <div className="relative" ref={miniCartRef}>
              <Button
                variant="ghost"
                size="icon"
                className="text-white/80 hover:text-white hover:bg-white/10 relative"
                onClick={() => setShowMiniCart(!showMiniCart)}
              >
                <ShoppingBag className="size-5" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.div
                      key="cart-badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1"
                    >
                      <Badge className="size-5 p-0 flex items-center justify-center bg-red-500 text-[10px]">
                        {cartCount}
                      </Badge>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>

              {/* Mini Cart Dropdown */}
              <AnimatePresence>
                {showMiniCart && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                  >
                    {/* Mini cart header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-[#f6f3f0]">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="size-4 text-[#492f0e]" />
                        <span className="font-semibold text-[#492f0e] text-sm">
                          Cart ({cartCount} {cartCount === 1 ? "item" : "items"})
                        </span>
                      </div>
                      <button
                        onClick={() => setShowMiniCart(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="size-4" />
                      </button>
                    </div>

                    {cart.length === 0 ? (
                      <div className="px-4 py-8 text-center">
                        <ShoppingBag className="size-10 text-gray-200 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Your cart is empty</p>
                        <button
                          onClick={() => { onNavigate("collections"); setShowMiniCart(false); }}
                          className="mt-3 text-xs text-[#492f0e] font-semibold hover:underline"
                        >
                          Browse Collections →
                        </button>
                      </div>
                    ) : (
                      <>
                        {/* Cart items preview */}
                        <div className="max-h-60 overflow-y-auto">
                          {previewItems.map((item) => (
                            <div key={item.id} className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="size-12 rounded-lg object-cover flex-shrink-0 bg-gray-100"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-gray-800 truncate">{item.title}</p>
                                <p className="text-xs text-[#492f0e] font-bold">{item.price}</p>
                                {/* Quantity controls */}
                                <div className="flex items-center gap-1 mt-1">
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="p-0.5 hover:bg-gray-200 rounded transition-colors"
                                  >
                                    <Minus className="size-3 text-gray-500" />
                                  </button>
                                  <span className="text-xs w-5 text-center">{item.quantity}</span>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="p-0.5 hover:bg-gray-200 rounded transition-colors"
                                  >
                                    <Plus className="size-3 text-gray-500" />
                                  </button>
                                  <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="ml-1 p-0.5 hover:bg-red-50 text-red-400 hover:text-red-600 rounded transition-colors"
                                  >
                                    <X className="size-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                          {cart.length > 3 && (
                            <p className="text-center text-xs text-gray-400 py-2">
                              +{cart.length - 3} more items
                            </p>
                          )}
                        </div>

                        {/* Total + Actions */}
                        <div className="px-4 py-3 border-t border-gray-100 bg-[#f9f7f5]">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-gray-600 font-medium">Subtotal</span>
                            <span className="text-sm font-bold text-[#492f0e]">{formatPrice(cartTotal)}</span>
                          </div>
                          <button
                            onClick={() => { onNavigate("cart"); setShowMiniCart(false); }}
                            className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#492f0e] hover:bg-[#362312] text-white text-sm font-semibold rounded-lg transition-colors"
                          >
                            View Cart
                            <ArrowRight className="size-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white/80 hover:text-white hover:bg-white/10">
                  <User className="size-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {user ? (
                  <>
                    <div className="px-2 py-2">
                      <p className="text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onNavigate("dashboard")}>
                      <User className="mr-2 size-4" /> Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onNavigate("orders")}>Orders</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onNavigate("settings")}>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onLogout}>
                      <LogOut className="mr-2 size-4" /> Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => onNavigate("login")}>
                      <LogIn className="mr-2 size-4" /> Login
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onNavigate("signup")}>Sign Up</DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white/80 hover:text-white hover:bg-white/10"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="size-6" />
          </Button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-4">
          <SearchBar
            onSearch={(query) => { if (query.trim()) onNavigate("search"); }}
            onNavigateToSearch={() => onNavigate("search")}
            onNavigateToProduct={(productId) => onNavigate("product", { productId })}
            placeholder="Search jewelry..."
          />
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/10 pt-4">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <button
                    key={link.label}
                    onClick={() => { onNavigate(link.page); setIsMenuOpen(false); }}
                    className={`flex items-center gap-2 transition-colors font-semibold ${currentPage === link.page ? "text-white" : "text-white/70 hover:text-white"
                      }`}
                  >
                    {Icon && <Icon className="size-4" />}
                    {link.label}
                  </button>
                );
              })}
              {/* Mobile cart & wishlist */}
              <div className="flex gap-4 pt-2 border-t border-white/10">
                <button
                  onClick={() => { onNavigate("wishlist"); setIsMenuOpen(false); }}
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm"
                >
                  <Heart className="size-4" />
                  Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                </button>
                <button
                  onClick={() => { onNavigate("cart"); setIsMenuOpen(false); }}
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm"
                >
                  <ShoppingBag className="size-4" />
                  Cart {cartCount > 0 && `(${cartCount})`}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}