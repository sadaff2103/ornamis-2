export type DesignMode = "text" | "sketch" | "image";

export interface DesignParameters {
    jewelryType: string;
    style: string;
    material: string;
    gemstone: string;
    complexity: number;
}

export interface DesignRequest {
    mode: DesignMode;
    prompt?: string;
    sketchData?: string; // base64 encoded canvas image
    referenceImage?: string; // base64 encoded image
    parameters: DesignParameters;
}

export interface GeneratedDesign {
    id: string;
    imageUrl: string;
    prompt: string;
    parameters: DesignParameters;
    createdAt: Date;
    variations?: string[];
}

export interface TryOnResult {
    designId: string;
    userPhoto: string;
    overlayImage: string;
    position: { x: number; y: number };
    scale: number;
    rotation: number;
}

export interface DrawingToolState {
    tool: "brush" | "eraser";
    brushSize: number;
    color: string;
    opacity: number;
}
