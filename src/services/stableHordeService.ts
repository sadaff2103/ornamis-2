/**
 * Stable Horde AI Image Generation Service
 * Free, community-powered AI image generation
 * API Docs: https://stablehorde.net/api/
 */

// Use "0000000000" for anonymous free access, or get your key at https://stablehorde.net/register
const STABLE_HORDE_API_KEY = import.meta.env.VITE_STABLEHORDE_API_KEY || "0000000000";
const API_BASE = "https://stablehorde.net/api/v2";

interface GenerationParams {
    prompt: string;
    negative_prompt?: string;
    width?: number;
    height?: number;
    steps?: number;
    cfg_scale?: number;
    seed?: string;
    karras?: boolean;
    n?: number;
}

interface GenerationResponse {
    id: string;
    kudos: number;
}

interface StatusResponse {
    done: boolean;
    faulted: boolean;
    wait_time: number;
    queue_position: number;
    generations?: Array<{
        img: string;
        seed: string;
        id: string;
        censored: boolean;
    }>;
}

/**
 * Generate AI images using Stable Horde
 * @param prompt - The jewelry design prompt
 * @param count - Number of variations (default: 4)
 */
export async function generateImages(
    prompt: string,
    count: number = 4
): Promise<string[]> {
    console.log("🎨 Generating with Stable Horde (FREE community-powered):", prompt);

    try {
        // Enhanced prompt for jewelry-specific generation - emphasize professional, commercial photography
        const enhancedPrompt = `professional product photography of ${prompt}, commercial jewelry photography, studio lighting setup, white seamless background, macro lens, high resolution 8k, detailed craftsmanship, precious metals and gemstones, luxury jewelry catalog, professional lighting, sharp focus, commercial product shot`;

        const negativePrompt = "blurry, low quality, distorted, cartoon, illustration, sketch, drawing, text, watermark, person, hands, body, nudity, nsfw, inappropriate";

        // Submit generation request
        const params: GenerationParams = {
            prompt: enhancedPrompt,
            negative_prompt: negativePrompt,
            width: 512,
            height: 512,
            steps: 30,
            cfg_scale: 7.5,
            karras: true,
            n: count,
        };

        const response = await fetch(`${API_BASE}/generate/async`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "apikey": STABLE_HORDE_API_KEY,
            },
            body: JSON.stringify({
                prompt: params.prompt,
                params: {
                    sampler_name: "k_euler_a",
                    cfg_scale: params.cfg_scale,
                    denoising_strength: 0.75,
                    height: params.height,
                    width: params.width,
                    karras: params.karras,
                    steps: params.steps,
                    n: params.n,
                },
                nsfw: false,
                censor_nsfw: false, // CRITICAL: Disable censorship for jewelry images
                trusted_workers: true, // Use only trusted workers to avoid overzealous censoring
                models: ["stable_diffusion"], // Use default model
                r2: true, // Request R2 storage for longer image availability
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Stable Horde API error:", errorText);
            throw new Error(`API request failed: ${response.statusText}`);
        }

        const data: GenerationResponse = await response.json();

        // Poll for completion
        const images = await waitForCompletion(data.id, 120000); // 2 minute timeout

        return images;
    } catch (error) {
        console.error("Stable Horde generation error:", error);
        throw error;
    }
}

/**
 * Check generation status
 */
async function checkStatus(generationId: string): Promise<StatusResponse> {
    const response = await fetch(`${API_BASE}/generate/check/${generationId}`);

    if (!response.ok) {
        throw new Error(`Status check failed: ${response.statusText}`);
    }

    return await response.json();
}

/**
 * Get generated images
 */
async function getGeneratedImages(generationId: string): Promise<string[]> {
    const response = await fetch(`${API_BASE}/generate/status/${generationId}`);

    if (!response.ok) {
        throw new Error(`Failed to get images: ${response.statusText}`);
    }

    const data: StatusResponse = await response.json();

    console.log("📊 Generation status data:", JSON.stringify(data, null, 2));

    if (data.faulted) {
        throw new Error("Generation faulted");
    }

    if (!data.done) {
        throw new Error("Generation not complete");
    }

    if (!data.generations || data.generations.length === 0) {
        console.error("❌ No generations in response:", data);
        throw new Error("No images generated - generations array is empty");
    }

    // Convert base64 images to data URLs, or return direct URLs
    const uncensored = data.generations.filter(gen => !gen.censored);
    const censoredCount = data.generations.length - uncensored.length;

    if (censoredCount > 0) {
        console.warn(`⚠️ ${censoredCount} out of ${data.generations.length} images were censored`);
    }

    if (uncensored.length === 0) {
        console.error("❌ All images were censored! This is likely due to overly aggressive content filtering.");
        console.error("💡 Try rephrasing your prompt to be more specific about 'professional jewelry photography'");
        throw new Error("All generated images were censored. Please try a different description or rephrase your prompt to emphasize professional jewelry photography.");
    }

    console.log(`✅ Got ${uncensored.length} uncensored images out of ${data.generations.length} total`);

    // Stable Horde can return either base64 or URLs - handle both
    return uncensored.map(gen => {
        // If img field starts with http, it's a URL - return directly
        if (gen.img.startsWith('http')) {
            return gen.img;
        }
        // Otherwise it's base64 data
        return `data:image/webp;base64,${gen.img}`;
    });
}

/**
 * Wait for generation to complete with polling
 */
async function waitForCompletion(
    generationId: string,
    timeout: number = 120000
): Promise<string[]> {
    const startTime = Date.now();
    const pollInterval = 3000; // Poll every 3 seconds

    while (Date.now() - startTime < timeout) {
        const status = await checkStatus(generationId);

        console.log(`Generation status: position ${status.queue_position}, wait time: ${status.wait_time}s`);

        if (status.done) {
            return await getGeneratedImages(generationId);
        }

        if (status.faulted) {
            throw new Error("Generation failed");
        }

        // Wait before next poll
        await new Promise(resolve => setTimeout(resolve, pollInterval));
    }

    throw new Error("Generation timeout");
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
