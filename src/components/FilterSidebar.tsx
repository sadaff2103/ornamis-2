import { useState } from "react";
import { Slider } from "./ui/slider";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { X, Filter } from "lucide-react";
import imgImage7 from "figma:asset/54726e7fc7d6afc77636d762a41a64b549adfa15.png";
import imgRing21 from "figma:asset/f6df2dc13ec2df0bd10d2e3b0c478f7460c1ed28.png";
import imgImage8 from "figma:asset/6c66ad760f1920c6675520e43bd3fa10aefcfdc3.png";
import imgEarringsImg from "figma:asset/ab5c452fc682f6bf39c8e4b9bbde4eb909b12078.png";

interface FilterSidebarProps {
  onFilterChange: (filters: FilterState) => void;
  onClose?: () => void;
  mobile?: boolean;
  currentCategory?: string;
  onNavigate?: (page: string) => void;
}

export interface FilterState {
  categories: string[];
  priceRange: [number, number];
  materials: string[];
  styles: string[];
  sellers: string[];
}

export function FilterSidebar({ onFilterChange, onClose, mobile = false, currentCategory, onNavigate }: FilterSidebarProps) {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 500000], // ₹5,00,000 max
    materials: [],
    styles: [],
    sellers: [],
  });

  const categories = ["Rings", "Necklaces", "Earrings", "Bracelets"];
  const materials = ["Gold", "Silver", "Platinum", "Rose Gold", "White Gold", "Diamond", "Pearl", "Gemstone", "Crystal"];
  const styles = ["Modern", "Vintage", "Classic", "Designer", "Minimalist", "Statement", "Bohemian", "Traditional"];
  const sellers = ["Verified Only", "Top Rated"];

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter((c) => c !== category);
    const newFilters = { ...filters, categories: newCategories };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleMaterialChange = (material: string, checked: boolean) => {
    const newMaterials = checked
      ? [...filters.materials, material]
      : filters.materials.filter((m) => m !== material);
    const newFilters = { ...filters, materials: newMaterials };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleStyleChange = (style: string, checked: boolean) => {
    const newStyles = checked
      ? [...filters.styles, style]
      : filters.styles.filter((s) => s !== style);
    const newFilters = { ...filters, styles: newStyles };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = (value: number[]) => {
    const newFilters = { ...filters, priceRange: [value[0], value[1]] as [number, number] };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters: FilterState = {
      categories: [],
      priceRange: [0, 500000],
      materials: [],
      styles: [],
      sellers: [],
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className={`bg-gradient-to-b from-white to-[#f6f3f0] ${mobile ? "p-4" : "p-6"} rounded-lg shadow-lg border border-[#e1ccb1]`}>
      {mobile && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="size-5 text-[#b39978]" />
            <h3 className="font-['Cinzel:Regular',sans-serif] text-[#492f0e]">Filters</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="size-5" />
          </Button>
        </div>
      )}

      {!mobile && (
        <div className="flex items-center gap-2 mb-6">
          <Filter className="size-5 text-[#b39978]" />
          <h3 className="font-['Cinzel:Regular',sans-serif] text-[#492f0e]">Filters</h3>
        </div>
      )}

      {/* Quick Category Navigation */}
      {onNavigate && (
        <>
          <div className="mb-6">
            <h4 className="mb-3 font-['Cinzel:Regular',sans-serif] text-[#492f0e]">Quick Navigate</h4>
            <div className="grid grid-cols-2 gap-3">
              {/* Rings Button */}
              <button
                onClick={() => onNavigate("rings")}
                className={`relative h-24 rounded-lg overflow-hidden transition-all hover:shadow-xl ${
                  currentCategory === "rings" ? "ring-2 ring-[#d4af37]" : ""
                }`}
              >
                <img src={imgRing21} alt="Rings" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#332518] to-[#f0cec4] opacity-70" />
                <p className="absolute inset-0 flex items-center justify-center font-['Cinzel_Decorative:Regular',sans-serif] text-white text-sm">
                  RINGS
                </p>
              </button>

              {/* Necklaces Button */}
              <button
                onClick={() => onNavigate("necklaces")}
                className={`relative h-24 rounded-lg overflow-hidden transition-all hover:shadow-xl ${
                  currentCategory === "necklaces" ? "ring-2 ring-[#d4af37]" : ""
                }`}
              >
                <img src={imgImage8} alt="Necklaces" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#f0cec4] to-[#332518] opacity-74" />
                <p className="absolute inset-0 flex items-center justify-center font-['Cinzel_Decorative:Regular',sans-serif] text-white text-sm">
                  NECKLACE
                </p>
              </button>

              {/* Bracelets Button */}
              <button
                onClick={() => onNavigate("bracelets")}
                className={`relative h-24 rounded-lg overflow-hidden transition-all hover:shadow-xl ${
                  currentCategory === "bracelets" ? "ring-2 ring-[#d4af37]" : ""
                }`}
              >
                <img src={imgImage7} alt="Bracelets" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#f0cec4] to-[#332518] opacity-86" />
                <p className="absolute inset-0 flex items-center justify-center font-['Cinzel_Decorative:Regular',sans-serif] text-white text-sm">
                  BRACELETS
                </p>
              </button>

              {/* Earrings Button */}
              <button
                onClick={() => onNavigate("earrings")}
                className={`relative h-24 rounded-lg overflow-hidden transition-all hover:shadow-xl ${
                  currentCategory === "earrings" ? "ring-2 ring-[#d4af37]" : ""
                }`}
              >
                <img src={imgEarringsImg} alt="Earrings" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#332518] to-[#f0cec4] opacity-70" />
                <p className="absolute inset-0 flex items-center justify-center font-['Cinzel_Decorative:Regular',sans-serif] text-white text-sm">
                  EARRINGS
                </p>
              </button>
            </div>
          </div>
          <Separator className="my-4 bg-[#e1ccb1]" />
        </>
      )}

      {/* Subcategories */}
      <div className="mb-6">
        <h4 className="mb-3 font-['Cinzel:Regular',sans-serif] text-[#492f0e]">Subcategory</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center gap-2">
              <Checkbox
                id={`category-${category}`}
                checked={filters.categories.includes(category)}
                onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                className="border-[#b39978] data-[state=checked]:bg-[#b39978]"
              />
              <Label htmlFor={`category-${category}`} className="cursor-pointer text-sm">
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-4 bg-[#e1ccb1]" />

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="mb-3 font-['Cinzel:Regular',sans-serif] text-[#492f0e]">Price Range</h4>
        <div className="px-2">
          <Slider
            min={0}
            max={500000}
            step={5000}
            value={filters.priceRange}
            onValueChange={handlePriceChange}
            className="mb-3"
          />
          <div className="flex justify-between text-sm text-[#492f0e]/70">
            <span>{formatPrice(filters.priceRange[0])}</span>
            <span>{formatPrice(filters.priceRange[1])}</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              onClick={() => handlePriceChange([0, 100000])}
              className="px-3 py-1 text-xs bg-[#f5f1ed] hover:bg-[#e1ccb1] rounded-full transition-colors"
            >
              Under ₹1L
            </button>
            <button
              onClick={() => handlePriceChange([100000, 250000])}
              className="px-3 py-1 text-xs bg-[#f5f1ed] hover:bg-[#e1ccb1] rounded-full transition-colors"
            >
              ₹1L - ₹2.5L
            </button>
            <button
              onClick={() => handlePriceChange([250000, 500000])}
              className="px-3 py-1 text-xs bg-[#f5f1ed] hover:bg-[#e1ccb1] rounded-full transition-colors"
            >
              Above ₹2.5L
            </button>
          </div>
        </div>
      </div>

      <Separator className="my-4 bg-[#e1ccb1]" />

      {/* Materials */}
      <div className="mb-6">
        <h4 className="mb-3 font-['Cinzel:Regular',sans-serif] text-[#492f0e]">Material</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {materials.map((material) => (
            <div key={material} className="flex items-center gap-2">
              <Checkbox
                id={`material-${material}`}
                checked={filters.materials.includes(material)}
                onCheckedChange={(checked) => handleMaterialChange(material, checked as boolean)}
                className="border-[#b39978] data-[state=checked]:bg-[#b39978]"
              />
              <Label htmlFor={`material-${material}`} className="cursor-pointer text-sm">
                {material}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-4 bg-[#e1ccb1]" />

      {/* Styles */}
      <div className="mb-6">
        <h4 className="mb-3 font-['Cinzel:Regular',sans-serif] text-[#492f0e]">Style</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {styles.map((style) => (
            <div key={style} className="flex items-center gap-2">
              <Checkbox
                id={`style-${style}`}
                checked={filters.styles.includes(style)}
                onCheckedChange={(checked) => handleStyleChange(style, checked as boolean)}
                className="border-[#b39978] data-[state=checked]:bg-[#b39978]"
              />
              <Label htmlFor={`style-${style}`} className="cursor-pointer text-sm">
                {style}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <Button
        variant="outline"
        className="w-full border-[#b39978] text-[#492f0e] hover:bg-[#f5f1ed] font-['Cinzel:Regular',sans-serif]"
        onClick={clearFilters}
      >
        Clear All Filters
      </Button>
    </div>
  );
}
