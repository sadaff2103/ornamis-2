/**
 * Replicate Image Generation Service  
 * Uses Replicate API directly for jewelry image generation with Gemini enhancement
 */

import { enhanceJewelryPrompt } from "./geminiService";


// Use local proxy to avoid CORS issues
const REPLICATE_API_URL = "/api/replicate/v1/predictions";

// SDXL model version
const SDXL_VERSION = "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b";

interface ReplicatePrediction {
    id: string;
    status: "starting" | "processing" | "succeeded" | "failed" | "canceled";
    output?: string | string[];
    error?: string;
    urls?: {
        get: string;
        cancel: string;
    };
}

/**
 * Generate jewelry images using Replicate API
 * @param prompt - Jewelry design description
 * @param count - Number of images to generate
 * @returns Array of image URLs
 */
export async function generateImagesWithReplicate(
    prompt: string,
    count: number = 4
): Promise<string[]> {
    // Enhance prompt using Gemini
    const enhancedResult = await enhanceJewelryPrompt(prompt);
    const enhancedPrompt = `Professional jewelry product photography, studio lighting on white background, high-end luxury jewelry, ${enhancedResult.enhancedPrompt}, ultra-detailed, sharp focus, 8K resolution, photorealistic, commercial product photography, elegant, high quality`;

    console.log("Generating with Replicate:", enhancedPrompt);

    // Generate images concurrently
    const promises = Array.from({ length: count }, async () => {
        // Create prediction
        const createResponse = await fetch(REPLICATE_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                version: SDXL_VERSION,
                input: {
                    prompt: enhancedPrompt,
                    negative_prompt: "blurry, low quality, distorted, ugly, bad anatomy, watermark, text, logo, person, hands",
                    width: 512,
                    height: 512,
                    num_outputs: 1,
                    scheduler: "K_EULER",
                    num_inference_steps: 25,
                    guidance_scale: 7.5,
                },
            }),
        });

        if (!createResponse.ok) {
            const errorText = await createResponse.text();
            throw new Error(`Replicate create failed: ${createResponse.statusText} - ${errorText}`);
        }

        const prediction: ReplicatePrediction = await createResponse.json();

        // Poll for completion
        const completedPrediction = await pollForCompletion(prediction.id);

        // Extract image URL
        if (Array.isArray(completedPrediction.output)) {
            return completedPrediction.output[0];
        } else if (typeof completedPrediction.output === "string") {
            return completedPrediction.output;
        } else {
            throw new Error("No output image from Replicate");
        }
    });

    const imageUrls = await Promise.all(promises);
    console.log(`Generated ${imageUrls.length} images successfully`);

    return imageUrls;
}

/**
 * Poll prediction until complete
 */
async function pollForCompletion(
    predictionId: string,
    maxAttempts: number = 120,
    intervalMs: number = 1500
): Promise<ReplicatePrediction> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const response = await fetch(`${REPLICATE_API_URL}/${predictionId}`, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Poll failed: ${response.statusText}`);
        }

        const prediction: ReplicatePrediction = await response.json();

        console.log(`Prediction ${predictionId} status: ${prediction.status}`);

        if (prediction.status === "succeeded") {
            return prediction;
        }

        if (prediction.status === "failed" || prediction.status === "canceled") {
            throw new Error(prediction.error || "Prediction failed");
        }

        await new Promise(resolve => setTimeout(resolve, intervalMs));
    }

    throw new Error("Prediction timeout");
}

/**
 * Build jewelry-specific prompt from parameters
 */
export function buildJewelryPromptFromParams(params: {
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
