/**
 * Image Generation Service
 * Primary: Stable Horde (100% FREE - community-run GPU network)
 * Prompt Enhancement: Gemini API (if configured)
 * Fallback: Demo images
 * 
 * Stable Horde is completely FREE - no API key needed!
 * Optional: Register at https://stablehorde.net for faster generation
 */

import { enhanceJewelryPrompt, isGeminiConfigured } from "./geminiService";

export interface GenerationProgress {
    status: "queued" | "processing" | "complete";
    queuePosition?: number;
    waitTime?: number; // seconds
    message?: string;
}

export type ProgressCallback = (progress: GenerationProgress) => void;

export interface ImagenGenerationOptions {
    jewelryType?: string;
    style?: string;
    material?: string;
    gemstone?: string;
    aspectRatio?: string;
    useGeminiEnhancement?: boolean;
    onProgress?: ProgressCallback;
}

export interface ImagenGenerationResult {
    success: boolean;
    imageUrl: string;
    prompt: string;
    enhancedPrompt?: string;
    source: "stablehorde" | "demo";
    geminiEnhanced?: boolean;
    error?: string;
}

// Demo images for fallback when API fails
const DEMO_IMAGES: Record<string, string[]> = {
    necklace: [
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80",
        "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
    ],
    ring: [
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
        "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&q=80",
        "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80",
    ],
    earrings: [
        "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
        "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=800&q=80",
        "https://images.unsplash.com/photo-1596944924591-4b8b0c6c2c0f?w=800&q=80",
    ],
    bracelet: [
        "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
        "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80",
    ],
    pendant: [
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&q=80",
    ],
    default: [
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80",
        "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
    ],
};

/**
 * Detect jewelry type from user's prompt text
 */
function detectJewelryTypeFromPrompt(prompt: string): string | null {
    const promptLower = prompt.toLowerCase();
    const jewelryTypes = [
        'bracelet', 'ring', 'necklace', 'earrings', 'pendant',
        'anklet', 'bangle', 'chain', 'choker', 'brooch'
    ];

    for (const type of jewelryTypes) {
        if (promptLower.includes(type)) {
            return type;
        }
    }
    return null;
}

/**
 * Get a random demo image for a jewelry type
 */
function getRandomDemoImage(prompt: string, jewelryType?: string): string {
    const detectedType = detectJewelryTypeFromPrompt(prompt) || jewelryType;
    const images = DEMO_IMAGES[detectedType?.toLowerCase() || "default"] || DEMO_IMAGES.default;
    return images[Math.floor(Math.random() * images.length)];
}

/**
 * Build a jewelry-optimized prompt for image generation
 */
function buildJewelryPrompt(prompt: string): string {
    return `Professional jewelry product photography, studio lighting, white background, ${prompt}, ultra-detailed, high-end luxury, sharp focus, photorealistic, commercial photography`;
}

/**
 * Get Stable Horde API key (optional - works without one, just slower)
 */
function getStableHordeApiKey(): string {
    return import.meta.env.VITE_STABLEHORDE_API_KEY || "0000000000"; // Anonymous API key
}

/**
 * Generate image using Stable Horde (100% FREE)
 * This is a community-run distributed GPU network
 */
