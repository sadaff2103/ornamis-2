import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    Sparkles,
    Send,
    Download,
    Bot,
    User,
    Wand2,
    Loader2,
    AlertCircle,
    Check,
    Grid3X3,
    Maximize2,
    X,
} from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { toast } from "sonner";
import { useAuth } from "../../contexts/AuthContext";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { BackButton } from "../BackButton";
import { generateImages } from "../../services/leonardoService";

// Types
interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
    status: "sending" | "generating" | "complete" | "error";
    hasDesign?: boolean;
}

interface GeneratedDesign {
    id: string;
    imageUrl: string;
    prompt: string;
    timestamp: Date;
}

// Suggested prompts (now more specific as they drive generation directly)
const SUGGESTED_PROMPTS = [
    "Elegant gold bracelet with diamond accents",
    "Vintage-style silver ring with emerald center stone",
    "Modern minimalist platinum necklace",
    "Traditional pearl drop earrings with gold trim",
    "Art deco rose gold pendant with sapphire",
    "Bohemian layered silver anklet with turquoise",
];

// Generate unique ID
function generateId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

interface AIChatDesignerProps {
    onNavigate: (page: string, params?: any) => void;
    onBack?: () => void;
}

export function AIChatDesigner({ onNavigate, onBack }: AIChatDesignerProps) {
    const { isAuthenticated } = useAuth();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedDesigns, setGeneratedDesigns] = useState<GeneratedDesign[]>([]);
    const [selectedDesign, setSelectedDesign] = useState<GeneratedDesign | null>(null);
    const [showFullscreen, setShowFullscreen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);



    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Add welcome message on first render
    useEffect(() => {
        if (messages.length === 0) {
            const welcomeMessage: ChatMessage = {
                id: generateId(),
                role: "assistant",
                content: `Welcome to the AI Jewelry Designer! ✨

I create jewelry designs based on your descriptions. Just tell me what you want - be specific about:
• **Type**: ring, necklace, bracelet, earrings, pendant, etc.
• **Material**: gold, silver, platinum, rose gold
• **Style**: modern, vintage, minimalist, art deco
• **Gemstones**: diamond, emerald, sapphire, ruby, pearl

**Example prompts:**
• "Elegant gold bracelet with diamond geometric patterns"
• "Vintage silver ring with a large emerald stone"
• "Minimalist rose gold hoop earrings"

Your designs will appear in the **Image Canvas** on the right →`,
                timestamp: new Date(),
                status: "complete",
            };
            setMessages([welcomeMessage]);
        }
    }, []);

    // Authentication check
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#f6f3f0] to-white flex items-center justify-center py-12 px-4">
                <Card className="max-w-md p-8 text-center">
                    <Sparkles className="w-12 h-12 mx-auto mb-4 text-[#492f0e]" />
                    <h2 className="text-2xl font-['Cinzel_Decorative'] text-[#492f0e] mb-4">
                        AI Designer Requires Authentication
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Please log in to access our AI-powered jewelry design studio and create custom designs.
                    </p>
                    <Button
                        className="w-full bg-gradient-to-r from-[#b39978] to-[#492f0e]"
                        onClick={() => onNavigate?.('login')}
                    >
                        Sign In to Access
                    </Button>
                </Card>
            </div>
        );
    }

    const handleSendMessage = async () => {
        const prompt = inputValue.trim();
        if (!prompt || isGenerating) return;

        setInputValue("");

        const userMessage: ChatMessage = {
            id: generateId(),
            role: "user",
            content: prompt,
            timestamp: new Date(),
            status: "complete",
        };
        setMessages((prev) => [...prev, userMessage]);

        const assistantMessageId = generateId();
        const assistantMessage: ChatMessage = {
            id: assistantMessageId,
            role: "assistant",
            content: "Generating your jewelry design... ✨",
            timestamp: new Date(),
            status: "generating",
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsGenerating(true);

        try {
            const imageUrls = await generateImages(prompt, 1);

            const newDesign: GeneratedDesign = {
                id: generateId(),
                imageUrl: imageUrls[0],
                prompt,
                timestamp: new Date(),
            };

            setGeneratedDesigns((prev) => [newDesign, ...prev].slice(0, 8));
            setSelectedDesign(newDesign);

            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === assistantMessageId
                        ? {
                            ...msg,
                            content: `✓ Design complete! Your jewelry design is ready in the Image Canvas →`,
                            status: "complete",
                            hasDesign: true,
                        }
                        : msg
                )
            );

            toast.success("Design generated successfully!");
        } catch (error: any) {
            console.error("Generation error:", error);
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === assistantMessageId
                        ? {
                            ...msg,
                            content: error?.message || "Failed to generate. Please try again.",
                            status: "error",
                        }
                        : msg
                )
            );
            toast.error("Generation failed. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };


    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setInputValue(suggestion);
        inputRef.current?.focus();
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#f6f3f0] to-white">
            {/* Header */}
            <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
                <div className="max-w-[1800px] mx-auto px-4 py-4">
                    <div className="flex items-center gap-3 mb-4">
                        <BackButton label="Back" onClick={onBack} />
                        <BackButton onNavigate={onNavigate} targetPage="home" label="Home" type="home" />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#b39978] to-[#492f0e] flex items-center justify-center">
                                <Sparkles className="size-5 text-white" />
                            </div>
                            <div>
                                <h1 className="font-['Cinzel_Decorative',serif] text-[#492f0e] text-lg">
                                    AI Jewelry Designer
                                </h1>
                                <p className="text-xs text-gray-500">Describe your design • AI generates it</p>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="flex items-center gap-2">
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Split-Panel Layout */}
            <div className="max-w-[1800px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 p-4 lg:p-6" style={{ minHeight: "calc(100vh - 80px)" }}>

                    {/* LEFT PANEL: Chat */}
                    <div className="flex flex-col h-[calc(100vh-120px)] lg:h-[calc(100vh-120px)]">
                        <Card className="flex-1 flex flex-col overflow-hidden">
                            {/* Chat Header */}
                            <div className="px-4 py-3 border-b bg-gradient-to-r from-[#f5f1ed] to-white">
                                <div className="flex items-center gap-2">
                                    <Bot className="size-4 text-[#492f0e]" />
                                    <span className="font-medium text-[#492f0e] text-sm">Chat with AI Designer</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Describe exactly what you want - the AI follows your prompt
                                </p>
                            </div>

                            {/* Messages Area */}
                            <ScrollArea className="flex-1 p-4">
                                <div className="space-y-4">
                                    <AnimatePresence>
                                        {messages.map((message) => (
                                            <motion.div
                                                key={message.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"
                                                    }`}
                                            >
                                                {message.role === "assistant" && (
                                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#b39978] to-[#492f0e] flex items-center justify-center">
                                                        <Bot className="size-4 text-white" />
                                                    </div>
                                                )}

                                                <div
                                                    className={`max-w-[85%] ${message.role === "user"
                                                        ? "bg-[#492f0e] text-white rounded-2xl rounded-tr-sm px-4 py-3"
                                                        : "bg-[#f5f1ed] text-gray-800 rounded-2xl rounded-tl-sm px-4 py-3"
                                                        }`}
                                                >
                                                    {/* Message content */}
                                                    <div className="whitespace-pre-wrap text-sm">
                                                        {message.status === "generating" ? (
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2">
                                                                    <Loader2 className="size-4 animate-spin" />
                                                                    <span>Creating your design...</span>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            message.content
                                                        )}
                                                    </div>

                                                    {/* Design indicator */}
                                                    {message.hasDesign && (
                                                        <div className="mt-2 flex items-center gap-1.5 text-green-600 text-xs">
                                                            <Check className="size-3" />
                                                            <span>Design ready in Image Canvas →</span>
                                                        </div>
                                                    )}

                                                    {/* Error state */}
                                                    {message.status === "error" && (
                                                        <div className="mt-2 flex items-center gap-2 text-red-500 text-xs">
                                                            <AlertCircle className="size-3" />
                                                            <span>Generation failed</span>
                                                        </div>
                                                    )}

                                                    {/* Timestamp */}
                                                    <div
                                                        className={`text-xs mt-2 ${message.role === "user" ? "text-white/60" : "text-gray-400"
                                                            }`}
                                                    >
                                                        {message.timestamp.toLocaleTimeString([], {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </div>
                                                </div>

                                                {message.role === "user" && (
                                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                        <User className="size-4 text-gray-600" />
                                                    </div>
                                                )}
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                    <div ref={messagesEndRef} />
                                </div>
                            </ScrollArea>

                            {/* Suggested Prompts */}
                            {messages.length <= 1 && (
                                <div className="px-4 py-3 border-t bg-[#f9f7f5]">
                                    <Label className="text-xs text-gray-500 mb-2 block">
                                        Quick start prompts:
                                    </Label>
                                    <div className="flex flex-wrap gap-2">
                                        {SUGGESTED_PROMPTS.slice(0, 3).map((suggestion, idx) => (
                                            <Badge
                                                key={idx}
                                                variant="outline"
                                                className="cursor-pointer hover:bg-[#f0ece7] text-xs py-1"
                                                onClick={() => handleSuggestionClick(suggestion)}
                                            >
                                                {suggestion.length > 30
                                                    ? suggestion.substring(0, 30) + "..."
                                                    : suggestion}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Fixed Input Area */}
                            <div className="p-4 border-t bg-white">
                                <div className="flex gap-3">
                                    <Textarea
                                        ref={inputRef}
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Describe your jewelry design in detail... (e.g., 'elegant gold bracelet with diamond patterns')"
                                        className="flex-1 min-h-[50px] max-h-[100px] resize-none"
                                        disabled={isGenerating}
                                    />
                                    <Button
                                        onClick={handleSendMessage}
                                        disabled={!inputValue.trim() || isGenerating}
                                        className="bg-gradient-to-r from-[#b39978] to-[#492f0e] hover:from-[#9a8567] hover:to-[#362312] text-white px-6"
                                    >
                                        {isGenerating ? (
                                            <Loader2 className="size-5 animate-spin" />
                                        ) : (
                                            <Send className="size-5" />
                                        )}
                                    </Button>
                                </div>
                                <p className="text-xs text-gray-400 mt-2 text-center">
                                    Be specific in your prompt • Press Enter to send
                                </p>
                            </div>
                        </Card>
                    </div>

                    {/* RIGHT PANEL: Image Canvas */}
                    <div className="flex flex-col h-[calc(100vh-120px)] lg:h-[calc(100vh-120px)]">
                        <Card className="flex-1 flex flex-col overflow-hidden">
                            <div className="px-4 py-3 border-b bg-gradient-to-r from-[#f5f1ed] to-white">
                                <div className="flex items-center gap-2">
                                    <Grid3X3 className="size-4 text-[#492f0e]" />
                                    <span className="font-medium text-[#492f0e] text-sm">Image Canvas</span>
                                    {generatedDesigns.length > 0 && (
                                        <Badge variant="outline" className="text-xs">
                                            {generatedDesigns.length} design{generatedDesigns.length > 1 ? "s" : ""}
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    View your generated designs and variations here
                                </p>
                            </div>


                            <ScrollArea className="flex-1 p-4">
                                {generatedDesigns.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-8">
                                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#b39978]/20 to-[#492f0e]/20 flex items-center justify-center mb-4">
                                            <Wand2 className="size-10 text-[#492f0e]/50" />
                                        </div>
                                        <h3 className="font-['Cinzel',serif] text-[#492f0e] text-lg mb-2">
                                            Your Designs Will Appear Here
                                        </h3>
                                        <p className="text-gray-500 text-sm max-w-xs">
                                            Describe your jewelry in the chat and Leonardo AI will generate it for you.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3">
                                        {generatedDesigns.map((design, index) => (
                                            <motion.div
                                                key={design.id}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: index * 0.1 }}
                                                className={`relative group rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${selectedDesign?.id === design.id
                                                    ? "border-[#d4af37] shadow-lg"
                                                    : "border-transparent hover:border-[#d4af37]/50"
                                                    }`}
                                                onClick={() => setSelectedDesign(design)}
                                            >
                                                <ImageWithFallback
                                                    src={design.imageUrl}
                                                    alt={`Generated design: ${design.prompt}`}
                                                    className="w-full aspect-square object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                    <Button
                                                        size="icon" variant="secondary" className="size-8"
                                                        onClick={(e: React.MouseEvent) => { e.stopPropagation(); setSelectedDesign(design); setShowFullscreen(true); }}
                                                    >
                                                        <Maximize2 className="size-4" />
                                                    </Button>
                                                    <Button
                                                        size="icon" variant="secondary" className="size-8"
                                                        onClick={(e: React.MouseEvent) => {
                                                            e.stopPropagation();
                                                            const a = document.createElement("a");
                                                            a.href = design.imageUrl;
                                                            a.download = `jewelry-${Date.now()}.png`;
                                                            a.click();
                                                        }}
                                                    >
                                                        <Download className="size-4" />
                                                    </Button>
                                                </div>
                                                {index === 0 && (
                                                    <div className="absolute top-2 left-2">
                                                        <Badge className="bg-[#d4af37] text-white text-[10px]">Latest</Badge>
                                                    </div>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </ScrollArea>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Fullscreen Modal */}
            <AnimatePresence>
                {showFullscreen && selectedDesign && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                        onClick={() => setShowFullscreen(false)}
                    >
                        <Button
                            variant="ghost" size="icon"
                            className="absolute top-4 right-4 text-white hover:bg-white/20"
                            onClick={() => setShowFullscreen(false)}
                        >
                            <X className="size-6" />
                        </Button>
                        <motion.img
                            initial={{ scale: 0.9 }} animate={{ scale: 1 }}
                            src={selectedDesign.imageUrl}
                            alt={selectedDesign.prompt}
                            className="max-w-full max-h-[90vh] rounded-lg object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
