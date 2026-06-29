/**
 * Gemini AI Service (FREE Tier)
 * Uses Google Gemini API for smart prompt enhancement and chat responses
 * 
 * Free Tier Limits:
 * - 15 requests per minute (RPM)
 * - 1 million tokens per minute (TPM)
 * - 1,500 requests per day (RPD)
 */

export interface GeminiChatMessage {
    role: "user" | "model";
    parts: { text: string }[];
}

export interface GeminiResponse {
    success: boolean;
    text: string;
    error?: string;
}

export interface EnhancedPromptResult {
    success: boolean;
    originalPrompt: string;
    enhancedPrompt: string;
    suggestions?: string[];
    error?: string;
}

// Check if Gemini API key is configured
export function isGeminiConfigured(): boolean {
    return !!import.meta.env.VITE_GEMINI_API_KEY;
}

/**
 * Get Gemini API key from environment
 */
function getApiKey(): string | null {
    return import.meta.env.VITE_GEMINI_API_KEY || null;
}

/**
 * Call Gemini API directly (uses free tier)
 */
async function callGeminiAPI(prompt: string, systemPrompt?: string): Promise<string> {
    const apiKey = getApiKey();

    if (!apiKey) {
        throw new Error("Gemini API key not configured");
    }

    // Using gemini-2.0-flash (widely available, fast)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const contents: GeminiChatMessage[] = [];

    // Add system instruction if provided
    if (systemPrompt) {
        contents.push({
            role: "user",
            parts: [{ text: systemPrompt }]
        });
        contents.push({
            role: "model",
            parts: [{ text: "Understood. I will follow these instructions." }]
        });
    }

    // Add user prompt
    contents.push({
        role: "user",
        parts: [{ text: prompt }]
    });

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            contents,
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
            },
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.error?.message || `Gemini API error: ${response.status}`
        );
    }

    const data = await response.json();

    // Extract text from response
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
        throw new Error("No response generated from Gemini");
    }

    return text;
}

/**
 * Enhance a jewelry design prompt for better image generation
 */
