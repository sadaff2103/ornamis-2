# AI Features API Integration Guide for ORNAMIS

This document provides detailed instructions for integrating AI-powered jewelry design and AR virtual try-on APIs into the ORNAMIS platform.

## 🎨 AI Jewelry Designer Integration

### Supported AI Design APIs

#### 1. **BLNG.ai** (Recommended for Jewelry)
- **Website**: https://blng.ai
- **Features**: Specialized jewelry AI generation, text-to-design, sketch-to-render
- **Pricing**: Enterprise plans available
- **Integration**:
  ```typescript
  const response = await fetch('https://api.blng.ai/v1/generate', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.BLNG_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: userPrompt,
      model: 'jewelry-design-v2',
      style: selectedStyle,
      material: selectedMaterial,
      num_outputs: 4,
      resolution: '1024x1024'
    })
  });
  const data = await response.json();
  // data.images contains array of generated image URLs
  ```

#### 2. **OpenArt.ai**
- **Website**: https://openart.ai
- **Features**: AI art generation with jewelry templates
- **API Endpoint**: `https://api.openart.ai/v1/generate`
- **Integration**:
  ```typescript
  const response = await fetch('https://api.openart.ai/v1/generate', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENART_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: `${userPrompt}, jewelry design, professional product photography`,
      template_id: 'jewelry_render',
      width: 1024,
      height: 1024,
      num_images: 4
    })
  });
  ```

#### 3. **Dzine.ai**
- **Website**: https://www.dzine.ai
- **Features**: AI jewelry design generator with style transfer
- **Best For**: Converting sketches to photorealistic renders

#### 4. **StarryAI**
- **Website**: https://starryai.com
- **Features**: General AI art generation
- **Integration**: Use their API with jewelry-specific prompts

### Implementation in AIDesignerPage.tsx

Replace the simulation code in `handleGenerate()` function (line 70+):

```typescript
const handleGenerate = async () => {
  setIsGenerating(true);
  
  const payload = {
    mode: designMode,
    prompt: buildPrompt(), // Helper function to build enhanced prompt
    jewelryType,
    style,
    material,
    gemstone,
    complexity: complexity[0]
  };

  try {
    // Choose your AI provider
    const apiKey = process.env.NEXT_PUBLIC_BLNG_API_KEY || 
                   process.env.NEXT_PUBLIC_OPENART_API_KEY;
    
    const response = await fetch('/api/ai/generate-design', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error('Generation failed');
    
    const data = await response.json();
    setGeneratedDesigns(data.images);
    setSelectedDesign(data.images[0]);
    toast.success("Design generated successfully!");
    
  } catch (error) {
    console.error("Generation error:", error);
    toast.error("Failed to generate design. Please try again.");
  } finally {
    setIsGenerating(false);
  }
};

// Helper function to build enhanced prompt
function buildPrompt(): string {
  let enhancedPrompt = prompt;
  
  // Add metadata for better results
  enhancedPrompt += `, ${jewelryType} jewelry design`;
  enhancedPrompt += `, ${style} style`;
  enhancedPrompt += `, ${material} material`;
  if (gemstone !== 'none') enhancedPrompt += `, ${gemstone} gemstone`;
  
  // Add quality modifiers
  enhancedPrompt += ', professional product photography';
  enhancedPrompt += ', high detail, studio lighting';
  enhancedPrompt += ', white background, 4k quality';
  
  return enhancedPrompt;
}
```

### Backend API Route (`/api/ai/generate-design`)

Create `/supabase/functions/server/routes/ai.tsx`:

