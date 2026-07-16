/* @refresh reset */
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

export interface Product {
  id: string;
  title: string;
  price: string;
  priceValue: number;
  image: string;
  category: string;
  material: string[];
  style: string[];
  description?: string;
  storeName?: string;
  storeSlug?: string;
  tags?: string[];
  rating?: number;
  reviewCount?: number;
  isNew?: boolean;
  // Gold specifications for dynamic pricing
  goldSpecs?: {
    weight: number;
    purity: "24k" | "22k" | "18k";
    makingCharges: number;
    gemstonesCost?: number;
  };
  isDynamicPricing?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

const TRENDING_SEARCHES = [
  "Diamond Rings",
  "Gold Necklaces",
  "Pearl Earrings",
  "Bridal Sets",
  "Silver Bracelets",
  "Ruby Pendant",
  "Vintage Style",
  "Platinum Ring",
];

const STORAGE_KEYS = {
  cart: "ornamis_cart",
  wishlist: "ornamis_wishlist",
  recentSearches: "ornamis_recent_searches",
};

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return fallback;
    const parsed = JSON.parse(stored);

    // Sanitize image paths for Cart and Wishlist to replace spaces with underscores
    if (key === STORAGE_KEYS.cart || key === STORAGE_KEYS.wishlist) {
      if (Array.isArray(parsed)) {
        return parsed.map((item: any) => {
          if (item.image && typeof item.image === 'string' && item.image.includes('/jewelry/')) {
            return { ...item, image: item.image.replace(/ /g, '_') };
          }
          return item;
        }) as unknown as T;
      }
    }
    return parsed as T;
  } catch {
    return fallback;
  }
}

interface ShopContextType {
  cart: CartItem[];
  wishlist: Product[];
  searchQuery: string;
  recentSearches: string[];
  trendingSearches: string[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  isInCart: (productId: string) => boolean;
  setSearchQuery: (query: string) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() =>
    loadFromStorage(STORAGE_KEYS.cart, [])
  );
  const [wishlist, setWishlist] = useState<Product[]>(() =>
    loadFromStorage(STORAGE_KEYS.wishlist, [])
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>(() =>
    loadFromStorage(STORAGE_KEYS.recentSearches, [])
  );

  // Persist cart & wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
    } catch { }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.wishlist, JSON.stringify(wishlist));
    } catch { }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.recentSearches, JSON.stringify(recentSearches));
    } catch { }
  }, [recentSearches]);

  const addRecentSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((q) => q.toLowerCase() !== trimmed.toLowerCase());
      return [trimmed, ...filtered].slice(0, 5);
    });
  };

  const clearRecentSearches = () => setRecentSearches([]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        toast.success(`Increased quantity of ${product.title}`);
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      toast.success(`${product.title} added to cart!`);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const item = prev.find((i) => i.id === productId);
      if (item) toast.info(`${item.title} removed from cart`);
      return prev.filter((item) => item.id !== productId);
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    toast.info("Cart cleared");
  };

  const addToWishlist = (product: Product) => {
    setWishlist((prev) => {
      if (prev.find((item) => item.id === product.id)) {
        toast.info(`${product.title} is already in your wishlist`);
        return prev;
      }
      toast.success(`${product.title} added to wishlist!`);
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => {
      const item = prev.find((i) => i.id === productId);
      if (item) toast.info(`${item.title} removed from wishlist`);
      return prev.filter((item) => item.id !== productId);
    });
  };

  const toggleWishlist = (product: Product) => {
    if (wishlist.find((item) => item.id === product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const isInWishlist = (productId: string) =>
    wishlist.some((item) => item.id === productId);

  const isInCart = (productId: string) =>
    cart.some((item) => item.id === productId);

  const getCartTotal = () =>
    cart.reduce((total, item) => total + item.priceValue * item.quantity, 0);

  const getCartCount = () =>
    cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <ShopContext.Provider
      value={{
        cart,
        wishlist,
        searchQuery,
        recentSearches,
        trendingSearches: TRENDING_SEARCHES,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        isInCart,
        setSearchQuery,
        addRecentSearch,
        clearRecentSearches,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
}
