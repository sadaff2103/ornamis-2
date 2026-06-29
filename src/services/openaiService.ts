import { DesignRequest, GeneratedDesign } from "../types/aiDesigner.types";
import { generateImages as generateUnsplashImages, buildJewelryPrompt } from "./unsplashService";

export async function generateDesignFromText(
    request: DesignRequest
): Promise<GeneratedDesign> {
    if (!request.prompt) {
        throw new Error("Text prompt is required");
    }

    const jewelryPrompt = buildJewelryPrompt({
        type: request.parameters.jewelryType,
        style: request.parameters.style,
        material: request.parameters.material,
        gemstone: request.parameters.gemstone,
        description: request.prompt,
    });

    // Get professional jewelry images from Unsplash
    const variations = await generateUnsplashImages(jewelryPrompt, 4);

    return {
        id: generateId(),
        imageUrl: variations[0],
        prompt: request.prompt,
        parameters: request.parameters,
        createdAt: new Date(),
        variations,
    };
}

export async function generateDesignFromSketch(
    request: DesignRequest
): Promise<GeneratedDesign> {
    if (!request.sketchData) {
        throw new Error("Sketch data is required");
    }

    const jewelryPrompt = buildJewelryPrompt({
        type: request.parameters.jewelryType,
        style: request.parameters.style,
        material: request.parameters.material,
        gemstone: request.parameters.gemstone,
        description: "sketch-based jewelry design",
    });

    // Get professional jewelry images from Unsplash
    const variations = await generateUnsplashImages(jewelryPrompt, 4);

    return {
        id: generateId(),
        imageUrl: variations[0],
        prompt: "Sketch-based design",
        parameters: request.parameters,
        createdAt: new Date(),
        variations,
    };
}

export async function generateDesignFromImage(
    request: DesignRequest
): Promise<GeneratedDesign> {
    if (!request.referenceImage) {
        throw new Error("Reference image is required");
    }

    const jewelryPrompt = buildJewelryPrompt({
        type: request.parameters.jewelryType,
        style: request.parameters.style,
        material: request.parameters.material,
        gemstone: request.parameters.gemstone,
        description: "reference-based jewelry design",
    });

    // Get professional jewelry images from Unsplash
    const variations = await generateUnsplashImages(jewelryPrompt, 4);

    return {
        id: generateId(),
        imageUrl: variations[0],
        prompt: "Reference-based design",
        parameters: request.parameters,
        createdAt: new Date(),
        variations,
    };
}

function generateId(): string {
    return `design_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function clearCache(): void {
    // Cache clearing not implemented for Pollinations service
    console.log("Cache clear requested");
}
