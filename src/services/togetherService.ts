/**
 * Together.ai Image Generation Service
 * FLUX.1 [schnell] Free - 3 MONTHS UNLIMITED FREE ACCESS!
 * API Docs: https://docs.together.ai/reference/post-images-generations
 * Ultra-fast: 315ms generation time
 */

const TOGETHER_API_KEY = import.meta.env.VITE_TOGETHER_API_KEY;
const API_ENDPOINT = "https://api.together.xyz/v1/images/generations";

interface TogetherImageData {
    index: number;
    url?: string;
    b64_json?: string;
    type: "url" | "b64_json";
}

interface TogetherResponse {
    id: string;
    model: string;
    object: "list";
    data: TogetherImageData[];
}

/**
 * Generate AI images using Together.ai FLUX.1 [schnell] Free
 * @param prompt - The jewelry design prompt
 * @param count - Number of variations (default: 4)
 */
export async function generateImages(
    prompt: string,
    count: number = 4
): Promise<string[]> {
    if (!TOGETHER_API_KEY || TOGETHER_API_KEY === "your_together_api_key_here") {
        throw new Error("Together.ai API key not configured. Please add VITE_TOGETHER_API_KEY to .env.local");
    }

    // Enhanced prompt for jewelry-specific generation
    const enhancedPrompt = `${prompt}, professional jewelry photography, studio lighting, white background, high resolution, detailed, precious metals, gemstones, luxury jewelry, product photography, 8k quality, ultra-detailed, photorealistic, commercial product photo`;

    const negativePrompt = "blurry, low quality, distorted, cartoon, illustration, sketch, drawing, text, watermark, person, hands, body, ugly, deformed, amateur";

    console.log("🎨 Generating with Together.ai FLUX.1 [schnell] Free:", enhancedPrompt);

    try {
        // Generate multiple images in a single request
        const response = await fetch(API_ENDPOINT, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${TOGETHER_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "black-forest-labs/FLUX.1-schnell-Free", // FREE unlimited for 3 months!
                prompt: enhancedPrompt,
                negative_prompt: negativePrompt,
                width: 512,
                height: 512,
                steps: 4, // Fast generation (1-4 steps recommended for schnell)
                n: count, // Number of images to generate
                response_format: "url", // Get URLs instead of base64
                seed: Math.floor(Math.random() * 1000000), // Random seed for variety
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Together.ai API error: ${response.status} - ${errorText}`);
        }

        const data: TogetherResponse = await response.json();

        if (data.data && data.data.length > 0) {
            const imageUrls = data.data
                .filter(item => item.url)
                .map(item => item.url!);

            console.log(`✅ Generated ${imageUrls.length} images successfully with Together.ai!`);
            return imageUrls;
        } else {
            throw new Error("No image data in response");
        }
    } catch (error) {
        console.error("Together.ai generation error:", error);
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
