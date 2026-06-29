/**
 * AI API Integration Helpers for ORNAMIS
 * 
 * This file contains utility functions for integrating various AI APIs
 * for jewelry design generation and AR virtual try-on features.
 * 
 * Supported APIs:
 * - BLNG.ai (Jewelry Design)
 * - OpenArt.ai (General AI Art)
 * - Dzine.ai (Jewelry Rendering)
 * - Banuba (AR Try-On)
 * - TensorFlow.js (Face Detection)
 */

// ============================================================================
// AI DESIGN GENERATION
// ============================================================================

export interface DesignParams {
  prompt: string;
  mode: "text" | "sketch" | "image";
  jewelryType: string;
  style: string;
  material: string;
  gemstone: string;
  complexity: number;
  sketchData?: string;
  referenceImage?: string;
}

export interface GeneratedDesign {
  images: string[];
  metadata?: {
    model: string;
    processingTime: number;
    cost?: number;
  };
}

/**
 * Builds an enhanced prompt for better AI generation results
 */
export function buildEnhancedPrompt(params: DesignParams): string {
  let prompt = params.prompt;

  // Add jewelry metadata
  prompt += `, ${params.jewelryType} jewelry design`;
  prompt += `, ${params.style} style`;
  prompt += `, ${params.material} material`;

  if (params.gemstone && params.gemstone !== "none") {
    prompt += `, ${params.gemstone} gemstone`;
  }

  // Add complexity descriptors
  if (params.complexity < 35) {
    prompt += ", simple and minimalist design";
  } else if (params.complexity > 65) {
    prompt += ", intricate and detailed design, ornate patterns";
  } else {
    prompt += ", balanced design with moderate detail";
  }

  // Add quality modifiers
  prompt += ", professional product photography";
  prompt += ", studio lighting, white background";
  prompt += ", high resolution, 4k quality";
  prompt += ", photorealistic rendering";

  return prompt;
}

/**
 * Generate jewelry design using BLNG.ai API
 */
export async function generateWithBLNG(
  params: DesignParams
): Promise<GeneratedDesign> {
  const apiKey = process.env.BLNG_API_KEY;
  if (!apiKey) {
    throw new Error("BLNG_API_KEY not configured");
  }

  const enhancedPrompt = buildEnhancedPrompt(params);

  const payload: any = {
    prompt: enhancedPrompt,
    model: "jewelry-design-v2",
    num_outputs: 4,
    resolution: "1024x1024",
    style: params.style,
    material: params.material,
  };

  // Add mode-specific parameters
  if (params.mode === "sketch" && params.sketchData) {
    payload.init_image = params.sketchData;
    payload.strength = 0.7; // How much to transform the sketch
  } else if (params.mode === "image" && params.referenceImage) {
    payload.reference_image = params.referenceImage;
    payload.style_transfer_strength = 0.6;
  }

  const startTime = Date.now();

  const response = await fetch("https://api.blng.ai/v1/generate", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`BLNG API error: ${response.statusText}`);
  }

  const data = await response.json();
  const processingTime = Date.now() - startTime;

  return {
    images: data.images || [],
    metadata: {
      model: "BLNG Jewelry Design v2",
      processingTime,
      cost: data.cost,
    },
  };
}

/**
 * Generate jewelry design using OpenArt.ai API
 */
export async function generateWithOpenArt(
  params: DesignParams
): Promise<GeneratedDesign> {
  const apiKey = process.env.OPENART_API_KEY;
  if (!apiKey) {
    throw new Error("OPENART_API_KEY not configured");
  }

  const enhancedPrompt = buildEnhancedPrompt(params);

  const response = await fetch("https://api.openart.ai/v1/generate", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: enhancedPrompt,
      negative_prompt: "blurry, low quality, distorted, ugly",
      template_id: "jewelry_product_photography",
      width: 1024,
      height: 1024,
      num_images: 4,
      guidance_scale: 7.5,
      num_inference_steps: 50,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenArt API error: ${response.statusText}`);
  }

  const data = await response.json();

  return {
    images: data.images || [],
    metadata: {
      model: "OpenArt Jewelry",
      processingTime: data.processing_time || 0,
    },
  };
}

/**
 * Fallback function - generates demo designs using Unsplash
 * Use this during development or when API keys are not available
 */
export async function generateDemoDesigns(
  params: DesignParams
): Promise<GeneratedDesign> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const searchQuery = `luxury ${params.jewelryType} ${params.material} jewelry`;

  const designs = [
    `https://images.unsplash.com/photo-1630534591724-dba93846b629?w=1024&q=80`,
    `https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1024&q=80`,
    `https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1024&q=80`,
    `https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1024&q=80`,
  ];

  return {
    images: designs,
    metadata: {
      model: "Demo Mode (Unsplash)",
      processingTime: 2000,
    },
  };
}

/**
 * Main generation function - automatically selects best available API
 */
export async function generateJewelryDesign(
  params: DesignParams
): Promise<GeneratedDesign> {
  // Try APIs in order of preference
  try {
    if (process.env.BLNG_API_KEY) {
      console.log("Using BLNG.ai for generation...");
      return await generateWithBLNG(params);
    } else if (process.env.OPENART_API_KEY) {
      console.log("Using OpenArt.ai for generation...");
      return await generateWithOpenArt(params);
    } else {
      console.log("No API keys found, using demo mode...");
      return await generateDemoDesigns(params);
    }
  } catch (error) {
    console.error("AI generation failed, falling back to demo:", error);
    return await generateDemoDesigns(params);
  }
}

// ============================================================================
// AR VIRTUAL TRY-ON
// ============================================================================

