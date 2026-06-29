import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import {
    Camera, Upload, Download, X,
    ShoppingCart, Sparkles, Heart,
    Eye, EyeOff, Info
} from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Slider } from "../ui/slider";
import { toast } from "sonner";
import { BackButton } from "../BackButton";
import { useShop } from "../../contexts/ShopContext";
import { jauhariProducts, type JProduct } from "../../data/jauhariProducts";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Props {
    onNavigate?: (page: string, params?: any) => void;
    onBack?: () => void;
    initialProductId?: string;
}

type TryOnMode = "camera" | "photo" | null;
type JewelryCategory = "All" | "Rings" | "Necklaces" | "Earrings" | "Bracelets" | "Sets";

// ─── Landmark indices for FaceMesh ─────────────────────────────────────────
const LM_LEFT_EAR = 361;
const LM_RIGHT_EAR = 132;
const LM_CHIN = 152;
const LM_LEFT_TMP = 356;
const LM_RIGHT_TMP = 127;
const LM_NOSE_TIP = 4;
const LM_FOREHEAD = 10;

// ─── EMA Smoothing ─────────────────────────────────────────────────────────
const ALPHA = 0.35;
function lerp(a: number, b: number) { return a * (1 - ALPHA) + b * ALPHA; }

// ─── Category → placement type ────────────────────────────────────────────
function placementFor(cat: string): "earring" | "necklace" | "ring" | "bangle" {
    if (cat === "Earrings") return "earring";
    if (cat === "Necklaces") return "necklace";
    if (cat === "Rings") return "ring";
    return "bangle";
}

// ─── Canvas overlay helper ─────────────────────────────────────────────────
function drawJewelry(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    x: number, y: number,
    size: number,
    angle = 0,
    opacity = 1,
    flipX = false
) {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.translate(x, y);
    ctx.rotate(angle);
    if (flipX) ctx.scale(-1, 1);
    ctx.drawImage(img, -size / 2, -size / 2, size, size);
    ctx.restore();
}

// ─── Main Component ────────────────────────────────────────────────────────

