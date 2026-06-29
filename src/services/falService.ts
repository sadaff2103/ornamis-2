/**
 * Fal.ai Image Generation Service
 * FLUX.1 [dev] - High-quality 12B parameter text-to-image model
 * API Docs: https://fal.ai/models/fal-ai/flux/dev/api
 * Pricing: ~$0.025/megapixel
 */

const FAL_API_KEY = import.meta.env.VITE_FAL_API_KEY;
const API_ENDPOINT = "https://queue.fal.run/fal-ai/flux/dev";

interface FalImage {
    url: string;
    content_type: string;
    width?: number;
    height?: number;
}

interface FalResponse {
    images: FalImage[];
    seed: number;
    has_nsfw_concepts: boolean[];
    prompt: string;
}

/**
 * Generate AI images using Fal.ai FLUX.1 [dev] model
 * @param prompt - The jewelry design prompt
 * @param count - Number of variations (default: 4)
 */
export async function generateImages(
    prompt: string,
    count: number = 4
): Promise<string[]> {
    if (!FAL_API_KEY || FAL_API_KEY === "your_fal_api_key_here") {
        throw new Error("Fal.ai API key not configured. Please add VITE_FAL_API_KEY to .env.local");
    }

    // Enhanced prompt for jewelry-specific generation
    const enhancedPrompt = `${prompt}, professional jewelry photography, studio lighting, white background, high resolution, detailed, precious metals, gemstones, luxury jewelry, product photography, 8k quality, ultra-detailed, photorealistic, commercial product photo`;

    console.log("🎨 Generating with Fal.ai FLUX.1 [dev]:", enhancedPrompt);

    try {
        // Generate multiple images sequentially (to avoid rate limits)
        const imageUrls: string[] = [];

        for (let i = 0; i < count; i++) {
            const response = await fetch(API_ENDPOINT, {
                method: "POST",
                headers: {
                    "Authorization": `Key ${FAL_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt: enhancedPrompt,
                    image_size: "square", // 512x512 for fast generation
                    num_inference_steps: 28, // Good quality vs speed balance
                    guidance_scale: 3.5,
                    num_images: 1,
                    enable_safety_checker: true,
                    output_format: "jpeg",
                    seed: Math.floor(Math.random() * 1000000), // Random seed for variety
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Fal.ai API error: ${response.status} - ${errorText}`);
            }

            const data: FalResponse = await response.json();

            if (data.images && data.images.length > 0) {
                imageUrls.push(data.images[0].url);
                console.log(`✅ Generated image ${i + 1}/${count}`);
            } else {
                throw new Error("No image data in response");
            }
        }

        console.log(`✅ Generated ${imageUrls.length} images successfully!`);
        return imageUrls;
    } catch (error) {
        console.error("Fal.ai generation error:", error);
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
