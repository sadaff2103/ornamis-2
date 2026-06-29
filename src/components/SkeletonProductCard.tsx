import { motion } from "motion/react";

interface SkeletonProductCardProps {
    className?: string;
}

export function SkeletonProductCard({ className = "" }: SkeletonProductCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`bg-white rounded-xl overflow-hidden shadow-sm ${className}`}
        >
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </div>
            <div className="p-4 space-y-2.5">
                <div className="h-2.5 bg-gray-100 rounded-full w-1/3 overflow-hidden relative">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite_0.1s] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                </div>
                <div className="h-4 bg-gray-200 rounded-full w-3/4 overflow-hidden relative">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite_0.2s] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                </div>
                <div className="h-3 bg-gray-100 rounded-full w-1/2 overflow-hidden relative">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite_0.3s] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                </div>
                <div className="h-9 bg-gray-100 rounded-lg mt-3 overflow-hidden relative">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite_0.4s] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                </div>
            </div>
        </motion.div>
    );
}