export async function enhanceJewelryPrompt(
    userPrompt: string
): Promise<EnhancedPromptResult> {
    const systemPrompt = `You are an expert jewelry designer assistant. Your task is to enhance user prompts for AI image generation.

When given a jewelry description, you should:
1. Add professional photography terms (studio lighting, white background, macro shot)
2. Enhance material descriptions (e.g., "gold" → "polished 18k yellow gold with mirror finish")
3. Add gemstone details if mentioned (cut, clarity, setting style)
4. Include luxury/premium descriptors
5. Keep the enhanced prompt under 150 words

IMPORTANT: Only output the enhanced prompt, nothing else. Do not include explanations.`;

    try {
        if (!isGeminiConfigured()) {
            // Fallback: return a basic enhancement without API
            return {
                success: true,
                originalPrompt: userPrompt,
                enhancedPrompt: `Professional jewelry product photography, studio lighting, white background, ${userPrompt}, ultra-detailed, high-end luxury, sharp focus, 8K resolution`,
            };
        }

        const enhancedPrompt = await callGeminiAPI(userPrompt, systemPrompt);

        return {
            success: true,
            originalPrompt: userPrompt,
            enhancedPrompt: enhancedPrompt.trim(),
        };
    } catch (error) {
        console.warn("Gemini enhancement failed:", error);

        // Fallback enhancement
        return {
            success: true,
            originalPrompt: userPrompt,
            enhancedPrompt: `Professional jewelry product photography, studio lighting, white background, ${userPrompt}, ultra-detailed, high-end luxury, sharp focus, 8K resolution`,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

/**
 * Generate design suggestions based on user preferences
 */
export async function generateDesignSuggestions(
    preferences: {
        jewelryType?: string;
        style?: string;
        material?: string;
        occasion?: string;
    }
): Promise<string[]> {
    const { jewelryType, style, material, occasion } = preferences;

    const prompt = `Based on these preferences, suggest 4 unique jewelry design ideas:
- Type: ${jewelryType || "any"}
- Style: ${style || "any"}
- Material: ${material || "any"}
- Occasion: ${occasion || "any"}

Return exactly 4 design descriptions, one per line. Each should be a complete, detailed prompt for jewelry image generation. No numbering, no bullet points, just the descriptions.`;

    try {
        if (!isGeminiConfigured()) {
            // Return default suggestions
            return getDefaultSuggestions(jewelryType);
        }

        const response = await callGeminiAPI(prompt);
        const suggestions = response
            .split("\n")
            .map(line => line.trim())
            .filter(line => line.length > 10)
            .slice(0, 4);

        return suggestions.length > 0 ? suggestions : getDefaultSuggestions(jewelryType);
    } catch (error) {
        console.warn("Gemini suggestions failed:", error);
        return getDefaultSuggestions(jewelryType);
    }
}

/**
 * Chat with the AI designer for conversational interactions
 */
export async function chatWithDesigner(
    userMessage: string,
    conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>
): Promise<GeminiResponse> {
    const systemPrompt = `You are an expert AI jewelry designer assistant for a luxury jewelry brand called Ornamis. You help customers:
- Design custom jewelry pieces
- Understand jewelry terminology
- Choose appropriate gemstones and materials
- Make style recommendations

Be helpful, professional, and enthusiastic about jewelry design. Keep responses concise (2-3 sentences) unless more detail is needed.

If the user describes a jewelry design they want, acknowledge their request and let them know you'll create it for them.`;

    try {
        if (!isGeminiConfigured()) {
            return {
                success: false,
                text: "",
                error: "Gemini API not configured. Please add VITE_GEMINI_API_KEY to your environment.",
            };
        }

        // Build context from conversation history
        let contextPrompt = userMessage;
        if (conversationHistory && conversationHistory.length > 0) {
            const recentHistory = conversationHistory.slice(-4); // Last 4 messages
            const historyContext = recentHistory
                .map(msg => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
                .join("\n");
            contextPrompt = `Previous conversation:\n${historyContext}\n\nUser's new message: ${userMessage}`;
        }

        const response = await callGeminiAPI(contextPrompt, systemPrompt);

        return {
            success: true,
            text: response.trim(),
        };
    } catch (error) {
        console.error("Gemini chat error:", error);
        return {
            success: false,
            text: "",
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

/**
 * Analyze a user prompt to extract jewelry details
 */
export async function analyzePrompt(userPrompt: string): Promise<{
    jewelryType: string | null;
    material: string | null;
    gemstone: string | null;
    style: string | null;
    color: string | null;
}> {
    const prompt = `Analyze this jewelry description and extract details in JSON format:
"${userPrompt}"

Return ONLY valid JSON with these fields (use null if not mentioned):
{
  "jewelryType": "ring/necklace/bracelet/earrings/pendant/etc or null",
  "material": "gold/silver/platinum/etc or null",
  "gemstone": "diamond/emerald/ruby/etc or null",
  "style": "modern/vintage/minimalist/etc or null",
  "color": "gold/silver/rose gold/etc or null"
}`;

    try {
        if (!isGeminiConfigured()) {
            // Basic keyword extraction
            return extractKeywordsLocally(userPrompt);
        }

        const response = await callGeminiAPI(prompt);

        // Extract JSON from response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        return extractKeywordsLocally(userPrompt);
    } catch (error) {
        console.warn("Gemini analysis failed:", error);
        return extractKeywordsLocally(userPrompt);
    }
}

/**
 * Local keyword extraction fallback
 */
function extractKeywordsLocally(prompt: string): {
    jewelryType: string | null;
    material: string | null;
    gemstone: string | null;
    style: string | null;
    color: string | null;
} {
    const lower = prompt.toLowerCase();

    const jewelryTypes = ["ring", "necklace", "bracelet", "earrings", "pendant", "anklet", "bangle", "brooch", "chain", "choker"];
    const materials = ["gold", "silver", "platinum", "titanium", "stainless steel", "brass", "copper"];
    const gemstones = ["diamond", "emerald", "ruby", "sapphire", "pearl", "opal", "amethyst", "topaz", "turquoise", "garnet"];
    const styles = ["modern", "vintage", "minimalist", "art deco", "bohemian", "classic", "contemporary", "traditional", "elegant"];
    const colors = ["rose gold", "yellow gold", "white gold", "silver", "gold", "black", "blue", "green", "red"];

    return {
        jewelryType: jewelryTypes.find(t => lower.includes(t)) || null,
        material: materials.find(m => lower.includes(m)) || null,
        gemstone: gemstones.find(g => lower.includes(g)) || null,
        style: styles.find(s => lower.includes(s)) || null,
        color: colors.find(c => lower.includes(c)) || null,
    };
}

/**
 * Default suggestions when API is not available
 */
function getDefaultSuggestions(jewelryType?: string): string[] {
    const suggestions: Record<string, string[]> = {
        ring: [
            "Elegant solitaire diamond ring in 18k white gold with cathedral setting",
            "Vintage-inspired rose gold band with emerald center stone and filigree details",
            "Modern minimalist platinum signet ring with brushed finish",
            "Art deco engagement ring with sapphire surrounded by diamond pavé",
        ],
        necklace: [
            "Delicate gold chain necklace with floating diamond pendant",
            "Statement pearl collar necklace with gold clasp",
            "Layered silver chains with gemstone charms",
            "Elegant tennis necklace with graduated diamonds",
        ],
        bracelet: [
            "Classic gold tennis bracelet with round brilliant diamonds",
            "Bohemian leather and turquoise cuff bracelet",
            "Sleek platinum bangle with embedded sapphires",
            "Charm bracelet with personalized gold pendants",
        ],
        earrings: [
            "Diamond stud earrings in white gold bezel setting",
            "Elegant pearl drop earrings with gold trim",
            "Modern geometric hoop earrings in rose gold",
            "Vintage chandelier earrings with emerald and diamonds",
        ],
        default: [
            "Elegant gold bracelet with diamond geometric patterns",
            "Vintage silver ring with a large emerald center stone",
            "Modern minimalist rose gold hoop earrings",
            "Art deco platinum pendant with sapphire accents",
        ],
    };

    return suggestions[jewelryType?.toLowerCase() || "default"] || suggestions.default;
}