```typescript
import { Hono } from 'npm:hono';

const ai = new Hono();

ai.post('/generate-design', async (c) => {
  try {
    const body = await c.req.json();
    const { prompt, mode, jewelryType, style, material } = body;

    // Choose AI provider based on mode
    let images: string[] = [];

    if (mode === 'text') {
      // Text-to-image generation
      images = await generateFromText(prompt, {
        jewelryType,
        style,
        material
      });
    } else if (mode === 'sketch') {
      // Sketch-to-render
      images = await generateFromSketch(body.sketchData, {
        jewelryType,
        style,
        material
      });
    } else if (mode === 'image') {
      // Image-to-design (style transfer)
      images = await generateFromImage(body.referenceImage, {
        jewelryType,
        style,
        material
      });
    }

    return c.json({ images, success: true });
  } catch (error) {
    console.error('AI generation error:', error);
    return c.json({ error: 'Generation failed' }, 500);
  }
});

async function generateFromText(prompt: string, params: any): Promise<string[]> {
  const apiKey = Deno.env.get('BLNG_API_KEY');
  
  const response = await fetch('https://api.blng.ai/v1/generate', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: buildEnhancedPrompt(prompt, params),
      model: 'jewelry-design-v2',
      num_outputs: 4,
      resolution: '1024x1024'
    })
  });

  const data = await response.json();
  return data.images;
}

export default ai;
```

---

## 📷 AR Virtual Try-On Integration

### Supported AR APIs

#### 1. **Banuba Virtual Try-On** (Recommended)
- **Website**: https://www.banuba.com/virtual-try-on-jewelry
- **Features**: Face tracking, jewelry overlay, realistic rendering
- **SDK**: JavaScript/WebGL SDK available
- **Integration**:
  ```typescript
  import { BanubaSDK } from '@banuba/webar';

  const sdk = await BanubaSDK.init({
    clientToken: process.env.NEXT_PUBLIC_BANUBA_TOKEN,
    devicePixelRatio: window.devicePixelRatio
  });

  // Load jewelry AR effect
  await sdk.addEffect('jewelry/necklace-gold.zip');
  
  // Apply to video stream
  const player = await sdk.play({
    video: videoElement,
    canvas: canvasElement
  });
  ```

#### 2. **KiXR AR Engine**
- **Website**: https://www.kiksarvr.com
- **Features**: WebAR for jewelry, no app download required
- **Best For**: High-quality 3D jewelry models

#### 3. **Camweara SDK**
- **Website**: https://camweara.com
- **Features**: Real-time AR try-on, works on web and mobile
- **Integration**: Embed their SDK widget

#### 4. **thenewblack.ai**
- **Website**: https://thenewblack.ai/ai-design-features/ai-virtual-try-on-jewelry
- **Features**: AI-powered virtual try-on with photo upload

### Implementation in ARTryOnPage.tsx

#### Option 1: Advanced AR with Face Tracking (Banuba)

```typescript
import { useEffect, useRef } from 'react';

function ARTryOnPage() {
  const [banubaSDK, setBanubaSDK] = useState(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    initializeBanuba();
    return () => {
      banubaSDK?.destroy();
    };
  }, []);

  async function initializeBanuba() {
    try {
      // Load Banuba SDK
      const { BanubaSDK } = await import('@banuba/webar');
      
      const sdk = await BanubaSDK.init({
        clientToken: process.env.NEXT_PUBLIC_BANUBA_TOKEN,
        devicePixelRatio: window.devicePixelRatio,
        preferredRenderBackend: 'WEBGL2'
      });

      setBanubaSDK(sdk);
      
      // Start camera
      const player = await sdk.play({
        video: videoRef.current,
        canvas: canvasRef.current
      });

    } catch (error) {
      console.error('Banuba initialization failed:', error);
      toast.error('AR features unavailable');
    }
  }

  async function applyJewelryEffect(productId: string) {
    if (!banubaSDK) return;
    
    // Load jewelry effect based on category
    const effectPath = `effects/${selectedProduct.category}-${productId}.zip`;
    await banubaSDK.addEffect(effectPath);
  }

  return (
    <div className="relative">
      <video ref={videoRef} className="hidden" />
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
```

#### Option 2: Simple Overlay with TensorFlow.js (Face Detection)

