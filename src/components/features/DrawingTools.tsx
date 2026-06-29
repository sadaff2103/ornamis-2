import { useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { PenTool, Eraser, Undo2, Redo2, Trash2 } from "lucide-react";
import { DrawingToolState } from "../../types/aiDesigner.types";

interface DrawingToolsProps {
    toolState: DrawingToolState;
    onToolStateChange: (state: DrawingToolState) => void;
    onUndo?: () => void;
    onRedo?: () => void;
    onClear?: () => void;
    canUndo?: boolean;
    canRedo?: boolean;
}

export function DrawingTools({
    toolState,
    onToolStateChange,
    onUndo,
    onRedo,
    onClear,
    canUndo = false,
    canRedo = false,
}: DrawingToolsProps) {
    const colors = [
        "#492f0e", // Brown
        "#000000", // Black
        "#b39978", // Gold
        "#8b4513", // Saddle Brown
        "#4a4a4a", // Dark Gray
    ];

    return (
        <div className="space-y-4 p-4 bg-[#f5f1ed] rounded-lg">
            {/* Tool Selection */}
            <div>
                <Label className="text-sm mb-2 block">Tool</Label>
                <div className="flex gap-2">
                    <Button
                        variant={toolState.tool === "brush" ? "default" : "outline"}
                        size="sm"
                        onClick={() => onToolStateChange({ ...toolState, tool: "brush" })}
                        className={toolState.tool === "brush" ? "bg-[#492f0e]" : ""}
                    >
                        <PenTool className="size-4 mr-2" />
                        Brush
                    </Button>
                    <Button
                        variant={toolState.tool === "eraser" ? "default" : "outline"}
                        size="sm"
                        onClick={() => onToolStateChange({ ...toolState, tool: "eraser" })}
                        className={toolState.tool === "eraser" ? "bg-[#492f0e]" : ""}
                    >
                        <Eraser className="size-4 mr-2" />
                        Eraser
                    </Button>
                </div>
            </div>

            {/* Brush Size */}
            <div>
                <Label className="text-sm mb-2 block">
                    Brush Size: {toolState.brushSize}px
                </Label>
                <Slider
                    value={[toolState.brushSize]}
                    onValueChange={(value: number[]) =>
                        onToolStateChange({ ...toolState, brushSize: value[0] })
                    }
                    min={1}
                    max={20}
                    step={1}
                    className="w-full"
                />
            </div>

            {/* Color Selection */}
            {toolState.tool === "brush" && (
                <div>
                    <Label className="text-sm mb-2 block">Color</Label>
                    <div className="flex gap-2">
                        {colors.map((color) => (
                            <button
                                key={color}
                                onClick={() => onToolStateChange({ ...toolState, color })}
                                className={`w-8 h-8 rounded-full border-2 transition-all ${toolState.color === color
                                    ? "border-[#492f0e] scale-110"
                                    : "border-gray-300 hover:scale-105"
                                    }`}
                                style={{ backgroundColor: color }}
                                title={color}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Opacity */}
            <div>
                <Label className="text-sm mb-2 block">
                    Opacity: {Math.round(toolState.opacity * 100)}%
                </Label>
                <Slider
                    value={[toolState.opacity * 100]}
                    onValueChange={(value: number[]) =>
                        onToolStateChange({ ...toolState, opacity: value[0] / 100 })
                    }
                    min={10}
                    max={100}
                    step={5}
                    className="w-full"
                />
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-gray-300">
                <div className="grid grid-cols-3 gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onUndo}
                        disabled={!canUndo}
                        title="Undo"
                    >
                        <Undo2 className="size-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onRedo}
                        disabled={!canRedo}
                        title="Redo"
                    >
                        <Redo2 className="size-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onClear}
                        title="Clear Canvas"
                    >
                        <Trash2 className="size-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
