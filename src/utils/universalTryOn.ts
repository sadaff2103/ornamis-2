import { UnifiedProduct } from '../data/allProducts';
import { givaProducts } from '../data/givaProducts';
import { palmonasProducts } from '../data/palmonasProducts';
import { khanProducts } from '../data/khanProducts';
import { jauhariProducts } from '../data/jauhariProducts';

/**
 * Normalizes products from all brand datasets into a single UnifiedProduct format.
 */
export function getProductById(brandId: string, productId: string): UnifiedProduct | null {
    const brand = brandId.toLowerCase();

    if (brand === 'giva') {
        const p = givaProducts.find(item => item.id === productId);
        if (p) return {
            id: p.id,
            name: p.name,
            category: p.category,
            description: p.description,
            price: p.price,
            priceValue: p.priceValue || parseFloat(p.price.replace(/[^0-9.]/g, '')) || 0,
            metal: p.metal,
            imageUrl: p.imageUrl,
            store: 'Giva',
            storeUrl: '/stores/giva',
            images: [p.imageUrl]
        };
    }

    if (brand === 'palmonas') {
        const p = palmonasProducts.find(item => item.id === productId);
        if (p) return {
            id: p.id,
            name: p.name,
            category: p.category,
            description: p.description,
            price: p.price,
            priceValue: p.priceValue || parseFloat(p.price.replace(/[^0-9.]/g, '')) || 0,
            metal: p.metal,
            imageUrl: p.imageUrl,
            store: 'Palmonas',
            storeUrl: '/stores/palmonas',
            images: [p.imageUrl]
        };
    }

    if (brand === 'khan' || brand === 'khans') {
        const p = khanProducts.find(item => item.id === productId);
        if (p) return {
            id: p.id,
            name: p.name,
            category: p.category,
            description: p.description,
            price: p.price,
            priceValue: p.priceValue || parseFloat(p.price.replace(/[^0-9.]/g, '')) || 0,
            metal: p.metal || '',
            imageUrl: p.imageUrl,
            store: 'Khan Jewellers',
            storeUrl: '/stores/khans',
            images: [p.imageUrl]
        };
    }

    if (brand === 'jauhari' || brand === 'jauhari') {
        const p = jauhariProducts.find(item => item.id === productId);
        if (p) return {
            id: p.id,
            name: p.name,
            category: p.category,
            description: p.description,
            price: p.price,
            priceValue: p.priceValue,
            metal: p.metal,
            imageUrl: p.images[0],
            store: 'Jauhari',
            storeUrl: '/stores/jauhari',
            images: p.images
        };

    }

    return null;
}


/**
 * Returns a list of related products for the try-on carousel
 */
export function getRelatedProducts(category: string, limit: number = 10): UnifiedProduct[] {
    const all: UnifiedProduct[] = [];

    // Add some from each brand if they match category
    const brands = [
        { name: 'Giva', data: givaProducts, url: '/stores/giva', type: 'standard' },
        { name: 'Palmonas', data: palmonasProducts, url: '/stores/palmonas', type: 'standard' },
        { name: 'Khan Jewellers', data: khanProducts, url: '/stores/khans', type: 'standard' },
        { name: 'Jauhari', data: jauhariProducts, url: '/stores/jauhari', type: 'jauhari' }
    ];

    brands.forEach(b => {
        const matches = b.data
            .filter((p: any) => p.category === category)
            .slice(0, 3)
            .map((p: any) => ({
                id: p.id,
                name: p.name,
                category: p.category,
                description: p.description,
                price: p.price,
                priceValue: p.priceValue || (typeof p.price === 'string' ? parseFloat(p.price.replace(/[^0-9.]/g, '')) : 0),
                metal: p.metal || p.material || '',
                imageUrl: b.type === 'jauhari' ? p.images[0] : p.imageUrl,
                store: b.name as any,
                storeUrl: b.url,
                images: b.type === 'jauhari' ? p.images : [p.imageUrl]
            }));
        all.push(...matches);
    });



    return all.slice(0, limit);
}

