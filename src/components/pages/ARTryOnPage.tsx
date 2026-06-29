import { useState, useRef, useEffect } from "react";
import { BackButton } from "../BackButton";

import { motion } from "motion/react";
import { Camera, Upload, RotateCcw, Download, X, Video, Image as ImageIcon, Sparkles, ShieldCheck, AlertCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { toast } from "sonner";
import { useAuth } from "../../contexts/AuthContext";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface ARTryOnPageProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
}

export function ARTryOnPage({ onNavigate, onBack }: ARTryOnPageProps) {
  const { isAuthenticated } = useAuth();

  // Authentication check - show message if not logged in
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f6f3f0] to-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <BackButton label="Back" onClick={onBack} />
            <BackButton onNavigate={onNavigate} targetPage="home" label="Home" type="home" />
          </div>
          <div className="flex items-center justify-center pt-12">
            <Card className="max-w-md p-8 text-center">
              <Camera className="w-12 h-12 mx-auto mb-4 text-[#492f0e]" />
              <h2 className="text-2xl font-['Cinzel_Decorative'] text-[#492f0e] mb-4">
                AR Try-On Requires Authentication
              </h2>
              <p className="text-gray-600 mb-6">
                Please log in to use our augmented reality try-on feature and see how jewelry looks on you.
              </p>
              <Button className="w-full bg-gradient-to-r from-[#b39978] to-[#492f0e]">
                Sign In to Access
              </Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f6f3f0] to-white py-12">
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="flex items-center gap-3">
          <BackButton label="Back" onClick={onBack} />
          <BackButton onNavigate={onNavigate} targetPage="home" label="Home" type="home" />
        </div>
      </div>
      <ARTryOnContent />
    </div>
  );
}

const sampleProducts = [
  {
    id: "1",
    name: "Diamond Solitaire Necklace",
    image: "/jewelry/jauhari/diamond-necklace-special.png",
    category: "necklace",
    price: "₹2,45,000"
  },
  {
    id: "2",
    name: "Emerald Gold Ring",
    image: "https://images.unsplash.com/photo-1762505464779-17f78cbfa8b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbWVyYWxkJTIwcmluZyUyMGpld2Vscnl8ZW58MXx8fHwxNzY0Njk5MTc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "ring",
    price: "₹1,89,000"
  },
  {
    id: "3",
    name: "Pearl Drop Earrings",
    image: "https://images.unsplash.com/photo-1685524820989-5b822999d8db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcnlzdGFsJTIwZHJvcCUyMGVhcnJpbmdzfGVufDF8fHx8MTc2NDY5OTEzNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "earrings",
    price: "₹1,25,000"
  },
  {
    id: "4",
    name: "Ruby Tennis Bracelet",
    image: "https://images.unsplash.com/photo-1728381031272-ba3f537feadd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydWJ5JTIwYnJhY2VsZXQlMjBnb2xkfGVufDF8fHx8MTc2NDY5OTE3OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "bracelet",
    price: "₹3,15,000"
  },
  {
    id: "5",
    name: "Sapphire Pendant",
    image: "https://images.unsplash.com/photo-1708221269375-7a4d8fa32a27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXBwaGlyZSUyMHBlbmRhbnQlMjBnb2xkJTIwdHJhZGl0aW9uYWx8ZW58MXx8fHwxNzY0Nzg0MDEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "necklace",
    price: "₹1,75,000"
  },
  {
    id: "6",
    name: "Diamond Hoop Earrings",
    image: "https://images.unsplash.com/photo-1725266698864-d762b3f23a96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob29wJTIwZWFycmluZ3MlMjBkaWFtb25kfGVufDF8fHx8MTc2NDY5OTE3OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "earrings",
    price: "₹2,25,000"
  },
];

