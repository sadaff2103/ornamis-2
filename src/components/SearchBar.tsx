import { useState, useRef, useEffect, useCallback } from "react";
import { Search, X, TrendingUp, Clock, Store, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useShop } from "../contexts/ShopContext";
import { buildProductIndex, fuzzySearch, highlightText } from "../utils/searchUtils";
import type { Product } from "../contexts/ShopContext";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  onNavigateToSearch?: (query: string) => void;
  onNavigateToProduct?: (productId: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  onSearch,
  onNavigateToSearch,
  onNavigateToProduct,
  placeholder = "Search jewelry by name, store, category...",
  className = "",
}: SearchBarProps) {
  const { searchQuery, setSearchQuery, recentSearches, trendingSearches, addRecentSearch } = useShop();
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Debounced search
  const runSearch = useCallback((value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (value.trim().length >= 2) {
        const index = buildProductIndex();
        const results = fuzzySearch(value, index).slice(0, 6);
        setSuggestions(results);
      } else {
        setSuggestions([]);
      }
      setSearchQuery(value);
      onSearch?.(value);
    }, 300);
  }, [onSearch, setSearchQuery]);

  const handleChange = (value: string) => {
    setLocalQuery(value);
    runSearch(value);
    setShowDropdown(true);
  };

  const handleSubmit = (query: string) => {
    const q = query.trim();
    if (!q) return;
    addRecentSearch(q);
    setLocalQuery(q);
    setSearchQuery(q);
    setShowDropdown(false);
    onNavigateToSearch?.(q);
    onSearch?.(q);
  };

  const handleProductClick = (product: Product) => {
    addRecentSearch(product.title);
    setLocalQuery(product.title);
    setSearchQuery(product.title);
    setShowDropdown(false);
    if (onNavigateToProduct) {
      onNavigateToProduct(product.id);
    } else {
      // fallback: go to search results with the product title
      onNavigateToSearch?.(product.title);
      onSearch?.(product.title);
    }
  };

  const handleClear = () => {
    setLocalQuery("");
    setSearchQuery("");
    setSuggestions([]);
    onSearch?.("");
    inputRef.current?.focus();
  };

  // Keyboard shortcut Ctrl/Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") setShowDropdown(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const hasQuery = localQuery.trim().length > 0;
  const showSuggestions = isFocused || showDropdown;

  function HighlightedText({ text, query }: { text: string; query: string }) {
    const segments = highlightText(text, query);
    return (
      <>
        {segments.map((seg, i) =>
          seg.highlighted ? (
            <mark key={i} className="bg-[#d4af37]/30 text-[#492f0e] rounded px-0.5 not-italic font-semibold">
              {seg.text}
            </mark>
          ) : (
            <span key={i}>{seg.text}</span>
          )
        )}
      </>
    );
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(localQuery);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Input */}
      <form
        onSubmit={handleFormSubmit}
        className={`relative flex items-center transition-all duration-200 ${isFocused ? "ring-2 ring-[#d4af37] ring-opacity-60" : ""
          }`}
        style={{ borderRadius: "0.625rem" }}
      >
        <Search
          className={`absolute left-4 size-5 transition-colors ${isFocused ? "text-[#492f0e]" : "text-gray-400"
            }`}
        />
        <input
          ref={inputRef}
          type="text"
          value={localQuery}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => { setIsFocused(true); setShowDropdown(true); }}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-3 bg-white border border-gray-200 rounded-[0.625rem] text-gray-900 placeholder-gray-500 focus:outline-none transition-all"
        />
        <AnimatePresence>
          {hasQuery && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleClear}
              className="absolute right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
              type="button"
            >
              <X className="size-4 text-gray-500" />
            </motion.button>
          )}
        </AnimatePresence>
      </form>

      {/* Dropdown */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
            style={{ maxHeight: "420px", overflowY: "auto" }}
          >
            {/* ── Live product suggestions ── */}
            {hasQuery && suggestions.length > 0 && (
              <div>
                <p className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Products
                </p>
                {suggestions.map((product) => (
                  <button
                    key={product.id}
                    onMouseDown={() => handleProductClick(product)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#f6f3f0] transition-colors text-left"
                  >
                    <img
                      src={product.image}
                      alt=""
                      className="size-10 rounded-lg object-cover flex-shrink-0 bg-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        <HighlightedText text={product.title} query={localQuery} />
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-[#b39978]">{product.category}</span>
                        <span className="text-gray-300">·</span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Store className="size-3" />
                          {product.storeName}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-[#492f0e] flex-shrink-0">
                      {product.price}
                    </span>
                  </button>
                ))}
                <button
                  onMouseDown={() => handleSubmit(localQuery)}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm text-[#492f0e] font-semibold bg-[#f6f3f0] hover:bg-[#ebe7e3] transition-colors border-t border-gray-100"
                >
                  <span>See all results for "{localQuery}"</span>
                  <ChevronRight className="size-4" />
                </button>
              </div>
            )}

            {/* ── No results ── */}
            {hasQuery && suggestions.length === 0 && (
              <div className="px-4 py-6 text-center">
                <p className="text-sm text-gray-500 mb-3">No results for "<strong>{localQuery}</strong>"</p>
                <p className="text-xs text-gray-400 mb-4">Try one of these instead:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {trendingSearches.slice(0, 4).map((term) => (
                    <button
                      key={term}
                      onMouseDown={() => handleSubmit(term)}
                      className="px-3 py-1 text-xs bg-[#f5f1ed] hover:bg-[#ebe7e3] text-[#492f0e] rounded-full transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Recent searches ── */}
            {!hasQuery && recentSearches.length > 0 && (
              <div>
                <p className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <Clock className="size-3" /> Recent
                </p>
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    onMouseDown={() => handleSubmit(term)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#f6f3f0] transition-colors text-left"
                  >
                    <Clock className="size-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{term}</span>
                  </button>
                ))}
              </div>
            )}

            {/* ── Trending searches ── */}
            {!hasQuery && (
              <div className={recentSearches.length > 0 ? "border-t border-gray-100" : ""}>
                <p className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <TrendingUp className="size-3" /> Trending
                </p>
                <div className="px-4 pb-4 flex flex-wrap gap-2 pt-1">
                  {trendingSearches.map((term) => (
                    <button
                      key={term}
                      onMouseDown={() => handleSubmit(term)}
                      className="px-3 py-1.5 text-xs bg-gradient-to-r from-[#f5f1ed] to-[#ebe7e3] hover:from-[#ebe7e3] hover:to-[#d8d0c5] text-[#492f0e] rounded-full transition-colors font-medium"
                    >
                      {term}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 px-4 pb-3">
                  <kbd className="px-2 py-0.5 bg-gray-100 rounded text-xs">⌘K</kbd> to focus search
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