async function generateWithStableHorde(prompt: string, onProgress?: ProgressCallback): Promise<string> {
    const apiKey = getStableHordeApiKey();

    console.log("🎨 Submitting request to Stable Horde (FREE)...");

    onProgress?.({
        status: "queued",
        message: "Submitting request to Stable Horde..."
    });

    // Step 1: Submit generation request
    const submitResponse = await fetch("https://stablehorde.net/api/v2/generate/async", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "apikey": apiKey,
            "Client-Agent": "ornamis-jewelry-designer:1.0"
        },
        body: JSON.stringify({
            prompt: prompt,
            params: {
                sampler_name: "k_euler",
                cfg_scale: 7.5,
                width: 512,
                height: 512,
                steps: 25,
                n: 1
            },
            nsfw: false,
            censor_nsfw: true,
            models: ["stable_diffusion"]
        }),
    });

    if (!submitResponse.ok) {
        const errorData = await submitResponse.json().catch(() => ({}));
        console.error("Stable Horde submit error:", errorData);
        throw new Error(errorData.message || `Submit failed: ${submitResponse.status}`);
    }

    const submitData = await submitResponse.json();
    const requestId = submitData.id;

    if (!requestId) {
        throw new Error("No request ID returned from Stable Horde");
    }

    console.log(`📝 Request ID: ${requestId}. Waiting for generation...`);

    // Step 2: Poll for completion (max 2 minutes)
    const maxWaitTime = 120000; // 2 minutes
    const pollInterval = 3000;  // 3 seconds
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitTime) {
        await new Promise(resolve => setTimeout(resolve, pollInterval));

        const checkResponse = await fetch(`https://stablehorde.net/api/v2/generate/check/${requestId}`, {
            headers: {
                "Client-Agent": "ornamis-jewelry-designer:1.0"
            }
        });

        if (!checkResponse.ok) {
            console.warn("Check request failed, retrying...");
            continue;
        }

        const checkData = await checkResponse.json();

        if (checkData.done) {
            console.log("✅ Generation complete!");
            onProgress?.({
                status: "processing",
                message: "Finalizing image..."
            });
            break;
        }

        const waitTime = checkData.wait_time || 0;
        const queuePosition = checkData.queue_position || 0;
        console.log(`⏳ Queue position: ${queuePosition}, Est. wait: ${waitTime}s`);

        // Emit progress update
        onProgress?.({
            status: "queued",
            queuePosition,
            waitTime,
            message: `Queue position: ${queuePosition}`
        });
    }

    // Step 3: Get the result
    const resultResponse = await fetch(`https://stablehorde.net/api/v2/generate/status/${requestId}`, {
        headers: {
            "Client-Agent": "ornamis-jewelry-designer:1.0"
        }
    });

    if (!resultResponse.ok) {
        throw new Error(`Failed to get result: ${resultResponse.status}`);
    }

    const resultData = await resultResponse.json();

    if (!resultData.generations || resultData.generations.length === 0) {
        throw new Error("No image generated");
    }

    const generation = resultData.generations[0];
    const imageData = generation.img;

    if (!imageData) {
        throw new Error("No image data in result");
    }

    console.log("✅ Image data received!");
    console.log("Image data type:", typeof imageData, "Length:", imageData.length, "Starts with:", imageData.substring(0, 50));

    // Stable Horde returns base64 directly (no data: prefix)
    // We need to add the proper data URL prefix
    if (imageData.startsWith("data:")) {
        return imageData;
    } else if (imageData.startsWith("http")) {
        // If it's a URL, fetch and convert to base64
        console.log("Fetching image from URL...");
        const imgResponse = await fetch(imageData);
        const blob = await imgResponse.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } else {
        // It's raw base64, add proper prefix
        // Check if it's PNG or WEBP by looking at magic bytes
        const isPng = imageData.startsWith("iVBORw0KGgo");
        const mimeType = isPng ? "image/png" : "image/webp";
        return `data:${mimeType};base64,${imageData}`;
    }
}

/**
 * Generate a jewelry design
 * Primary: Stable Horde (100% FREE)
 * Enhancement: Gemini API (optional, for smarter prompts)
 * Fallback: Demo images
 */
export async function generateJewelryImage(
    prompt: string,
    options?: ImagenGenerationOptions
): Promise<ImagenGenerationResult> {
    let enhancedPrompt: string;
    let geminiEnhanced = false;

    // Step 1: Try to enhance the prompt with Gemini (if available)
    const useGemini = options?.useGeminiEnhancement !== false && isGeminiConfigured();

    if (useGemini) {
        try {
            console.log("✨ Enhancing prompt with Gemini...");
            const geminiResult = await enhanceJewelryPrompt(prompt);
            enhancedPrompt = geminiResult.enhancedPrompt;
            geminiEnhanced = !geminiResult.error;
            if (geminiEnhanced) {
                console.log("✅ Prompt enhanced by Gemini");
            }
        } catch (error) {
            console.warn("Gemini enhancement failed, using basic enhancement");
            enhancedPrompt = buildJewelryPrompt(prompt);
        }
    } else {
        enhancedPrompt = buildJewelryPrompt(prompt);
    }

    // Step 2: Generate image with Stable Horde (FREE!)
    try {
        console.log("🎨 Generating image with Stable Horde (FREE)...");
        const imageUrl = await generateWithStableHorde(enhancedPrompt, options?.onProgress);
        console.log("✅ Image generated successfully!");

        // Notify completion
        options?.onProgress?.({
            status: "complete",
            message: "Image ready!"
        });

        return {
            success: true,
            imageUrl,
            prompt,
            enhancedPrompt,
            source: "stablehorde",
            geminiEnhanced,
        };
    } catch (error) {
        console.warn("Stable Horde failed:", error);
    }

    // Step 3: Fallback to demo mode
    console.log("🎨 Using demo images");
    const delay = 500 + Math.random() * 500;
    await new Promise((resolve) => setTimeout(resolve, delay));

    return {
        success: true,
        imageUrl: getRandomDemoImage(prompt),
        prompt,
        enhancedPrompt,
        source: "demo",
        geminiEnhanced,
    };
}

/**
 * Check if image generation is available
 * Stable Horde is always available (anonymous access allowed)
 */
export function isImagenConfigured(): boolean {
    return true; // Stable Horde works without API key
}