/**
 * Returns ALL try-on-compatible products from every brand for the catalog browser.
 * Only includes categories that can be virtually tried on.
 */
const TRY_ON_CATEGORIES = ['Earrings', 'Rings', 'Bracelets'];

// Curated necklace stickers with clean backgrounds for AR overlay
const NECKLACE_STICKERS: UnifiedProduct[] = [
    { id: 'stk-n1', name: 'Minimal Heart & Pearl Gold', category: 'Necklaces', description: 'Delicate gold chain with small hearts and pearls. Aesthetic minimal design.', price: '₹3,499', priceValue: 3499, metal: '18K Gold Plated', imageUrl: '/jewelry/necklace_minimal_1.png', store: 'Palmonas', storeUrl: '/stores/palmonas', images: ['/jewelry/necklace_minimal_1.png'] },
    { id: 'stk-n2', name: 'Ethereal Butterfly Gold', category: 'Necklaces', description: 'Thin gold-plated chain with butterfly charms and small pearls.', price: '₹2,799', priceValue: 2799, metal: '18K Gold Plated', imageUrl: '/jewelry/necklace_minimal_2.png', store: 'Palmonas', storeUrl: '/stores/palmonas', images: ['/jewelry/necklace_minimal_2.png'] },
    { id: 'stk-n3', name: 'Rose Gold Heart Outline', category: 'Necklaces', description: 'Minimal rose gold-plated chain with heart outlines and pearls.', price: '₹2,499', priceValue: 2499, metal: '18K Rose Gold Plated', imageUrl: '/jewelry/necklace_minimal_3.png', store: 'Palmonas', storeUrl: '/stores/palmonas', images: ['/jewelry/necklace_minimal_3.png'] },
    { id: 'stk-n4', name: 'Minimal Gold V-Shape', category: 'Necklaces', description: 'Elegant V-shaped thin gold-plated necklace, minimal and sleek.', price: '₹2,499', priceValue: 2499, metal: '18K Gold Plated', imageUrl: '/jewelry/necklace_minimal_4.png', store: 'Palmonas', storeUrl: '/stores/palmonas', images: ['/jewelry/necklace_minimal_4.png'] },
    { id: 'stk-n5', name: 'Dainty Butterfly & Pearl', category: 'Necklaces', description: 'Petite butterfly pendant with pearls on a refined gold-plated chain.', price: '₹2,999', priceValue: 2999, metal: '18K Gold Plated', imageUrl: '/jewelry/necklace_minimal_5.png', store: 'Palmonas', storeUrl: '/stores/palmonas', images: ['/jewelry/necklace_minimal_5.png'] },
];

const EARRING_STICKERS: UnifiedProduct[] = [
    { id: 'stk-e1', name: 'Aesthetic Pearl Drop', category: 'Earrings', description: 'Classy geometric earring with CZ accent and pearl drop.', price: '₹1,999', priceValue: 1999, metal: '18K Gold Plated', imageUrl: '/jewelry/earring_aesthetic_1.png', store: 'Palmonas', storeUrl: '/stores/palmonas', images: ['/jewelry/earring_aesthetic_1.png'] },
    { id: 'stk-e2', name: 'Ethereal Butterfly Hoop', category: 'Earrings', description: 'Aesthetic gold-plated hoop with butterfly charm and crystal.', price: '₹1,799', priceValue: 1799, metal: '18K Gold Plated', imageUrl: '/jewelry/earring_aesthetic_2.png', store: 'Palmonas', storeUrl: '/stores/palmonas', images: ['/jewelry/earring_aesthetic_2.png'] },
    { id: 'stk-e3', name: 'Minimal Heart Stud', category: 'Earrings', description: 'Sleek gold-plated bar stud with heart outline and blue CZ.', price: '₹1,499', priceValue: 1499, metal: '18K Gold Plated', imageUrl: '/jewelry/earring_aesthetic_3.png', store: 'Palmonas', storeUrl: '/stores/palmonas', images: ['/jewelry/earring_aesthetic_3.png'] },
    { id: 'stk-e4', name: 'Rose Gold Flower Drop', category: 'Earrings', description: 'Refined flower motif drop with pearl in rose gold plating.', price: '₹1,999', priceValue: 1999, metal: '18K Rose Gold Plated', imageUrl: '/jewelry/earring_aesthetic_4.png', store: 'Palmonas', storeUrl: '/stores/palmonas', images: ['/jewelry/earring_aesthetic_4.png'] },
    { id: 'stk-e5', name: 'Modern Intertwined CZ', category: 'Earrings', description: 'Cool intertwined gold-plated rings with green CZ accent.', price: '₹1,999', priceValue: 1999, metal: '18K Gold Plated', imageUrl: '/jewelry/earring_aesthetic_5.png', store: 'Palmonas', storeUrl: '/stores/palmonas', images: ['/jewelry/earring_aesthetic_5.png'] },
];

