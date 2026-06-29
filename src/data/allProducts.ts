// Unified product data from all stores
// This module exports products from all stores with normalized interfaces

export interface UnifiedProduct {
    id: string;
    name: string;
    category: string;
    description: string;
    price: string;
    priceValue: number;
    metal: string;
    imageUrl: string;
    store: 'Giva' | 'Palmonas' | 'Khan Jewellers' | 'Jauhari';
    storeUrl: string;
    images?: string[];
    weight?: string;
    gemstone?: string;
    isNew?: boolean;
    isBridal?: boolean;
    isExclusive?: boolean;
    isLimited?: boolean;
}

// Note: Import actual product arrays from store pages when needed
// For now, we'll create a helper to fetch products dynamically

export const STORE_NAMES = {
    GIVA: 'Giva',
    PALMONAS: 'Palmonas',
    KHAN: 'Khan Jewellers',
    JAUHARI: 'Jauhari',
} as const;

export const CATEGORIES = {
    RINGS: 'Rings',
    NECKLACES: 'Necklaces',
    EARRINGS: 'Earrings',
    BRACELETS: 'Bracelets',
    PENDANTS: 'Pendants',
    SETS: 'Sets',
    BANGLES: 'Bangles',
} as const;

// Helper to filter products by category
export function filterByCategory(products: UnifiedProduct[], category: string): UnifiedProduct[] {
    if (category === 'All') return products;
    return products.filter(p => p.category === category);
}

// Helper to filter by store
export function filterByStore(products: UnifiedProduct[], store: string): UnifiedProduct[] {
    if (store === 'All') return products;
    return products.filter(p => p.store === store);
}

// Helper to filter by metal
export function filterByMetal(products: UnifiedProduct[], metal: string): UnifiedProduct[] {
    if (metal === 'All') return products;
    return products.filter(p => p.metal === metal);
}

// Helper to filter by price range
export function filterByPriceRange(
    products: UnifiedProduct[],
    minPrice: number,
    maxPrice: number
): UnifiedProduct[] {
    return products.filter(p => p.priceValue >= minPrice && p.priceValue <= maxPrice);
}

// Store metadata
export const STORE_INFO = {
    [STORE_NAMES.GIVA]: {
        name: 'GIVA',
        color: '#8B4513',
        description: 'Silver & Gold Jewellery',
        url: '/stores/giva',
    },
    [STORE_NAMES.PALMONAS]: {
        name: 'PALMONAS',
        color: '#2C5F2D',
        description: 'Demifine Jewellery',
        url: '/stores/palmonas',
    },
    [STORE_NAMES.KHAN]: {
        name: 'Khan Jewellers',
        color: '#4a1c0f',
        description: 'Traditional Craftsmanship',
        url: '/stores/khans',
    },
    [STORE_NAMES.JAUHARI]: {
        name: 'Jauhari',
        color: '#D4AF37',
        description: 'Crafted Just For You',
        url: '/stores/jauhari',
    },
};
