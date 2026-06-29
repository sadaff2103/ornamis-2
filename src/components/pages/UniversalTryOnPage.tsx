import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Camera, Upload, Download, X,
    Sparkles,
    Eye, EyeOff, Info, Maximize2,
} from "lucide-react";

import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Slider } from "../ui/slider";
import { toast } from "sonner";
import { BackButton } from "../BackButton";
import { useShop } from "../../contexts/ShopContext";
import { useBooking } from "../../contexts/BookingContext";
import { getProductById, getAllTryOnProducts } from "../../utils/universalTryOn";
import { UnifiedProduct } from "../../data/allProducts";
import { lerp } from "../../utils/tryOnEngine";

// --- Types ---
interface Props {
    onBack?: () => void;

    brandId?: string;
    productId?: string;
}

type TryOnMode = "camera" | "photo" | null;
type CatalogCategory = "Earrings" | "Necklaces" | "Rings" | "Bracelets";

// Landmark indices for FaceMesh
const LM_LEFT_EAR = 361;
const LM_RIGHT_EAR = 132;
const LM_CHIN = 152;
const LM_LEFT_TMP = 356;
const LM_RIGHT_TMP = 127;
const LM_FOREHEAD = 10;
const LM_NOSE_TIP = 1;
const LM_LEFT_CHEEK = 234;
const LM_RIGHT_CHEEK = 454;

