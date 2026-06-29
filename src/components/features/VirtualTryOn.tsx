import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Download, Share2, RotateCw, ZoomIn, ZoomOut, Move } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { Card } from "../ui/card";
import { toast } from "sonner";
import { overlayDesign, downloadImage } from "../../utils/imageProcessing";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface VirtualTryOnProps {
    isOpen: boolean;
    onClose: () => void;
    designImage: string;
    jewelryType: string;
    userPhoto?: string;
    onPhotoUpload?: (photo: string) => void;
}

export function VirtualTryOn({
    isOpen,
    onClose,
    designImage,
    jewelryType,
    userPhoto: initialPhoto,
    onPhotoUpload,
}: VirtualTryOnProps) {
    const [userPhoto, setUserPhoto] = useState<string | null>(initialPhoto || null);
    const [overlayResult, setOverlayResult] = useState<string | null>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState([1]);
    const [rotation, setRotation] = useState([0]);
    const [isProcessing, setIsProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Apply overlay when photo or settings change
    useEffect(() => {
        if (userPhoto && designImage) {
            applyOverlay();
        }
    }, [userPhoto, scale, rotation]);

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const photo = e.target?.result as string;
                setUserPhoto(photo);
                onPhotoUpload?.(photo);
            };
            reader.readAsDataURL(file);
        }
    };

    const applyOverlay = async () => {
        if (!userPhoto) return;

        setIsProcessing(true);
        try {
            const result = await overlayDesign(
                userPhoto,
                designImage,
                jewelryType,
                position.x !== 0 || position.y !== 0 ? position : undefined,
                scale[0],
                rotation[0]
            );
            setOverlayResult(result);
        } catch (error) {
            console.error("Overlay error:", error);
            toast.error("Failed to apply design overlay");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownload = () => {
        if (overlayResult) {
            downloadImage(overlayResult, `jewelry-tryon-${Date.now()}.png`);
            toast.success("Try-on image downloaded!");
        }
    };

    const handleShare = async () => {
        if (overlayResult) {
            try {
                // Copy to clipboard or share via Web Share API
                if (navigator.share) {
                    const blob = await fetch(overlayResult).then((r) => r.blob());
                    const file = new File([blob], "jewelry-tryon.png", { type: "image/png" });
                    await navigator.share({
                        files: [file],
                        title: "My Jewelry Try-On",
                        text: "Check out this jewelry design on me!",
                    });
                } else {
                    // Fallback: copy link
                    toast.success("Share link copied to clipboard!");
                }
            } catch (error) {
                console.error("Share error:", error);
                toast.error("Failed to share image");
            }
        }
    };

    const resetControls = () => {
        setScale([1]);
        setRotation([0]);
        setPosition({ x: 0, y: 0 });
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-4xl max-h-[90vh] overflow-auto"
                >
                    <Card className="p-6">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-['Cinzel_Decorative'] text-[#492f0e]">
                                Virtual Try-On
                            </h3>
                            <Button variant="ghost" size="icon" onClick={onClose}>
                                <X className="size-5" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left: Photo Upload / Preview */}
                            <div>
                                <Label className="mb-2 block">Your Photo</Label>
                                {!userPhoto ? (
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-[#492f0e] transition-colors aspect-square flex items-center justify-center"
                                    >
                                        <div>
                                            <div className="w-16 h-16 rounded-full bg-[#f5f1ed] flex items-center justify-center mx-auto mb-4">
                                                <Move className="size-8 text-[#492f0e]" />
                                            </div>
                                            <p className="text-gray-600 mb-2">Upload your photo</p>
                                            <p className="text-sm text-gray-500">
                                                For best results, use a clear front-facing photo
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative aspect-square rounded-lg overflow-hidden bg-[#f5f1ed]">
                                        <ImageWithFallback
                                            src={overlayResult || userPhoto}
                                            alt="Try-on preview"
                                            className="w-full h-full object-contain"
                                        />
                                        {isProcessing && (
                                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                                <div className="text-white">Processing...</div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                    className="hidden"
                                />
                                {userPhoto && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full mt-2"
                                    >
                                        Change Photo
                                    </Button>
                                )}
                            </div>

                            {/* Right: Controls */}
                            <div className="space-y-6">
                                {/* Design Preview */}
                                <div>
                                    <Label className="mb-2 block">Design</Label>
                                    <div className="aspect-square rounded-lg overflow-hidden bg-[#f5f1ed]">
                                        <ImageWithFallback
                                            src={designImage}
                                            alt="Jewelry design"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                </div>

                                {/* Adjustment Controls */}
                                {userPhoto && (
                                    <div className="space-y-4 p-4 bg-[#f5f1ed] rounded-lg">
                                        <h4 className="font-medium text-[#492f0e] mb-3">
                                            Adjust Position
                                        </h4>

                                        {/* Scale */}
                                        <div>
                                            <Label className="text-sm mb-2 block">
                                                Size: {Math.round(scale[0] * 100)}%
                                            </Label>
                                            <div className="flex items-center gap-2">
                                                <ZoomOut className="size-4 text-gray-500" />
                                                <Slider
                                                    value={scale}
                                                    onValueChange={setScale}
                                                    min={0.5}
                                                    max={2}
                                                    step={0.1}
                                                    className="flex-1"
                                                />
                                                <ZoomIn className="size-4 text-gray-500" />
                                            </div>
                                        </div>

                                        {/* Rotation */}
                                        <div>
                                            <Label className="text-sm mb-2 block">
                                                Rotation: {rotation[0]}°
                                            </Label>
                                            <div className="flex items-center gap-2">
                                                <RotateCw className="size-4 text-gray-500" />
                                                <Slider
                                                    value={rotation}
                                                    onValueChange={setRotation}
                                                    min={-45}
                                                    max={45}
                                                    step={5}
                                                    className="flex-1"
                                                />
                                            </div>
                                        </div>

                                        {/* Reset Button */}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={resetControls}
                                            className="w-full"
                                        >
                                            Reset Position
                                        </Button>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                {overlayResult && (
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={handleDownload}
                                            className="w-full"
                                        >
                                            <Download className="mr-2 size-4" />
                                            Download
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={handleShare}
                                            className="w-full"
                                        >
                                            <Share2 className="mr-2 size-4" />
                                            Share
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tips */}
                        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                            <p className="text-sm text-amber-900">
                                <strong>💡 Tips:</strong> For best results, use a well-lit photo
                                with a clear view of where you want to wear the jewelry. Adjust
                                the size and rotation to match your photo's perspective.
                            </p>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