// Gemstone-only stickers for finger tracking in Virtual Try-On
// These are isolated stone images (no ring band) for clean AR overlay on the finger
const RING_STICKERS: UnifiedProduct[] = [
    { id: 'stk-r1', name: 'Diamond – Round Cut', category: 'Rings', description: 'Brilliant round-cut diamond gemstone. Tracks directly on your finger.', price: '₹45,000', priceValue: 45000, metal: 'Diamond', imageUrl: '/jewelry/stone_diamond.png', store: 'Palmonas', storeUrl: '/stores/palmonas', images: ['/jewelry/stone_diamond.png'] },
    { id: 'stk-r2', name: 'Ruby – Oval Cut', category: 'Rings', description: 'Deep red oval-cut ruby gemstone for a bold statement look.', price: '₹38,000', priceValue: 38000, metal: 'Ruby', imageUrl: '/jewelry/stone_ruby.png', store: 'Palmonas', storeUrl: '/stores/palmonas', images: ['/jewelry/stone_ruby.png'] },
    { id: 'stk-r3', name: 'Emerald – Cushion Cut', category: 'Rings', description: 'Rich forest-green cushion-cut emerald gemstone.', price: '₹42,000', priceValue: 42000, metal: 'Emerald', imageUrl: '/jewelry/stone_emerald.png', store: 'Palmonas', storeUrl: '/stores/palmonas', images: ['/jewelry/stone_emerald.png'] },
    { id: 'stk-r4', name: 'Sapphire – Pear Cut', category: 'Rings', description: 'Royal blue pear-cut sapphire gemstone, elegant and rare.', price: '₹52,000', priceValue: 52000, metal: 'Sapphire', imageUrl: '/jewelry/stone_sapphire.png', store: 'Palmonas', storeUrl: '/stores/palmonas', images: ['/jewelry/stone_sapphire.png'] },
    { id: 'stk-r5', name: 'Amethyst – Emerald Cut', category: 'Rings', description: 'Deep purple emerald-cut amethyst gemstone, mystical and refined.', price: '₹18,000', priceValue: 18000, metal: 'Amethyst', imageUrl: '/jewelry/stone_amethyst.png', store: 'Palmonas', storeUrl: '/stores/palmonas', images: ['/jewelry/stone_amethyst.png'] },
];

