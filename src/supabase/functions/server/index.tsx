import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import * as kv from "./kv_store.tsx";
import designGeneratorApp from "./design-generator.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Supabase client for auth
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

// Health check endpoint
app.get("/make-server-75af7cc1/health", (c) => {
  return c.json({ status: "ok", message: "ORNAMIS server is running" });
});

// Sign up endpoint
app.post("/make-server-75af7cc1/signup", async (c) => {
  try {
    const { email, password, name, phone, role } = await c.req.json();

    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, phone, role },
      // Automatically confirm the user's email since an email server hasn't been configured
      email_confirm: true,
    });

    if (error) {
      console.error("Signup error:", error);
      return c.json({ error: error.message }, 400);
    }

    // Store additional user data in KV store
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email,
      name,
      phone,
      role,
      createdAt: new Date().toISOString(),
      orders: [],
      wishlist: [],
      cart: [],
    });

    return c.json({ 
      success: true, 
      user: { 
        id: data.user.id, 
        email, 
        name, 
        role 
      } 
    });
  } catch (error: any) {
    console.error("Signup error during processing:", error);
    return c.json({ error: "Failed to create account", details: error.message }, 500);
  }
});

// Login endpoint
app.post("/make-server-75af7cc1/login", async (c) => {
  try {
    const { email, password } = await c.req.json();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error);
      return c.json({ error: error.message }, 401);
    }

    // Get user data from KV store
    const userData = await kv.get(`user:${data.user.id}`);

    return c.json({ 
      success: true,
      accessToken: data.session.access_token,
      user: userData || {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || email.split('@')[0],
        role: data.user.user_metadata?.role || 'customer',
      }
    });
  } catch (error: any) {
    console.error("Login error during processing:", error);
    return c.json({ error: "Failed to login", details: error.message }, 500);
  }
});

// Get user profile (protected route)
app.get("/make-server-75af7cc1/profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userData = await kv.get(`user:${user.id}`);

    return c.json({ 
      success: true,
      user: userData || {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name,
        role: user.user_metadata?.role,
      }
    });
  } catch (error: any) {
    console.error("Profile fetch error:", error);
    return c.json({ error: "Failed to fetch profile", details: error.message }, 500);
  }
});

// Products endpoints
app.get("/make-server-75af7cc1/products", async (c) => {
  try {
    const products = await kv.getByPrefix("product:");
    return c.json({ success: true, products });
  } catch (error: any) {
    console.error("Products fetch error:", error);
    return c.json({ error: "Failed to fetch products", details: error.message }, 500);
  }
});

// Add to cart (protected)
app.post("/make-server-75af7cc1/cart/add", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { productId, quantity } = await c.req.json();
    
    const userData = await kv.get(`user:${user.id}`);
    if (!userData) {
      return c.json({ error: "User not found" }, 404);
    }

    // Add to cart
    userData.cart = userData.cart || [];
    const existingItem = userData.cart.find((item: any) => item.productId === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      userData.cart.push({ productId, quantity, addedAt: new Date().toISOString() });
    }

    await kv.set(`user:${user.id}`, userData);

    return c.json({ success: true, cart: userData.cart });
  } catch (error: any) {
    console.error("Add to cart error:", error);
    return c.json({ error: "Failed to add to cart", details: error.message }, 500);
  }
});

// Add to wishlist (protected)
app.post("/make-server-75af7cc1/wishlist/add", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { productId } = await c.req.json();
    
    const userData = await kv.get(`user:${user.id}`);
    if (!userData) {
      return c.json({ error: "User not found" }, 404);
    }

    // Add to wishlist
    userData.wishlist = userData.wishlist || [];
    if (!userData.wishlist.includes(productId)) {
      userData.wishlist.push(productId);
    }

    await kv.set(`user:${user.id}`, userData);

    return c.json({ success: true, wishlist: userData.wishlist });
  } catch (error: any) {
    console.error("Add to wishlist error:", error);
    return c.json({ error: "Failed to add to wishlist", details: error.message }, 500);
  }
});

// AI Design generation endpoint
app.post("/make-server-75af7cc1/ai-design", async (c) => {
  try {
    const { prompt, jewelryType, style, material, complexity } = await c.req.json();

    // Simulate AI design generation (in production, this would call an AI service)
    const designId = `design_${Date.now()}`;
    const design = {
      id: designId,
      prompt,
      jewelryType,
      style,
      material,
      complexity,
      imageUrl: "https://images.unsplash.com/photo-1758995115842-e90d363a640c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      createdAt: new Date().toISOString(),
    };

    // Store the design
    await kv.set(`design:${designId}`, design);

    return c.json({ success: true, design });
  } catch (error: any) {
    console.error("AI design generation error:", error);
    return c.json({ error: "Failed to generate design", details: error.message }, 500);
  }
});

// Save AI design (protected)
app.post("/make-server-75af7cc1/designs/save", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { designId } = await c.req.json();
    
    const userData = await kv.get(`user:${user.id}`);
    if (!userData) {
      return c.json({ error: "User not found" }, 404);
    }

    // Save design to user's saved designs
    userData.savedDesigns = userData.savedDesigns || [];
    if (!userData.savedDesigns.includes(designId)) {
      userData.savedDesigns.push(designId);
    }

    await kv.set(`user:${user.id}`, userData);

    return c.json({ success: true });
  } catch (error: any) {
    console.error("Save design error:", error);
    return c.json({ error: "Failed to save design", details: error.message }, 500);
  }
});

// Design generator app
app.route("/", designGeneratorApp);

Deno.serve(app.fetch);