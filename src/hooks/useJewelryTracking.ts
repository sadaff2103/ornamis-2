import { useEffect, useRef, useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface JewelryAnchors {
    leftEar: { x: number; y: number } | null;
    rightEar: { x: number; y: number } | null;
    necklaceCenter: { x: number; y: number } | null;
    ringFinger: { x: number; y: number; size: number } | null;
    wrist: { x: number; y: number; size: number } | null;
    headRoll: number;
    earringSize: number;
}

const ALPHA = 0.4;

function smooth(prev: number | null, next: number): number {
    if (prev === null) return next;
    return prev * (1 - ALPHA) + next * ALPHA;
}

function smoothPt(
    prev: { x: number; y: number } | null,
    next: { x: number; y: number }
): { x: number; y: number } {
    if (!prev) return next;
    return { x: smooth(prev.x, next.x), y: smooth(prev.y, next.y) };
}

// FaceMesh landmark indices
const FACE_LEFT_EAR = 361;
const FACE_RIGHT_EAR = 132;
const FACE_CHIN = 152;
const FACE_LEFT_TEMPLE = 356;
const FACE_RIGHT_TEMPLE = 127;
const FACE_NOSE_TIP = 4;

// Hands landmark indices
const HAND_RING_FINGER_MCP = 13;
const HAND_WRIST = 0;
const HAND_INDEX_TIP = 8;

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useJewelryTracking(
    videoRef: React.RefObject<HTMLVideoElement | null>,
    enabled: boolean
) {
    const [anchors, setAnchors] = useState<JewelryAnchors>({
        leftEar: null,
        rightEar: null,
        necklaceCenter: null,
        ringFinger: null,
        wrist: null,
        headRoll: 0,
        earringSize: 40,
    });
    const [ready, setReady] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const smoothedRef = useRef<Partial<JewelryAnchors>>({});
    const faceMeshRef = useRef<any>(null);
    const handsRef = useRef<any>(null);
    const cameraRef = useRef<any>(null);
    const rafRef = useRef<number>(0);

    const processResults = useCallback(
        (faceResults: any, handResults: any, w: number, h: number) => {
            const s = smoothedRef.current;
            let leftEar: { x: number; y: number } | null = null;
            let rightEar: { x: number; y: number } | null = null;
            let necklaceCenter: { x: number; y: number } | null = null;
            let headRoll = 0;
            let earringSize = 40;
            let ringFinger: { x: number; y: number; size: number } | null = null;
            let wrist: { x: number; y: number; size: number } | null = null;

            if (faceResults?.multiFaceLandmarks?.length > 0) {
                const lm = faceResults.multiFaceLandmarks[0];
                const toScreen = (l: any) => ({ x: l.x * w, y: l.y * h });

                const lEar = toScreen(lm[FACE_LEFT_EAR]);
                const rEar = toScreen(lm[FACE_RIGHT_EAR]);
                const chin = toScreen(lm[FACE_CHIN]);
                const lTemple = toScreen(lm[FACE_LEFT_TEMPLE]);
                const rTemple = toScreen(lm[FACE_RIGHT_TEMPLE]);
                const noseTip = toScreen(lm[FACE_NOSE_TIP]);

                const dx = rTemple.x - lTemple.x;
                const dy = rTemple.y - lTemple.y;
                headRoll = Math.atan2(dy, dx);

                const faceHeight = Math.hypot(chin.x - noseTip.x, chin.y - noseTip.y);
                earringSize = Math.max(30, faceHeight * 0.45);

                const earDropY = earringSize * 0.3;
                leftEar = smoothPt(s.leftEar ?? null, { x: lEar.x, y: lEar.y + earDropY });
                rightEar = smoothPt(s.rightEar ?? null, { x: rEar.x, y: rEar.y + earDropY });

                const midX = (lEar.x + rEar.x) / 2;
                const midY = (lEar.y + rEar.y) / 2;
                const toChinX = chin.x - midX;
                const toChinY = chin.y - midY;
                necklaceCenter = smoothPt(s.necklaceCenter ?? null, {
                    x: midX + toChinX * 0.6,
                    y: midY + toChinY * 0.6,
                });

                smoothedRef.current = { ...s, leftEar, rightEar, necklaceCenter };
            }

            if (handResults?.multiHandLandmarks?.length > 0) {
                const lm = handResults.multiHandLandmarks[0];
                const toScreen = (l: any) => ({ x: l.x * w, y: l.y * h });

                const rfBase = toScreen(lm[HAND_RING_FINGER_MCP]);
                const wristPt = toScreen(lm[HAND_WRIST]);
                const indexTip = toScreen(lm[HAND_INDEX_TIP]);

                const handSize = Math.hypot(wristPt.x - indexTip.x, wristPt.y - indexTip.y);
                const fingerSize = handSize * 0.18;

                const smoothedRf = smoothPt(s.ringFinger ?? null, rfBase);
                const smoothedWrist = smoothPt(s.wrist ?? null, wristPt);
                ringFinger = smoothedRf ? { ...smoothedRf, size: fingerSize } : null;
                wrist = smoothedWrist ? { ...smoothedWrist, size: handSize * 0.5 } : null;

                smoothedRef.current = { ...smoothedRef.current, ringFinger, wrist };
            }

            setAnchors({ leftEar, rightEar, necklaceCenter, ringFinger, wrist, headRoll, earringSize });
        },
        []
    );

    useEffect(() => {
        if (!enabled) return;

        let faceResults: any = null;
        let handResults: any = null;
        let stopped = false;

        async function init() {
            try {
                const { FaceMesh } = await import("@mediapipe/face_mesh");
                const { Camera } = await import("@mediapipe/camera_utils");

                const faceMesh = new FaceMesh({
                    locateFile: (file: string) =>
                        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/${file}`,
                });
                faceMesh.setOptions({
                    maxNumFaces: 1,
                    refineLandmarks: true,
                    minDetectionConfidence: 0.6,
                    minTrackingConfidence: 0.5,
                });
                faceMesh.onResults((results: any) => {
                    faceResults = results;
                });
                faceMeshRef.current = faceMesh;

                if (videoRef.current) {
                    const camera = new Camera(videoRef.current, {
                        onFrame: async () => {
                            if (stopped) return;
                            await faceMesh.send({ image: videoRef.current! });
                            if (videoRef.current) {
                                const { videoWidth: w, videoHeight: h } = videoRef.current;
                                processResults(faceResults, handResults, w || 640, h || 480);
                            }
                        },
                        width: 640,
                        height: 480,
                    });
                    await camera.start();
                    cameraRef.current = camera;
                    setReady(true);
                }
            } catch (e: any) {
                setError("Tracking init failed: " + e.message);
            }
        }

        init();

        return () => {
            stopped = true;
            cancelAnimationFrame(rafRef.current);
            cameraRef.current?.stop?.();
            faceMeshRef.current?.close?.();
            handsRef.current?.close?.();
            smoothedRef.current = {};
        };
    }, [enabled, processResults, videoRef]);

    return { anchors, ready, error };
}