const BRACELET_STICKERS: UnifiedProduct[] = [
    { id: 'stk-b1', name: 'Marquise Chevron Diamond Bracelet', category: 'Bracelets', description: 'Stunning marquise-cut diamond chevron bracelet with brilliant sparkle. Each stone is precisely set in a herringbone pattern for maximum brilliance.', price: '₹1,85,000', priceValue: 185000, metal: '18K White Gold', imageUrl: '/jewelry/bracelets-tryon/bracelet_marquise_chevron.png', store: 'Jauhari', storeUrl: '/stores/jauhari', images: ['/jewelry/bracelets-tryon/bracelet_marquise_chevron.png'] },
    { id: 'stk-b2', name: 'Floral Cluster Diamond Bracelet', category: 'Bracelets', description: 'Exquisite floral cluster bracelet featuring pear and marquise diamonds arranged in a blooming flower motif. A true statement piece.', price: '₹2,45,000', priceValue: 245000, metal: '18K White Gold', imageUrl: '/jewelry/bracelets-tryon/bracelet_floral_cluster.png', store: 'Jauhari', storeUrl: '/stores/jauhari', images: ['/jewelry/bracelets-tryon/bracelet_floral_cluster.png'] },
    { id: 'stk-b3', name: 'Leaf Vine Diamond Bracelet', category: 'Bracelets', description: 'Delicate leaf vine bracelet with marquise-cut diamonds forming an organic botanical pattern. Nature-inspired elegance.', price: '₹1,65,000', priceValue: 165000, metal: '18K White Gold', imageUrl: '/jewelry/bracelets-tryon/bracelet_leaf_vine.png', store: 'Jauhari', storeUrl: '/stores/jauhari', images: ['/jewelry/bracelets-tryon/bracelet_leaf_vine.png'] },
    { id: 'stk-b4', name: 'Heart Halo Diamond Bracelet', category: 'Bracelets', description: 'Romantic heart halo bracelet with a central round brilliant diamond surrounded by a pave halo and heart-shaped links.', price: '₹1,95,000', priceValue: 195000, metal: '18K White Gold', imageUrl: '/jewelry/bracelets-tryon/bracelet_heart_halo.png', store: 'Jauhari', storeUrl: '/stores/jauhari', images: ['/jewelry/bracelets-tryon/bracelet_heart_halo.png'] },
    { id: 'stk-b5', name: 'Botanical Cuff Diamond Bracelet', category: 'Bracelets', description: 'Luxurious botanical cuff bracelet with cascading leaf motif set with pave and marquise diamonds. A masterpiece of craftsmanship.', price: '₹2,75,000', priceValue: 275000, metal: '18K White Gold', imageUrl: '/jewelry/bracelets-tryon/bracelet_botanical_cuff.png', store: 'Jauhari', storeUrl: '/stores/jauhari', images: ['/jewelry/bracelets-tryon/bracelet_botanical_cuff.png'] },
];

export function getAllTryOnProducts(): UnifiedProduct[] {
    const byCategory: Record<string, UnifiedProduct[]> = {};

    // Pre-populate necklaces, earrings & rings with curated stickers
    byCategory['Necklaces'] = [...NECKLACE_STICKERS];
    byCategory['Earrings'] = [...EARRING_STICKERS];
    byCategory['Rings'] = [...RING_STICKERS];
    byCategory['Bracelets'] = [...BRACELET_STICKERS];

    // Palmonas first — best quality images
    const brands = [
        { name: 'Palmonas', data: palmonasProducts, url: '/stores/palmonas', type: 'standard' },
        { name: 'Giva', data: givaProducts, url: '/stores/giva', type: 'standard' },
        { name: 'Khan Jewellers', data: khanProducts, url: '/stores/khans', type: 'standard' },
        { name: 'Jauhari', data: jauhariProducts, url: '/stores/jauhari', type: 'jauhari' }
    ];

    brands.forEach(b => {
        b.data
            .filter((p: any) => TRY_ON_CATEGORIES.includes(p.category))
            .forEach((p: any) => {
                const cat = p.category;
                if (!byCategory[cat]) byCategory[cat] = [];
                if (byCategory[cat].length >= 5) return;
                byCategory[cat].push({
                    id: p.id,
                    name: p.name,
                    category: cat,
                    description: p.description,
                    price: p.price,
                    priceValue: p.priceValue || (typeof p.price === 'string' ? parseFloat(p.price.replace(/[^0-9.]/g, '')) : 0),
                    metal: p.metal || p.material || '',
                    imageUrl: b.type === 'jauhari' ? p.images[0] : p.imageUrl,
                    store: b.name as any,
                    storeUrl: b.url,
                    images: b.type === 'jauhari' ? p.images : [p.imageUrl]
                });
            });
    });

    return Object.values(byCategory).flat();
}