export interface ARConfig {
  provider: "banuba" | "tensorflow" | "simple";
  faceDetection: boolean;
  landmarkTracking: boolean;
  lightingAdjustment: boolean;
}

/**
 * Initialize AR SDK based on provider
 */
export async function initializeAR(
  config: ARConfig,
  videoElement: HTMLVideoElement,
  canvasElement: HTMLCanvasElement
): Promise<any> {
  if (config.provider === "banuba") {
    return await initializeBanuba(videoElement, canvasElement);
  } else if (config.provider === "tensorflow") {
    return await initializeTensorFlow();
  } else {
    return null; // Simple overlay mode
  }
}

/**
 * Initialize Banuba WebAR SDK
 */
async function initializeBanuba(
  videoElement: HTMLVideoElement,
  canvasElement: HTMLCanvasElement
): Promise<any> {
  try {
    // @ts-ignore - Banuba SDK loaded via CDN or npm
    const { BanubaSDK } = await import("@banuba/webar");

    const sdk = await BanubaSDK.init({
      clientToken: process.env.NEXT_PUBLIC_BANUBA_TOKEN,
      devicePixelRatio: window.devicePixelRatio || 1,
      preferredRenderBackend: "WEBGL2",
    });

    const player = await sdk.play({
      video: videoElement,
      canvas: canvasElement,
    });

    console.log("Banuba AR initialized successfully");
    return { sdk, player };
  } catch (error) {
    console.error("Banuba initialization failed:", error);
    throw error;
  }
}

/**
 * Initialize TensorFlow.js Face Detection
 */
async function initializeTensorFlow(): Promise<any> {
  try {
    // @ts-ignore - TensorFlow loaded via CDN or npm
    const faceLandmarksDetection = await import(
      "@tensorflow-models/face-landmarks-detection"
    );
    await import("@tensorflow/tfjs-core");
    await import("@tensorflow/tfjs-backend-webgl");

    const model = await faceLandmarksDetection.load(
      faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
      {
        maxFaces: 1,
        shouldLoadIrisModel: false,
      }
    );

    console.log("TensorFlow face detection initialized");
    return model;
  } catch (error) {
    console.error("TensorFlow initialization failed:", error);
    throw error;
  }
}

/**
 * Calculate jewelry position based on face landmarks
 */
export interface FaceLandmarks {
  noseTip: { x: number; y: number };
  leftEar: { x: number; y: number };
  rightEar: { x: number; y: number };
  chin: { x: number; y: number };
  foreheadCenter: { x: number; y: number };
}

export function calculateJewelryPosition(
  landmarks: FaceLandmarks,
  jewelryType: string
): { x: number; y: number; scale: number; rotation: number } {
  switch (jewelryType) {
    case "necklace":
      return {
        x: landmarks.noseTip.x,
        y: landmarks.chin.y + 80,
        scale: 1.0,
        rotation: 0,
      };

    case "earrings":
      // Return position for both ears
      return {
        x: (landmarks.leftEar.x + landmarks.rightEar.x) / 2,
        y: (landmarks.leftEar.y + landmarks.rightEar.y) / 2,
        scale: 0.6,
        rotation: 0,
      };

    case "ring":
      // Position at bottom of frame (hand assumed)
      return {
        x: landmarks.noseTip.x,
        y: landmarks.foreheadCenter.y + 400,
        scale: 0.8,
        rotation: 0,
      };

    default:
      return {
        x: landmarks.noseTip.x,
        y: landmarks.noseTip.y + 100,
        scale: 1.0,
        rotation: 0,
      };
  }
}

/**
 * Load jewelry AR effect (for Banuba)
 */
export async function loadJewelryEffect(
  sdk: any,
  productId: string,
  category: string
): Promise<void> {
  const effectPath = `/effects/${category}-${productId}.zip`;

  try {
    await sdk.addEffect(effectPath);
    console.log(`Loaded effect: ${effectPath}`);
  } catch (error) {
    console.error(`Failed to load effect ${effectPath}:`, error);
    throw error;
  }
}

// ============================================================================
// IMAGE PROCESSING UTILITIES
// ============================================================================

/**
 * Convert canvas to downloadable image
 */
export function downloadCanvasAsImage(
  canvas: HTMLCanvasElement,
  filename: string = "jewelry-design.png"
): void {
  canvas.toBlob((blob) => {
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}

/**
 * Resize image to target dimensions
 */
export function resizeImage(
  imageUrl: string,
  maxWidth: number,
  maxHeight: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.9));
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = imageUrl;
  });
}

/**
 * Convert image to base64
 */
export function imageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ============================================================================
// COST TRACKING & ANALYTICS
// ============================================================================

export interface UsageMetrics {
  totalGenerations: number;
  totalCost: number;
  averageProcessingTime: number;
  successRate: number;
}

/**
 * Track AI generation usage
 */
export function trackGeneration(
  userId: string,
  params: DesignParams,
  result: GeneratedDesign
): void {
  // Log to analytics service
  console.log("AI Generation:", {
    userId,
    timestamp: new Date().toISOString(),
    mode: params.mode,
    jewelryType: params.jewelryType,
    model: result.metadata?.model,
    processingTime: result.metadata?.processingTime,
    cost: result.metadata?.cost,
    success: result.images.length > 0,
  });

  // TODO: Send to analytics backend
  // Example: sendToAnalytics('ai_generation', { ... })
}

/**
 * Get usage metrics for user/session
 */
export async function getUsageMetrics(userId: string): Promise<UsageMetrics> {
  // TODO: Fetch from analytics backend
  return {
    totalGenerations: 0,
    totalCost: 0,
    averageProcessingTime: 0,
    successRate: 100,
  };
}
