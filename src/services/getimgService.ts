/**
 * GetImg.ai Image Generation Service
 * FREE: 100 images/month
 * High-quality Stable Diffusion XL
 * API Docs: https://docs.getimg.ai/
 */

const GETIMG_API_KEY = import.meta.env.VITE_GETIMG_API_KEY;
const API_BASE = "https://api.getimg.ai/v1";

interface GenerationResponse {
    image: string; // base64 encoded
}

/**
 * Generate AI images using GetImg.ai
 * @param prompt - The jewelry design prompt
 * @param count - Number of variations (default: 4)
 */
export async function generateImages(
    prompt: string,
    count: number = 4
): Promise<string[]> {
    if (!GETIMG_API_KEY || GETIMG_API_KEY === "your_getimg_api_key_here") {
        throw new Error("GetImg.ai API key not configured. Please add VITE_GETIMG_API_KEY to .env.local");
    }

    // Enhanced prompt for jewelry-specific generation
    const enhancedPrompt = `${prompt}, professional jewelry photography, studio lighting, white background, high resolution, detailed, precious metals, gemstones, luxury jewelry, product photography, 8k quality, ultra-detailed, photorealistic`;

    const negativePrompt = "blurry, low quality, distorted, cartoon, illustration, sketch, drawing, text, watermark, person, hands, body, ugly, deformed";

    console.log("🎨 Generating with GetImg.ai (SDXL):", enhancedPrompt);

    try {
        // Generate multiple images
        const promises = Array.from({ length: count }, async () => {
            const response = await fetch(`${API_BASE}/stable-diffusion-xl/text-to-image`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${GETIMG_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt: enhancedPrompt,
                    negative_prompt: negativePrompt,
                    width: 512,
                    height: 512,
                    steps: 25,
                    guidance: 7.5,
                    seed: Math.floor(Math.random() * 1000000),
                    scheduler: "euler",
                    output_format: "png"
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`GetImg.ai API error: ${response.status} - ${errorText}`);
            }

            const data: GenerationResponse = await response.json();

            // Convert base64 to data URL
            return `data:image/png;base64,${data.image}`;
        });

        const imageUrls = await Promise.all(promises);
        console.log(`✅ Generated ${imageUrls.length} images successfully!`);

        return imageUrls;
    } catch (error) {
        console.error("GetImg.ai generation error:", error);
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
