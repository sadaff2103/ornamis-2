/**
 * Hugging Face Inference API Service
 * FREE: 1000 requests/day - EASY signup!
 * Stable Diffusion XL quality
 * API Docs: https://huggingface.co/docs/api-inference/
 */

const HF_API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY;
// Use local proxy to avoid CORS issues  
const API_BASE = "/api/huggingface/models";
const MODEL = "stabilityai/stable-diffusion-xl-base-1.0";

/**
 * Generate AI images using Hugging Face
 * @param prompt - The jewelry design prompt
 * @param count - Number of variations (default: 4)
 */
export async function generateImages(
    prompt: string,
    count: number = 4
): Promise<string[]> {
    if (!HF_API_KEY || HF_API_KEY === "your_huggingface_token_here") {
        throw new Error("Hugging Face API key not configured. Please add VITE_HUGGINGFACE_API_KEY to .env.local");
    }

    // Enhanced prompt for jewelry-specific generation
    const enhancedPrompt = `${prompt}, professional jewelry photography, studio lighting, white background, high resolution, detailed, precious metals, gemstones, luxury jewelry, product photography, 8k quality, ultra-detailed, photorealistic`;

    console.log("🎨 Generating with Hugging Face SDXL:", enhancedPrompt);

    try {
        // Generate multiple images in parallel
        const promises = Array.from({ length: count }, async () => {
            const response = await fetch(`${API_BASE}/${MODEL}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    inputs: enhancedPrompt,
                    parameters: {
                        negative_prompt: "blurry, low quality, distorted, cartoon, sketch, text, watermark, person, hands",
                        num_inference_steps: 25,
                        guidance_scale: 7.5,
                    }
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Hugging Face API error: ${response.status} - ${errorText}`);
            }

            // Hugging Face returns image as blob
            const blob = await response.blob();

            // Convert blob to base64
            return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        });

        const imageUrls = await Promise.all(promises);
        console.log(`✅ Generated ${imageUrls.length} images successfully!`);

        return imageUrls;
    } catch (error) {
        console.error("Hugging Face generation error:", error);
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
