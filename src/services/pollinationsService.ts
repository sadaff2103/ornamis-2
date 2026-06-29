/**
 * Pollinations.ai Image Generation Service
 * FREE, FAST, NO API KEY NEEDED
 * Docs: https://pollinations.ai/
 */

/**
 * Generate AI images using Pollinations.ai
 * @param prompt - The jewelry design prompt
 * @param count - Number of variations (default: 4)
 */
export async function generateImages(
    prompt: string,
    count: number = 4
): Promise<string[]> {
    // Enhanced prompt for jewelry-specific generation
    const enhancedPrompt = `${prompt}, professional jewelry photography, studio lighting, white background, high resolution, detailed, precious metals, gemstones, luxury jewelry, product photography, 8k quality`;

    // Encode prompt for URL
    const encodedPrompt = encodeURIComponent(enhancedPrompt);

    console.log("🎨 Generating with Pollinations.ai (new API):", enhancedPrompt);

    // Generate multiple variations by adding seed parameter
    const images = Array.from({ length: count }, () => {
        // Add seed for variation
        const seed = Math.floor(Math.random() * 1000000);
        // NEW API ENDPOINT
        const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&seed=${seed}&nologo=true&model=flux`;
        return url;
    });

    console.log(`✅ Generated ${images.length} image URLs instantly!`);

    return images;
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
