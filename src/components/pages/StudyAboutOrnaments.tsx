import { useState } from 'react';

import { BackButton } from '../BackButton';

import { GemstoneDetailPage } from './GemstoneDetailPage';
import { gemstoneDatabase, GemstoneData } from '../../data/gemstoneData';

// Import gemstone images from Figma assets
import imgCutAlexandritePng from "figma:asset/4e3ac42d89cd6de519170b431ccf02c9a5f24dac.png";
import imgAmberGemstonePng from "figma:asset/1f8a18b369dd6561e3b24393ace97b2123cd3c88.png";
import imgAmethystGemstonePng from "figma:asset/0cdf9c483fb1f3d57d53e5a30e5003b54361e17d.png";
import imgAmetrineGemstonePng from "figma:asset/bb007eeb28ba04d8dd7a8d69cb4d2693fcd1d276.png";
import imgAquamarineGemstonePng from "figma:asset/b465d288b290dcdf13b003d6c1d00783ce90719e.png";
import imgCitrineGemstonePng from "figma:asset/45d19cbd7a885db5d272d3fbaa48ee38439598e1.png";
import imgGreenEmeraldPng from "figma:asset/276e246bb652ba5d6dfba899653b9a39fcf08075.png";
import imgPolishedGarnetGemstonePng from "figma:asset/0b225929c042cdb144c76b84a91a61c636f85348.png";
import imgPolishedIoliteGemstonePng from "figma:asset/17761087d7c80245e6086c166b9825f90872d0c4.png";
import imgJadeGemstonePng from "figma:asset/7bfa7c118b006b4b4bf39d908c98cd7d73f8a295.png";
import imgKunziteGemstonePng from "figma:asset/a1dec71a5f9b9cd9bb6003146fc9227e8c5d51d2.png";
import imgLapisLazuliPng from "figma:asset/6247de843424c14335675d1434f3d6ba489ed800.png";
import imgMoonstoneGemPng from "figma:asset/2c4abc143678210f96ebb13db7158ba03b398d1c.png";
import imgMorganiteGemstonePng from "figma:asset/625b8c8627a25e245b4d8c143ceb4b98e2939eeb.png";
import imgOpalGemstonePng from "figma:asset/2a869bb565f6fbc495fff70b0b35b2ca3b02b041.png";
import imgPeralPng from "figma:asset/7c3f16c7126dfb194cf43daf12a1baccba69b80b.png";
import imgPeridotGemPng from "figma:asset/bb969eba57e477ff9ebcac00a51dce6009547acc.png";
import imgRoseQuartzGemsPng from "figma:asset/3d5b4652b11a7237ab6b0fd2fd007b953bbd6ab4.png";
import imgRubyGemstonePng from "figma:asset/0d4f23c004281e37749bba810d47ef0fa562a730.png";
import imgSpinelGemstonePng from "figma:asset/129051079ad0c7c355a5b15c7a0866b3389df153.png";
import imgSuntoneGemPng from "figma:asset/b0492ab20d455dd010e5884ad4581c963d11fef8.png";
import imgTanzaniteGemstonePng from "figma:asset/92c3ca788cae84b4cf77c0a3b8e5407fbf405c5f.png";
import imgTopazGemstonePng from "figma:asset/7e3feeca48b1b7c3f4efd3d75b6ab5cc5fcb0ac7.png";
import imgTourmalineGemstonePng from "figma:asset/e896bc5265e42189cb33f84954eb24503b67f1e9.png";
import imgTurquoiseGemstonePng from "figma:asset/ecad692b3798ed097470c72d6634a3d9acc153c0.png";
import imgZirconGemstonePng from "figma:asset/4d190b8e3b17ddb9703b5893f47c0304a3a4c694.png";
import imgImage10 from "figma:asset/ae4dbd3b008bfc23c54fda790732ee5160d3cc2f.png";
import imgImage11 from "figma:asset/fee003af1203d9cedd5ab8655c9d0b2a9f1f590c.png";

interface Gemstone {
  name: string;
  image: string;
}

interface StudyAboutOrnamentsProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

