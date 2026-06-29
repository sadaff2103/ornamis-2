import { useState, useRef } from "react";
import { motion } from "motion/react";
import { Sparkles, Wand2, Download, Share2, Save, Upload, ImageIcon, PenTool, Type, Loader2, Eye } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { toast } from "sonner";
import { useAuth } from "../../contexts/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Slider } from "../ui/slider";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { generateImages, buildJewelryPrompt } from "../../services/leonardoService";
import { canvasToBase64, downloadImage } from "../../utils/imageProcessing";
import { BackButton } from "../BackButton";

// Drawing tool state type
interface DrawingToolState {
  tool: "brush" | "eraser";
  brushSize: number;
  color: string;
  opacity: number;
}

export function AIDesignerPage({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const { isAuthenticated } = useAuth();
  const [designMode, setDesignMode] = useState<"text" | "sketch" | "image">("text");
  const [prompt, setPrompt] = useState("");
  const [jewelryType, setJewelryType] = useState("necklace");
  const [style, setStyle] = useState("modern");
  const [material, setMaterial] = useState("gold");
  const [gemstone, setGemstone] = useState("diamond");
  const [complexity, setComplexity] = useState([50]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDesigns, setGeneratedDesigns] = useState<string[]>([]);

  // Authentication check - show message if not logged in
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f6f3f0] to-white flex items-center justify-center py-12 px-4">
        <Card className="max-w-md p-8 text-center">
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-[#492f0e]" />
          <h2 className="text-2xl font-['Cinzel_Decorative'] text-[#492f0e] mb-4">
            AI Designer Requires Authentication
          </h2>
          <p className="text-gray-600 mb-6">
            Please log in to access our AI-powered jewelry design studio and create custom designs.
          </p>
          <Button
            className="w-full bg-gradient-to-r from-[#b39978] to-[#492f0e]"
            onClick={() => onNavigate?.('login')}
          >
            Sign In to Access
          </Button>
        </Card>
      </div>
    );
  }
  const [selectedDesign, setSelectedDesign] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Virtual Try-On state
  const [isTryOnOpen, setIsTryOnOpen] = useState(false);

  // Drawing tools state
  const [drawingToolState] = useState<DrawingToolState>({
    tool: "brush",
    brushSize: 3,
    color: "#492f0e",
    opacity: 1,
  });
  const [drawingHistory, setDrawingHistory] = useState<string[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);

  // Canvas drawing handlers with enhanced tools
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Save state for undo
    saveDrawingState();

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);

    if (drawingToolState.tool === "brush") {
      ctx.strokeStyle = drawingToolState.color;
      ctx.globalAlpha = drawingToolState.opacity;
    } else {
      ctx.strokeStyle = "#ffffff";
      ctx.globalAlpha = 1;
    }

    ctx.lineWidth = drawingToolState.brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveDrawingState();
  };

  const saveDrawingState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvasToBase64(canvas);
    const newHistory = drawingHistory.slice(0, historyStep + 1);
    newHistory.push(dataUrl);
    setDrawingHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyStep > 0) {
      setHistoryStep(historyStep - 1);
      restoreDrawingState(drawingHistory[historyStep - 1]);
    }
  };

  const handleRedo = () => {
    if (historyStep < drawingHistory.length - 1) {
      setHistoryStep(historyStep + 1);
      restoreDrawingState(drawingHistory[historyStep + 1]);
    }
  };

  const restoreDrawingState = (dataUrl: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = dataUrl;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);

    try {
      let finalPrompt = prompt;

      // Build jewelry prompt from parameters
      if (!prompt || designMode !== "text") {
        finalPrompt = buildJewelryPrompt({
          type: jewelryType,
          style,
          material,
          gemstone,
          description: prompt
        });
      }

      // Generate variations using Leonardo AI
      const result = await generateImages(finalPrompt, 4);

      if (result && result.length > 0) {
        setGeneratedDesigns(result);
        setSelectedDesign(result[0]);
        toast.success("Design generated successfully! Select your favorite variation.");
      }

    } catch (error: any) {
      console.error("Generation error:", error);
      toast.error(error?.message || "Failed to generate design. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!selectedDesign) return;
    downloadImage(selectedDesign, `jewelry-design-${Date.now()}.png`);
    toast.success("Design downloaded successfully!");
  };

  const handleSave = () => {
    if (!selectedDesign) return;
    toast.success("Design saved to your collection!");
  };

  const handleShare = () => {
    if (!selectedDesign) return;
    toast.success("Share link copied to clipboard!");
  };

  const isGenerateDisabled = () => {
    if (designMode === "text") return !prompt;
    if (designMode === "image") return !uploadedImage;
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f6f3f0] to-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Navigation Buttons */}
        <div className="flex items-center gap-3 mb-6">
          <BackButton label="Back" />
          <BackButton onNavigate={onNavigate} targetPage="home" label="Home" type="home" />
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#b39978] to-[#492f0e] mb-4">
            <Sparkles className="size-10 text-white" />
          </div>
          <h1 className="font-['Cinzel_Decorative',serif] text-[#492f0e] mb-4">
            AI Jewelry Designer
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Transform your ideas into stunning jewelry designs using cutting-edge AI. Describe, sketch, or upload inspiration - we'll create photorealistic renders instantly.
          </p>
        </motion.div>

        {/* Design Mode Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="p-2 max-w-2xl mx-auto">
            <Tabs value={designMode} onValueChange={(v: string) => setDesignMode(v as "text" | "sketch" | "image")}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="text" className="flex items-center gap-2">
                  <Type className="size-4" />
                  <span className="hidden sm:inline">Text Prompt</span>
                  <span className="sm:hidden">Text</span>
                </TabsTrigger>
                <TabsTrigger value="sketch" className="flex items-center gap-2">
                  <PenTool className="size-4" />
                  <span className="hidden sm:inline">Draw Sketch</span>
                  <span className="sm:hidden">Sketch</span>
                </TabsTrigger>
                <TabsTrigger value="image" className="flex items-center gap-2">
                  <ImageIcon className="size-4" />
                  <span className="hidden sm:inline">Upload Image</span>
                  <span className="sm:hidden">Image</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Design Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <h3 className="mb-6 text-[#492f0e]">Design Input</h3>

              {/* Input Area Based on Mode */}
              {designMode === "text" && (
                <div className="mb-6">
                  <Label htmlFor="prompt" className="mb-2 block">
                    Describe Your Design
                  </Label>
                  <Textarea
                    id="prompt"
                    placeholder="e.g., An elegant necklace with sapphire gems arranged in a floral pattern, vintage style with intricate gold detailing and diamond accents..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={6}
                    className="resize-none"
                  />
                  <div className="mt-2">
                    <Label className="text-sm text-gray-600 mb-2 block">Quick Prompts</Label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Elegant diamond pendant",
                        "Vintage pearl necklace",
                        "Modern minimalist ring",
                        "Bohemian gemstone earrings",
                        "Art deco bracelet",
                        "Traditional jhumka design"
                      ].map((suggestion) => (
                        <Badge
                          key={suggestion}
                          variant="outline"
                          className="cursor-pointer hover:bg-[#f5f1ed] text-xs"
                          onClick={() => setPrompt(suggestion)}
                        >
                          {suggestion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {designMode === "sketch" && (
                <div className="mb-6 space-y-4">
                  <Label className="mb-2 block">Draw Your Design</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                    <canvas
                      ref={canvasRef}
                      width={600}
                      height={400}
                      className="w-full bg-white cursor-crosshair"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                    />
                  </div>

                  {/* Drawing Tools - TODO: Implement DrawingTools component */}
                  {/* <DrawingTools
                    toolState={drawingToolState}
                    onToolStateChange={setDrawingToolState}
                    onUndo={handleUndo}
                    onRedo={handleRedo}
                    onClear={clearCanvas}
                    canUndo={historyStep > 0}
                    canRedo={historyStep < drawingHistory.length - 1}
                  /> */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleUndo} disabled={historyStep <= 0}>
                      Undo
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleRedo} disabled={historyStep >= drawingHistory.length - 1}>
                      Redo
                    </Button>
                    <Button variant="outline" size="sm" onClick={clearCanvas}>
                      Clear
                    </Button>
                  </div>
                </div>
              )}

              {designMode === "image" && (
                <div className="mb-6">
                  <Label className="mb-2 block">Upload Reference Image</Label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-[#492f0e] transition-colors"
                  >
                    {uploadedImage ? (
                      <div className="relative">
                        <ImageWithFallback
                          src={uploadedImage}
                          alt="Uploaded reference"
                          className="w-full h-64 object-contain rounded-lg"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            setUploadedImage(null);
                          }}
                          className="mt-4"
                        >
                          Change Image
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="size-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Click to upload or drag and drop</p>
                        <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 10MB</p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              )}

              {/* Design Parameters */}
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type" className="mb-2 block text-sm">
                      Jewelry Type
                    </Label>
                    <Select value={jewelryType} onValueChange={setJewelryType}>
                      <SelectTrigger id="type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="necklace">Necklace</SelectItem>
                        <SelectItem value="ring">Ring</SelectItem>
                        <SelectItem value="earrings">Earrings</SelectItem>
                        <SelectItem value="bracelet">Bracelet</SelectItem>
                        <SelectItem value="pendant">Pendant</SelectItem>
                        <SelectItem value="anklet">Anklet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="style" className="mb-2 block text-sm">
                      Style
                    </Label>
                    <Select value={style} onValueChange={setStyle}>
                      <SelectTrigger id="style">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="vintage">Vintage</SelectItem>
                        <SelectItem value="classic">Classic</SelectItem>
                        <SelectItem value="bohemian">Bohemian</SelectItem>
                        <SelectItem value="minimalist">Minimalist</SelectItem>
                        <SelectItem value="statement">Statement</SelectItem>
                        <SelectItem value="traditional">Traditional</SelectItem>
                        <SelectItem value="art-deco">Art Deco</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="material" className="mb-2 block text-sm">
                      Material
                    </Label>
                    <Select value={material} onValueChange={setMaterial}>
                      <SelectTrigger id="material">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gold">Yellow Gold</SelectItem>
                        <SelectItem value="rose-gold">Rose Gold</SelectItem>
                        <SelectItem value="white-gold">White Gold</SelectItem>
                        <SelectItem value="silver">Silver</SelectItem>
                        <SelectItem value="platinum">Platinum</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="gemstone" className="mb-2 block text-sm">
                      Gemstone
                    </Label>
                    <Select value={gemstone} onValueChange={setGemstone}>
                      <SelectTrigger id="gemstone">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="diamond">Diamond</SelectItem>
                        <SelectItem value="ruby">Ruby</SelectItem>
                        <SelectItem value="emerald">Emerald</SelectItem>
                        <SelectItem value="sapphire">Sapphire</SelectItem>
                        <SelectItem value="pearl">Pearl</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block text-sm">
                    Design Complexity
                  </Label>
                  <div className="px-2">
                    <Slider
                      value={complexity}
                      onValueChange={setComplexity}
                      max={100}
                      step={1}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Simple</span>
                      <span>Moderate</span>
                      <span>Intricate</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={isGenerateDisabled() || isGenerating}
                className="w-full bg-gradient-to-r from-[#b39978] to-[#492f0e] hover:from-[#9a8567] hover:to-[#362312] text-white"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 size-5 animate-spin" />
                    Generating Designs...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 size-5" />
                    Generate AI Design
                  </>
                )}
              </Button>


            </Card>
          </motion.div>

          {/* Right Panel - Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 h-full">
              <h3 className="mb-6 text-[#492f0e]">Design Preview</h3>

              {generatedDesigns.length > 0 ? (
                <div className="space-y-6">
                  {/* Main Preview */}
                  <div className="aspect-square bg-[#f5f1ed] rounded-lg overflow-hidden">
                    <ImageWithFallback
                      src={selectedDesign || generatedDesigns[0]}
                      alt="Generated Design"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Variations */}
                  <div>
                    <Label className="mb-2 block text-sm">Design Variations</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {generatedDesigns.map((design, idx) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedDesign(design)}
                          className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${selectedDesign === design
                            ? "border-[#492f0e] scale-105"
                            : "border-transparent hover:border-gray-300"
                            }`}
                        >
                          <ImageWithFallback
                            src={design}
                            alt={`Variation ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Design Details */}
                  <div className="space-y-2 p-4 bg-[#f5f1ed] rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Type:</span>
                      <Badge className="capitalize">{jewelryType}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Style:</span>
                      <Badge className="capitalize">{style}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Material:</span>
                      <Badge className="capitalize">{material.replace("-", " ")}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Gemstone:</span>
                      <Badge className="capitalize">{gemstone}</Badge>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" className="w-full" onClick={handleSave}>
                      <Save className="mr-2 size-4" />
                      Save
                    </Button>
                    <Button variant="outline" className="w-full" onClick={handleDownload}>
                      <Download className="mr-2 size-4" />
                      Export
                    </Button>
                    <Button variant="outline" className="w-full" onClick={handleShare}>
                      <Share2 className="mr-2 size-4" />
                      Share
                    </Button>
                  </div>

                  {/* Virtual Try-On Button */}
                  <Button
                    className="w-full bg-gradient-to-r from-[#b39978] to-[#492f0e] hover:from-[#9a8567] hover:to-[#362312] text-white"
                    onClick={() => setIsTryOnOpen(true)}
                  >
                    <Eye className="mr-2 size-4" />
                    Virtual Try-On
                  </Button>

                  {/* Request Quote */}
                  <Button className="w-full bg-[#492f0e] hover:bg-[#362312]">
                    Request Quote from Verified Sellers
                  </Button>
                </div>
              ) : (
                <div className="h-[600px] flex items-center justify-center bg-[#f5f1ed] rounded-lg">
                  <div className="text-center">
                    <Sparkles className="size-16 text-[#b39978] mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                      Your AI-generated designs will appear here
                    </p>
                    <p className="text-sm text-gray-500">
                      Choose a design mode and create your dream jewelry
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h3 className="text-center mb-8 text-[#492f0e]">AI-Powered Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                title: "Text-to-Design",
                desc: "Describe your vision in natural language",
                icon: Type,
              },
              {
                title: "Sketch-to-Render",
                desc: "Draw rough sketches, get photorealistic results",
                icon: PenTool,
              },
              {
                title: "Image-to-Design",
                desc: "Upload inspiration and get similar designs",
                icon: ImageIcon,
              },
              {
                title: "Instant Export",
                desc: "Download high-res images for quotes",
                icon: Download,
              },
            ].map((item) => (
              <Card key={item.title} className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#b39978] to-[#492f0e] text-white flex items-center justify-center mx-auto mb-4">
                  <item.icon className="size-6" />
                </div>
                <h4 className="mb-2">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </Card>
            ))}
          </div>
        </motion.div>



        {/* Comprehensive API Integration Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <h3 className="text-center mb-8 text-[#492f0e]">Integrated Design & Asset APIs</h3>

          {/* A - Design / Asset APIs */}
          <div className="mb-8">
            <Card className="p-6">
              <h4 className="text-[#492f0e] mb-4 flex items-center gap-2">
                <ImageIcon className="size-5" />
                A — Design / Asset APIs
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-br from-[#faf8f5] to-[#f5f1ed] rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-[#492f0e]">Unsplash API</h5>
                    <Badge variant="secondary" className="text-xs">Free Tier</Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    High-quality photos for placeholders & hero images
                  </p>
                  <p className="text-xs text-gray-600 mb-2">
                    <strong>Use:</strong> Dynamically populate banners or store card backgrounds
                  </p>
                  <p className="text-xs text-[#492f0e]">
                    💡 Request small sizes for web to keep payloads light
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-br from-[#faf8f5] to-[#f5f1ed] rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-[#492f0e]">Pexels API</h5>
                    <Badge variant="secondary" className="text-xs">Free Tier</Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    Alternative stock photos + video
                  </p>
                  <p className="text-xs text-gray-600 mb-2">
                    <strong>Use:</strong> Same as Unsplash, provides additional variety
                  </p>
                  <p className="text-xs text-[#492f0e]">
                    💡 Great for lifestyle jewelry photography
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-br from-[#faf8f5] to-[#f5f1ed] rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-[#492f0e]">LottieFiles API</h5>
                    <Badge variant="secondary" className="text-xs">Free Tier</Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    Lightweight JSON animations
                  </p>
                  <p className="text-xs text-gray-600 mb-2">
                    <strong>Use:</strong> Fast, small animations for loading states instead of heavy GIFs
                  </p>
                  <p className="text-xs text-[#492f0e]">
                    💡 Play with Lottie players for smooth 60fps animations
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-br from-[#faf8f5] to-[#f5f1ed] rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-[#492f0e]">Iconify REST</h5>
                    <Badge variant="secondary" className="text-xs">Free</Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    Huge free icon collection accessible by CDN
                  </p>
                  <p className="text-xs text-gray-600 mb-2">
                    <strong>Use:</strong> Vector icons inside nav, cards; small and scalable
                  </p>
                  <p className="text-xs text-[#492f0e]">
                    💡 Over 200,000 icons from 100+ icon sets
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* B - Image Processing & Optimization */}
          <div className="mb-8">
            <Card className="p-6">
              <h4 className="text-[#492f0e] mb-4 flex items-center gap-2">
                <Sparkles className="size-5" />
                B — Image Processing & Optimization
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-[#faf8f5] to-[#f5f1ed] rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-[#492f0e]">Remove.bg</h5>
                    <Badge variant="secondary" className="text-xs">Limited Free</Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    Automatic background removal
                  </p>
                  <p className="text-xs text-gray-600 mb-2">
                    <strong>Use:</strong> Prepare store logos or jewelry images with transparent backgrounds
                  </p>
                  <p className="text-xs text-[#492f0e]">
                    💡 Perfect for creating clean product shots
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-br from-[#faf8f5] to-[#f5f1ed] rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-[#492f0e]">TinyPNG / Tinify</h5>
                    <Badge variant="secondary" className="text-xs">Free Limited</Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    Compress PNG/JPG files programmatically
                  </p>
                  <p className="text-xs text-gray-600 mb-2">
                    <strong>Use:</strong> Keep the performance budget under control
                  </p>
                  <p className="text-xs text-[#492f0e]">
                    💡 50-80% file size reduction without quality loss
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-br from-[#faf8f5] to-[#f5f1ed] rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-[#492f0e]">Cloudinary</h5>
                    <Badge variant="secondary" className="text-xs">Free Tier</Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    Image hosting & on-the-fly transformation
                  </p>
                  <p className="text-xs text-gray-600 mb-2">
                    <strong>Use:</strong> Serve optimized images with automatic format selection (WebP/AVIF)
                  </p>
                  <p className="text-xs text-[#492f0e]">
                    💡 Includes lazy-loading URLs and CDN delivery
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* C - AI Features */}
          <div className="mb-8">
            <Card className="p-6">
              <h4 className="text-[#492f0e] mb-4 flex items-center gap-2">
                <Wand2 className="size-5" />
                C — AI Features (NLP / Vision / Generation)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-[#faf8f5] to-[#f5f1ed] rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-[#492f0e]">Hugging Face</h5>
                    <Badge variant="secondary" className="text-xs">Free Tier</Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    Text classification, summarization, image captioning
                  </p>
                  <p className="text-xs text-gray-600 mb-2">
                    <strong>Use:</strong> Auto-generate product descriptions or alt text for images
                  </p>
                  <p className="text-xs text-[#492f0e]">
                    💡 Inference API supports 1000+ models
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-br from-[#faf8f5] to-[#f5f1ed] rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-[#492f0e]">DeepAI</h5>
                    <Badge variant="secondary" className="text-xs">Free Limited</Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    Image upscaling, colorization, tagging
                  </p>
                  <p className="text-xs text-gray-600 mb-2">
                    <strong>Use:</strong> Quick prototype image tasks and enhancements
                  </p>
                  <p className="text-xs text-[#492f0e]">
                    💡 Great for improving low-res jewelry photos
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-br from-[#faf8f5] to-[#f5f1ed] rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-[#492f0e]">Stability.ai / Replicate</h5>
                    <Badge variant="secondary" className="text-xs">Free Trial</Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    Image generation for concept art or placeholders
                  </p>
                  <p className="text-xs text-gray-600 mb-2">
                    <strong>Use:</strong> Generate hero images when real photos aren't available
                  </p>
                  <p className="text-xs text-[#492f0e]">
                    ⚠️ Be mindful of usage limits and costs
                  </p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-900">
                  <strong>⚡ Practical Note:</strong> For production, put AI calls on your server/backend to hide API keys, cache responses, and throttle requests.
                </p>
              </div>
            </Card>
          </div>

          {/* D - Developer & Figma Ecosystem */}
          <div className="mb-8">
            <Card className="p-6">
              <h4 className="text-[#492f0e] mb-4 flex items-center gap-2">
                <Type className="size-5" />
                D — Developer & Figma Ecosystem
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-br from-[#faf8f5] to-[#f5f1ed] rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-[#492f0e]">Figma REST API</h5>
                    <Badge variant="secondary" className="text-xs">Free</Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    Read/write frames, export images, create plugins
                  </p>
                  <p className="text-xs text-gray-600 mb-2">
                    <strong>Use:</strong> Pull designs from Figma Make, export optimized assets automatically
                  </p>
                  <p className="text-xs text-[#492f0e]">
                    💡 Automate your design-to-website pipeline
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-br from-[#faf8f5] to-[#f5f1ed] rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-[#492f0e]">Google Fonts</h5>
                    <Badge variant="secondary" className="text-xs">Free</Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    Web-hosted fonts with CDN delivery
                  </p>
                  <p className="text-xs text-gray-600 mb-2">
                    <strong>Use:</strong> Sync the font used in Figma Make to your website for pixel-consistent rendering
                  </p>
                  <p className="text-xs text-[#492f0e]">
                    💡 1400+ font families available instantly
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Integration Tips */}
          <Card className="p-6 bg-gradient-to-r from-[#492f0e] to-[#6b4423] text-white">
            <h4 className="mb-4 text-white">⚡ Quick Integration Tips & Priorities</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg">
                <h5 className="font-medium mb-2">🔐 Security First</h5>
                <p className="text-sm text-white/90">
                  Server-side proxy for all third-party AI calls to protect keys + centralize retries & caching
                </p>
              </div>

              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg">
                <h5 className="font-medium mb-2">⚡ Build-time Optimization</h5>
                <p className="text-sm text-white/90">
                  Export compressed, web-ready assets from Figma; use Cloudinary/TinyPNG for a final pass
                </p>
              </div>

              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg">
                <h5 className="font-medium mb-2">📱 Progressive Enhancement</h5>
                <p className="text-sm text-white/90">
                  Always return HTML/CSS fallback for slow networks; add Lottie only if device supports it
                </p>
              </div>

              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg">
                <h5 className="font-medium mb-2">📊 Monitoring</h5>
                <p className="text-sm text-white/90">
                  Track asset sizes & page load (Lighthouse) and set alerts for regressions
                </p>
              </div>

              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg">
                <h5 className="font-medium mb-2">⏱️ Rate Limits</h5>
                <p className="text-sm text-white/90">
                  Fail gracefully — show placeholders or cached content when API calls hit quotas
                </p>
              </div>

              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg">
                <h5 className="font-medium mb-2">💾 Caching Strategy</h5>
                <p className="text-sm text-white/90">
                  Cache AI responses and optimized images to reduce API calls and improve performance
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Virtual Try-On Modal - TODO: Implement VirtualTryOn component */}
      {/* <VirtualTryOn
        isOpen={isTryOnOpen}
        onClose={() => setIsTryOnOpen(false)}
        designImage={selectedDesign || ""}
        jewelryType={jewelryType}
        userPhoto={tryOnPhoto || undefined}
        onPhotoUpload={setTryOnPhoto}
      /> */}
      {isTryOnOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <Card className="p-6 max-w-md">
            <h3 className="text-[#492f0e] mb-4">Virtual Try-On</h3>
            <p className="text-gray-600 mb-4">Virtual try-on feature coming soon!</p>
            <Button onClick={() => setIsTryOnOpen(false)} className="w-full">
              Close
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}