export function JauhariTryOnPage({ onNavigate, onBack, initialProductId }: Props) {
    const { addToCart, toggleWishlist, isInWishlist } = useShop();

    // Mode & product state
    const [mode, setMode] = useState<TryOnMode>(null);
    const [selectedProduct, setSelectedProduct] = useState<JProduct | null>(() =>
        initialProductId ? jauhariProducts.find(p => p.id === initialProductId) ?? null : null
    );
    const [catFilter, setCatFilter] = useState<JewelryCategory>("All");

    // Camera / photo state
    const [cameraActive, setCameraActive] = useState(false);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [photoPos, setPhotoPos] = useState({ x: 0.5, y: 0.35 }); // normalized

    // Overlay controls
    const [scale, setScale] = useState([85]);
    const [opacity, setOpacity] = useState([90]);
    const [showOverlay, setShowOverlay] = useState(true);
    const [isDragging, setIsDragging] = useState(false);

    // Tracking state (smoothed landmarks)
    const smoRef = useRef<Record<string, number>>({});
    const faceDetRef = useRef(false);

    // Refs
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const photoCanvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const jewImgRef = useRef<HTMLImageElement | null>(null);
    const rafRef = useRef<number>(0);
    const streamRef = useRef<MediaStream | null>(null);
    const faceMeshRef = useRef<any>(null);

    // Pre-load jewellery image whenever product changes
    useEffect(() => {
        if (!selectedProduct) return;
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = selectedProduct.images[0];
        img.onload = () => { jewImgRef.current = img; };
    }, [selectedProduct]);

    // ── Filtered product list ───────────────────────────────────────────────
    const filteredProducts = catFilter === "All"
        ? jauhariProducts
        : jauhariProducts.filter(p => p.category === catFilter);

    // ── Camera start ───────────────────────────────────────────────────────
    const startCamera = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
                audio: false,
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
                setCameraActive(true);
                toast.success("Camera active! Select jewellery to try on.");
                initFaceMesh();
            }
        } catch (e: any) {
            toast.error("Camera access denied. Try the Photo mode instead.");
        }
    }, []);

    const stopCamera = useCallback(() => {
        streamRef.current?.getTracks().forEach(t => t.stop());
        streamRef.current = null;
        cancelAnimationFrame(rafRef.current);
        faceMeshRef.current?.close?.();
        faceMeshRef.current = null;
        setCameraActive(false);
        faceDetRef.current = false;
    }, []);

    // ── MediaPipe FaceMesh init ────────────────────────────────────────────
    const initFaceMesh = useCallback(async () => {
        try {
            // Dynamic import for FaceMesh
            const { FaceMesh } = await import("@mediapipe/face_mesh");
            const fm = new FaceMesh({
                locateFile: (f: string) =>
                    `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/${f}`,
            });
            fm.setOptions({
                maxNumFaces: 1,
                refineLandmarks: true,
                minDetectionConfidence: 0.6,
                minTrackingConfidence: 0.5,
            });

            fm.onResults((results: any) => {
                const lms = results.multiFaceLandmarks?.[0];
                faceDetRef.current = !!lms;
                if (!lms) return;

                const s = smoRef.current;
                const v = videoRef.current;
                if (!v) return;
                const W = v.videoWidth || 640;
                const H = v.videoHeight || 480;

                const px = (i: number) => lms[i].x * W;
                const py = (i: number) => lms[i].y * H;

                // Smooth helpers
                const sm = (key: string, val: number) => {
                    s[key] = s[key] !== undefined ? lerp(s[key], val) : val;
                    return s[key];
                };

                sm("lEx", px(LM_LEFT_EAR)); sm("lEy", py(LM_LEFT_EAR));
                sm("rEx", px(LM_RIGHT_EAR)); sm("rEy", py(LM_RIGHT_EAR));
                sm("cX", px(LM_CHIN)); sm("cY", py(LM_CHIN));
                sm("ltX", px(LM_LEFT_TMP)); sm("ltY", py(LM_LEFT_TMP));
                sm("rtX", px(LM_RIGHT_TMP)); sm("rtY", py(LM_RIGHT_TMP));
                sm("nX", px(LM_NOSE_TIP)); sm("nY", py(LM_NOSE_TIP));
                sm("fhX", px(LM_FOREHEAD)); sm("fhY", py(LM_FOREHEAD));
            });

            faceMeshRef.current = fm;
            startRenderLoop(fm);
        } catch (e) {
            // FaceMesh unavailable — still render with no tracking
            startRenderLoop(null);
        }
    }, []);

    // ── Render loop ────────────────────────────────────────────────────────
    const startRenderLoop = useCallback((fm: any) => {
        const draw = async () => {
            const canvas = canvasRef.current;
            const video = videoRef.current;
            if (!canvas || !video || video.readyState < 2) {
                rafRef.current = requestAnimationFrame(draw);
                return;
            }

            const W = video.videoWidth || canvas.width;
            const H = video.videoHeight || canvas.height;
            canvas.width = W;
            canvas.height = H;
            const ctx = canvas.getContext("2d")!;

            // Send frame to FaceMesh
            try { await fm?.send({ image: video }); } catch { }

            // Mirror + draw video, but only clear/draw video frame
            ctx.save();
            ctx.scale(-1, 1);
            ctx.drawImage(video, -W, 0, W, H);
            ctx.restore();

            // Draw jewellery overlay
            if (showOverlay && jewImgRef.current && selectedProduct) {
                const s = smoRef.current;
                const placement = placementFor(selectedProduct.category);
                const sc = scale[0] / 100;
                const op = opacity[0] / 100;
                const img = jewImgRef.current;

                if (placement === "earring" && s["lEx"] !== undefined) {
                    // Face detected — use landmark positions
                    const faceW = Math.abs(s["rtX"] - s["ltX"]);
                    const earSize = Math.max(30, faceW * 0.22) * sc;
                    // Left ear — mirrored canvas so LEFT on screen = right ear landmark
                    drawJewelry(ctx, img, W - s["lEx"], s["lEy"] + earSize * 0.1, earSize, 0, op);
                    drawJewelry(ctx, img, W - s["rEx"], s["rEy"] + earSize * 0.1, earSize, 0, op);

                } else if (placement === "necklace" && s["cX"] !== undefined) {
                    const faceH = Math.abs(s["cY"] - s["fhY"]);
                    const neckSize = Math.max(60, faceH * 0.8) * sc;
                    const nx = W - (s["lEx"] + s["rEx"]) / 2;
                    const ny = s["cY"] + faceH * 0.15;
                    drawJewelry(ctx, img, nx, ny, neckSize, 0, op);

                } else if (placement === "ring" || placement === "bangle") {
                    // No hand tracking yet — default center-bottom position
                    const sz = 100 * sc;
                    drawJewelry(ctx, img, W / 2, H * 0.75, sz, 0, op);

                } else {
                    // No face detected yet — show floating centered preview
                    const sz = 80 * sc;
                    drawJewelry(ctx, img, W / 2, H / 2, sz, 0, op * 0.6);
                    // Hint text
                    ctx.font = "bold 14px sans-serif";
                    ctx.fillStyle = "rgba(212,175,55,0.9)";
                    ctx.textAlign = "center";
                    ctx.fillText("Position your face in frame", W / 2, H - 20);
                }
            }

            rafRef.current = requestAnimationFrame(draw);
        };
        rafRef.current = requestAnimationFrame(draw);
    }, [showOverlay, selectedProduct, scale, opacity]);

    // Restart render loop when overlay params change
    useEffect(() => {
        if (!cameraActive) return;
        cancelAnimationFrame(rafRef.current);
        startRenderLoop(faceMeshRef.current);
    }, [showOverlay, selectedProduct, scale, opacity, cameraActive, startRenderLoop]);

    // ── Photo mode canvas ──────────────────────────────────────────────────
    useEffect(() => {
        if (!uploadedImage || !photoCanvasRef.current) return;
        const canvas = photoCanvasRef.current;
        const ctx = canvas.getContext("2d")!;

        const bgImg = new Image();
        bgImg.onload = () => {
            canvas.width = bgImg.naturalWidth;
            canvas.height = bgImg.naturalHeight;
            ctx.drawImage(bgImg, 0, 0);

            if (showOverlay && jewImgRef.current) {
                const sc = scale[0] / 100;
                const op = opacity[0] / 100;
                const sz = Math.min(canvas.width, canvas.height) * 0.22 * sc;
                const px = photoPos.x * canvas.width;
                const py = photoPos.y * canvas.height;
                drawJewelry(ctx, jewImgRef.current, px, py, sz, 0, op);
            }
        };
        bgImg.src = uploadedImage;
    }, [uploadedImage, showOverlay, scale, opacity, photoPos, selectedProduct]);

    // ── Screenshot ────────────────────────────────────────────────────────
    const handleScreenshot = useCallback(() => {
        const canvas = mode === "camera" ? canvasRef.current : photoCanvasRef.current;
        if (!canvas) return;
        const link = document.createElement("a");
        link.download = `jauhari-tryon-${Date.now()}.jpg`;
        link.href = canvas.toDataURL("image/jpeg", 0.92);
        link.click();
        toast.success("📸 Look saved to your device!");
    }, [mode]);

    // ── Add to cart ───────────────────────────────────────────────────────
    const handleAddToCart = () => {
        if (!selectedProduct) return;
        addToCart({
            id: selectedProduct.id,
            image: selectedProduct.images[0],
            title: selectedProduct.name,
            price: selectedProduct.price,
            priceValue: selectedProduct.priceValue,
            category: selectedProduct.category,
            material: selectedProduct.material,
            style: selectedProduct.style,
            storeName: "Jauhari",
            storeSlug: "jauhari",
        });
        toast.success(`${selectedProduct.name} added to cart!`);
    };

    // ── Cleanup ───────────────────────────────────────────────────────────
    useEffect(() => () => { stopCamera(); }, [stopCamera]);

    // ── Photo drag handlers ───────────────────────────────────────────────
    const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDragging || mode !== "photo") return;
        const rect = e.currentTarget.getBoundingClientRect();
        setPhotoPos({
            x: Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)),
            y: Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)),
        });
    };

    // ─────────────────────────────────────────────────────────────────────────
    // ── RENDER ────────────────────────────────────────────────────────────────
    // ─────────────────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #1a1510 50%, #0d0d0d 100%)" }}>
            {/* ── Nav ── */}
            <div className="max-w-7xl mx-auto px-4 pt-4 pb-2">
                <div className="flex items-center gap-3">
                    <BackButton label="Back" onClick={onBack} />
                    <BackButton onNavigate={onNavigate} targetPage="home" label="Home" type="home" />
                </div>
            </div>

            {/* ── Hero header ── */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
                    <Badge className="mb-4 px-5 py-2" style={{ background: "linear-gradient(135deg,#d4af37,#f4e5b8)", color: "#1a1510", border: "none", fontWeight: 700, letterSpacing: "0.08em" }}>
                        <Sparkles className="size-4 mr-2" /> JAUHARI VIRTUAL TRY-ON
                    </Badge>
                    <h1 className="font-['Cinzel',serif] mb-2" style={{ fontSize: "clamp(28px,5vw,52px)", fontWeight: 700, background: "linear-gradient(135deg,#f4e5b8 0%,#d4af37 50%,#f4e5b8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                        Try Before You Treasure
                    </h1>
                    <p className="font-['Cinzel',serif] text-[#d4b896] text-sm tracking-wider">
                        Real-time jewellery try-on • Transparent overlay • Instant capture
                    </p>
                </motion.div>

                {/* ── Mode selector ── */}
                {!mode && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
                        <ModeCard
                            icon={<Camera className="size-10 text-[#d4af37]" />}
                            title="Live Camera"
                            desc="See jewellery on you in real-time with face-tracking AR overlay"
                            badge="Recommended"
                            badgeColor="#22c55e"
                            onClick={() => { setMode("camera"); startCamera(); }}
                        />
                        <ModeCard
                            icon={<Upload className="size-10 text-[#d4af37]" />}
                            title="Upload Photo"
                            desc="Upload a selfie and drag jewellery to the perfect position"
                            badge="No Camera"
                            badgeColor="#8b5cf6"
                            onClick={() => { setMode("photo"); fileInputRef.current?.click(); }}
                        />
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                            onChange={e => {
                                const f = e.target.files?.[0];
                                if (!f) return;
                                const r = new FileReader();
                                r.onload = ev => { setUploadedImage(ev.target?.result as string); };
                                r.readAsDataURL(f);
                            }}
                        />
                    </motion.div>
                )}

                {/* ── Sample Try-On section (visible when no mode selected) ── */}
                {!mode && <SampleTryOnSection onSelectProduct={p => { setSelectedProduct(p); setMode("photo"); fileInputRef.current?.click(); }} />}

                {/* ── Main try-on UI ── */}
                {mode && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Left: Preview canvas */}
                        <div className="lg:col-span-2 space-y-4">
                            <Card className="overflow-hidden" style={{ background: "#0d0d0d", border: "1px solid #d4af37" }}>
                                {/* Toolbar */}
                                <div className="flex items-center justify-between p-4 border-b border-[#d4af37]/20">
                                    <div className="flex items-center gap-2">
                                        {mode === "camera" ? (
                                            <span className="flex items-center gap-2 text-[#d4af37] text-sm font-['Cinzel',serif]">
                                                <span className="size-2 rounded-full bg-red-500 animate-pulse inline-block" /> LIVE
                                            </span>
                                        ) : (
                                            <span className="text-[#d4af37] text-sm font-['Cinzel',serif]">Photo Mode</span>
                                        )}
                                        {selectedProduct && (
                                            <Badge className="text-xs" style={{ background: "rgba(212,175,55,0.15)", color: "#d4af37", border: "1px solid #d4af37" }}>
                                                {selectedProduct.name}
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => setShowOverlay(v => !v)} className="p-2 rounded-lg text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors" title={showOverlay ? "Hide jewellery" : "Show jewellery"}>
                                            {showOverlay ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                                        </button>
                                        <button onClick={handleScreenshot} className="p-2 rounded-lg text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors" title="Save photo">
                                            <Download className="size-4" />
                                        </button>
                                        <button onClick={() => { setMode(null); stopCamera(); setUploadedImage(null); }} className="p-2 rounded-lg text-[#f4e5b8]/50 hover:text-white hover:bg-white/10 transition-colors">
                                            <X className="size-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Canvas area */}
                                <div className="relative aspect-[4/3] flex items-center justify-center bg-black">
                                    {mode === "camera" ? (
                                        <>
                                            <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover opacity-0" />
                                            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-contain" />
                                            {!cameraActive && (
                                                <div className="text-center z-10">
                                                    <Camera className="size-12 text-[#d4af37]/40 mx-auto mb-3" />
                                                    <p className="text-[#d4b896] text-sm font-['Cinzel',serif]">Starting camera…</p>
                                                </div>
                                            )}
                                        </>
                                    ) : uploadedImage ? (
                                        <div className="relative w-full h-full">
                                            <canvas
                                                ref={photoCanvasRef}
                                                className="w-full h-full object-contain cursor-crosshair"
                                                onMouseDown={() => setIsDragging(true)}
                                                onMouseUp={() => setIsDragging(false)}
                                                onMouseLeave={() => setIsDragging(false)}
                                                onMouseMove={handleCanvasMouseMove}
                                            />
                                            {isDragging && (
                                                <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-[#d4af37]/90 text-[#1a1510] text-xs px-3 py-1 rounded-full font-bold">
                                                    Drag to position jewellery
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center z-10">
                                            <Upload className="size-12 text-[#d4af37]/40 mx-auto mb-3" />
                                            <p className="text-[#d4b896] text-sm font-['Cinzel',serif]">Upload a photo to begin</p>
                                            <Button className="mt-4 text-xs" size="sm"
                                                style={{ background: "linear-gradient(135deg,#d4af37,#f4e5b8)", color: "#1a1510" }}
                                                onClick={() => fileInputRef.current?.click()}>
                                                Choose Photo
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </Card>

                            {/* Controls */}
                            <Card className="p-5 space-y-4" style={{ background: "#1a1510", border: "1px solid #d4af37" }}>
                                <h4 className="font-['Cinzel',serif] text-[#f4e5b8] text-sm font-semibold tracking-wider">Overlay Controls</h4>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-[#d4b896] text-xs font-['Cinzel',serif]">Size</span>
                                            <span className="text-[#d4af37] text-xs">{scale[0]}%</span>
                                        </div>
                                        <Slider value={scale} onValueChange={setScale} min={40} max={160} step={5} />
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-[#d4b896] text-xs font-['Cinzel',serif]">Opacity</span>
                                            <span className="text-[#d4af37] text-xs">{opacity[0]}%</span>
                                        </div>
                                        <Slider value={opacity} onValueChange={setOpacity} min={30} max={100} step={5} />
                                    </div>
                                </div>
                                {mode === "photo" && (
                                    <p className="text-[#b8985f] text-xs font-['Cinzel',serif] flex items-center gap-2">
                                        <Info className="size-3" /> Click and drag on the photo to reposition jewellery
                                    </p>
                                )}
                            </Card>

                            {/* Add to cart */}
                            {selectedProduct && (
                                <div className="flex gap-3">
                                    <Button className="flex-1 h-12" style={{ background: "linear-gradient(135deg,#d4af37,#f4e5b8)", color: "#1a1510", border: "none", fontWeight: 700, letterSpacing: "0.05em" }} onClick={handleAddToCart}>
                                        <ShoppingCart className="size-4 mr-2" /> Add to Cart · {selectedProduct.price}
                                    </Button>
                                    <button onClick={() => toggleWishlist({ id: selectedProduct.id, image: selectedProduct.images[0], title: selectedProduct.name, price: selectedProduct.price, priceValue: selectedProduct.priceValue, category: selectedProduct.category, material: selectedProduct.material, style: selectedProduct.style, storeName: "Jauhari", storeSlug: "jauhari" })}
                                        className={`p-3 rounded-lg border transition-all ${isInWishlist(selectedProduct.id) ? "bg-[#d4af37] border-[#d4af37]" : "border-[#d4af37]/40 text-[#d4af37] hover:bg-[#d4af37]/10"}`}>
                                        <Heart className={`size-5 ${isInWishlist(selectedProduct.id) ? "fill-[#1a1510] text-[#1a1510]" : ""}`} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Right: product carousel */}
                        <div className="space-y-4">
                            <div data-slot="card" className="bg-[#fcfaf8] text-[#1a1510] flex flex-col gap-6 rounded-xl border border-[#d4af37]/30 p-6 shadow-xl">
                                <h3 className="mb-2 text-[#492f0e] font-['Cinzel',serif] font-bold text-lg">Select Jewelry</h3>

                                {/* Modified Tabs to match requested structure */}
                                <div dir="ltr" data-orientation="horizontal" data-slot="tabs" className="flex flex-col gap-2 w-full mb-2">
                                    <div role="tablist" aria-orientation="horizontal" data-slot="tabs-list" className="bg-[#f5f1ed] text-[#492f0e] h-10 items-center justify-center rounded-xl p-[3px] w-full grid grid-cols-3">
                                        {["All", "Necklaces", "Earrings"].map(cat => (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() => setCatFilter(cat as JewelryCategory)}
                                                className={`inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-xl px-2 py-1 font-['Cinzel',serif] font-medium whitespace-nowrap transition-all text-xs ${catFilter === cat ? "bg-white text-[#492f0e] shadow-sm border border-[#d4af37]/20" : "text-[#492f0e]/60 hover:text-[#492f0e]"}`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Product list matching requested design */}
                                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                    {filteredProducts.map(p => (
                                        <div
                                            key={p.id}
                                            onClick={() => setSelectedProduct(p)}
                                            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border ${selectedProduct?.id === p.id ? "bg-[#f5f1ed] border-[#d4af37] shadow-sm" : "bg-[#fcfaf8] border-transparent hover:bg-[#f5f1ed]"}`}
                                        >
                                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-white border border-[#d4af37]/10">
                                                <img
                                                    src={p.images[0]}
                                                    alt={p.name}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-['Cinzel',serif] font-semibold mb-1 truncate text-[#1a1510]">{p.name}</p>
                                                <p className="text-[10px] font-['Cinzel',serif] uppercase tracking-wider mb-1 text-gray-500">{p.category}</p>
                                                <p className="text-sm font-bold text-[#492f0e]">{p.price}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Tips card */}
                            <Card className="p-4" style={{ background: "rgba(212,175,55,0.05)", border: "1px solid rgba(212,175,55,0.2)" }}>
                                <h4 className="font-['Cinzel',serif] text-[#d4af37] text-xs font-semibold tracking-wider mb-2">✨ Tips</h4>
                                <ul className="space-y-1.5 text-[#d4b896] text-[11px] font-['Cinzel',serif]">
                                    {mode === "camera" ? (
                                        <>
                                            <li>• Face the camera directly for best earring/necklace tracking</li>
                                            <li>• Good lighting improves detection accuracy</li>
                                            <li>• Hold still when selecting jewellery</li>
                                            <li>• Ring/bangle placement improves with MediaPipe Hands support</li>
                                        </>
                                    ) : (
                                        <>
                                            <li>• Click & drag on photo to reposition jewellery</li>
                                            <li>• Use Size slider for the perfect fit</li>
                                            <li>• Reduce Opacity for a softer look</li>
                                            <li>• Save your look with the download button</li>
                                        </>
                                    )}
                                </ul>
                            </Card>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

// ─── Mode Selection Card ──────────────────────────────────────────────────────

function ModeCard({ icon, title, desc, badge, badgeColor, onClick }: {
    icon: React.ReactNode; title: string; desc: string;
    badge: string; badgeColor: string; onClick: () => void;
}) {
    return (
        <motion.button whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} onClick={onClick}
            className="p-8 rounded-2xl text-center group transition-all w-full"
            style={{ background: "linear-gradient(135deg,#1a1510,#2a1f14)", border: "1px solid rgba(212,175,55,0.4)" }}>
            <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform"
                style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.3)" }}>
                {icon}
            </div>
            <h3 className="font-['Cinzel',serif] text-[#f4e5b8] font-bold text-lg mb-2 tracking-wide">{title}</h3>
            <p className="text-[#d4b896] text-xs font-['Cinzel',serif] mb-4 leading-relaxed">{desc}</p>
            <span className="inline-block px-4 py-1 rounded-full text-xs font-bold" style={{ background: `${badgeColor}20`, color: badgeColor, border: `1px solid ${badgeColor}40` }}>
                {badge}
            </span>
        </motion.button>
    );
}

// ─── Sample Try-On Section ───────────────────────────────────────────────────
// Shows jewellery images with transparent-bg CSS trick as a preview

function SampleTryOnSection({ onSelectProduct }: { onSelectProduct: (p: JProduct) => void }) {
    const featured = jauhariProducts.filter(p =>
        ["JH-E001", "JH-E002", "JH-N001", "JH-N004", "JH-R001", "JH-B003"].includes(p.id)
    );

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="max-w-5xl mx-auto">
            <div className="text-center mb-6">
                <h2 className="font-['Cinzel',serif] text-[#f4e5b8] text-xl font-semibold mb-2">
                    Featured Jewellery – Instant Try-On
                </h2>
                <p className="text-[#d4b896] text-xs font-['Cinzel',serif]">Click any piece to open it in Try-On mode</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {featured.map((p, i) => (
                    <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                        whileHover={{ scale: 1.03, y: -4 }}
                        onClick={() => onSelectProduct(p)}
                        className="cursor-pointer rounded-2xl overflow-hidden group"
                        style={{ background: "linear-gradient(135deg,#1a1510,#2a1f14)", border: "1px solid rgba(212,175,55,0.3)" }}>

                        {/* Transparent-bg jewellery preview */}
                        <div className="aspect-square flex items-center justify-center p-4 relative overflow-hidden"
                            style={{ background: "radial-gradient(ellipse at center, #2a1f14 0%, #0d0d0d 100%)" }}>
                            {/* Glow effect */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "radial-gradient(ellipse at center, rgba(212,175,55,0.1) 0%, transparent 70%)" }} />
                            <img
                                src={p.images[0]}
                                alt={p.name}
                                className="w-full h-full object-contain relative z-10 transition-transform group-hover:scale-105"
                                style={{ mixBlendMode: "screen" }} // transparent-bg effect
                            />
                            {/* Try-On button overlay */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-20"
                                style={{ background: "rgba(0,0,0,0.5)" }}>
                                <span className="px-4 py-2 rounded-full text-xs font-bold font-['Cinzel',serif]"
                                    style={{ background: "linear-gradient(135deg,#d4af37,#f4e5b8)", color: "#1a1510" }}>
                                    👁 Try On
                                </span>
                            </div>
                        </div>

                        <div className="p-3">
                            <p className="text-[#b8985f] text-[10px] font-['Cinzel',serif] uppercase tracking-wider">{p.category}</p>
                            <p className="text-[#f4e5b8] text-xs font-['Cinzel',serif] font-semibold truncate mt-0.5">{p.name}</p>
                            <p className="text-[#d4af37] text-xs font-bold mt-1">{p.price}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="text-center mt-8">
                <p className="text-[#b8985f] text-xs font-['Cinzel',serif]">
                    ✦ Jewellery rendered with transparent background overlay for realistic try-on ✦
                </p>
            </div>
        </motion.div>
    );
}