const gemstones: Gemstone[] = [
  { name: "ALEXANDRITE", image: imgCutAlexandritePng },
  { name: "AMBER", image: imgAmberGemstonePng },
  { name: "AMETHYST", image: imgAmethystGemstonePng },
  { name: "AMETRINE", image: imgAmetrineGemstonePng },
  { name: "AQUAMARINE", image: imgAquamarineGemstonePng },
  { name: "CITRINE", image: imgCitrineGemstonePng },
  { name: "EMERALD", image: imgGreenEmeraldPng },
  { name: "GARNET", image: imgPolishedGarnetGemstonePng },
  { name: "IOLITE", image: imgPolishedIoliteGemstonePng },
  { name: "JADE", image: imgJadeGemstonePng },
  { name: "KUNZITE", image: imgKunziteGemstonePng },
  { name: "LAPIS LAZULI", image: imgLapisLazuliPng },
  { name: "MOONSTONE", image: imgMoonstoneGemPng },
  { name: "MORGANITE", image: imgMorganiteGemstonePng },
  { name: "OPAL", image: imgOpalGemstonePng },
  { name: "PEARL", image: imgPeralPng },
  { name: "PERIDOT", image: imgPeridotGemPng },
  { name: "ROSE QUARTZ", image: imgRoseQuartzGemsPng },
  { name: "RUBY", image: imgRubyGemstonePng },
  { name: "SAPPHIRE", image: imgSpinelGemstonePng },
  { name: "SPINEL", image: imgSpinelGemstonePng },
  { name: "SUNSTONE", image: imgSuntoneGemPng },
  { name: "TANZANITE", image: imgTanzaniteGemstonePng },
  { name: "TOPAZ", image: imgTopazGemstonePng },
  { name: "TOURMALINE", image: imgTourmalineGemstonePng },
  { name: "TURQUOISE", image: imgTurquoiseGemstonePng },
  { name: "ZIRCON", image: imgZirconGemstonePng },
];

