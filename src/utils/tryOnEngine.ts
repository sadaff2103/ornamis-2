/**
 * Core AR Engine for Ornamis
 * Handles landmark smoothing, perspective warping, and position math
 */

export interface Point {
    x: number;
    y: number;
}

export interface Box {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
}

// EMA Smoothing
const ALPHA = 0.35;
export function lerp(a: number, b: number) {
    return a * (1 - ALPHA) + b * ALPHA;
}

/**
 * Calculates the bounding box for a necklace based on chin and shoulder estimation
 */
export function calculateNecklaceBox(chin: Point, leftShoulder: Point, rightShoulder: Point, faceWidth: number): Box {
    const neckWidth = faceWidth * 1.2;
    const neckHeight = faceWidth * 0.8;

    return {
        x: (leftShoulder.x + rightShoulder.x) / 2,
        y: chin.y + (faceWidth * 0.3),
        width: neckWidth,
        height: neckHeight,
        rotation: Math.atan2(rightShoulder.y - leftShoulder.y, rightShoulder.x - leftShoulder.x)
    };
}

/**
 * Calculates the bounding box for earrings
 */
export function calculateEarringBox(earLandmark: Point, faceWidth: number): Box {
    const size = faceWidth * 0.25;
    return {
        x: earLandmark.x,
        y: earLandmark.y + (size * 0.2), // slightly below ear attachment point
        width: size,
        height: size,
        rotation: 0
    };
}

/**
 * Normalizes landmarks from MediaPipe to pixel coordinates
 */
export function toPixels(landmark: { x: number, y: number }, width: number, height: number): Point {
    return {
        x: landmark.x * width,
        y: landmark.y * height
    };
}

/**
 * Calculates rotation between two points in degrees
 */
export function calculateRotation(p1: Point, p2: Point): number {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}