```typescript
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';

const [model, setModel] = useState(null);

async function loadFaceDetection() {
  const model = await faceLandmarksDetection.load(
    faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
    { maxFaces: 1 }
  );
  setModel(model);
}

async function detectAndOverlay() {
  if (!model || !videoRef.current) return;
  
  const predictions = await model.estimateFaces({
    input: videoRef.current
  });

  if (predictions.length > 0) {
    const face = predictions[0];
    const keypoints = face.scaledMesh;
    
    // Calculate position for jewelry based on face landmarks
    const necklacePosition = calculateNecklacePosition(keypoints);
    const earringPosition = calculateEarringPosition(keypoints);
    
    // Update overlay position
    updateJewelryOverlay(necklacePosition);
  }

  requestAnimationFrame(detectAndOverlay);
}
```

---

## 🎯 Photorealistic Rendering APIs

### For Converting Sketches/CAD to Product Photos

#### 1. **JewelRender.in**
- **Website**: https://jewelrender.in
- **Features**: Professional jewelry rendering service
- **Use Case**: Upload CAD files, get photorealistic renders

#### 2. **Flair.ai**
- **Website**: https://flair.ai/product-category-features/jewelry
- **Features**: AI product photography, branded shoots
- **Integration**:
  ```typescript
  const response = await fetch('https://api.flair.ai/render', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.FLAIR_API_KEY}`,
    },
    body: formData // Include sketch/CAD file
  });
  ```

---

## 🔐 Environment Variables Setup

Add to your `.env` file:

```bash
# AI Design APIs
BLNG_API_KEY=your_blng_api_key
OPENART_API_KEY=your_openart_key
DZINE_API_KEY=your_dzine_key
STARRYAI_API_KEY=your_starryai_key

# AR Try-On APIs
NEXT_PUBLIC_BANUBA_TOKEN=your_banuba_token
KIXR_API_KEY=your_kixr_key
CAMWEARA_API_KEY=your_camweara_key

# Rendering APIs
JEWELRENDER_API_KEY=your_jewelrender_key
FLAIR_API_KEY=your_flair_key
```

---

## 📦 Required NPM Packages

Add to your project:

```bash
# For AI features
npm install openai axios form-data

# For AR features (choose based on provider)
npm install @banuba/webar
npm install @tensorflow/tfjs @tensorflow-models/face-landmarks-detection
npm install three @react-three/fiber @react-three/drei

# For image processing
npm install sharp canvas
```

---

## 🚀 Deployment Checklist

1. **API Keys**: Ensure all API keys are added to environment variables
2. **CORS**: Configure CORS for AI API endpoints
3. **Rate Limiting**: Implement rate limiting for AI generation endpoints
4. **Caching**: Cache generated designs to reduce API costs
5. **Error Handling**: Add comprehensive error handling and fallbacks
6. **Analytics**: Track AI generation usage and success rates
7. **User Feedback**: Collect feedback on generated designs

---

## 💡 Best Practices

### For AI Generation:
- **Prompt Engineering**: Build detailed prompts with jewelry terminology
- **Batch Processing**: Generate multiple variations in one API call
- **Quality Control**: Implement design approval workflow
- **Cost Management**: Cache results, set usage limits

### For AR Try-On:
- **Performance**: Optimize video stream resolution for mobile
- **Lighting**: Provide guidance for best lighting conditions
- **Fallback**: Offer photo upload if camera fails
- **3D Models**: Pre-load jewelry 3D models for faster rendering

---

## 📞 Support & Resources

- **BLNG Support**: support@blng.ai
- **Banuba Docs**: https://docs.banuba.com
- **OpenArt Community**: https://discord.gg/openart
- **TensorFlow.js**: https://www.tensorflow.org/js

---

## 🔄 Migration Path

### Phase 1: MVP (Current Demo)
- ✅ UI/UX complete with demo functionality
- ✅ User flow tested
- ✅ Design parameters working

### Phase 2: Basic AI Integration
- Add OpenArt/StarryAI for text-to-image
- Simple photo overlay for AR try-on
- Manual design approval

### Phase 3: Advanced Features
- Integrate BLNG for jewelry-specific generation
- Add Banuba SDK for face tracking AR
- Implement sketch-to-render pipeline
- 3D model rendering

### Phase 4: Enterprise
- Custom AI model training
- Real-time 3D AR with lighting
- API rate optimization
- Advanced analytics

---

**Last Updated**: January 2025
**Version**: 1.0.0
