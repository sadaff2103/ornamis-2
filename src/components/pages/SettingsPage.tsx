import { useState } from "react";
import { motion } from "motion/react";
import {
    User,
    MapPin,
    Shield,
    Bell,
    CreditCard,
    Store,
    Truck,
    Settings as SettingsIcon,
    LogOut,
    Camera,
    Plus,
    Mail,
    Phone,
    Database,
    Lock,
} from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { BackButton } from "../BackButton";
import { useAuth } from "../../contexts/AuthContext";

interface SettingsPageProps {
    onNavigate: (page: string) => void;
    onBack?: () => void;
}

export function SettingsPage({ onNavigate, onBack }: SettingsPageProps) {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState("profile");

    if (!user) return null;

    // ─── Tab definitions per role ───────────────────────────────────────────────
    const allTabs = [
        { id: "profile", label: "Profile", icon: User, roles: ["customer", "seller", "admin"] },
        { id: "addresses", label: "Addresses", icon: MapPin, roles: ["customer"] },
        { id: "security", label: "Security", icon: Lock, roles: ["customer", "seller", "admin"] },
        { id: "notifications", label: "Notifications", icon: Bell, roles: ["customer", "seller", "admin"] },
        { id: "payments", label: "Payments", icon: CreditCard, roles: ["customer"] },
        { id: "store", label: "Store", icon: Store, roles: ["seller"] },
        { id: "shipping", label: "Shipping", icon: Truck, roles: ["seller"] },
        { id: "system", label: "Platform Control", icon: SettingsIcon, roles: ["admin"] },
    ].filter((t) => t.roles.includes(user.role || "customer"));

    // ─── Content blocks ─────────────────────────────────────────────────────────
    const renderContent = () => {
        switch (activeTab) {

            // ── Profile ──────────────────────────────────────────────────────────────
            case "profile":
                return (
                    <Card className="p-6 border-none shadow-xl shadow-black/5">
                        <h3 className="text-lg font-semibold mb-6">Profile Information</h3>
                        <div className="flex items-center gap-6 mb-8">
                            <div className="relative group">
                                <div className="size-24 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 text-3xl font-bold border-4 border-white shadow-md">
                                    {user.name.charAt(0)}
                                </div>
                                <button className="absolute bottom-0 right-0 p-2 bg-[#492f0e] text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="size-4" />
                                </button>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Public avatar and name</p>
                                <Button variant="outline" size="sm">Change Photo</Button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" defaultValue={user.name} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" defaultValue={user.email} disabled />
                            </div>
                            {user.role !== "customer" && (
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input id="phone" placeholder="+91 99887 76655" />
                                </div>
                            )}
                        </div>
                        <Button className="mt-6 bg-[#492f0e] hover:bg-[#362312]">Save Changes</Button>
                    </Card>
                );

            // ── Addresses (customer) ──────────────────────────────────────────────────
            case "addresses":
                return (
                    <Card className="p-6 border-none shadow-xl shadow-black/5">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold">Saved Addresses</h3>
                            <Button size="sm" className="bg-[#492f0e] hover:bg-[#362312]">
                                <Plus className="size-4 mr-2" /> Add New
                            </Button>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 border rounded-xl flex items-center justify-between hover:border-amber-500/30 transition-colors">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold">Home</span>
                                        <Badge variant="secondary" className="text-[10px]">Default</Badge>
                                    </div>
                                    <p className="text-sm text-gray-600">H.No 12-3-456, Banjara Hills, Hyderabad, Telangana – 500034</p>
                                </div>
                                <Button variant="ghost" size="sm">Edit</Button>
                            </div>
                            <div className="p-4 border rounded-xl flex items-center justify-between hover:border-amber-500/30 transition-colors">
                                <div>
                                    <span className="font-bold">Office</span>
                                    <p className="text-sm text-gray-600">8-2-293/82/A, Road No. 45, Jubilee Hills, Hyderabad – 500033</p>
                                </div>
                                <Button variant="ghost" size="sm">Edit</Button>
                            </div>
                        </div>
                    </Card>
                );

            // ── Security ──────────────────────────────────────────────────────────────
            case "security":
                return (
                    <Card className="p-6 border-none shadow-xl shadow-black/5">
                        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <Lock className="size-5 text-amber-600" /> Security & Access
                        </h3>
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <Label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Password</Label>
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-amber-200 transition-colors">
                                    <div>
                                        <p className="text-sm font-bold text-gray-800">Master Password</p>
                                        <p className="text-xs text-gray-500">Last updated January 2024</p>
                                    </div>
                                    <Button variant="outline" size="sm" className="rounded-full px-6">Change</Button>
                                </div>
                            </div>
                            <div className="space-y-3 pt-4 border-t border-gray-100">
                                <Label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Two-Factor Authentication</Label>
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="flex-1 pr-4">
                                        <p className="text-sm font-bold text-gray-800">2FA via Email OTP</p>
                                        <p className="text-xs text-red-500 font-medium">Currently inactive — recommended for high security</p>
                                    </div>
                                    <Button size="sm" className="rounded-full px-6 bg-[#492f0e] text-white hover:bg-[#362312]">Enable</Button>
                                </div>
                            </div>
                            <div className="space-y-3 pt-4 border-t border-gray-100">
                                <Label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Active Sessions</Label>
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div>
                                        <p className="text-sm font-bold text-gray-800">Current Session</p>
                                        <p className="text-xs text-gray-500">Windows · Chrome · Hyderabad, IN</p>
                                    </div>
                                    <Badge className="bg-green-500/10 text-green-600 border-green-200">Active</Badge>
                                </div>
                            </div>
                        </div>
                    </Card>
                );

            // ── Notifications ─────────────────────────────────────────────────────────
            case "notifications":
                return (
                    <Card className="p-6 border-none shadow-xl shadow-black/5">
                        <h3 className="text-lg font-semibold mb-6">Notification Preferences</h3>
                        <div className="space-y-4">
                            {[
                                { id: "order_updates", label: "Order Updates", desc: "Get notified about order status and tracking", on: true },
                                { id: "promos", label: "Promotions & Offers", desc: "Sales and new collection alerts", on: true },
                                { id: "ai_design", label: "AI Design Tips", desc: "Weekly inspiration for custom jewelry", on: false },
                                { id: "security_alerts", label: "Security Alerts", desc: "Login from new devices or locations", on: true },
                            ].map((pref) => (
                                <div key={pref.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                    <div>
                                        <p className="text-sm font-medium">{pref.label}</p>
                                        <p className="text-xs text-gray-500">{pref.desc}</p>
                                    </div>
                                    <div className={`w-10 h-5 rounded-full flex items-center px-1 cursor-pointer transition-colors ${pref.on ? "bg-amber-500 justify-end" : "bg-gray-300 justify-start"}`}>
                                        <div className="size-3.5 bg-white rounded-full shadow" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                );

            // ── Payments (customer) ───────────────────────────────────────────────────
            case "payments":
                return (
                    <Card className="p-6 border-none shadow-xl shadow-black/5">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold">Payment Methods</h3>
                            <Button size="sm" className="bg-[#492f0e] hover:bg-[#362312]">
                                <Plus className="size-4 mr-2" /> Add Card
                            </Button>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 border border-dashed rounded-xl flex flex-col items-center justify-center text-center py-10 text-gray-400">
                                <CreditCard className="size-8 mb-2 opacity-20" />
                                <p className="text-sm font-medium">No saved cards or UPI IDs</p>
                                <p className="text-xs text-gray-400 mt-1">Add a card for faster checkout</p>
                            </div>
                        </div>
                        <div className="mt-6 pt-6 border-t">
                            <h4 className="text-sm font-bold mb-3 text-gray-700">UPI IDs</h4>
                            <div className="p-4 border border-dashed rounded-xl flex flex-col items-center justify-center text-center py-6 text-gray-400">
                                <p className="text-sm">No UPI IDs linked</p>
                                <Button variant="link" size="sm" className="text-amber-800">Link UPI ID</Button>
                            </div>
                        </div>
                    </Card>
                );

            // ── Store (seller) ────────────────────────────────────────────────────────
            case "store":
                return (
                    <Card className="p-6 border-none shadow-xl shadow-black/5">
                        <h3 className="text-lg font-semibold mb-6">Store Configuration</h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="storeName">Store Display Name</Label>
                                <Input id="storeName" placeholder="E.g. Jauhari Excellence" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="storeDesc">Store Tagline</Label>
                                <Input id="storeDesc" placeholder="What makes your store unique?" />
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                <div className="space-y-2">
                                    <Label>Business Phone</Label>
                                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-600 border">
                                        <Phone className="size-4 text-gray-400" /> +91 99887 76655
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Business Email</Label>
                                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-600 border">
                                        <Mail className="size-4 text-gray-400" /> partner@ornamis.com
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="gstin">GSTIN</Label>
                                <Input id="gstin" placeholder="27AAPFU0939F1ZV" />
                            </div>
                        </div>
                        <Button className="mt-6 bg-amber-600 hover:bg-amber-700">Update Store</Button>
                    </Card>
                );

            // ── Shipping (seller) ─────────────────────────────────────────────────────
            case "shipping":
                return (
                    <Card className="p-6 border-none shadow-xl shadow-black/5">
                        <h3 className="text-lg font-semibold mb-6">Shipping & Logistics</h3>
                        <div className="space-y-4">
                            {[
                                { label: "Express Shipping", desc: "24-hour dispatch for local orders", on: true },
                                { label: "Pan-India Delivery", desc: "Ship to all states via courier partner", on: true },
                                { label: "International Shipping", desc: "Allow orders from outside India", on: false },
                                { label: "Cash on Delivery (COD)", desc: "Accept payment at delivery doorstep", on: true },
                            ].map((opt) => (
                                <div key={opt.label} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <Truck className="size-5 text-gray-400 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium text-sm">{opt.label}</p>
                                            <p className="text-xs text-gray-500">{opt.desc}</p>
                                        </div>
                                    </div>
                                    <div className={`w-10 h-5 rounded-full flex items-center px-1 cursor-pointer transition-colors ${opt.on ? "bg-amber-500 justify-end" : "bg-gray-300 justify-start"}`}>
                                        <div className="size-3.5 bg-white rounded-full shadow" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-6 border-t">
                            <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">Payout Cycle</Label>
                            <div className="grid grid-cols-3 gap-3 mt-3">
                                {["Weekly", "Bi-weekly", "Monthly"].map((cycle) => (
                                    <button
                                        key={cycle}
                                        className={`py-3 border rounded-xl text-sm font-bold transition-all ${cycle === "Weekly" ? "border-amber-500 bg-amber-50 text-amber-800" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
                                    >
                                        {cycle}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </Card>
                );

            // ── Platform Control (admin) ──────────────────────────────────────────────
            case "system":
                return (
                    <Card className="p-6 border-none shadow-xl shadow-black/5">
                        <h3 className="text-lg font-semibold mb-6">Platform Governance</h3>
                        <div className="space-y-6">
                            {/* Maintenance Mode */}
                            <div className="flex items-center justify-between p-4 border rounded-xl bg-red-50/50 border-red-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-100 rounded-lg text-red-600">
                                        <Shield className="size-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-red-900">Maintenance Mode</p>
                                        <p className="text-xs text-red-800/60">Diverts all traffic to a maintenance splash page</p>
                                    </div>
                                </div>
                                <div className="w-10 h-5 bg-gray-200 rounded-full flex items-center justify-start px-1 cursor-pointer">
                                    <div className="size-3.5 bg-white rounded-full shadow" />
                                </div>
                            </div>

                            {/* Fee + Multiplier */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fee">Platform Commission Fee (%)</Label>
                                    <Input id="fee" type="number" defaultValue="2.5" min="0" max="20" step="0.1" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="multiplier">Live Rate Multiplier</Label>
                                    <Input id="multiplier" type="number" defaultValue="1.0" step="0.01" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="taxRate">GST Rate (%)</Label>
                                    <Input id="taxRate" type="number" defaultValue="3" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="maxDiscount">Max Allowed Discount (%)</Label>
                                    <Input id="maxDiscount" type="number" defaultValue="30" />
                                </div>
                            </div>

                            {/* Toggles */}
                            <div className="space-y-3 pt-4 border-t">
                                <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">Global Flags</Label>
                                {[
                                    { label: "Email Notifications on Approval", desc: "Notify sellers when approved/rejected", on: true },
                                    { label: "Auto-approve New Customers", desc: "Skip manual activation for customers", on: true },
                                    { label: "New Seller Registrations", desc: "Allow new sellers to submit applications", on: true },
                                ].map((flag) => (
                                    <div key={flag.label} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div>
                                            <p className="text-sm font-medium">{flag.label}</p>
                                            <p className="text-xs text-gray-500">{flag.desc}</p>
                                        </div>
                                        <div className={`w-10 h-5 rounded-full flex items-center px-1 cursor-pointer ${flag.on ? "bg-amber-500 justify-end" : "bg-gray-300 justify-start"}`}>
                                            <div className="size-3.5 bg-white rounded-full shadow" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* System tools */}
                            <div className="pt-4 border-t space-y-3">
                                <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">System Integrity</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    <Button variant="outline" className="justify-start gap-3 h-auto py-3">
                                        <Database className="size-4 text-amber-600" />
                                        <div className="text-left">
                                            <p className="text-xs font-bold">Flush Cache</p>
                                            <p className="text-[10px] text-gray-500">Clear all site cache</p>
                                        </div>
                                    </Button>
                                    <Button variant="outline" className="justify-start gap-3 h-auto py-3">
                                        <Shield className="size-4 text-amber-600" />
                                        <div className="text-left">
                                            <p className="text-xs font-bold">Audit Logs</p>
                                            <p className="text-[10px] text-gray-500">View all admin actions</p>
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <Button className="mt-8 w-full md:w-auto bg-[#492f0e] hover:bg-[#362312]">Apply Platform Changes</Button>
                    </Card>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#f9f7f5] py-12 px-4 selection:bg-amber-200">
            <div className="max-w-6xl mx-auto">
                {/* Top bar */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <BackButton label="Back" onClick={onBack} />
                        <BackButton onNavigate={onNavigate} targetPage="home" label="Home" type="home" />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <SettingsIcon className="size-4" />
                        <span className="font-medium capitalize">{user.role} Settings</span>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="w-full lg:w-72 space-y-4 flex-shrink-0">
                        <Card className="p-2 border-none shadow-xl shadow-black/5 bg-white/80 backdrop-blur-xl">
                            <div className="p-4 mb-2">
                                <h2 className="text-2xl font-['Cinzel',serif] font-bold text-[#492f0e]">
                                    Control Center
                                </h2>
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-1">
                                    {user.role} Authorization Active
                                </p>
                            </div>
                            <nav className="space-y-1">
                                {allTabs.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left ${activeTab === item.id
                                                ? "bg-[#492f0e] text-white shadow-lg shadow-[#492f0e]/20"
                                                : "text-gray-500 hover:bg-amber-50 hover:text-amber-900"
                                            }`}
                                    >
                                        <item.icon className={`size-4 flex-shrink-0 ${activeTab === item.id ? "text-amber-400" : ""}`} />
                                        {item.label}
                                        {activeTab === item.id && (
                                            <motion.div layoutId="activeDot" className="ml-auto size-1.5 rounded-full bg-amber-400" />
                                        )}
                                    </button>
                                ))}
                                <div className="pt-2 mt-2 border-t border-gray-100">
                                    <button
                                        onClick={logout}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <LogOut className="size-4" />
                                        Sign Out
                                    </button>
                                </div>
                            </nav>
                        </Card>

                        {/* Help card */}
                        <Card className="p-6 bg-gradient-to-br from-[#492f0e] to-[#2a1b0a] text-white border-none shadow-xl">
                            <Shield className="size-8 text-amber-400 mb-4" />
                            <h4 className="font-bold text-sm mb-2">Need help?</h4>
                            <p className="text-xs text-white/60 mb-4 leading-relaxed">
                                Our support team is available 24/7 for account or order assistance.
                            </p>
                            <Button variant="outline" className="w-full border-white/20 hover:bg-white/10 text-xs">
                                Contact Support
                            </Button>
                        </Card>
                    </div>

                    {/* Content panel */}
                    <div className="flex-1 min-w-0">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {renderContent()}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
