import { DesignParameters } from "../types/aiDesigner.types";

/**
 * Build an optimized prompt for OpenAI API based on design parameters
 */
export function buildDesignPrompt(
    userPrompt: string,
    parameters: DesignParameters
): string {
    const { jewelryType, style, material, gemstone, complexity } = parameters;

    // Complexity level descriptions
    const complexityLevel =
        complexity < 33
            ? "simple and minimalist"
            : complexity < 66
                ? "moderately detailed"
                : "highly intricate and ornate";

    // Build structured prompt
    const prompt = `Create a photorealistic 3D render of a ${style} ${jewelryType} with the following specifications:

DESIGN DESCRIPTION: ${userPrompt}

SPECIFICATIONS:
- Material: ${material.replace("-", " ")}
- Primary Gemstone: ${gemstone === "none" ? "no gemstones" : gemstone}
- Style: ${style}
- Complexity: ${complexityLevel}
- Type: ${jewelryType}

RENDERING REQUIREMENTS:
- Ultra-high quality photorealistic 3D render
- Professional jewelry photography lighting
- White or subtle gradient background
- Sharp focus on details
- Show intricate metalwork and gemstone facets
- Studio lighting with soft shadows
- 4K resolution quality

The design should be elegant, wearable, and showcase the beauty of ${material} and ${gemstone !== "none" ? gemstone : "the metalwork"}.`;

    return prompt;
}

/**
 * Build prompt for sketch-to-design conversion
 */
export function buildSketchPrompt(parameters: DesignParameters): string {
    const { jewelryType, style, material, gemstone } = parameters;

    return `Convert this hand-drawn sketch into a photorealistic 3D render of a ${style} ${jewelryType}.

SPECIFICATIONS:
- Material: ${material.replace("-", " ")}
- Gemstone: ${gemstone === "none" ? "no gemstones" : gemstone}
- Style: ${style}

INSTRUCTIONS:
- Interpret the sketch's basic shapes and design intent
- Transform it into a professional jewelry render
- Maintain the core design concept from the sketch
- Add realistic materials, lighting, and details
- Create a wearable, elegant piece
- Use professional jewelry photography lighting
- White or subtle background

The final render should look like a high-end jewelry catalog photo while preserving the sketch's design essence.`;
}

/**
 * Build prompt for image-to-design conversion
 */
export function buildImagePrompt(parameters: DesignParameters): string {
    const { jewelryType, style, material, gemstone } = parameters;

    return `Create a ${style} ${jewelryType} inspired by the reference image provided.

SPECIFICATIONS:
- Material: ${material.replace("-", " ")}
- Gemstone: ${gemstone === "none" ? "no gemstones" : gemstone}
- Style: ${style}

INSTRUCTIONS:
- Draw inspiration from the reference image's design elements
- Create a unique interpretation, not an exact copy
- Incorporate similar aesthetic qualities and motifs
- Render as a photorealistic 3D jewelry piece
- Professional studio lighting
- White or subtle gradient background
- High-end jewelry catalog quality

The design should capture the essence and style of the reference while being an original creation.`;
}

/**
 * Build prompt for generating design variations
 */
export function buildVariationPrompt(
    originalPrompt: string,
    variationNumber: number
): string {
    return `${originalPrompt}

VARIATION ${variationNumber}:
Create a unique variation of this design with subtle differences in:
- Gemstone arrangement or pattern
- Decorative details and embellishments
- Proportions and scale
- Additional design elements

Maintain the core style and specifications but make it distinctly different from other variations.`;
}

/**
 * Extract design intent from user prompt
 */
export function extractDesignIntent(prompt: string): {
    hasColorMention: boolean;
    hasShapeMention: boolean;
    hasPatternMention: boolean;
    sentiment: "elegant" | "bold" | "delicate" | "statement";
} {
    const lowerPrompt = prompt.toLowerCase();

    return {
        hasColorMention: /\b(gold|silver|rose|white|yellow|color)\b/.test(lowerPrompt),
        hasShapeMention: /\b(round|square|oval|heart|pear|emerald|cushion|circle)\b/.test(lowerPrompt),
        hasPatternMention: /\b(floral|geometric|vintage|modern|pattern|design)\b/.test(lowerPrompt),
        sentiment: lowerPrompt.includes("bold") || lowerPrompt.includes("statement")
            ? "statement"
            : lowerPrompt.includes("delicate") || lowerPrompt.includes("subtle")
                ? "delicate"
                : lowerPrompt.includes("elegant") || lowerPrompt.includes("classic")
                    ? "elegant"
                    : "bold",
    };
}
