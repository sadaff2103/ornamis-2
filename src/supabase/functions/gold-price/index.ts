/**
 * Supabase Edge Function: gold-price
 * Fetches live gold prices from Metals-API and returns formatted JSON
 * 
 * Environment Variables Required:
 * - METALS_API_KEY: Your Metals-API access key
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
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

// Constants for conversion
const TROY_OUNCE_TO_GRAMS = 31.1034768;
const GRAMS_PER_UNIT = 10; // Price per 10 grams

// Purity ratios
const PURITY_RATIOS = {
  "24K": 1,           // Pure gold
  "22K": 22 / 24,     // 91.67%
  "18K": 18 / 24,     // 75%
};

// Fallback prices (Updated Jan 2026 market rates - per 10g in INR)
const FALLBACK_PRICES = {
  "24K": 138820,  // Current market rate
  "22K": 127250,  // (22/24) * 24K
  "18K": 104120,  // (18/24) * 24K
};

interface GoldPriceResponse {
  currency: string;
  unit: string;
  prices: {
    "24K": number;
    "22K": number;
    "18K": number;
  };
  updatedAt: string;
  source: "live" | "fallback";
}

interface MetalsAPIResponse {
  success: boolean;
  timestamp: number;
  base: string;
  rates: {
    XAU?: number;
    INR?: number;
  };
  error?: {
    code: number;
    info: string;
  };
}

/**
 * Fetch gold price from Metals-API
 */
async function fetchFromMetalsAPI(apiKey: string): Promise<number | null> {
  try {
    // Metals-API endpoint with INR base and XAU symbol
    const url = `https://metals-api.com/api/latest?access_key=${apiKey}&base=INR&symbols=XAU`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      console.error(`Metals-API HTTP error: ${response.status}`);
      return null;
    }

    const data: MetalsAPIResponse = await response.json();

    if (!data.success) {
      console.error("Metals-API error:", data.error?.info || "Unknown error");
      return null;
    }

    // XAU rate gives us how many INR per 1 XAU (troy ounce)
    // When base=INR, rates.XAU tells us: 1 INR = X XAU
    // So 1 XAU = 1/X INR
    const xauRate = data.rates?.XAU;
    if (!xauRate || xauRate === 0) {
      console.error("Invalid XAU rate from Metals-API");
      return null;
    }

    // Calculate price per troy ounce in INR
    const pricePerTroyOunce = 1 / xauRate;

    // Convert to price per gram
    const pricePerGram = pricePerTroyOunce / TROY_OUNCE_TO_GRAMS;

    // Convert to price per 10 grams (24K pure gold)
    const pricePer10Grams = pricePerGram * GRAMS_PER_UNIT;

    return Math.round(pricePer10Grams);
  } catch (error) {
    console.error("Metals-API fetch error:", error);
    return null;
  }
}

/**
 * Calculate prices for all purities
 */
function calculatePrices(gold24kPricePer10g: number): GoldPriceResponse["prices"] {
  return {
    "24K": Math.round(gold24kPricePer10g * PURITY_RATIOS["24K"]),
    "22K": Math.round(gold24kPricePer10g * PURITY_RATIOS["22K"]),
    "18K": Math.round(gold24kPricePer10g * PURITY_RATIOS["18K"]),
  };
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

  // Only allow GET requests
  if (req.method !== "GET") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  try {
    // Get API key from environment
    const apiKey = Deno.env.get("METALS_API_KEY");

    let gold24kPrice: number | null = null;
    let source: "live" | "fallback" = "fallback";

    // Try to fetch live prices if API key is available
    if (apiKey && apiKey !== "your_metals_api_key_here") {
      gold24kPrice = await fetchFromMetalsAPI(apiKey);
      if (gold24kPrice !== null) {
        source = "live";
      }
    }

    // Use fallback if API call failed or no API key
    if (gold24kPrice === null) {
      gold24kPrice = FALLBACK_PRICES["24K"];
      source = "fallback";
      console.log("Using fallback gold prices");
    }

    // Calculate all purity prices
    const prices = calculatePrices(gold24kPrice);

    // Build response
    const response: GoldPriceResponse = {
      currency: "INR",
      unit: "10g",
      prices,
      updatedAt: new Date().toISOString(),
      source,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300", // Cache for 5 minutes
      },
    });
  } catch (error) {
    console.error("Gold price endpoint error:", error);

    // Return fallback prices on error
    const fallbackResponse: GoldPriceResponse = {
      currency: "INR",
      unit: "10g",
      prices: FALLBACK_PRICES,
      updatedAt: new Date().toISOString(),
      source: "fallback",
    };

    return new Response(JSON.stringify(fallbackResponse), {
      status: 200, // Return 200 with fallback data instead of 500
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }
}

// Deno Deploy entry point
Deno.serve(handler);
