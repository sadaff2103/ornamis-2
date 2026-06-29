/**
 * Convert canvas to base64 data URL
 */
export function canvasToBase64(canvas: HTMLCanvasElement, quality = 0.9): string {
    return canvas.toDataURL("image/png", quality);
}

/**
 * Convert base64 to blob for file operations
 */
export function base64ToBlob(base64: string): Blob {
    const parts = base64.split(";base64,");
    const contentType = parts[0].split(":")[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
}

/**
 * Resize image to maximum dimensions while maintaining aspect ratio
 */
export async function resizeImage(
    imageData: string,
    maxWidth: number,
    maxHeight: number
): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) {
                reject(new Error("Could not get canvas context"));
                return;
            }

            let { width, height } = img;

            // Calculate new dimensions
            if (width > maxWidth || height > maxHeight) {
                const ratio = Math.min(maxWidth / width, maxHeight / height);
                width *= ratio;
                height *= ratio;
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            resolve(canvas.toDataURL("image/jpeg", 0.9));
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = imageData;
    });
}

/**
 * Detect if image contains a face (basic detection)
 * For production, use TensorFlow.js face detection
 */
export async function detectFace(imageData: string): Promise<{
    hasFace: boolean;
    faceRegion?: { x: number; y: number; width: number; height: number };
}> {
    // Placeholder - in production, integrate with TensorFlow.js face-landmarks-detection
    // which is already in your dependencies
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            // For now, assume face is in center-top region
            // This is a simplified placeholder
            resolve({
                hasFace: true,
                faceRegion: {
                    x: img.width * 0.25,
                    y: img.height * 0.1,
                    width: img.width * 0.5,
                    height: img.height * 0.4,
                },
            });
        };
        img.src = imageData;
    });
}

/**
 * Overlay jewelry design on user photo
 */
export async function overlayDesign(
    userPhoto: string,
    designImage: string,
    jewelryType: string,
    position?: { x: number; y: number },
    scale = 1,
    rotation = 0
): Promise<string> {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            reject(new Error("Could not get canvas context"));
            return;
        }

        const userImg = new Image();
        const designImg = new Image();

        let loadedCount = 0;

        const onImageLoad = () => {
            loadedCount++;
            if (loadedCount === 2) {
                // Set canvas size to user photo
                canvas.width = userImg.width;
                canvas.height = userImg.height;

                // Draw user photo
                ctx.drawImage(userImg, 0, 0);

                // Calculate default position based on jewelry type
                const defaultPosition = getDefaultJewelryPosition(
                    jewelryType,
                    userImg.width,
                    userImg.height
                );

                const finalPosition = position || defaultPosition;

                // Calculate design size based on jewelry type
                const designSize = getJewelrySize(jewelryType, userImg.width, userImg.height);

                // Save context state
                ctx.save();

                // Apply transformations
                ctx.translate(finalPosition.x, finalPosition.y);
                ctx.rotate((rotation * Math.PI) / 180);
                ctx.scale(scale, scale);

                // Draw design (centered on position)
                ctx.drawImage(
                    designImg,
                    -designSize.width / 2,
                    -designSize.height / 2,
                    designSize.width,
                    designSize.height
                );

                // Restore context state
                ctx.restore();

                resolve(canvas.toDataURL("image/png"));
            }
        };

        userImg.onload = onImageLoad;
        designImg.onload = onImageLoad;
        userImg.onerror = () => reject(new Error("Failed to load user photo"));
        designImg.onerror = () => reject(new Error("Failed to load design image"));

        userImg.src = userPhoto;
        designImg.src = designImage;
    });
}

/**
 * Get default position for jewelry based on type
 */
function getDefaultJewelryPosition(
    jewelryType: string,
    imageWidth: number,
    imageHeight: number
): { x: number; y: number } {
    const centerX = imageWidth / 2;

    switch (jewelryType.toLowerCase()) {
        case "necklace":
        case "pendant":
            return { x: centerX, y: imageHeight * 0.35 };
        case "earrings":
            return { x: centerX, y: imageHeight * 0.25 };
        case "ring":
            return { x: centerX, y: imageHeight * 0.65 };
        case "bracelet":
        case "anklet":
            return { x: centerX, y: imageHeight * 0.7 };
        default:
            return { x: centerX, y: imageHeight * 0.4 };
    }
}

/**
 * Get appropriate size for jewelry overlay based on type
 */
function getJewelrySize(
    jewelryType: string,
    imageWidth: number,
    imageHeight: number
): { width: number; height: number } {
    const baseSize = Math.min(imageWidth, imageHeight);

    switch (jewelryType.toLowerCase()) {
        case "necklace":
            return { width: baseSize * 0.4, height: baseSize * 0.3 };
        case "pendant":
            return { width: baseSize * 0.15, height: baseSize * 0.15 };
        case "earrings":
            return { width: baseSize * 0.12, height: baseSize * 0.12 };
        case "ring":
            return { width: baseSize * 0.15, height: baseSize * 0.15 };
        case "bracelet":
            return { width: baseSize * 0.3, height: baseSize * 0.2 };
        case "anklet":
            return { width: baseSize * 0.35, height: baseSize * 0.15 };
        default:
            return { width: baseSize * 0.25, height: baseSize * 0.25 };
    }
}

/**
 * Download image to user's device
 */
export function downloadImage(dataUrl: string, filename: string): void {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
