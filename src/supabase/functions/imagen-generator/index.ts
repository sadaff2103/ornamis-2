/**
 * Supabase Edge Function: imagen-generator
 * Proxies requests to Replicate API for Stable Diffusion XL (FREE)
 * 
 * Environment Variables Required:
 * - REPLICATE_API_TOKEN: Your Replicate API token
 */

// Deno types for Supabase Edge Functions
declare const Deno: {
    env: {
        get(key: string): string | undefined;
    };
    serve(handler: (req: Request) => Promise<Response> | Response): void;
};

// CORS headers for browser access
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// SDXL model version (free tier compatible)
const SDXL_VERSION = "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b";
const REPLICATE_API_URL = "https://api.replicate.com/v1/predictions";

interface GenerationRequest {
    prompt: string;
    aspect_ratio?: string;
}

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
 * Build an optimized jewelry design prompt for Stable Diffusion
 */
function buildJewelryPrompt(prompt: string): string {
    return `Professional jewelry product photography, studio lighting on white background, high-end luxury jewelry, ${prompt}, ultra-detailed, sharp focus, 8K resolution, photorealistic, commercial product photography, elegant, high quality`;
}

/**
 * Poll Replicate API until prediction completes
 */
async function pollForCompletion(
    predictionUrl: string,
    apiToken: string,
    maxAttempts = 120,
    intervalMs = 1500
): Promise<ReplicatePrediction> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const response = await fetch(predictionUrl, {
            headers: {
                "Authorization": `Bearer ${apiToken}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to poll prediction: ${response.status}`);
        }

        const prediction: ReplicatePrediction = await response.json();

        if (prediction.status === "succeeded") {
            return prediction;
        }

        if (prediction.status === "failed" || prediction.status === "canceled") {
            throw new Error(prediction.error || "Prediction failed");
        }

        await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }

    throw new Error("Prediction timed out");
}

/**
 * Main handler
 */
export default async function handler(req: Request): Promise<Response> {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response(null, {
            status: 204,
            headers: corsHeaders,
        });
    }

    // Only allow POST requests
    if (req.method !== "POST") {
        return new Response(
            JSON.stringify({ error: "Method not allowed" }),
            {
                status: 405,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    }

    try {
        const apiToken = Deno.env.get("REPLICATE_API_TOKEN");

        if (!apiToken || apiToken === "your_replicate_token_here") {
            return new Response(
                JSON.stringify({
                    success: true,
                    imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
                    prompt: "Demo jewelry design (API not configured)",
                    source: "demo",
                }),
                {
                    status: 200,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        const body: GenerationRequest = await req.json();

        if (!body.prompt) {
            return new Response(
                JSON.stringify({ error: "Prompt is required" }),
                {
                    status: 400,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        const enhancedPrompt = buildJewelryPrompt(body.prompt);

        // Create prediction with SDXL
        const createResponse = await fetch(REPLICATE_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                version: SDXL_VERSION,
                input: {
                    prompt: enhancedPrompt,
                    negative_prompt: "blurry, low quality, distorted, ugly, bad anatomy, watermark, text, logo",
                    width: 1024,
                    height: 1024,
                    num_outputs: 1,
                    scheduler: "K_EULER",
                    num_inference_steps: 25,
                    guidance_scale: 7.5,
                },
            }),
        });

        if (!createResponse.ok) {
            const errorData = await createResponse.json();
            throw new Error(errorData.detail || `Replicate API error: ${createResponse.status}`);
        }

        const prediction: ReplicatePrediction = await createResponse.json();

        const completedPrediction = await pollForCompletion(
            prediction.urls?.get || `https://api.replicate.com/v1/predictions/${prediction.id}`,
            apiToken
        );

        let imageUrl: string;
        if (Array.isArray(completedPrediction.output)) {
            imageUrl = completedPrediction.output[0];
        } else if (typeof completedPrediction.output === "string") {
            imageUrl = completedPrediction.output;
        } else {
            throw new Error("No output image from Replicate");
        }

        return new Response(
            JSON.stringify({
                success: true,
                imageUrl,
                prompt: body.prompt,
                enhancedPrompt,
                source: "replicate",
                predictionId: prediction.id,
            }),
            {
                status: 200,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Image generator error:", error);

        return new Response(
            JSON.stringify({
                success: true,
                imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
                prompt: "Demo jewelry design (generation failed)",
                source: "demo",
                error: error instanceof Error ? error.message : "Unknown error",
            }),
            {
                status: 200,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    }
}

// Deno Deploy entry point
Deno.serve(handler);
