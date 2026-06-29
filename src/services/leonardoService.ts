// Leonardo AI Image Generation Service
// API Key: 242a202e-dad9-4bf9-a761-a0f769e8fde8

const LEONARDO_API_KEY = "242a202e-dad9-4bf9-a761-a0f769e8fde8";
const LEONARDO_BASE_URL = "https://cloud.leonardo.ai/api/rest/v1";

// Model: Leonardo Diffusion XL (general purpose, high quality)
const MODEL_ID = "7b592283-e8a7-4c5a-9ba6-d18c31f258b9";

// Style: Cinematic (good for jewelry renders)
const STYLE_UUID = "111dc692-d470-4eec-b791-3475abac4c46";

interface GenerationResponse {
    sdGenerationJob: {
        generationId: string;
        apiCreditCost: number;
    };
}

interface GenerationStatusResponse {
    generations_by_pk: {
        id: string;
        status: "PENDING" | "PROCESSING" | "COMPLETE" | "FAILED";
        generated_images: Array<{
            id: string;
            url: string;
            nsfw: boolean;
        }>;
    };
}

/**
 * Build an enhanced jewelry prompt from parameters
 */
export function buildJewelryPrompt(params: {
    type: string;
    style: string;
    material: string;
    gemstone: string;
    description?: string;
}): string {
    const { type, style, material, gemstone, description } = params;
    const gemPart = gemstone !== "none" ? `set with ${gemstone}` : "";
    const base = `A stunning ${style} ${material} ${type} jewelry piece ${gemPart}`.trim();
    const suffix =
        ", professional jewelry photography, macro shot, white background, ultra-detailed, 8k resolution, photorealistic render";
    return description ? `${description}, ${base}${suffix}` : `${base}${suffix}`;
}

/**
 * Submit a generation job to Leonardo AI
 */
async function submitGeneration(
    prompt: string,
    numImages: number = 4
): Promise<string> {
    const response = await fetch(`${LEONARDO_BASE_URL}/generations`, {
        method: "POST",
        headers: {
            accept: "application/json",
            authorization: `Bearer ${LEONARDO_API_KEY}`,
            "content-type": "application/json",
        },
        body: JSON.stringify({
            alchemy: false,
            height: 1024,
            width: 1024,
            modelId: MODEL_ID,
            contrast: 3.5,
            num_images: numImages,
            styleUUID: STYLE_UUID,
            prompt,
            ultra: false,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `Leonardo API error (${response.status}): ${errorText}`
        );
    }

    const data: GenerationResponse = await response.json();
    return data.sdGenerationJob.generationId;
}

/**
 * Poll for generation status until complete or failed
 */
async function pollGeneration(
    generationId: string,
    maxAttempts: number = 30,
    intervalMs: number = 2000
): Promise<string[]> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        await new Promise((resolve) => setTimeout(resolve, intervalMs));

        const response = await fetch(
            `${LEONARDO_BASE_URL}/generations/${generationId}`,
            {
                headers: {
                    accept: "application/json",
                    authorization: `Bearer ${LEONARDO_API_KEY}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch generation status: ${response.status}`);
        }

        const data: GenerationStatusResponse = await response.json();
        const generation = data.generations_by_pk;

        if (generation.status === "COMPLETE") {
            const urls = generation.generated_images
                .filter((img) => !img.nsfw)
                .map((img) => img.url);
            if (urls.length === 0) {
                throw new Error("No images were generated (all were filtered).");
            }
            return urls;
        }

        if (generation.status === "FAILED") {
            throw new Error("Image generation failed on the Leonardo AI side.");
        }

        // PENDING or PROCESSING — keep polling
    }

    throw new Error(
        "Generation timed out. Please try again."
    );
}

/**
 * Main entry point: generate images and return their URLs
 */
export async function generateImages(
    prompt: string,
    numImages: number = 4
): Promise<string[]> {
    const generationId = await submitGeneration(prompt, numImages);
    return pollGeneration(generationId);
}
