/**
 * Segmind Image Generation Service
 * FREE: 1000 requests/month
 * Fast & reliable with multiple SDXL models
 * API Docs: https://docs.segmind.com/
 */

const SEGMIND_API_KEY = import.meta.env.VITE_SEGMIND_API_KEY;
const API_BASE = "https://api.segmind.com/v1";

/**
 * Generate AI images using Segmind
 * @param prompt - The jewelry design prompt
 * @param count - Number of variations (default: 4)
 */
export async function generateImages(
    prompt: string,
    count: number = 4
): Promise<string[]> {
    if (!SEGMIND_API_KEY || SEGMIND_API_KEY === "your_segmind_api_key_here") {
        throw new Error("Segmind API key not configured. Please add VITE_SEGMIND_API_KEY to .env.local");
    }

    // Enhanced prompt for jewelry-specific generation
    const enhancedPrompt = `${prompt}, professional jewelry photography, studio lighting, white background, high resolution, detailed, precious metals, gemstones, luxury jewelry, product photography, 8k quality, ultra-detailed, photorealistic, commercial product photo`;

    const negativePrompt = "blurry, low quality, distorted, cartoon, illustration, sketch, drawing, text, watermark, person, hands, body, ugly, deformed";

    console.log("🎨 Generating with Segmind SDXL:", enhancedPrompt);

    try {
        // Generate multiple images in parallel
        const promises = Array.from({ length: count }, async () => {
            const response = await fetch(`${API_BASE}/sdxl1.0-txt2img`, {
                method: "POST",
                headers: {
                    "x-api-key": SEGMIND_API_KEY,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt: enhancedPrompt,
                    negative_prompt: negativePrompt,
                    samples: 1,
                    scheduler: "UniPC",
                    num_inference_steps: 25,
                    guidance_scale: 7.5,
                    seed: Math.floor(Math.random() * 1000000),
                    img_width: 512,
                    img_height: 512,
                    base64: true, // Return as base64
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Segmind API error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();

            // Segmind returns base64 image in 'image' field
            if (data.image) {
                return `data:image/png;base64,${data.image}`;
            }

            throw new Error("No image data in response");
        });

        const imageUrls = await Promise.all(promises);
        console.log(`✅ Generated ${imageUrls.length} images successfully!`);

        return imageUrls;
    } catch (error) {
        console.error("Segmind generation error:", error);
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
