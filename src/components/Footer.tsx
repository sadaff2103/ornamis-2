import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { OrnamisLogo } from "./OrnamisLogo";

interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-gradient-to-r from-[#351d06] to-[#492f0e] text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <div className="mb-4">
              <OrnamisLogo variant="icon" size={40} />
            </div>
            <h3 className="mb-4 font-['Cinzel_Decorative',serif]">OrnaMIS</h3>
            <p className="text-sm text-white/70 mb-4">
              Where technology meets elegance, tailored for you. Discover unique jewelry pieces with AI-powered recommendations and AR try-on.
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
                <Facebook className="size-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
                <Instagram className="size-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
                <Twitter className="size-5" />
              </Button>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="mb-4">Explore</h4>
            <div className="space-y-2 text-sm text-white/70">
              <button onClick={() => onNavigate("rings")} className="block hover:text-white transition-colors">
                Rings
              </button>
              <button onClick={() => onNavigate("necklaces")} className="block hover:text-white transition-colors">
                Necklaces
              </button>
              <button onClick={() => onNavigate("earrings")} className="block hover:text-white transition-colors">
                Earrings
              </button>
              <button onClick={() => onNavigate("bracelets")} className="block hover:text-white transition-colors">
                Bracelets
              </button>
              <button onClick={() => onNavigate("ai-designer")} className="block hover:text-white transition-colors">
                AI Designer
              </button>
              <button onClick={() => onNavigate("universal-tryon")} className="block hover:text-white transition-colors">
                AR Try-On
              </button>
              <button onClick={() => onNavigate("about")} className="block hover:text-white transition-colors">
                About
              </button>
            </div>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="mb-4">Contact Us</h4>
            <div className="space-y-3 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <Mail className="size-4" />
                <a href="mailto:admin@ornamis.com" className="hover:text-white transition-colors">
                  admin@ornamis.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="size-4" />
                <a href="tel:+919123456789" className="hover:text-white transition-colors">
                  +91 91234 56789
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="size-4 mt-0.5" />
                <p>Hyderabad, Telangana, India</p>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="mb-4">Newsletter</h4>
            <p className="text-sm text-white/70 mb-4">
              Subscribe to get exclusive offers and updates
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
              <Button className="bg-[#b39978] hover:bg-[#9a8567] text-white">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <Separator className="bg-white/10 mb-6" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/70">
          <div className="flex items-center gap-2">
            <span>©</span>
            <span>2025 www.OrnaMIS.com</span>
          </div>
          <div className="flex gap-6">
            <button onClick={() => onNavigate("privacy")} className="hover:text-white transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => onNavigate("terms")} className="hover:text-white transition-colors">
              Terms & Conditions
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}