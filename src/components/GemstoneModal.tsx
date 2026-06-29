import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft } from 'lucide-react';
import { GemstoneData } from '../data/gemstoneData';

interface GemstoneModalProps {
    gemstone: GemstoneData | null;
    isOpen: boolean;
    onClose: () => void;
    onSelectRelated: (name: string) => void;
}

export function GemstoneModal({ gemstone, isOpen, onClose, onSelectRelated }: GemstoneModalProps) {
    if (!gemstone) return null;

    // Close on ESC key
    React.useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        {/* Modal Container - More Compact */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: 'spring', duration: 0.5 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-gradient-to-br from-[#F5EFE7] to-[#E8DCC8] rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto border-4 border-[#8B7355] relative"
                        >
                            {/* Back Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 left-4 z-10 bg-[#8B7355] hover:bg-[#6B5945] text-white rounded-full p-2 transition-all duration-300 hover:scale-110 shadow-lg flex items-center gap-2 px-4"
                                aria-label="Go back"
                            >
                                <ArrowLeft size={20} />
                                <span className="text-sm font-semibold">Back</span>
                            </button>

                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 z-10 bg-[#8B7355] hover:bg-[#6B5945] text-white rounded-full p-2 transition-all duration-300 hover:scale-110 shadow-lg"
                                aria-label="Close modal"
                            >
                                <X size={20} />
                            </button>

                            {/* Content - Reduced Padding */}
                            <div className="p-4 md:p-6 pt-16">
                                {/* Header Section - Compact */}
                                <div className="mb-6">
                                    <div className="flex flex-col md:flex-row md:items-start gap-4 mb-4">
                                        {/* Gemstone Image - Smaller */}
                                        <div className="flex-shrink-0 flex justify-center md:justify-start">
                                            <motion.div
                                                initial={{ scale: 0.8, rotate: -10 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                transition={{ delay: 0.2, type: 'spring' }}
                                                className="w-32 h-32 md:w-36 md:h-36 bg-white/60 backdrop-blur-sm rounded-full p-5 shadow-2xl border-4 border-[#d4af37]"
                                            >
                                                <img
                                                    src={gemstone.image}
                                                    alt={gemstone.name}
                                                    className="w-full h-full object-contain drop-shadow-2xl"
                                                />
                                            </motion.div>
                                        </div>

                                        {/* Title and Short Description - Smaller Fonts */}
                                        <div className="flex-1 text-center md:text-left">
                                            {/* Gemstone Name */}
                                            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#2c1810] mb-2 tracking-[0.1em] uppercase">
                                                {gemstone.name}
                                            </h2>
                                            <div className="h-0.5 w-24 bg-[#d4af37] mx-auto md:mx-0 mb-3"></div>

                                            {/* Short Description */}
                                            <p className="text-sm md:text-base font-serif text-[#3d2817] italic leading-relaxed">
                                                {gemstone.shortDescription}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Long Description - Compact */}
                                <div className="mb-6 bg-white/50 backdrop-blur-sm rounded-xl p-4 border-l-4 border-[#d4af37] shadow-lg">
                                    <h3 className="text-lg md:text-xl font-serif font-bold text-[#2c1810] mb-3 flex items-center">
                                        <span className="text-[#d4af37] mr-2">✦</span>
                                        About {gemstone.name}
                                    </h3>
                                    <p className="text-xs md:text-sm leading-relaxed text-[#1a0f08] text-justify">
                                        {gemstone.longDescription}
                                    </p>
                                </div>

                                {/* Properties Grid - Compact */}
                                <div className="mb-6">
                                    <h3 className="text-lg md:text-xl font-serif font-bold text-[#2c1810] mb-3 flex items-center">
                                        <span className="text-[#d4af37] mr-2">✦</span>
                                        Properties
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-3">
                                        {/* Colors */}
                                        <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3 shadow-md border border-[#8B7355]/20">
                                            <h4 className="font-bold text-sm text-[#6b4e0e] mb-2">Colors</h4>
                                            <div className="flex flex-wrap gap-1.5">
                                                {gemstone.properties.colors.map((color, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2 py-0.5 bg-gradient-to-r from-[#d4af37]/20 to-[#f9d77e]/20 rounded-full text-xs text-[#2c1810] border border-[#d4af37]/30"
                                                    >
                                                        {color}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Hardness */}
                                        <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3 shadow-md border border-[#8B7355]/20">
                                            <h4 className="font-bold text-sm text-[#6b4e0e] mb-2">Hardness</h4>
                                            <p className="text-xs text-[#1a0f08]">{gemstone.properties.hardness}</p>
                                        </div>

                                        {/* Origins */}
                                        <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3 shadow-md border border-[#8B7355]/20">
                                            <h4 className="font-bold text-sm text-[#6b4e0e] mb-2">Origins</h4>
                                            <p className="text-xs text-[#1a0f08]">{gemstone.properties.origins.join(', ')}</p>
                                        </div>

                                        {/* Chakra */}
                                        {gemstone.properties.chakra && (
                                            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3 shadow-md border border-[#8B7355]/20">
                                                <h4 className="font-bold text-sm text-[#6b4e0e] mb-2">Chakra</h4>
                                                <p className="text-xs text-[#1a0f08]">{gemstone.properties.chakra}</p>
                                            </div>
                                        )}

                                        {/* Birthstone */}
                                        {gemstone.properties.birthstone && (
                                            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3 shadow-md border border-[#8B7355]/20">
                                                <h4 className="font-bold text-sm text-[#6b4e0e] mb-2">Birthstone</h4>
                                                <p className="text-xs text-[#1a0f08]">{gemstone.properties.birthstone}</p>
                                            </div>
                                        )}

                                        {/* Zodiac */}
                                        {gemstone.properties.zodiac && (
                                            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3 shadow-md border border-[#8B7355]/20">
                                                <h4 className="font-bold text-sm text-[#6b4e0e] mb-2">Zodiac Signs</h4>
                                                <p className="text-xs text-[#1a0f08]">{gemstone.properties.zodiac}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Metaphysical Properties - Compact */}
                                <div className="mb-6 bg-gradient-to-r from-[#d4af37]/10 to-[#f9d77e]/10 rounded-xl p-4 border-2 border-[#d4af37]/30 shadow-lg">
                                    <h3 className="text-lg md:text-xl font-serif font-bold text-[#2c1810] mb-3 flex items-center">
                                        <span className="text-[#d4af37] mr-2">✦</span>
                                        Metaphysical Properties
                                    </h3>
                                    <p className="text-xs md:text-sm leading-relaxed text-[#1a0f08] text-justify">
                                        {gemstone.metaphysical}
                                    </p>
                                </div>

                                {/* Related Gemstones - Compact */}
                                {gemstone.relatedGemstones.length > 0 && (
                                    <div>
                                        <h3 className="text-lg md:text-xl font-serif font-bold text-[#2c1810] mb-3 flex items-center">
                                            <span className="text-[#d4af37] mr-2">✦</span>
                                            Related Gemstones
                                        </h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                            {gemstone.relatedGemstones.map((relatedName, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => onSelectRelated(relatedName)}
                                                    className="bg-white/60 hover:bg-white/90 backdrop-blur-sm rounded-lg p-2 transition-all duration-300 hover:scale-105 hover:shadow-xl border border-[#8B7355]/20 hover:border-[#d4af37] group"
                                                >
                                                    <p className="text-xs font-semibold text-[#2c1810] uppercase tracking-wider group-hover:text-[#6b4e0e]">
                                                        {relatedName}
                                                    </p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