export function StudyAboutOrnaments({ onNavigate, onBack }: StudyAboutOrnamentsProps) {
  const [selectedGemstone, setSelectedGemstone] = useState<GemstoneData | null>(null);

  const handleGemstoneClick = (gemstoneName: string) => {
    const gemstoneData = gemstoneDatabase[gemstoneName];
    if (gemstoneData) {
      setSelectedGemstone(gemstoneData);
    }
  };

  const handleSelectRelated = (relatedName: string) => {
    const gemstoneData = gemstoneDatabase[relatedName];
    if (gemstoneData) {
      setSelectedGemstone(gemstoneData);
    }
  };

  const handleBack = () => {
    setSelectedGemstone(null);
  };

  // If a gemstone is selected, show the detail page
  if (selectedGemstone) {
    return (
      <GemstoneDetailPage
        gemstone={selectedGemstone}
        onBack={handleBack}
        onSelectRelated={handleSelectRelated}
      />
    );
  }

  // Otherwise, show the main encyclopedia page
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#D9C9B5] via-[#C9B8A4] to-[#B8A693]">
      {/* Navigation Buttons */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="flex items-center gap-3">
          <BackButton label="Back" onClick={onBack} />
          <BackButton onNavigate={onNavigate} targetPage="home" label="Home" type="home" />
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#8B7355] via-[#9B8265] to-[#8B7355] py-12 px-4 border-b-4 border-[#6B5945]">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#2c1810] mb-3 tracking-[0.15em] uppercase">
            Study About Ornaments
          </h1>
          <div className="h-1 w-48 bg-[#2c1810] mx-auto mb-4"></div>
          <p className="text-lg md:text-xl font-serif text-[#1a0f08] tracking-[0.1em] uppercase">
            Unveiling the unseen details that make every jewel timeless
          </p>
        </div>
      </div>

      {/* Gem Encyclopedia Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-[#2c1810] mb-10 tracking-[0.15em] uppercase border-b-2 border-[#8B7355] pb-3 inline-block w-full">
          Gem Encyclopedia
        </h2>

        {/* Gemstone Grid - Matching Figma Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 mb-20">
          {gemstones.map((gem, index) => (
            <div
              key={index}
              onClick={() => handleGemstoneClick(gem.name)}
              className="flex flex-col items-center justify-center p-4 bg-white/40 backdrop-blur-sm rounded-lg hover:bg-white/60 transition-all duration-300 hover:scale-105 cursor-pointer border border-[#8B7355]/20 hover:border-[#8B7355]/50 shadow-md hover:shadow-xl"
            >
              {/* Gemstone Image */}
              <div className="w-full aspect-square mb-3 flex items-center justify-center p-2">
                <img
                  src={gem.image}
                  alt={gem.name}
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </div>
              {/* Gemstone Name */}
              <p className="text-center text-xs md:text-sm font-semibold text-[#202020] uppercase tracking-wider">
                {gem.name}
              </p>
            </div>
          ))}
        </div>

        {/* Every Ornament Holds a Story */}
        <div className="text-center mb-12 py-8 bg-gradient-to-r from-transparent via-[#8B7355]/20 to-transparent">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2c1810] mb-3 tracking-[0.12em] uppercase">
            Every Ornament Holds a Story
          </h2>
          <p className="text-lg md:text-xl font-serif text-[#3d2817] tracking-[0.08em] uppercase">
            Our Metadata Reveals the Art Behind Its Sparkle
          </p>
        </div>

        {/* Gold Guide Section */}
        <div className="bg-gradient-to-br from-[#F5EFE7] to-[#E8DCC8] rounded-2xl p-6 md:p-10 shadow-2xl border-4 border-[#8B7355]">
          <div className="flex items-center justify-center mb-8 border-b-2 border-[#8B7355] pb-4">
            <span className="text-4xl md:text-5xl mr-3">✨</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2c1810] tracking-[0.15em] uppercase">
              Gold Guide
            </h2>
          </div>

          {/* Gold Images */}
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-10">
            <div className="rounded-xl overflow-hidden shadow-2xl border-4 border-[#d4af37]">
              <img
                src={imgImage10}
                alt="Gold nuggets"
                className="w-full h-64 md:h-80 object-cover"
              />
            </div>
            <div className="rounded-xl overflow-hidden shadow-2xl border-4 border-[#d4af37]">
              <img
                src={imgImage11}
                alt="Gold bars"
                className="w-full h-64 md:h-80 object-cover"
              />
            </div>
          </div>

          {/* Gold Information */}
          <div className="space-y-6 text-[#1a0f08]">
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border-l-4 border-[#d4af37] shadow-lg">
              <p className="text-sm md:text-base leading-relaxed text-justify">
                <span className="font-bold text-base md:text-lg text-[#6b4e0e]">GOLD IS A NATURALLY OCCURRING PRECIOUS METAL</span> known for its bright
                yellow appearance, high malleability, and resistance to corrosion.
                It has been used throughout history for currency, jewelry, and cultural
                artifacts.
              </p>
            </div>

            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border-l-4 border-[#d4af37] shadow-lg">
              <p className="text-sm md:text-base leading-relaxed mb-4 text-justify">
                <span className="font-bold text-base md:text-lg text-[#6b4e0e]">GOLD IS MEASURED IN CARATS (K)</span>, which indicate its purity:
              </p>
              <ul className="space-y-3 ml-4 md:ml-6">
                <li className="flex items-start">
                  <span className="text-[#d4af37] mr-3 text-xl">•</span>
                  <span className="text-sm md:text-base"><strong className="text-[#6b4e0e]">24K GOLD</strong> contains 99.9% gold, the purest form, ideal for investment and some jewelry.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#d4af37] mr-3 text-xl">•</span>
                  <span className="text-sm md:text-base"><strong className="text-[#6b4e0e]">22K GOLD</strong> contains 91.6% gold mixed with small amounts of metals like copper and silver, suitable for detailed jewelry.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#d4af37] mr-3 text-xl">•</span>
                  <span className="text-sm md:text-base"><strong className="text-[#6b4e0e]">18K GOLD</strong> contains 75% gold and is commonly used for fine jewelry due to its strength and durability while maintaining a high-quality appearance.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border-l-4 border-[#d4af37] shadow-lg">
              <p className="text-sm md:text-base leading-relaxed text-justify">
                <span className="font-bold text-base md:text-lg text-[#6b4e0e]">GOLD DOES NOT TARNISH</span> but it can scratch easily in higher purities.
                To ensure authenticity, gold jewelry is often marked with hallmarks.
                In India, <strong>BIS (Bureau of Indian Standards)</strong> issues hallmark certification.
                The value of gold depends on purity, weight, craftsmanship, and certification agency.
                Market rates fluctuate based on global demand and economic factors.
              </p>
            </div>

            <div className="bg-gradient-to-r from-[#d4af37]/20 to-[#f9d77e]/20 rounded-lg p-6 border-2 border-[#d4af37] shadow-lg">
              <p className="text-sm md:text-base leading-relaxed text-justify font-semibold text-[#2c1810]">
                💡 <strong>Did you know?</strong> Gold is so malleable that a single ounce can be beaten into a sheet
                covering 300 square feet! This property makes it perfect for intricate jewelry designs.
              </p>
            </div>
          </div>
        </div>

        {/* Additional Educational Content */}
        <div className="mt-12 bg-gradient-to-br from-[#E8DCC8] to-[#D9C9B5] rounded-2xl p-6 md:p-10 shadow-xl border-2 border-[#8B7355]">
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-center text-[#2c1810] mb-6 tracking-[0.12em] uppercase">
            Understanding Gemstone Quality
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-5 shadow-md">
              <h4 className="font-bold text-lg text-[#6b4e0e] mb-3">The 4 C's of Gemstones</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-[#d4af37] mr-2">✦</span>
                  <span><strong>Color:</strong> Hue, saturation, and tone determine beauty and value</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#d4af37] mr-2">✦</span>
                  <span><strong>Clarity:</strong> Fewer inclusions mean higher quality</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#d4af37] mr-2">✦</span>
                  <span><strong>Cut:</strong> Proper faceting maximizes brilliance</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#d4af37] mr-2">✦</span>
                  <span><strong>Carat:</strong> Weight measurement (1 carat = 200mg)</span>
                </li>
              </ul>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-5 shadow-md">
              <h4 className="font-bold text-lg text-[#6b4e0e] mb-3">Care & Maintenance</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-[#d4af37] mr-2">✦</span>
                  <span>Clean with warm soapy water and soft brush</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#d4af37] mr-2">✦</span>
                  <span>Store separately to prevent scratching</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#d4af37] mr-2">✦</span>
                  <span>Remove jewelry before sports or heavy work</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#d4af37] mr-2">✦</span>
                  <span>Professional cleaning recommended annually</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
