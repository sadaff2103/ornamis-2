import { givaProducts } from "../data/givaProducts";
import { palmonasProducts } from "../data/palmonasProducts";
import { khanProducts } from "../data/khanProducts";
import type { Product } from "../contexts/ShopContext";

// ─── Unified Product Index ──────────────────────────────────────────────────

let _productIndex: Product[] | null = null;

export function buildProductIndex(): Product[] {
    if (_productIndex) return _productIndex;
    _productIndex = [
        ...givaProducts.map((p) => ({
            id: p.id,
            title: p.name,
            price: p.price,
            priceValue: p.priceValue,
            image: p.imageUrl,
            category: p.category,
            material: [p.metal],
            style: [],
            description: p.description,
            storeName: "GIVA",
            storeSlug: "giva",
            tags: [p.category, p.metal, "giva"],
            rating: p.rating,
            reviewCount: p.reviewCount,
            isNew: p.isNew,
        })),
        ...palmonasProducts.map((p) => ({
            id: p.id,
            title: p.name,
            price: p.price,
            priceValue: p.priceValue,
            image: p.imageUrl,
            category: p.category,
            material: [p.metal, ...(p.stoneType ? [p.stoneType] : [])],
            style: [],
            description: p.description,
            storeName: "Palmonas",
            storeSlug: "palmonas",
            tags: [p.category, p.metal, "palmonas"],
            rating: p.rating,
            reviewCount: p.reviewCount,
        })),
        ...khanProducts.map((p) => ({
            id: p.id,
            title: p.name,
            price: p.price,
            priceValue: p.priceValue,
            image: p.imageUrl,
            category: p.category,
            material: [p.metal],
            style: [],
            description: p.description,
            storeName: "Khan Jewellers",
            storeSlug: "khans",
            tags: [p.category, p.metal, "khan", "khans"],
            rating: p.rating,
            reviewCount: p.reviewCount,
        })),
    ];
    return _productIndex;
}

// ─── Fuzzy Search ───────────────────────────────────────────────────────────

/**
 * Normalize jewelry category words to their **plural canonical** form.
 * Applied to BOTH query tokens and the product's searchable text so they
 * always align (avoids the bug where "rings"→"ring" but the target text
 * still says "rings" and the word-boundary check on "ring" fails because
 * the 's' after it is still [a-z]).
 */
const PLURAL_MAP: Record<string, string> = {
    // singular → plural
    ring: "rings",
    earring: "earrings",
    necklace: "necklaces",
    bracelet: "bracelets",
    bangle: "bangles",
    pendant: "pendants",
    chain: "chains",
    stud: "studs",
    set: "sets",
    // plural already (identity kept for safety)
    rings: "rings",
    earrings: "earrings",
    necklaces: "necklaces",
    bracelets: "bracelets",
    bangles: "bangles",
    pendants: "pendants",
    chains: "chains",
    studs: "studs",
    sets: "sets",
};

function canonicalizeToken(t: string): string {
    return PLURAL_MAP[t] ?? t;
}

/** Rewrite every jewelry keyword inside a longer string to its plural form */
function canonicalizeText(text: string): string {
    return text.replace(
        /\b(ring|earring|necklace|bracelet|bangle|pendant|chain|stud|set)s?\b/gi,
        (match: string): string => PLURAL_MAP[match.toLowerCase()] ?? match.toLowerCase()
    );
}

/**
 * Returns the "structural" searchable text: title, category, store, material,
 * tags — but NOT description. This prevents cross-category pollution where
 * e.g. a necklace description mentions "diamond" and matches "diamond ring".
 * All jewelry keywords are canonicalized to plural so they align with tokens.
 */
function productSearchableText(p: Product): string {
    const raw = [
        p.title,
        p.category,
        p.storeName ?? "",
        (p.material ?? []).join(" "),
        (p.tags ?? []).join(" "),
    ]
        .join(" ")
        .toLowerCase();
    return canonicalizeText(raw);
}


/**
 * Checks whether `token` appears as a **whole word** in `target`.
 * Falls back to a one-character fuzzy window for typos only when:
 *   1. The token is >= 5 chars (so short words like "ring" never bleed into "earring")
 *   2. The fuzzy-matched position also satisfies word boundaries
 */
function matchToken(token: string, target: string): boolean {
    // Whole-word boundary match (fast path)
    const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const wordRe = new RegExp(`(?<![a-z])${escaped}(?![a-z])`, "i");
    if (wordRe.test(target)) return true;

    // Fuzzy fallback for typos — minimum 5 chars AND word-boundary enforced at match site.
    // This ensures "ring" (4 chars) NEVER fuzzy-matches inside "earring"/"earrings".
    if (token.length < 5) return false;
    for (let i = 0; i <= target.length - token.length; i++) {
        // Word boundary check at start and end of candidate position
        const beforeOk = i === 0 || !/[a-z]/i.test(target[i - 1]);
        const afterEnd = i + token.length;
        const afterOk = afterEnd >= target.length || !/[a-z]/i.test(target[afterEnd]);
        if (!beforeOk || !afterOk) continue;

        let mismatches = 0;
        for (let j = 0; j < token.length; j++) {
            if (token[j] !== target[i + j]) mismatches++;
            if (mismatches > 1) break;
        }
        if (mismatches === 1) return true; // exactly 1 typo at a word boundary
    }
    return false;
}

export function fuzzySearch(query: string, products: Product[]): Product[] {
    if (!query.trim()) return [];
    const tokens = query
        .toLowerCase()
        .trim()
        .split(/\s+/)
        .map(canonicalizeToken);
    return products.filter((p) => {
        const text = productSearchableText(p);
        return tokens.every((token) => matchToken(token, text));
    });
}

// ─── Highlight Matched Text ─────────────────────────────────────────────────

export interface TextSegment {
    text: string;
    highlighted: boolean;
}

export function highlightText(text: string, query: string): TextSegment[] {
    if (!query.trim()) return [{ text, highlighted: false }];
    const tokens = query
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .filter((t) => t.length > 1);
    if (!tokens.length) return [{ text, highlighted: false }];

    const pattern = tokens
        .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("|");
    const regex = new RegExp(`(${pattern})`, "gi");
    const parts = text.split(regex);
    return parts.map((part) => ({
        text: part,
        highlighted: regex.test(part),
    }));
}

// ─── Similar Products ───────────────────────────────────────────────────────

export function getSimilarProducts(query: string, products: Product[], limit = 4): Product[] {
    const tokens = query.toLowerCase().split(/\s+/);
    const scored = products.map((p) => {
        const text = productSearchableText(p);
        const score = tokens.reduce((acc, t) => acc + (text.includes(t) ? 1 : 0), 0);
        return { p, score };
    });
    return scored
        .filter((s) => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((s) => s.p);
}
