/**
 * OpenRouter Image Generation Service
 * Provides access to multiple AI models including DALL-E and Stable Diffusion
 * API Docs: https://openrouter.ai/docs
 */

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const API_BASE = "https://openrouter.ai/api/v1";

/**
 * Generate AI images using OpenRouter
 * @param prompt - The jewelry design prompt
 * @param count - Number of variations (default: 4)
 */
export async function generateImages(
    prompt: string,
    count: number = 4
): Promise<string[]> {
    if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === "your_openrouter_api_key_here") {
        throw new Error("OpenRouter API key not configured. Please add VITE_OPENROUTER_API_KEY to .env.local");
    }

    // Enhanced prompt for jewelry
    const enhancedPrompt = `Professional jewelry product photography: ${prompt}. Studio lighting, white background, high-end luxury jewelry, ultra-detailed, 8K resolution, photorealistic, commercial product photography`;

    console.log("🎨 Generating with OpenRouter:", enhancedPrompt);

    try {
        // Try to generate images
        const promises = Array.from({ length: count }, async () => {
            // Use DALL-E 3 via OpenRouter
            const response = await fetch(`${API_BASE}/chat/completions`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": window.location.origin,
                },
                body: JSON.stringify({
                    model: "openai/dall-e-3",
                    messages: [{
                        role: "user",
                        content: enhancedPrompt
                    }],
                    // Image generation specific params
                    max_tokens: 1000,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();

            // Extract image URL from response
            if (data.choices && data.choices[0]) {
                const content = data.choices[0].message.content;
                // DALL-E returns image URLs in the content
                const urlMatch = content.match(/https:\/\/[^\s]+\.(jpg|jpeg|png)/);
                if (urlMatch) {
                    return urlMatch[0];
                }
            }

            throw new Error("No image URL in response");
        });

        const imageUrls = await Promise.all(promises);
        console.log(`✅ Generated ${imageUrls.length} images successfully!`);

        return imageUrls;
    } catch (error) {
        console.error("OpenRouter generation error:", error);
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
