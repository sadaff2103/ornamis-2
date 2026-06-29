/**
 * Unsplash Image Service
 * FREE - No API key needed for basic usage
 * High-quality jewelry photography
 * API Docs: https://unsplash.com/developers
 */

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY || "demo";
const UNSPLASH_API_URL = "https://api.unsplash.com/search/photos";

/**
 * Generate jewelry images using Unsplash
 * @param prompt - The jewelry design prompt
 * @param count - Number of variations (default: 4)
 */
export async function generateImages(
    prompt: string,
    count: number = 4
): Promise<string[]> {
    // Extract jewelry keywords from prompt
    const keywords = extractJewelryKeywords(prompt);
    const searchQuery = `${keywords} jewelry luxury`;

    console.log("🎨 Fetching from Unsplash:", searchQuery);

    try {
        const response = await fetch(
            `${UNSPLASH_API_URL}?query=${encodeURIComponent(searchQuery)}&per_page=${count}&orientation=squarish`,
            {
                headers: UNSPLASH_ACCESS_KEY !== "demo"
                    ? { "Authorization": `Client-ID ${UNSPLASH_ACCESS_KEY}` }
                    : {}
            }
        );

        if (!response.ok) {
            throw new Error(`Unsplash API error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            // Fallback to generic jewelry search
            return getFallbackImages(count);
        }

        const imageUrls = data.results.slice(0, count).map((photo: any) => photo.urls.regular);
        console.log(`✅ Got ${imageUrls.length} images from Unsplash!`);

        return imageUrls;
    } catch (error) {
        console.error("Unsplash error:", error);
        return getFallbackImages(count);
    }
}

/**
 * Extract jewelry keywords from prompt
 */
function extractJewelryKeywords(prompt: string): string {
    const keywords = [];

    // Jewelry types
    if (/necklace|pendant/i.test(prompt)) keywords.push("necklace");
    else if (/ring/i.test(prompt)) keywords.push("ring");
    else if (/bracelet/i.test(prompt)) keywords.push("bracelet");
    else if (/earring/i.test(prompt)) keywords.push("earrings");
    else keywords.push("jewelry");

    // Materials
    if (/gold/i.test(prompt)) keywords.push("gold");
    if (/silver|platinum/i.test(prompt)) keywords.push("silver");
    if (/diamond/i.test(prompt)) keywords.push("diamond");
    if (/pearl/i.test(prompt)) keywords.push("pearl");
    if (/ruby|sapphire|emerald/i.test(prompt)) keywords.push("gemstone");

    return keywords.join(" ");
}

/**
 * Fallback images for when Unsplash fails
 */
function getFallbackImages(count: number): string[] {
    const fallbackUrls = [
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=512",
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=512",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=512",
        "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=512",
    ];

    return fallbackUrls.slice(0, count);
}

/**
 * Build jewelry-specific prompt
 */
export function buildJewelryPrompt(params: {
    type: string;
    style?: string;
    material?: string;
    gemstone?: string;
    description?: string;
}): string {
    const { type, style = "modern", material = "gold", gemstone = "diamond", description = "" } = params;

    const basePrompt = description || `${style} ${material} ${type}`;

    let prompt = basePrompt;

    if (gemstone && gemstone !== "none") {
        prompt += ` with ${gemstone} gemstones`;
    }

    return prompt;
}
