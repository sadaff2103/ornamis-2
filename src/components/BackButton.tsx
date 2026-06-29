import { ArrowLeft, Home } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "./ui/button";

interface BackButtonProps {
    onNavigate?: (page: string, params?: any) => void;
    targetPage?: string;
    label?: string;
    onClick?: () => void;
    type?: "back" | "home";
    className?: string;
}

export function BackButton({
    onNavigate,
    targetPage = "home",
    label,
    onClick,
    type = "back",
    className = ""
}: BackButtonProps) {
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onClick) {
            onClick();
        } else if (onNavigate) {
            onNavigate(targetPage);
        } else {
            if (window.history.length > 1) {
                window.history.back();
            } else {
                window.location.assign('/');
            }
        }
    };

    const Icon = type === "home" ? Home : ArrowLeft;
    const resolvedLabel = label || (type === "home" ? "Home" : "Back");

    return (
        <motion.div
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.96 }}
            className={className}
        >
            <Button
                onClick={handleClick}
                variant="ghost"
                className="relative group h-9 px-4 rounded-full bg-white/40 backdrop-blur-md border border-white/40 shadow-sm hover:bg-white/60 hover:border-[#d4af37]/50 transition-all duration-300"
            >
                <div className="flex items-center gap-2">
                    <Icon className="size-4 text-[#492f0e] group-hover:text-[#d4af37] transition-colors" />
                    <span className="text-xs font-bold tracking-tight text-[#492f0e] group-hover:text-[#d4af37] transition-colors">
                        {resolvedLabel}
                    </span>
                </div>

                {/* Subtle golden underline on hover */}
                <div className="absolute bottom-1.5 left-8 right-4 h-px bg-[#d4af37] opacity-0 group-hover:opacity-40 transition-opacity" />
            </Button>
        </motion.div>
    );
}

