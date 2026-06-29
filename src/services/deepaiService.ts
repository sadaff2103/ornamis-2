/**
 * DeepAI Image Generation Service
 * FREE tier available with API key
 * Simple and reliable API
 * API Docs: https://deepai.org/machine-learning-model/text2img
 */

const DEEPAI_API_KEY = import.meta.env.VITE_DEEPAI_API_KEY;
const API_URL = "https://api.deepai.org/api/text2img";

/**
 * Generate AI images using DeepAI
 * @param prompt - The jewelry design prompt
 * @param count - Number of variations (default: 4)
 */
export async function generateImages(
    prompt: string,
    count: number = 4
): Promise<string[]> {
    if (!DEEPAI_API_KEY || DEEPAI_API_KEY === "your_deepai_api_key_here") {
        throw new Error("DeepAI API key not configured. Please add VITE_DEEPAI_API_KEY to .env.local");
    }

    // Enhanced prompt for jewelry-specific generation
    const enhancedPrompt = `${prompt}, professional jewelry photography, studio lighting, white background, high resolution, detailed, precious metals, gemstones, luxury jewelry, product photography, 8k quality, ultra-detailed, photorealistic`;

    console.log("🎨 Generating with DeepAI:", enhancedPrompt);

    try {
        // Generate multiple images in parallel
        const promises = Array.from({ length: count }, async () => {
            const formData = new FormData();
            formData.append('text', enhancedPrompt);

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "api-key": DEEPAI_API_KEY,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`DeepAI API error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();

            if (!data.output_url) {
                throw new Error("No image URL in response");
            }

            return data.output_url;
        });

        const imageUrls = await Promise.all(promises);
        console.log(`✅ Generated ${imageUrls.length} images successfully!`);

        return imageUrls;
    } catch (error) {
        console.error("DeepAI generation error:", error);
        throw error;
    }
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