function drawJewelryPiece(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    x: number, y: number, sz: number,
    tilt: number, yaw: number, opacity: number
) {
    ctx.save();
    ctx.translate(x, y);

    // Very subtle head-follow rotation (nearly upright)
    ctx.rotate(tilt * 0.1);

    // Extremely subtle perspective skew
    const skewX = yaw * 0.05;
    ctx.transform(1, 0, skewX, 1, 0, 0);

    // Soft drop shadow
    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    ctx.shadowBlur = sz * 0.25;
    ctx.shadowOffsetX = Math.sin(tilt) * sz * 0.05;
    ctx.shadowOffsetY = sz * 0.06;

    // Main jewelry image
    ctx.globalAlpha = opacity;
    ctx.drawImage(img, -sz / 2, -sz / 2, sz, sz);

    // --- Gemini Enhanced Realism: Dynamic Shimmer ---
    // Simulates a video texture/animation reacting to light
    ctx.globalCompositeOperation = 'lighter';
    const time = Date.now() / 1000;
    const shimmerPos = (Math.sin(time * 1.5 + tilt * 2) + 1) / 2; // oscillates 0-1

    ctx.globalAlpha = 0.15 * opacity;
    const shimmer = ctx.createLinearGradient(-sz * 0.8, -sz * 0.8, sz * 0.8, sz * 0.8);
    shimmer.addColorStop(Math.max(0, shimmerPos - 0.2), 'rgba(255,255,255,0)');
    shimmer.addColorStop(shimmerPos, 'rgba(255,250,230,0.6)'); // Golden/White glint
    shimmer.addColorStop(Math.min(1, shimmerPos + 0.2), 'rgba(255,255,255,0)');

    ctx.fillStyle = shimmer;
    ctx.fillRect(-sz / 2, -sz / 2, sz, sz);

    // Subtle metallic shine overlay (static base)
    ctx.globalAlpha = 0.05 * opacity;
    const gradient = ctx.createLinearGradient(-sz / 2, -sz / 2, sz / 2, sz / 2);
    gradient.addColorStop(0, 'rgba(255,255,255,0)');
    gradient.addColorStop(0.5, 'rgba(255,248,220,0.3)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(-sz / 2, -sz / 2, sz, sz);

    ctx.restore();
}

export function UniversalTryOnPage({ onBack, brandId, productId }: Props) {
    const { addToCart } = useShop();
    const { isBooked } = useBooking();



    // Mode & product state
    const [mode, setMode] = useState<TryOnMode>(null);
    const [selectedProduct, setSelectedProduct] = useState<UnifiedProduct | null>(null);
    const [allCatalog, setAllCatalog] = useState<UnifiedProduct[]>([]);
    const [catFilter, setCatFilter] = useState<CatalogCategory>("Necklaces");

    // Camera / photo state
    const [cameraActive, setCameraActive] = useState(false);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [photoPos, setPhotoPos] = useState({ x: 0.5, y: 0.35 });

    // Overlay controls
    const [scale, setScale] = useState([100]);
    const [opacity, setOpacity] = useState([95]);
    const [rotation, setRotation] = useState([0]);
    const [showOverlay, setShowOverlay] = useState(true);
    const [isDragging, setIsDragging] = useState(false);

    // Tracking state
    const smoRef = useRef<Record<string, number>>({});
    const faceDetRef = useRef(false);
    const handsDetRef = useRef(false);
    const fmErrorCount = useRef(0);
    const hErrorCount = useRef(0);
    const MAX_TRACKER_ERRORS = 3;

    // Refs
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const photoCanvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const jewImgRef = useRef<HTMLImageElement | null>(null);
    const rafRef = useRef<number>(0);
    const streamRef = useRef<MediaStream | null>(null);
    const faceMeshRef = useRef<any>(null);
    const handsRef = useRef<any>(null);

    // Mirror refs for render loop (avoids stale closures)
    const selectedProductRef = useRef<UnifiedProduct | null>(null);
    const showOverlayRef = useRef(true);
    const scaleRef = useRef([100]);
    const opacityRef = useRef([95]);

    // Initial Load — pre-select product or load full catalog
    useEffect(() => {
        const catalog = getAllTryOnProducts();
        setAllCatalog(catalog);

        if (brandId && productId) {
            const p = getProductById(brandId, productId);
            if (p) {
                setSelectedProduct(p);
            }
        }
    }, [brandId, productId]);

    // Keep refs in sync with state (for the render loop)
    useEffect(() => { selectedProductRef.current = selectedProduct; }, [selectedProduct]);
    useEffect(() => { showOverlayRef.current = showOverlay; }, [showOverlay]);
    useEffect(() => { scaleRef.current = scale; }, [scale]);
    useEffect(() => { opacityRef.current = opacity; }, [opacity]);

    // Filtered products for the sidebar catalog
    const filteredCatalog = allCatalog.filter(p => p.category === catFilter);

    // Pre-load jewellery image with smart background removal
    useEffect(() => {
        if (!selectedProduct) return;
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = selectedProduct.imageUrl;
        img.onload = () => {
            try {
                const offscreen = document.createElement("canvas");
                const w = img.naturalWidth;
                const h = img.naturalHeight;
                offscreen.width = w;
                offscreen.height = h;
                const octx = offscreen.getContext("2d")!;
                octx.drawImage(img, 0, 0, w, h);

                const imageData = octx.getImageData(0, 0, w, h);
                const d = imageData.data;

                // ── Sample corners to detect background color ──
                const cornerIdxs = [
                    0,
                    (w - 1) * 4,
                    (h - 1) * w * 4,
                    ((h - 1) * w + (w - 1)) * 4,
                    // also mid-edges for more reliable detection
                    Math.floor(w / 2) * 4,
                    ((h - 1) * w + Math.floor(w / 2)) * 4,
                ];
                let bgR = 0, bgG = 0, bgB = 0;
                cornerIdxs.forEach(i => { bgR += d[i]; bgG += d[i + 1]; bgB += d[i + 2]; });
                bgR /= cornerIdxs.length;
                bgG /= cornerIdxs.length;
                bgB /= cornerIdxs.length;

                // ── Detect if background is near-white ──
                const isWhiteBg = bgR > 210 && bgG > 210 && bgB > 210;

                if (isWhiteBg) {
                    // ── Strategy A: Luminance-based white removal ──
                    // More aggressive — strips all very-light pixels regardless of color cast
                    for (let i = 0; i < d.length; i += 4) {
                        const r = d[i], g = d[i + 1], b = d[i + 2];
                        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
                        // Hard cutoff for near-white
                        if (luminance > 240) {
                            d[i + 3] = 0;
                        } else if (luminance > 210) {
                            // Smooth fade zone 210–240
                            d[i + 3] = Math.round(((240 - luminance) / 30) * 255);
                        }
                        // Also strip pixels very close to detected BG color
                        const dist = Math.sqrt((r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2);
                        if (dist < 40) d[i + 3] = 0;
                    }
                } else {
                    // ── Strategy B: Corner-color distance removal (for dark/colored BGs) ──
                    const threshold = 55;
                    const fadeZone = 35;
                    for (let i = 0; i < d.length; i += 4) {
                        const r = d[i], g = d[i + 1], b = d[i + 2];
                        const dist = Math.sqrt((r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2);
                        if (dist < threshold) {
                            d[i + 3] = 0;
                        } else if (dist < threshold + fadeZone) {
                            d[i + 3] = Math.round(((dist - threshold) / fadeZone) * 255);
                        }
                    }
                }

                // ── Edge-smoothing pass: blend any pixel next to a transparent neighbor ──
                // This removes the "halo" / fringe pixels at jewelry borders
                const alpha = new Uint8Array(d.length / 4);
                for (let i = 0; i < d.length; i += 4) alpha[i / 4] = d[i + 3];

                for (let y = 1; y < h - 1; y++) {
                    for (let x = 1; x < w - 1; x++) {
                        const idx = y * w + x;
                        if (alpha[idx] > 0) {
                            const neighbors = [
                                alpha[idx - 1], alpha[idx + 1],
                                alpha[idx - w], alpha[idx + w],
                            ];
                            const minNeighbor = Math.min(...neighbors);
                            if (minNeighbor === 0) {
                                // This pixel touches a transparent pixel — soften it
                                d[idx * 4 + 3] = Math.min(d[idx * 4 + 3], 180);
                            }
                        }
                    }
                }

                octx.putImageData(imageData, 0, 0);

                const processed = new Image();
                processed.onload = () => { jewImgRef.current = processed; };
                processed.src = offscreen.toDataURL("image/png");

            } catch {
                // Fallback: use original image if processing fails (CORS etc)
                jewImgRef.current = img;
            }
        };
    }, [selectedProduct]);

    // --- MediaPipe FaceMesh & Hands ---
    const stopCamera = useCallback(() => {
        streamRef.current?.getTracks().forEach(t => t.stop());
        streamRef.current = null;
        cancelAnimationFrame(rafRef.current);
        faceMeshRef.current?.close?.();
        handsRef.current?.close?.();
        faceMeshRef.current = null;
        handsRef.current = null;
        fmErrorCount.current = 0;
        hErrorCount.current = 0;
        setCameraActive(false);
    }, []);

    const startCamera = useCallback(async () => {
        // Guard: don't start if already running
        if (streamRef.current) return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
                audio: false,
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setCameraActive(true);

                try {
                    await videoRef.current.play();
                } catch (playErr) {
                    console.warn("⚠️ Video play() failed");
                }

                startRenderLoop();
                initTrackers();
            }
        } catch (e) {
            toast.error("Camera access denied. Try Photo mode.");
            setMode("photo");
        }
    }, []);

    const initTrackers = useCallback(async () => {
        // ── Step 1: Load FaceMesh FIRST and wait for it to fully initialize ──
        // These modules share a global WASM Module object and MUST be loaded
        // sequentially, never with Promise.all, or their locateFile functions collide.
        try {
            const { FaceMesh } = await import("@mediapipe/face_mesh");
            const fm = new FaceMesh({
                locateFile: (f: string) =>
                    `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/${f}`
            });
            fm.setOptions({
                maxNumFaces: 1,
                refineLandmarks: true,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5,
            });
            fm.onResults((results: any) => {
                const lms = results.multiFaceLandmarks?.[0];
                faceDetRef.current = !!lms;
                if (!lms) return;

                const s = smoRef.current;
                const W = videoRef.current?.videoWidth || 640;
                const H = videoRef.current?.videoHeight || 480;
                const sm = (k: string, v: number) => {
                    s[k] = s[k] !== undefined ? lerp(s[k], v) : v;
                };

                sm("lEx", lms[LM_LEFT_EAR].x * W); sm("lEy", lms[LM_LEFT_EAR].y * H);
                sm("rEx", lms[LM_RIGHT_EAR].x * W); sm("rEy", lms[LM_RIGHT_EAR].y * H);
                sm("cX", lms[LM_CHIN].x * W); sm("cY", lms[LM_CHIN].y * H);
                sm("ltX", lms[LM_LEFT_TMP].x * W); sm("ltY", lms[LM_LEFT_TMP].y * H);
                sm("rtX", lms[LM_RIGHT_TMP].x * W); sm("rtY", lms[LM_RIGHT_TMP].y * H);
                sm("fhY", lms[LM_FOREHEAD].y * H);
                sm("nX", lms[LM_NOSE_TIP].x * W); sm("nY", lms[LM_NOSE_TIP].y * H);
                sm("lcX", lms[LM_LEFT_CHEEK].x * W); sm("rcX", lms[LM_RIGHT_CHEEK].x * W);

                // Head pose: tilt (roll) and yaw
                const tilt = Math.atan2(lms[LM_RIGHT_EAR].y - lms[LM_LEFT_EAR].y, lms[LM_RIGHT_EAR].x - lms[LM_LEFT_EAR].x);
                sm("headTilt", tilt);
                const faceCenter = (lms[LM_LEFT_CHEEK].x + lms[LM_RIGHT_CHEEK].x) / 2;
                const noseOff = lms[LM_NOSE_TIP].x - faceCenter;
                sm("headYaw", noseOff * 4);
            });

            // Initialize FaceMesh with a blank frame to fully load its WASM
            // before we touch the Hands module
            if (videoRef.current && videoRef.current.readyState >= 2) {
                await fm.send({ image: videoRef.current });
            }
            faceMeshRef.current = fm;
            console.log("✅ FaceMesh initialized");
        } catch (e) {
            console.warn("⚠️ FaceMesh init failed, continuing without face tracking:", e);
        }

        // ── Step 2: Load Hands AFTER FaceMesh is done ──
        try {
            const { Hands } = await import("@mediapipe/hands");
            const h = new Hands({
                locateFile: (f: string) =>
                    `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4/${f}`
            });
            h.setOptions({
                maxNumHands: 1,
                modelComplexity: 1,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5,
            });
            h.onResults((results: any) => {
                const lms = results.multiHandLandmarks?.[0];
                handsDetRef.current = !!lms;
                if (!lms) return;

                const s = smoRef.current;
                const W = videoRef.current?.videoWidth || 640;
                const H = videoRef.current?.videoHeight || 480;
                const sm = (k: string, v: number) => {
                    s[k] = s[k] !== undefined ? lerp(s[k], v) : v;
                };

                sm("hX", lms[13].x * W);
                sm("hY", lms[13].y * H);
                sm("hRot", Math.atan2(lms[0].y - lms[9].y, lms[0].x - lms[9].x));

                // Wrist Tracking: landmark 0 is the wrist center
                sm("wX", lms[0].x * W);
                sm("wY", lms[0].y * H);
                // Orientation: from wrist to middle finger base (9)
                sm("wRot", Math.atan2(
                    lms[9].y - lms[0].y,
                    lms[9].x - lms[0].x
                ) + Math.PI / 2); // Perp to arm

                // Wrist width estimation: distance between 1 and 17 (thumb base to pinky base)
                const wristWidthPx = Math.hypot(
                    (lms[1].x - lms[17].x) * W,
                    (lms[1].y - lms[17].y) * H
                ) * 1.2;
                sm("wW", wristWidthPx);

                // Ring finger: landmark 14 = ring PIP, 13 = ring MCP
                // Use these for precise ring placement on the ring finger
                sm("rfX", lms[14].x * W);
                sm("rfY", lms[14].y * H);
                // Rotation: angle of ring finger segment
                sm("rfRot", Math.atan2(
                    lms[13].y - lms[14].y,
                    lms[13].x - lms[14].x
                ));
                // Finger width: distance between adjacent finger MCPs (9 and 13) / 4
                const fingerWidthPx = Math.hypot(
                    (lms[9].x - lms[13].x) * W,
                    (lms[9].y - lms[13].y) * H
                ) * 0.9;
                sm("rfW", fingerWidthPx);
            });

            handsRef.current = h;
            console.log("✅ Hands initialized");
        } catch (e) {
            console.warn("⚠️ Hands init failed, continuing without hand tracking:", e);
        }

        // Render loop is already running from startCamera — trackers
        // will be picked up automatically via refs
    }, []);

    const startRenderLoop = useCallback(() => {
        const draw = async () => {
            const canvas = canvasRef.current;
            const video = videoRef.current;
            if (!canvas || !video || video.readyState < 2) {
                rafRef.current = requestAnimationFrame(draw);
                return;
            }

            const W = video.videoWidth;
            const H = video.videoHeight;
            canvas.width = W;
            canvas.height = H;
            const ctx = canvas.getContext("2d")!;

            // 1. Clear the canvas so the video underneath is visible
            ctx.clearRect(0, 0, W, H);

            // Send frames to trackers (error counting prevents infinite error loops)
            const fm = faceMeshRef.current;
            const h = handsRef.current;
            if (fm && fmErrorCount.current < MAX_TRACKER_ERRORS) {
                try { await fm.send({ image: video }); fmErrorCount.current = 0; }
                catch { fmErrorCount.current++; }
            }
            if (h && hErrorCount.current < MAX_TRACKER_ERRORS) {
                try { await h.send({ image: video }); hErrorCount.current = 0; }
                catch { hErrorCount.current++; }
            }

            // 3. Draw jewelry with photorealistic effects
            const product = selectedProductRef.current;
            const overlay = showOverlayRef.current;
            const sc = scaleRef.current[0] / 100;
            const op = opacityRef.current[0] / 100;

            if (overlay && jewImgRef.current && product) {
                const s = smoRef.current;
                const cat = product.category;
                const img = jewImgRef.current;
                const tilt = s["headTilt"] || 0;
                const yaw = s["headYaw"] || 0;

                if (cat === "Earrings" && s["lEx"]) {
                    const faceW = Math.abs(s["rtX"] - s["ltX"]);
                    const sz = faceW * 0.3 * sc;

                    // Left earring with subtle swing
                    const swingL = Math.sin(Date.now() / 800) * tilt * 2;
                    drawJewelryPiece(ctx, img,
                        s["lEx"], s["lEy"] + sz * 0.3 + swingL,
                        sz, tilt, yaw, op
                    );

                    // Right earring
                    const swingR = Math.sin(Date.now() / 800 + 0.5) * tilt * 2;
                    drawJewelryPiece(ctx, img,
                        s["rEx"], s["rEy"] + sz * 0.3 + swingR,
                        sz, tilt, yaw, op
                    );
                }
                else if (cat === "Necklaces" && s["cX"]) {
                    const faceH = Math.abs(s["cY"] - s["fhY"]);
                    const sz = faceH * 1.4 * sc;
                    const cx = (s["lEx"] + s["rEx"]) / 2;
                    const cy = s["cY"] + faceH * 0.25;
                    drawJewelryPiece(ctx, img, cx, cy, sz, tilt, yaw, op);
                }
                else if (cat === "Rings" && s["rfX"]) {
                    // Gemstone-only overlay: anchor to ring finger PIP joint
                    const sz = (s["rfW"] || 60) * 1.6 * sc;
                    drawJewelryPiece(ctx, img, s["rfX"], s["rfY"], sz, s["rfRot"] || 0, 0, op);
                }
                else if (cat === "Bracelets" && s["wX"]) {
                    // Same as rings: stamp the isolated front-arc sticker centered on the wrist.
                    // Sticker images are already isolated front-view arcs on transparent BG,
                    // so only the front portion is visible — identical pattern to ring gemstones.
                    const sz = (s["wW"] || 80) * 2.0 * sc;

                    // Use 'multiply' blend before drawing so any residual white/light fringe
                    // becomes transparent over skin tones — making the overlay hand-friendly
                    ctx.globalCompositeOperation = "multiply";
                    drawJewelryPiece(ctx, img, s["wX"], s["wY"], sz, s["wRot"] || 0, 0, op);
                    ctx.globalCompositeOperation = "source-over"; // reset for other elements
                }
                else {
                    // Fallback: center of frame
                    const sz = 200 * sc;
                    drawJewelryPiece(ctx, img, W / 2, H / 2, sz, 0, 0, op);
                }
            }

            rafRef.current = requestAnimationFrame(draw);
        };
        draw();
    }, []); // No deps — reads everything from refs

    // Handle Screenshot
    const handleScreenshot = () => {
        const target = mode === "camera" ? canvasRef.current : photoCanvasRef.current;
        if (!target) return;
        const link = document.createElement("a");
        link.download = `ornamis-tryon-${selectedProduct?.name || 'look'}.png`;
        link.href = target.toDataURL("image/png");
        link.click();
        toast.success("Look saved to gallery! ✨");
    };

    // --- Photo Mode Render ---
    useEffect(() => {
        if (mode !== "photo" || !uploadedImage || !photoCanvasRef.current) return;
        const canvas = photoCanvasRef.current;
        const ctx = canvas.getContext("2d")!;
        const bg = new Image();
        bg.src = uploadedImage;
        bg.onload = () => {
            canvas.width = bg.width;
            canvas.height = bg.height;
            ctx.drawImage(bg, 0, 0);

            if (showOverlay && jewImgRef.current) {
                const sc = scale[0] / 100;
                const sz = Math.min(canvas.width, canvas.height) * 0.3 * sc;
                const x = photoPos.x * canvas.width;
                const y = photoPos.y * canvas.height;
                const rot = (rotation[0] * Math.PI) / 180;

                ctx.save();
                ctx.globalAlpha = opacity[0] / 100;
                ctx.translate(x, y);
                ctx.rotate(rot);
                ctx.drawImage(jewImgRef.current, -sz / 2, -sz / 2, sz, sz);
                ctx.restore();
            }
        };
    }, [mode, uploadedImage, showOverlay, selectedProduct, scale, opacity, photoPos, rotation]);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-['Inter',sans-serif]">
            {/* Header */}
            <header className="p-4 flex items-center justify-between border-b border-white/10 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <BackButton onClick={onBack} />
                    <div>
                        <h1 className="text-lg font-bold font-['Cinzel',serif] text-gold-gradient bg-clip-text text-transparent bg-gradient-to-r from-[#d4af37] via-[#f4e5b8] to-[#d4af37]">
                            ORAMIS AR STUDIO
                        </h1>
                        <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em]">Universal Try-On Engine</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-white/10 bg-white/5 hover:bg-white/10" onClick={handleScreenshot}>
                        <Download className="size-4 mr-2" /> Save Look
                    </Button>
                    <button onClick={() => { stopCamera(); onBack?.(); }} className="p-2 hover:bg-white/10 rounded-full">
                        <X className="size-5" />
                    </button>
                </div>
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-4 h-[calc(100vh-72px)] overflow-hidden">
                {/* Product Sidebar */}
                <div className="lg:col-span-1 border-r border-white/10 bg-[#0d0d0d] overflow-y-auto p-4 custom-scrollbar hidden lg:block">
                    {/* Selected product card */}
                    {selectedProduct && (
                        <Card className="bg-white/5 border-white/10 p-3 mb-4">
                            <div className="flex gap-3">
                                <div className="size-16 rounded-lg bg-white p-1 overflow-hidden flex-shrink-0">
                                    <img src={selectedProduct.imageUrl} alt="" className="w-full h-full object-contain" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-['Cinzel',serif] text-[#f4e5b8] text-xs font-bold truncate">{selectedProduct.name}</h3>
                                    <p className="text-gray-500 text-[10px] mb-1">{selectedProduct.store} • {selectedProduct.category}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gold text-xs font-bold">{selectedProduct.price}</span>
                                        {isBooked(selectedProduct.id) ? (
                                            <Badge className="bg-red-500/20 text-red-500 border-red-500/40 text-[10px] h-6 px-2">
                                                Reserved
                                            </Badge>
                                        ) : (
                                            <Button size="sm" className="bg-[#d4af37] hover:bg-[#b8985f] text-black font-bold h-6 text-[10px] px-2" onClick={() => addToCart(selectedProduct as any)}>
                                                Add to Cart
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Category tabs */}
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Select Jewelry</h2>
                    <div className="grid grid-cols-2 gap-1 mb-4 bg-white/5 p-1 rounded-lg">
                        {(["Necklaces", "Earrings"] as CatalogCategory[]).map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCatFilter(cat)}
                                className={`px-2 py-1.5 rounded text-[10px] font-bold transition-all ${catFilter === cat
                                    ? 'bg-[#d4af37] text-black'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-1 mb-4 bg-white/5 p-1 rounded-lg">
                        {(["Rings", "Bracelets"] as CatalogCategory[]).map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCatFilter(cat)}
                                className={`px-2 py-1.5 rounded text-[10px] font-bold transition-all ${catFilter === cat
                                    ? 'bg-[#d4af37] text-black'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Product list */}
                    <div className="space-y-2">
                        {filteredCatalog.map(p => (
                            <div
                                key={p.id}
                                onClick={() => {
                                    setSelectedProduct(p);
                                }}
                                className={`flex gap-3 p-2 rounded-lg cursor-pointer transition-all border ${selectedProduct?.id === p.id
                                    ? 'bg-[#d4af37]/10 border-[#d4af37]'
                                    : 'hover:bg-white/5 border-transparent'
                                    }`}
                            >
                                <div className="size-12 rounded bg-white p-0.5 overflow-hidden flex-shrink-0">
                                    <img src={p.imageUrl} alt="" className="w-full h-full object-contain" />
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center justify-between gap-1">
                                        <p className="text-[11px] font-bold text-white truncate">{p.name}</p>
                                        {isBooked(p.id) && (
                                            <Badge className="bg-red-500/20 text-red-500 border-red-500/40 text-[8px] py-0 h-3 px-1">
                                                Reserved
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-gray-500">{p.price}</p>
                                    <Badge variant="outline" className="text-[8px] py-0 h-4 border-white/20 text-gray-400 mt-0.5">
                                        {p.store}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                        {filteredCatalog.length === 0 && (
                            <p className="text-gray-500 text-xs text-center py-4">No products in this category</p>
                        )}
                    </div>
                </div>

                {/* Main Viewport */}
                <div className="lg:col-span-2 relative bg-black flex flex-col">
                    {/* Viewport Toolbar */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2">
                        <div className="flex gap-2 bg-black/40 backdrop-blur-md p-1 rounded-full border border-white/10">
                            <button
                                onClick={() => { setMode("camera"); startCamera(); }}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${mode === "camera" ? 'bg-[#d4af37] text-black' : 'text-gray-400 hover:text-white'}`}
                            >
                                <Camera className="size-3" /> LIVE AR
                            </button>
                            <button
                                onClick={() => { stopCamera(); setMode("photo"); fileInputRef.current?.click(); }}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${mode === "photo" ? 'bg-[#d4af37] text-black' : 'text-gray-400 hover:text-white'}`}
                            >
                                <Upload className="size-3" /> PHOTO
                            </button>
                        </div>

                        {selectedProduct && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-[#492f0e] text-[#f4e5b8] px-4 py-1 rounded-full text-xs font-bold shadow-lg border border-[#d4af37]/30 font-['Cinzel',serif]"
                            >
                                {selectedProduct.name}
                            </motion.div>
                        )}
                    </div>


                    <div className="flex-1 relative overflow-hidden flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            {mode === "camera" ? (
                                <motion.div key="camera" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black flex items-center justify-center">
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        className="absolute inset-0 w-full h-full object-contain scale-x-[-1]"
                                        style={{ zIndex: 5 }}
                                    />
                                    <canvas
                                        ref={canvasRef}
                                        className="absolute inset-0 w-full h-full object-contain scale-x-[-1] z-10 pointer-events-none"
                                    />


                                    {!cameraActive && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a]">
                                            <div className="text-center">
                                                <div className="size-12 border-2 border-[#d4af37]/20 border-t-[#d4af37] rounded-full animate-spin mx-auto mb-4" />
                                                <p className="font-['Cinzel',serif] text-sm text-[#d4af37]">Initializing Studios...</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Hand tracking prompt for Bracelets */}
                                    {cameraActive && selectedProduct?.category === 'Bracelets' && !handsDetRef.current && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
                                        >
                                            <div className="flex items-center gap-3 bg-black/70 backdrop-blur-md border border-[#d4af37]/40 rounded-2xl px-5 py-3 shadow-[0_0_30px_rgba(212,175,55,0.15)]">
                                                <motion.div
                                                    animate={{ scale: [1, 1.15, 1], rotate: [0, -10, 10, 0] }}
                                                    transition={{ duration: 1.8, repeat: Infinity }}
                                                    className="text-2xl select-none"
                                                >🤚</motion.div>
                                                <div>
                                                    <p className="text-[#f4e5b8] text-xs font-bold uppercase tracking-widest">Show Your Hand</p>
                                                    <p className="text-[#d4b896]/60 text-[10px] mt-0.5">Hold your wrist up to the camera to try on the bracelet</p>
                                                </div>
                                            </div>
                                            <motion.div
                                                animate={{ opacity: [0.3, 1, 0.3] }}
                                                transition={{ duration: 1.5, repeat: Infinity }}
                                                className="text-[10px] text-[#d4af37] uppercase tracking-[0.25em] font-bold"
                                            >
                                                Scanning for hand...
                                            </motion.div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            ) : mode === "photo" ? (
                                <motion.div key="photo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center">
                                    {uploadedImage ? (
                                        <div className="relative w-full h-full flex items-center justify-center p-8">
                                            <canvas
                                                ref={photoCanvasRef}
                                                className="max-w-full max-h-full object-contain shadow-2xl rounded-lg cursor-crosshair"
                                                onMouseDown={() => setIsDragging(true)}
                                                onMouseUp={() => setIsDragging(false)}
                                                onMouseLeave={() => setIsDragging(false)}
                                                onMouseMove={(e) => {
                                                    if (!isDragging) return;
                                                    const rect = e.currentTarget.getBoundingClientRect();
                                                    setPhotoPos({
                                                        x: (e.clientX - rect.left) / rect.width,
                                                        y: (e.clientY - rect.top) / rect.height
                                                    });
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="text-center p-8 border-2 border-dashed border-white/10 rounded-2xl">
                                            <div className="size-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                                                <Upload className="size-8 text-gray-500" />
                                            </div>
                                            <h3 className="font-['Cinzel',serif] text-[#f4e5b8] mb-2">Upload your Canvas</h3>
                                            <p className="text-xs text-gray-500 mb-6">Drag and drop or select a high-quality selfie</p>
                                            <Button className="bg-[#d4af37] text-black" onClick={() => fileInputRef.current?.click()}>
                                                Select Portrait
                                            </Button>
                                        </div>
                                    )}
                                </motion.div>
                            ) : (
                                <div key="fallback" className="text-center">
                                    <div className="size-24 rounded-full bg-gradient-to-br from-[#d4af37]/20 to-transparent flex items-center justify-center mx-auto mb-6">
                                        <Maximize2 className="size-10 text-[#d4af37]" />
                                    </div>
                                    <h2 className="font-['Cinzel',serif] text-2xl mb-2 text-white/90">Step into the Studio</h2>
                                    <p className="text-sm text-gray-500 max-w-xs mx-auto mb-8">Choose your mode to experience high-fidelity virtual try-on.</p>
                                    <div className="flex gap-4 justify-center">
                                        <Button className="bg-[#d4af37] text-black" onClick={() => { setMode("camera"); startCamera(); }}>
                                            Live Camera
                                        </Button>
                                        <Button variant="outline" className="border-white/20 text-white" onClick={() => setMode("photo")}>
                                            Upload Photo
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                        onChange={e => {
                            const f = e.target.files?.[0];
                            if (f) {
                                const r = new FileReader();
                                r.onload = ev => setUploadedImage(ev.target?.result as string);
                                r.readAsDataURL(f);
                            }
                        }}
                    />

                    {/* Hint text */}
                    {mode && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 bg-black/40 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/5 flex items-center gap-2">
                            <Info className="size-3 outline-none" />
                            {mode === "camera"
                                ? selectedProduct?.category === 'Bracelets'
                                    ? "🤚 Raise your wrist to the camera — bracelet tracks your hand in real-time."
                                    : "Ensure good lighting for better face detection. Mirrors your movement."
                                : "Click and drag to position the jewelry on your portrait."}
                        </div>
                    )}
                </div>

                {/* Controls Sidebar */}
                <div className="lg:col-span-1 border-l border-white/10 bg-[#0d0d0d] p-6 space-y-8 overflow-y-auto custom-scrollbar">
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Adjustments</h2>
                            <button onClick={() => { setScale([100]); setOpacity([95]); setRotation([0]); }} className="text-[10px] text-[#d4af37] hover:underline font-bold">RESET</button>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <div className="flex justify-between text-[11px] font-medium">
                                    <span className="text-gray-400">Scale</span>
                                    <span className="text-[#d4af37]">{scale[0]}%</span>
                                </div>
                                <Slider value={scale} onValueChange={setScale} min={10} max={250} step={2} />
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-[11px] font-medium">
                                    <span className="text-gray-400">Opacity</span>
                                    <span className="text-[#d4af37]">{opacity[0]}%</span>
                                </div>
                                <Slider value={opacity} onValueChange={setOpacity} min={0} max={100} step={1} />
                            </div>

                            {mode === "photo" && (
                                <div className="space-y-3">
                                    <div className="flex justify-between text-[11px] font-medium">
                                        <span className="text-gray-400">Rotation</span>
                                        <span className="text-[#d4af37]">{rotation[0]}°</span>
                                    </div>
                                    <Slider value={rotation} onValueChange={setRotation} min={-180} max={180} step={1} />
                                </div>
                            )}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Quick Tools</h2>
                        <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" className="h-10 border-white/10 bg-white/5 text-[11px]" onClick={() => setShowOverlay(!showOverlay)}>
                                {showOverlay ? <Eye className="size-3 mr-2" /> : <EyeOff className="size-3 mr-2" />}
                                {showOverlay ? "Hide" : "Show"}
                            </Button>
                            <Button variant="outline" className="h-10 border-white/10 bg-white/5 text-[11px]" onClick={handleScreenshot}>
                                <Download className="size-3 mr-2" />
                                Snapshot
                            </Button>
                        </div>
                    </section>

                    <section className="pt-8 border-t border-white/5">
                        <div className="bg-gradient-to-br from-[#d4af37]/20 to-transparent p-4 rounded-xl border border-[#d4af37]/10">
                            <h4 className="text-[11px] font-bold text-[#f4e5b8] flex items-center gap-2 mb-2">
                                <Sparkles className="size-3" /> LUXURY TRACKING
                            </h4>
                            <p className="text-[10px] text-gray-400 leading-relaxed mb-4">
                                Our AI detects {(selectedProduct?.category === 'Rings' || selectedProduct?.category === 'Bracelets') ? 'hand & wrist landmarks' : 'face contours'} to automatically anchor the piece.
                            </p>
                            <div className="flex items-center gap-3">
                                <div className={`size-1.5 rounded-full ${((selectedProduct?.category === 'Rings' || selectedProduct?.category === 'Bracelets') ? handsDetRef.current : faceDetRef.current) ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-white/10'}`} />
                                <span className="text-[9px] font-bold tracking-widest uppercase">
                                    {(selectedProduct?.category === 'Rings' || selectedProduct?.category === 'Bracelets') ? 'Tracking Hand & Wrist' : 'Tracking Face'}
                                </span>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <style>{`
                .text-gold { color: #d4af37; }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(212,175,55,0.3); }
                .text-gold-gradient {
                    background: linear-gradient(135deg, #d4af37 0%, #f4e5b8 50%, #d4af37 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            `}</style>
        </div>
    );
}
