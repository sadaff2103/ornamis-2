import { motion } from "motion/react";
import { BackButton } from "../BackButton";

import imgImage from "figma:asset/538b9b23ce4d8c09d0b8e92e310e7d2e3c19b378.png";
import img6132080106382936004 from "figma:asset/33b7dbe6beb71c1bd77b96d6c0b3aff59848e6aa.png";
import img61339932695001679381 from "figma:asset/e6652a3b97db909da3c28d41a3ac42c8eb457b89.png";
import imgWebsite from "figma:asset/fdf128c6975f5cc0ab3c9fbc7bfa9309574b3507.png";
import imgPlaceMarker from "figma:asset/d77502d1a3ce89db8a432c3559db893d32393cb5.png";
import imgContactDetails from "figma:asset/746a83fc692e83ccd23a3a166e1924c809fa23ff.png";

interface AboutPageProps {
  onNavigate: (page: string) => void;
  onBack?: () => void;
}

export function AboutPage({ onNavigate, onBack }: AboutPageProps) {
  return (
    <div
      className="relative min-h-screen w-full pb-12"
      style={{
        backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 1440 4908\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><g transform=\\'matrix(4.4087e-15 245.4 -72 1.5026e-14 720 2454)\\' opacity=\\'1\\'><rect height=\\'190\\' width=\\'190\\' fill=\\'url(%23grad)\\' id=\\'quad\\' shape-rendering=\\'crispEdges\\'/><use href=\\'%23quad\\' transform=\\'scale(1 -1)\\'/><use href=\\'%23quad\\' transform=\\'scale(-1 1)\\'/><use href=\\'%23quad\\' transform=\\'scale(-1 -1)\\'/></g><defs><linearGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' x2=\\'5\\' y2=\\'5\\'><stop stop-color=\\'rgba(231,225,215,1)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(187,170,162,1)\\' offset=\\'0.25\\'/><stop stop-color=\\'rgba(164,142,135,1)\\' offset=\\'0.375\\'/><stop stop-color=\\'rgba(142,114,109,1)\\' offset=\\'0.5\\'/><stop stop-color=\\'rgba(120,86,82,1)\\' offset=\\'0.625\\'/><stop stop-color=\\'rgba(98,59,56,1)\\' offset=\\'0.75\\'/><stop stop-color=\\'rgba(75,31,29,1)\\' offset=\\'0.875\\'/><stop stop-color=\\'rgba(64,17,16,1)\\' offset=\\'0.9375\\'/><stop stop-color=\\'rgba(53,3,3,1)\\' offset=\\'1\\'/></linearGradient></defs></svg>')"
      }}
    >
      {/* Navigation Buttons */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="flex items-center gap-3">
          <BackButton label="Back" onClick={onBack} />
          <BackButton onNavigate={onNavigate} targetPage="home" label="Home" type="home" />
        </div>
      </div>

      {/* About ORNAMIS Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative mx-auto pt-20 pb-6 max-w-6xl"
      >
        <div className="bg-gradient-to-r from-[#7f3e3e] to-[#b39978] mx-4 rounded-[40px] h-[200px] md:h-[240px] relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="font-['Chonburi',sans-serif] text-[#f6ecec] text-4xl md:text-5xl lg:text-6xl text-center px-4">
              ABOUT ORNAMIS
            </h1>
          </div>
        </div>
      </motion.div>

      {/* Our Story */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-5xl mx-auto px-4 py-8"
      >
        <div className="font-['Cormorant_Upright',serif] text-[#f6ecec] text-lg md:text-xl leading-relaxed space-y-4 text-center">
          <p>
            In a world where technology and fashion are often seen as distinct domains, our platform bridges this gap by combining both to create a unique and personalized experience for women in choosing the perfect jewelry for any occasion or outfit.
          </p>
          <p>
            We believe that understanding the craftsmanship behind each piece enhances the experience of wearing it. That's why we provide detailed insights into the making of every jewelry item featured on our platform.
          </p>
          <div className="pt-4">
            <button
              onClick={() => onNavigate("collections")}
              className="px-8 py-3 bg-white text-[#492f0e] rounded-lg hover:bg-white/90 transition-colors font-['Cinzel',serif]"
            >
              Explore Our Collections
            </button>
          </div>
        </div>
      </motion.div>

      {/* Brand Partners Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="relative mx-auto mt-12 max-w-6xl"
      >
        <div className="bg-[#fab8b8] mx-4 rounded-[40px] h-[200px] md:h-[240px] relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.67]">
            <img alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none" src={imgImage} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="font-['Chonburi',sans-serif] text-[#873d3d] text-4xl md:text-5xl lg:text-6xl text-center px-4">
              BRAND PARTNERS
            </h2>
          </div>
        </div>
      </motion.div>

      {/* JAUHARI Section */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="relative"
          >
            <div className="rounded-full overflow-hidden w-full max-w-[400px] mx-auto aspect-square shadow-2xl">
              <img alt="JAUHARI Brand" className="w-full h-full object-cover" src={img6132080106382936004} />
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
          >
            <div className="font-['Cormorant_Upright',serif] text-[#fcf8f1] text-base md:text-lg leading-relaxed">
              <p className="mb-4">
                We are honored to collaborate with <strong>JAUHARI - Crafted just for you</strong>, a distinguished brand renowned for its exceptional craftsmanship and timeless designs. This partnership is built on a shared commitment to quality, artistry, and customer satisfaction.
              </p>
              <p className="mb-4">
                Together, we aim to curate a unique selection of jewelry that combines classic elegance with contemporary style. Known for their meticulous attention to detail and use of premium materials, JAUHARI brings unmatched expertise and creativity to this collaboration.
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-3 bg-[#492f0e]/20 backdrop-blur-sm rounded-2xl p-5">
              <div className="flex items-center gap-3">
                <div className="size-[40px] flex-shrink-0">
                  <img alt="Website" className="w-full h-full object-contain" src={imgWebsite} />
                </div>
                <a
                  href="https://www.jauhari.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-['Cormorant_Garamond:SemiBold',serif] text-white text-xl hover:underline"
                >
                  www.jauhari.in
                </a>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-[40px] flex-shrink-0">
                  <img alt="Contact" className="w-full h-full object-contain" src={imgContactDetails} />
                </div>
                <p className="font-['Cormorant_Garamond:SemiBold',serif] text-[#fff8f8] text-xl">
                  040 2930 3137
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="size-[40px] flex-shrink-0 mt-1">
                  <img alt="Location" className="w-full h-full object-contain" src={imgPlaceMarker} />
                </div>
                <p className="font-['Cormorant_Garamond:SemiBold',serif] text-[#fffcfc] text-base leading-relaxed">
                  9-4-131/11/A, Opp. Success School, 7 Tombs Road, Towlichowki, Hyderabad - 500089, Telangana
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Diamond Certification */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="max-w-6xl mx-auto px-4 py-10"
      >
        <div className="bg-gradient-to-r from-[#492f0e] to-[#6c5c4c] rounded-[40px] p-8 md:p-10 text-center">
          <h2 className="font-['Days_One',sans-serif] text-2xl md:text-3xl lg:text-4xl text-black mb-6">
            DIAMOND CERTIFICATION of<br />
            IGI - INTERNATIONAL GEMOLOGICAL<br />
            INSTITUTE INDIA
          </h2>
          <div className="max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-2xl">
            <img alt="Diamond Certification" className="w-full h-auto object-cover" src={img61339932695001679381} />
          </div>
        </div>
      </motion.div>

      {/* Authenticity Statement */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="max-w-5xl mx-auto px-4 py-10"
      >
        <div className="font-['Cormorant_Upright',serif] text-[#f6ecec] text-lg md:text-xl leading-relaxed text-center space-y-4">
          <p>
            We are committed to providing our customers with 100% authentic jewelry and accurate information. All images on our website are sourced from an authorized brand, and every detail shared is fully verified.
          </p>
          <p>
            We bring you a curated collection of exquisite jewelry, each piece designed to exude elegance, sophistication, and timeless beauty. From dazzling necklaces to intricately crafted rings, our selection is perfect for every occasion.
          </p>
          <p className="font-['Cinzel_Decorative',serif] text-[#d1c5b6] text-2xl md:text-3xl mt-6">
            Explore our collection and indulge in the brilliance of genuine craftsmanship – where beauty meets authenticity.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
