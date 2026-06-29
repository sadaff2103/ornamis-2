import { LayoutGrid, LayoutList } from "lucide-react";
import { Button } from "./ui/button";

interface LayoutToggleProps {
  isMinimal: boolean;
  onToggle: () => void;
}

export function LayoutToggle({ isMinimal, onToggle }: LayoutToggleProps) {
  return (
    <div className="fixed bottom-24 right-4 z-50">
      <Button
        onClick={onToggle}
        className="bg-white shadow-lg hover:shadow-xl border border-gray-200 text-gray-700 hover:text-gray-900 rounded-full p-3"
        size="icon"
        title={isMinimal ? "Switch to Full Layout" : "Switch to Minimal Layout"}
      >
        {isMinimal ? (
          <LayoutGrid className="w-5 h-5" />
        ) : (
          <LayoutList className="w-5 h-5" />
        )}
      </Button>
    </div>
  );
}
