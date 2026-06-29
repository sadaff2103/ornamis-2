import React from 'react';
import { motion } from 'framer-motion';
import { BackButton } from '../BackButton';


import { GemstoneData } from '../../data/gemstoneData';

interface GemstoneDetailPageProps {
    gemstone: GemstoneData;
    onBack: () => void;
    onSelectRelated: (name: string) => void;
}

export function GemstoneDetailPage({ gemstone, onBack, onSelectRelated }: GemstoneDetailPageProps) {
    // Scroll to top when component mounts
    React.useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [gemstone.name]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#D9C9B5] via-[#C9B8A4] to-[#B8A693]">
            {/* Back Button - Fixed at Top */}
            <div className="sticky top-0 z-20 bg-gradient-to-r from-[#8B7355] to-[#6B5945] shadow-lg">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
                    <BackButton
                        label="Back to Gem Encyclopedia"
                        onClick={onBack}
                        className="!bg-white/10 !border-white/20 hover:!bg-white/20"
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-12"
                >
                    <div className="flex flex-col md:flex-row md:items-start gap-8 mb-8">
                        {/* Gemstone Image */}
                        <div className="flex-shrink-0 flex justify-center md:justify-start">
                            <motion.div
                                initial={{ scale: 0.8, rotate: -10 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.3, type: 'spring' }}
                                className="w-48 h-48 md:w-64 md:h-64 bg-white/60 backdrop-blur-sm rounded-full p-10 md:p-12 shadow-2xl border-4 border-[#d4af37]"
                            >
                                <img
                                    src={gemstone.image}
                                    alt={gemstone.name}
                                    className="w-full h-full object-contain drop-shadow-2xl"
                                />
                            </motion.div>
                        </div>

                        {/* Title and Short Description */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-4xl md:text-6xl font-serif font-bold text-[#2c1810] mb-4 tracking-[0.15em] uppercase">
                                {gemstone.name}
                            </h1>
                            <div className="h-1 w-40 bg-[#d4af37] mx-auto md:mx-0 mb-6"></div>

                            <p className="text-lg md:text-2xl font-serif text-[#3d2817] italic leading-relaxed">
                                {gemstone.shortDescription}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Long Description */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="mb-12 bg-white/50 backdrop-blur-sm rounded-2xl p-8 md:p-10 border-l-4 border-[#d4af37] shadow-xl"
                >
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2c1810] mb-6 flex items-center">
                        <span className="text-[#d4af37] mr-3">✦</span>
                        About {gemstone.name}
                    </h2>
                    <p className="text-base md:text-lg leading-relaxed text-[#1a0f08] text-justify">
                        {gemstone.longDescription}
                    </p>
                </motion.div>

                {/* Properties Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2c1810] mb-6 flex items-center">
                        <span className="text-[#d4af37] mr-3">✦</span>
                        Properties & Characteristics
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Colors */}
                        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-[#8B7355]/20 hover:shadow-xl transition-shadow duration-300">
                            <h3 className="font-bold text-xl text-[#6b4e0e] mb-3">Colors</h3>
                            <div className="flex flex-wrap gap-2">
                                {gemstone.properties.colors.map((color, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1.5 bg-gradient-to-r from-[#d4af37]/20 to-[#f9d77e]/20 rounded-full text-sm text-[#2c1810] border border-[#d4af37]/30"
                                    >
                                        {color}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Hardness */}
                        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-[#8B7355]/20 hover:shadow-xl transition-shadow duration-300">
                            <h3 className="font-bold text-xl text-[#6b4e0e] mb-3">Hardness</h3>
                            <p className="text-base text-[#1a0f08]">{gemstone.properties.hardness}</p>
                        </div>

                        {/* Origins */}
                        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-[#8B7355]/20 hover:shadow-xl transition-shadow duration-300">
                            <h3 className="font-bold text-xl text-[#6b4e0e] mb-3">Origins</h3>
                            <p className="text-base text-[#1a0f08]">{gemstone.properties.origins.join(', ')}</p>
                        </div>

                        {/* Chakra */}
                        {gemstone.properties.chakra && (
                            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-[#8B7355]/20 hover:shadow-xl transition-shadow duration-300">
                                <h3 className="font-bold text-xl text-[#6b4e0e] mb-3">Chakra</h3>
                                <p className="text-base text-[#1a0f08]">{gemstone.properties.chakra}</p>
                            </div>
                        )}

                        {/* Birthstone */}
                        {gemstone.properties.birthstone && (
                            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-[#8B7355]/20 hover:shadow-xl transition-shadow duration-300">
                                <h3 className="font-bold text-xl text-[#6b4e0e] mb-3">Birthstone</h3>
                                <p className="text-base text-[#1a0f08]">{gemstone.properties.birthstone}</p>
                            </div>
                        )}

                        {/* Zodiac */}
                        {gemstone.properties.zodiac && (
                            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-[#8B7355]/20 hover:shadow-xl transition-shadow duration-300">
                                <h3 className="font-bold text-xl text-[#6b4e0e] mb-3">Zodiac Signs</h3>
                                <p className="text-base text-[#1a0f08]">{gemstone.properties.zodiac}</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Metaphysical Properties */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="mb-12 bg-gradient-to-r from-[#d4af37]/10 to-[#f9d77e]/10 rounded-2xl p-8 md:p-10 border-2 border-[#d4af37]/30 shadow-xl"
                >
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2c1810] mb-6 flex items-center">
                        <span className="text-[#d4af37] mr-3">✦</span>
                        Metaphysical & Healing Properties
                    </h2>
                    <p className="text-base md:text-lg leading-relaxed text-[#1a0f08] text-justify">
                        {gemstone.metaphysical}
                    </p>
                </motion.div>

                {/* Related Gemstones */}
                {gemstone.relatedGemstones.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.6 }}
                        className="mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2c1810] mb-6 flex items-center">
                            <span className="text-[#d4af37] mr-3">✦</span>
                            Related Gemstones
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {gemstone.relatedGemstones.map((relatedName, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => onSelectRelated(relatedName)}
                                    className="bg-white/60 hover:bg-white/90 backdrop-blur-sm rounded-xl p-4 transition-all duration-300 hover:scale-105 hover:shadow-xl border border-[#8B7355]/20 hover:border-[#d4af37] group"
                                >
                                    <p className="text-sm font-semibold text-[#2c1810] uppercase tracking-wider group-hover:text-[#6b4e0e]">
                                        {relatedName}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Back to Top Button */}
                <div className="text-center">
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="bg-[#8B7355] hover:bg-[#6B5945] text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                    >
                        Back to Top
                    </button>
                </div>
            </div>
        </div>
    );
}