function ARTryOnContent() {
  const [mode, setMode] = useState<"camera" | "upload" | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<typeof sampleProducts[0] | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [jewelryScale, setJewelryScale] = useState([100]);
  const [jewelryOpacity, setJewelryOpacity] = useState([70]);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [showPermissionGuide, setShowPermissionGuide] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = async () => {
    try {
      // Check browser support
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error("❌ MediaDevices API not supported in this browser");
        toast.error("Camera access is not supported in your browser. Please use Chrome, Firefox, or Safari.", {
          duration: 5000
        });
        setCameraError(true);
        setMode(null);
        return;
      }

      console.log("📷 Requesting camera access...");

      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
        setCameraError(false);
        console.log("✅ Camera access granted successfully");
        toast.success("Camera activated! Select a product to try on.");
      }
    } catch (err: any) {
      console.error("❌ Camera access error:", err.name, "-", err.message);
      console.log("💡 Error details:", {
        name: err.name,
        message: err.message,
        constraint: err.constraint
      });

      // Provide specific error messages and solutions
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        toast.error(
          <div className="space-y-2">
            <p className="font-medium">Camera Permission Denied</p>
            <p className="text-sm">Please allow camera access to use AR try-on.</p>
            <p className="text-xs mt-2">
              <strong>How to fix:</strong><br />
              1. Click the camera icon 🎥 in your browser's address bar<br />
              2. Select "Allow" for camera access<br />
              3. Refresh the page and try again
            </p>
          </div>,
          { duration: 8000 }
        );
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        toast.error("No camera detected on your device. Please try uploading a photo instead.", {
          duration: 5000
        });
      } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
        toast.error("Camera is already in use by another application. Please close other apps using the camera.", {
          duration: 5000
        });
      } else if (err.name === "NotSupportedError") {
        toast.error("Camera access must be done over HTTPS. Please use a secure connection.", {
          duration: 5000
        });
      } else {
        toast.error(`Camera error: ${err.message}. Please try uploading a photo instead.`, {
          duration: 5000
        });
      }

      setCameraError(true);
      setMode(null);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  const handleModeSelect = (newMode: "camera" | "upload") => {
    if (newMode === "camera") {
      // Show permission guide first
      setShowPermissionGuide(true);
    } else {
      setMode(newMode);
      stopCamera();
    }
  };

  const handleCameraStart = () => {
    setShowPermissionGuide(false);
    setCameraError(false);
    setMode("camera");
    startCamera();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size should be less than 10MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        toast.success("Photo uploaded! Select a product to try on.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCapture = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0);
    canvas.toDataURL('image/png');
    toast.success("Photo captured successfully!");
  };

  const handleDownload = () => {
    toast.success("Image downloaded successfully!");
  };

  const handleReset = () => {
    setMode(null);
    setSelectedProduct(null);
    setUploadedImage(null);
    setJewelryScale([100]);
    setJewelryOpacity([70]);
    setCameraError(false);
    stopCamera();
  };

  const handleProductSelect = (product: typeof sampleProducts[0]) => {
    setSelectedProduct(product);
    toast.success(`${product.name} selected! Adjust position and scale as needed.`);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const filteredProducts = categoryFilter === "all"
    ? sampleProducts
    : sampleProducts.filter(p => p.category === categoryFilter);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f6f3f0] to-white py-12">
      <div className="max-w-7xl mx-auto px-4">

        {/* Camera Error Help Banner */}
        {cameraError && !mode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto mb-8"
          >
            <Card className="bg-amber-50 border-amber-200">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <AlertCircle className="size-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-amber-900 mb-2">Camera Access Issue</h3>
                    <p className="text-sm text-amber-800 mb-3">
                      We couldn't access your camera. Here are some quick fixes:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-amber-800">
                      <div className="bg-white/50 p-3 rounded">
                        <strong>Option 1: Grant Permission</strong>
                        <p className="text-xs mt-1">Click the camera icon 🎥 in your address bar and allow access</p>
                      </div>
                      <div className="bg-white/50 p-3 rounded">
                        <strong>Option 2: Use Photo Upload</strong>
                        <p className="text-xs mt-1">Upload a photo instead - works great too!</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setCameraError(false);
                          handleModeSelect("camera");
                        }}
                        className="text-xs"
                      >
                        <RotateCcw className="size-3 mr-1" />
                        Try Again
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          setCameraError(false);
                          handleModeSelect("upload");
                          fileInputRef.current?.click();
                        }}
                        className="text-xs bg-[#492f0e] hover:bg-[#362312]"
                      >
                        <Upload className="size-3 mr-1" />
                        Upload Photo Instead
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCameraError(false)}
                    className="flex-shrink-0"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Camera Permission Guide Dialog */}
        <Dialog open={showPermissionGuide} onOpenChange={setShowPermissionGuide}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-[#492f0e]" />
                Camera Permission Required
              </DialogTitle>
              <DialogDescription className="pt-4 space-y-3">
                <p>To use AR virtual try-on, we need access to your camera. Your privacy is important to us:</p>
                <div className="bg-[#f5f1ed] p-4 rounded-lg space-y-2 text-sm text-gray-700">
                  <p className="flex items-start gap-2">
                    <span className="text-[#492f0e]">•</span>
                    <span>Your camera feed stays on your device</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-[#492f0e]">•</span>
                    <span>We don't record or store any images</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-[#492f0e]">•</span>
                    <span>You can revoke access anytime</span>
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-900 mb-2 flex items-center gap-2">
                    <AlertCircle className="size-4" />
                    <strong>When prompted by your browser:</strong>
                  </p>
                  <ol className="text-sm text-blue-800 space-y-1 ml-6 list-decimal">
                    <li>Click <strong>"Allow"</strong> when asked for camera access</li>
                    <li>If blocked, click the camera icon 🎥 in your address bar</li>
                    <li>Select "Always allow" and refresh the page</li>
                  </ol>
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => setShowPermissionGuide(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCameraStart}
                className="w-full sm:w-auto bg-[#492f0e] hover:bg-[#362312]"
              >
                <Camera className="size-4 mr-2" />
                Enable Camera
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {!mode ? (
          /* Mode Selection */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          >
            <Card
              className="p-8 cursor-pointer hover:shadow-xl transition-all text-center group"
              onClick={() => handleModeSelect("camera")}
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#b39978] to-[#492f0e] mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Video className="size-10 text-white" />
              </div>
              <h3 className="mb-2">Live Camera Try-On</h3>
              <p className="text-sm text-gray-600 mb-4">
                Try on jewelry in real-time using your device's camera with AR overlay
              </p>
              <div className="flex flex-col gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  Recommended
                </Badge>
                <p className="text-xs text-gray-500">
                  Camera permission required
                </p>
              </div>
            </Card>

            <Card
              className="p-8 cursor-pointer hover:shadow-xl transition-all text-center group"
              onClick={() => {
                handleModeSelect("upload");
                fileInputRef.current?.click();
              }}
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#b39978] to-[#492f0e] mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ImageIcon className="size-10 text-white" />
              </div>
              <h3 className="mb-2">Upload Photo</h3>
              <p className="text-sm text-gray-600 mb-4">
                Upload your photo and see jewelry overlays with adjustable positioning
              </p>
              <Badge variant="secondary">
                Quick & Easy
              </Badge>
            </Card>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </motion.div>
        ) : (
          /* Try-On Interface */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Preview Area */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[#492f0e]">
                    {mode === "camera" ? "Live Camera Preview" : "Photo Preview"}
                  </h3>
                  <div className="flex gap-2">
                    {mode === "camera" && (
                      <Button variant="outline" size="sm" onClick={handleCapture}>
                        <Camera className="size-4 mr-2" />
                        Capture
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={handleDownload}>
                      <Download className="size-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleReset}>
                      <X className="size-4 mr-2" />
                      Close
                    </Button>
                  </div>
                </div>

                <div className="aspect-[4/3] bg-[#f5f1ed] rounded-lg overflow-hidden relative">
                  {mode === "camera" ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  ) : uploadedImage ? (
                    <ImageWithFallback
                      src={uploadedImage}
                      alt="Uploaded"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Upload className="size-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Upload an image to begin</p>
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Choose Photo
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Overlay selected product */}
                  {selectedProduct && (isCameraActive || uploadedImage) && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div
                        className="relative"
                        style={{
                          transform: `scale(${jewelryScale[0] / 100})`,
                          opacity: jewelryOpacity[0] / 100
                        }}
                      >
                        <Badge className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#492f0e] whitespace-nowrap">
                          {selectedProduct.name}
                        </Badge>
                        <ImageWithFallback
                          src={selectedProduct.image}
                          alt={selectedProduct.name}
                          className="w-64 h-64 object-contain drop-shadow-2xl"
                        />
                      </div>
                    </div>
                  )}

                  {/* AR Grid Overlay */}
                  {selectedProduct && (isCameraActive || uploadedImage) && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-4 left-4 right-4 h-px bg-white/20" />
                      <div className="absolute bottom-4 left-4 right-4 h-px bg-white/20" />
                      <div className="absolute top-4 left-4 bottom-4 w-px bg-white/20" />
                      <div className="absolute top-4 right-4 bottom-4 w-px bg-white/20" />
                    </div>
                  )}
                </div>

                {/* Adjustment Controls */}
                {selectedProduct && (isCameraActive || uploadedImage) && (
                  <div className="mt-4 p-4 bg-[#f5f1ed] rounded-lg space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm">Size Adjustment</Label>
                        <span className="text-xs text-gray-600">{jewelryScale[0]}%</span>
                      </div>
                      <Slider
                        value={jewelryScale}
                        onValueChange={setJewelryScale}
                        min={50}
                        max={150}
                        step={5}
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm">Opacity</Label>
                        <span className="text-xs text-gray-600">{jewelryOpacity[0]}%</span>
                      </div>
                      <Slider
                        value={jewelryOpacity}
                        onValueChange={setJewelryOpacity}
                        min={30}
                        max={100}
                        step={5}
                      />
                    </div>
                  </div>
                )}

                {/* Instructions */}
                <div className="mt-4 p-4 bg-gradient-to-r from-[#f5f1ed] to-[#ebe7e3] rounded-lg">
                  <div className="flex items-start gap-3">
                    <Sparkles className="size-5 text-[#492f0e] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>Pro Tips:</strong>
                      </p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {mode === "camera" ? (
                          <>
                            <li>• Position your face in the center for best results</li>
                            <li>• Ensure good lighting for accurate AR overlay</li>
                            <li>• Hold still while selecting jewelry</li>
                          </>
                        ) : (
                          <>
                            <li>• Use a clear, well-lit photo for best results</li>
                            <li>• Front-facing photos work best</li>
                            <li>• Adjust size and opacity for perfect fit</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Product Selection */}
            <div>
              <Card className="p-6">
                <h3 className="mb-4 text-[#492f0e]">Select Jewelry</h3>

                {/* Category Filter */}
                <Tabs value={categoryFilter} onValueChange={setCategoryFilter} className="w-full mb-4">
                  <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                    <TabsTrigger value="necklace" className="text-xs">Necklaces</TabsTrigger>
                    <TabsTrigger value="earrings" className="text-xs">Earrings</TabsTrigger>
                  </TabsList>
                </Tabs>

                {/* Product List */}
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleProductSelect(product)}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${selectedProduct?.id === product.id
                        ? "bg-[#492f0e] text-white shadow-lg scale-105"
                        : "bg-[#f5f1ed] hover:bg-[#ebe7e3]"
                        }`}
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-white">
                        <ImageWithFallback
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm mb-1 truncate ${selectedProduct?.id === product.id ? "font-medium" : ""
                          }`}>
                          {product.name}
                        </p>
                        <p className={`text-xs capitalize mb-1 ${selectedProduct?.id === product.id
                          ? "text-white/70"
                          : "text-gray-500"
                          }`}>
                          {product.category}
                        </p>
                        <p className={`text-xs ${selectedProduct?.id === product.id
                          ? "text-white"
                          : "text-[#492f0e]"
                          }`}>
                          {product.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedProduct && (
                  <div className="mt-4 space-y-2">
                    <Button className="w-full bg-[#492f0e] hover:bg-[#362312]">
                      Add to Cart • {selectedProduct.price}
                    </Button>
                    <Button variant="outline" className="w-full">
                      Add to Wishlist
                    </Button>
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}

        {/* Features Section */}
        {!mode && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16"
            >
              <h3 className="text-center mb-8 text-[#492f0e]">Virtual Try-On Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  {
                    title: "Real-Time AR",
                    desc: "See jewelry on yourself instantly with live camera feed",
                    icon: Camera,
                  },
                  {
                    title: "Photo Upload",
                    desc: "Try on jewelry using your existing photos",
                    icon: Upload,
                  },
                  {
                    title: "Adjustable Fit",
                    desc: "Control size, position, and opacity for perfect preview",
                    icon: RotateCcw,
                  },
                  {
                    title: "Save & Share",
                    desc: "Capture and download your virtual try-on photos",
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

            {/* Browser Compatibility Note */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8 max-w-2xl mx-auto"
            >
              <Card className="p-4 bg-blue-50 border-blue-200">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-blue-900 text-sm mb-1">Camera Requirements</h4>
                    <p className="text-xs text-blue-800">
                      Works best on Chrome, Firefox, Safari, or Edge. Camera permission required for live try-on.
                      Your privacy is protected - no images are uploaded or stored.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </>
        )}

        {/* API Integration Notice */}
        {!mode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <Card className="p-6 bg-gradient-to-r from-[#f5f1ed] to-[#e8e4df]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#492f0e] flex items-center justify-center flex-shrink-0">
                  <Sparkles className="size-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-[#492f0e] mb-2">Enterprise AR Ready</h4>
                  <p className="text-sm text-gray-700 mb-3">
                    This virtual try-on system can be enhanced with professional AR APIs for advanced features like facial landmark detection, 3D model rendering, and realistic lighting:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Banuba Virtual Try-On",
                      "KiXR AR Engine",
                      "Camweara SDK",
                      "thenewblack.ai",
                      "AR.js",
                      "Three.js + TensorFlow"
                    ].map((api) => (
                      <Badge key={api} variant="secondary" className="bg-white">
                        {api}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 mt-3">
                    Integrate advanced AR SDKs for precise jewelry positioning, 3D rendering, and realistic material simulation.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}