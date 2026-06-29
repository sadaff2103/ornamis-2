import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import {
    Users,
    ShieldCheck,
    CheckCircle2,
    XCircle,
    Database,
    Globe,
    RefreshCw,
    Bell,
    Gem,
    Store
} from "lucide-react";
import { BackButton } from "../BackButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ref, get, update } from "firebase/database";
import { db } from "../../lib/firebaseClient";
import { useBooking } from "../../contexts/BookingContext";

interface AdminDashboardProps {
    user: { name: string; email: string; role?: string };
    onNavigate: (page: string) => void;
    onBack?: () => void;
}

interface SellerProfile {
    id: string;
    email: string;
    full_name?: string;
    role: string;
    seller_status: string;
    created_at: string;
}

interface DashboardStats {
    totalUsers: number;
    totalSellers: number;
    pendingSellers: number;
    approvedSellers: number;
}

export function AdminDashboard({ user, onNavigate, onBack }: AdminDashboardProps) {
    const [pendingSellers, setPendingSellers] = useState<SellerProfile[]>([]);
    const [stats, setStats] = useState<DashboardStats>({
        totalUsers: 0,
        totalSellers: 0,
        pendingSellers: 0,
        approvedSellers: 0,
    });
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [notifications, setNotifications] = useState<string[]>([]);
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" | "info" } | null>(null);
    const [isSimulated, setIsSimulated] = useState(false);
    const { allBookings, releaseBooking, refreshAllBookings, isLoadingBookings } = useBooking();

    const showToast = (msg: string, type: "success" | "error" | "info" = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 4000);
    };

    const fetchData = useCallback(async () => {
        setLoading(true);
        setIsSimulated(false);
        try {
            const snap = await get(ref(db, 'profiles'));
            const all: SellerProfile[] = snap.exists()
                ? Object.values(snap.val() as Record<string, SellerProfile>)
                : [];
            all.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

            const sellers = all.filter((p) => p.role === "seller");
            const pending = sellers.filter((p) => p.seller_status === "pending");
            const approved = sellers.filter((p) => p.seller_status === "approved");

            setPendingSellers(pending);
            setStats({
                totalUsers: all.length,
                totalSellers: sellers.length,
                pendingSellers: pending.length,
                approvedSellers: approved.length,
            });

            const customers = all.filter((p) => p.role === "customer");
            const notifs: string[] = [];
            if (pending.length > 0)
                notifs.push(`${pending.length} Merchant Petitions awaiting review`);
            if (approved.length > 0)
                notifs.push(`${approved.length} Master Artisans active on platform`);
            if (customers.length > 0)
                notifs.push(`${customers.length} Noble Patrons registered`);
            
            setNotifications(notifs.length > 0 ? notifs : ["The Archive is synchronized. All systems stable."]);
        } catch (err: any) {
            console.error("Admin error:", err);
            if (err.message?.includes("Permission denied") || err.code === "PERMISSION_DENIED") {
                setIsSimulated(true);
                // Fallback to mock data for aesthetic review
                const mockSellers: SellerProfile[] = [
                    { id: "mock1", email: "artisan@giva.co", full_name: "Giva Master", role: "seller", seller_status: "pending", created_at: new Date().toISOString() },
                    { id: "mock2", email: "royal@jauhari.in", full_name: "Jauhari Artisan", role: "seller", seller_status: "pending", created_at: new Date().toISOString() },
                ];
                setPendingSellers(mockSellers);
                setStats({
                    totalUsers: 142,
                    totalSellers: 24,
                    pendingSellers: 2,
                    approvedSellers: 22,
                });
                setNotifications([
                    "⚠ PERMISSION DENIED: Using Imperial Simulation Mode",
                    "Please update Firebase Database Rules to allow admin access to /profiles",
                    "Simulating 2 pending petitions for UI verification."
                ]);
                showToast("Imperial Archive access restricted. Entering Simulation Mode.", "info");
            } else {
                showToast("Failed to connect to the Imperial Archive", "error");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        refreshAllBookings();
    }, [fetchData, refreshAllBookings]);

    const handleApprove = async (sellerId: string, sellerEmail: string) => {
        setActionLoading(sellerId);
        try {
            await update(ref(db, `profiles/${sellerId}`), {
                seller_status: "approved",
                updated_at: new Date().toISOString(),
            });
            showToast(`Imperial Seal granted to ${sellerEmail}`);
            await fetchData();
        } catch (err) {
            showToast("Decree failed", "error");
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (sellerId: string, sellerEmail: string) => {
        setActionLoading(sellerId + "_reject");
        try {
            await update(ref(db, `profiles/${sellerId}`), {
                seller_status: "rejected",
                updated_at: new Date().toISOString(),
            });
            showToast(`Merchant ${sellerEmail} has been declined`, "error");
            await fetchData();
        } catch (err) {
            showToast("Action failed", "error");
        } finally {
            setActionLoading(null);
        }
    };

    const platformStats = [
        { label: "Grand Patrons", value: stats.totalUsers, sub: "Registered", icon: Users, color: "#3d2b1f" },
        { label: "Imperial Artisans", value: stats.approvedSellers, sub: "Active Sellers", icon: Store, color: "#3d2b1f" },
        { label: "Pending Decrees", value: stats.pendingSellers, sub: stats.pendingSellers > 0 ? "Action Required" : "All Clear", icon: ShieldCheck, color: stats.pendingSellers > 0 ? "#8b4513" : "#3d2b1f" },
        { label: "Royal Vault", value: allBookings.filter(b => b.bookingStatus === "Booked").length, sub: "Reservations", icon: Gem, color: "#3d2b1f" },
    ];

    return (
        <div className="min-h-screen bg-[#fcf9f2] text-[#492f0e] selection:bg-[#492f0e]/10">
            {/* Custom Toast */}
            {toast && (
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`fixed top-8 right-8 z-[100] px-8 py-4 rounded-none border-2 shadow-2xl backdrop-blur-xl ${
                        toast.type === "success" ? "bg-white border-[#492f0e]" : 
                        toast.type === "info" ? "bg-[#fcf9f2] border-[#d4af37]" : 
                        "bg-red-50 border-red-500"
                    }`}
                >
                    <div className="flex items-center gap-3">
                        {toast.type === "success" ? <CheckCircle2 className="size-5 text-[#492f0e]" /> : 
                         toast.type === "info" ? <Gem className="size-5 text-[#d4af37]" /> :
                         <XCircle className="size-5 text-red-500" />}
                        <p className={`font-['Cinzel',serif] text-sm tracking-widest ${toast.type === "info" ? "text-[#492f0e]" : ""}`}>{toast.msg}</p>
                    </div>
                </motion.div>
            )}

            {/* Navigation */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#492f0e]/10">
                <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <BackButton label="Back" onClick={onBack} className="border-[#492f0e]/30 text-[#492f0e] hover:bg-[#492f0e]/5" />
                        <BackButton onNavigate={onNavigate} targetPage="home" label="Home" type="home" className="border-[#492f0e]/30 text-[#492f0e] hover:bg-[#492f0e]/5" />
                    </div>
                    
                    <div className="flex items-center gap-8">
                        <button onClick={fetchData} className="p-2.5 rounded-none border border-[#492f0e]/20 hover:bg-[#492f0e]/5 transition-all">
                            <RefreshCw className={`size-4 text-[#492f0e] ${loading ? "animate-spin" : ""}`} />
                        </button>
                        
                        <div className="flex items-center gap-5 pl-8 border-l border-[#492f0e]/10">
                            <div className="text-right hidden sm:block">
                                <p className="font-['Cinzel',serif] text-sm tracking-widest text-[#492f0e]">Imperial Admin</p>
                                <p className="text-[10px] text-[#492f0e]/60 font-mono italic uppercase">{user.email.split('@')[0]}</p>
                            </div>
                            <div className="size-12 rounded-none border-2 border-[#492f0e] flex items-center justify-center font-['Cinzel',serif] font-bold text-[#492f0e] text-lg bg-white shadow-[4px_4px_0_rgba(61,43,31,0.1)]">
                                AD
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-8 py-16">
                {/* Header Section */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-20 text-center">
                    <Gem className="size-8 text-[#d4af37] mx-auto mb-6" />
                    <h1 className="font-['Cinzel',serif] text-5xl md:text-6xl text-[#362312] mb-4 tracking-widest uppercase">Imperial Command</h1>
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <p className="font-serif italic text-[#492f0e]/60 text-lg">Platform Governance & Global Oversight</p>
                        {isSimulated && (
                            <div className="px-3 py-0.5 bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-[10px] font-['Cinzel'] tracking-widest uppercase rounded-full">Simulation Mode</div>
                        )}
                    </div>
                    <div className="h-[1px] w-40 bg-[#492f0e]/20 mx-auto mt-8" />
                </motion.div>

                {/* Statistics Dashboard */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                    {platformStats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <div className="bg-white border border-[#492f0e]/10 p-10 shadow-[8px_8px_0_rgba(61,43,31,0.03)] hover:shadow-[12px_12px_0_rgba(61,43,31,0.05)] transition-all group">
                                <div className="flex flex-col items-center text-center">
                                    <div className="size-16 border border-[#492f0e]/10 flex items-center justify-center bg-[#fcf9f2] mb-6 group-hover:bg-[#492f0e] group-hover:text-white transition-all text-[#492f0e]">
                                        <stat.icon className="size-6" />
                                    </div>
                                    <p className="font-['Cinzel',serif] text-[10px] tracking-[0.3em] text-[#492f0e]/60 uppercase mb-4">{stat.label}</p>
                                    <h3 className="text-4xl font-bold text-[#492f0e] mb-2 tabular-nums">
                                        {loading ? "..." : stat.value}
                                    </h3>
                                    <p className="text-xs font-serif italic text-[#492f0e]/40">{stat.sub}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Main Interface */}
                <Tabs defaultValue="sellers" className="space-y-12">
                    <div className="flex justify-center">
                        <TabsList className="bg-white border-2 border-[#492f0e]/10 p-1.5 rounded-none flex h-auto">
                            {["overview", "sellers", "bookings", "settings"].map(tab => (
                                <TabsTrigger 
                                    key={tab} 
                                    value={tab} 
                                    className="px-12 py-3 rounded-none font-['Cinzel',serif] text-xs tracking-widest uppercase transition-all text-[#492f0e]/60 data-[state=active]:bg-[#492f0e] data-[state=active]:text-white"
                                >
                                    {tab}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    <TabsContent value="overview">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* System Status */}
                            <div className="bg-white border border-[#492f0e]/10 p-12 shadow-[10px_10px_0_rgba(61,43,31,0.02)]">
                                <div className="flex items-center justify-between mb-12">
                                    <h3 className="font-['Cinzel',serif] text-2xl tracking-widest uppercase">System Vitality</h3>
                                    <div className="px-4 py-1 border border-[#492f0e]/20 text-[10px] font-['Cinzel',serif] tracking-widest text-[#492f0e]/60 uppercase">Operational</div>
                                </div>
                                <div className="space-y-10">
                                    {[
                                        { label: "Archive Synchrony", value: 98 },
                                        { label: "Registry Load", value: 42 },
                                        { label: "Thread Efficiency", value: 76 },
                                    ].map((item) => (
                                        <div key={item.label} className="space-y-4">
                                            <div className="flex justify-between font-['Cinzel',serif] text-[10px] tracking-widest text-[#492f0e]/60 uppercase">
                                                <span>{item.label}</span>
                                                <span>{item.value}%</span>
                                            </div>
                                            <div className="h-[2px] bg-[#492f0e]/5 relative overflow-hidden">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${item.value}%` }}
                                                    className="h-full bg-[#492f0e]"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-3 gap-6 mt-16">
                                    {[
                                        { icon: Database, label: "Registry" },
                                        { icon: Globe, label: "Network" },
                                        { icon: ShieldCheck, label: "Guard" },
                                    ].map((b, i) => (
                                        <div key={i} className="text-center p-6 bg-[#fcf9f2] border border-[#492f0e]/5">
                                            <b.icon className="size-5 mx-auto mb-3 text-[#492f0e]/40" />
                                            <p className="font-['Cinzel',serif] text-[8px] tracking-widest text-[#492f0e]/40 uppercase">{b.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Activity Log */}
                            <div className="bg-white border border-[#492f0e]/10 p-12 shadow-[10px_10px_0_rgba(61,43,31,0.02)]">
                                <div className="flex items-center justify-between mb-12">
                                    <h3 className="font-['Cinzel',serif] text-2xl tracking-widest uppercase">Archive Logs</h3>
                                    <Bell className="size-5 text-[#492f0e]/30" />
                                </div>
                                <div className="space-y-6 overflow-y-auto max-h-[400px] pr-4 custom-scrollbar">
                                    {notifications.map((notif, i) => (
                                        <div key={i} className="p-6 bg-[#fcf9f2] border-l-2 border-[#492f0e]/20 hover:border-[#492f0e] transition-all">
                                            <p className="font-serif italic text-[#492f0e] leading-relaxed text-sm mb-2">{notif}</p>
                                            <p className="text-[9px] font-mono tracking-tighter text-[#492f0e]/40">{new Date().toLocaleTimeString()}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="sellers">
                        <div className="bg-white border border-[#492f0e]/10 shadow-[15px_15px_0_rgba(61,43,31,0.02)]">
                            <div className="p-12 border-b border-[#492f0e]/5 flex items-center justify-between bg-[#fcf9f2]/30">
                                <div>
                                    <h3 className="font-['Cinzel',serif] text-3xl tracking-widest uppercase">Merchant Petitions</h3>
                                    <p className="font-serif italic text-[#492f0e]/50 text-sm mt-2">Authenticated review of merchant registration requests.</p>
                                </div>
                                {stats.pendingSellers > 0 && (
                                    <div className="bg-[#492f0e] text-white px-6 py-2 text-xs font-['Cinzel',serif] tracking-widest">
                                        {stats.pendingSellers} PENDING
                                    </div>
                                )}
                            </div>

                            {loading ? (
                                <div className="p-32 flex flex-col items-center gap-4">
                                    <RefreshCw className="size-8 text-[#492f0e]/20 animate-spin" />
                                    <p className="font-['Cinzel',serif] text-[10px] tracking-widest text-[#492f0e]/40">Accessing Records...</p>
                                </div>
                            ) : pendingSellers.length === 0 ? (
                                <div className="p-32 flex flex-col items-center text-center text-[#492f0e]/30">
                                    <CheckCircle2 className="size-16 mb-8 opacity-20" />
                                    <h4 className="font-['Cinzel',serif] text-xl tracking-widest mb-2">Petitions Clear</h4>
                                    <p className="font-serif italic">No merchant souls await entry at this moment.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-[#3d2b1f]/5">
                                    {pendingSellers.map((seller) => (
                                        <div key={seller.id} className="p-12 flex flex-col md:flex-row md:items-center justify-between gap-10 hover:bg-[#fcf9f2] transition-all">
                                            <div className="flex items-center gap-10">
                                                <div className="size-20 border border-[#492f0e]/10 flex items-center justify-center font-['Cinzel',serif] text-3xl font-bold bg-white text-[#492f0e] shadow-inner">
                                                    {seller.email.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="space-y-2">
                                                    <h4 className="font-['Cinzel',serif] text-2xl tracking-wide text-[#492f0e]">{seller.full_name || seller.email}</h4>
                                                    <div className="flex items-center gap-4 text-sm font-serif italic text-[#492f0e]/50">
                                                        <span>{seller.email}</span>
                                                        <span className="size-1 bg-[#492f0e]/20 rounded-full" />
                                                        <span>{new Date(seller.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={() => handleApprove(seller.id, seller.email)}
                                                    disabled={!!actionLoading}
                                                    className="bg-[#492f0e] text-white font-['Cinzel',serif] font-bold text-xs tracking-[0.2em] h-14 px-12 shadow-lg active:scale-95 transition-all"
                                                >
                                                    {actionLoading === seller.id ? <RefreshCw className="size-5 animate-spin" /> : "Approve"}
                                                </button>
                                                <button
                                                    onClick={() => handleReject(seller.id, seller.email)}
                                                    disabled={!!actionLoading}
                                                    className="border border-[#492f0e]/20 text-[#492f0e]/60 font-['Cinzel',serif] font-bold text-xs tracking-widest h-14 px-10 hover:bg-red-50 hover:text-red-600 hover:border-red-500/30 transition-all"
                                                >
                                                    Decline
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="bookings">
                        <div className="bg-white border border-[#492f0e]/10 shadow-[15px_15px_0_rgba(61,43,31,0.02)] overflow-x-auto">
                            <div className="p-12 border-b border-[#492f0e]/5 flex items-center justify-between">
                                <h3 className="font-['Cinzel',serif] text-3xl tracking-widest uppercase">Global Ledger</h3>
                                <button onClick={refreshAllBookings} className="text-[#492f0e]/40 hover:text-[#492f0e] transition-all">
                                    <RefreshCw className={`size-5 ${isLoadingBookings ? "animate-spin" : ""}`} />
                                </button>
                            </div>
                            <table className="w-full text-left">
                                <thead className="bg-[#fcf9f2] text-[10px] font-['Cinzel',serif] tracking-[0.3em] text-[#492f0e]/60 uppercase">
                                    <tr>
                                        <th className="px-12 py-6 font-bold">Reference</th>
                                        <th className="px-12 py-6 font-bold">Patron</th>
                                        <th className="px-12 py-6 font-bold">Merchant</th>
                                        <th className="px-12 py-6 font-bold">Tribute</th>
                                        <th className="px-12 py-6 font-bold">Status</th>
                                        <th className="px-12 py-6 font-bold text-right">Decree</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#3d2b1f]/5">
                                    {allBookings.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-[#fcf9f2]/50 transition-colors font-serif italic text-sm">
                                            <td className="px-12 py-8">
                                                <p className="text-[#492f0e] font-mono not-italic font-bold tracking-widest mb-1 uppercase">{booking.bookingRef}</p>
                                                <p className="text-[10px] text-[#492f0e]/40">{new Date(booking.createdAt).toLocaleDateString()}</p>
                                            </td>
                                            <td className="px-12 py-8">
                                                <p className="font-bold not-italic font-['Cinzel'] text-xs mb-1 tracking-wider">{booking.userName}</p>
                                                <p className="text-[10px] text-[#492f0e]/40">{booking.userEmail}</p>
                                            </td>
                                            <td className="px-12 py-8">
                                                <span className="text-[#492f0e]/60 uppercase font-['Cinzel'] text-[10px] tracking-widest font-bold">{booking.storeName}</span>
                                            </td>
                                            <td className="px-12 py-8">
                                                <div className="space-y-1">
                                                    <p className="text-[#492f0e]/80">₹{booking.totalPrice.toLocaleString()}</p>
                                                    <p className="text-[10px] text-emerald-600/70 font-bold not-italic">Paid: ₹{booking.advanceAmount.toLocaleString()}</p>
                                                </div>
                                            </td>
                                            <td className="px-12 py-8">
                                                <div className={`text-[9px] font-['Cinzel'] tracking-widest uppercase px-3 py-1 border inline-block ${
                                                    booking.bookingStatus === "Booked" ? "border-[#492f0e] text-[#492f0e] bg-[#492f0e]/5" : "border-[#492f0e]/20 text-[#492f0e]/40"
                                                }`}>
                                                    {booking.bookingStatus}
                                                </div>
                                            </td>
                                            <td className="px-12 py-8 text-right">
                                                {booking.bookingStatus === "Booked" && (
                                                    <button 
                                                        onClick={() => releaseBooking(booking.id)}
                                                        className="font-['Cinzel'] text-[9px] font-bold text-[#492f0e] hover:underline tracking-widest"
                                                    >
                                                        RELEASE
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </TabsContent>

                    <TabsContent value="settings">
                        <div className="bg-white border border-[#492f0e]/10 p-16 shadow-[15px_15px_0_rgba(61,43,31,0.02)]">
                            <div className="flex items-center justify-between mb-16">
                                <div>
                                    <h3 className="font-['Cinzel',serif] text-3xl tracking-widest uppercase">Decree Config</h3>
                                    <p className="font-serif italic text-[#492f0e]/50 text-sm mt-2">Adjust global parameters of the Imperial system.</p>
                                </div>
                                <button onClick={() => onNavigate("settings")} className="font-['Cinzel'] text-[10px] font-bold text-white bg-[#492f0e] px-10 py-3 tracking-[0.2em] shadow-lg">
                                    ADVANCED_ACCESS
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {[
                                    { label: "Herald Delivery", desc: "Dispatch automated scrolls for system events", enabled: true, icon: Bell },
                                    { label: "Patron Privilege", desc: "Immediate authentication for noble patrons", enabled: true, icon: ShieldCheck },
                                    { label: "Merchant Sandbox", desc: "Isolate new merchant souls for testing", enabled: false, icon: Database },
                                    { label: "System Lockdown", desc: "Halt all trade across the digital borders", enabled: false, icon: Globe },
                                ].map((item) => (
                                    <div key={item.label} className="p-10 border border-[#492f0e]/10 bg-[#fcf9f2]/40 flex items-start justify-between">
                                        <div className="flex gap-8">
                                            <item.icon className="size-5 mt-1 text-[#492f0e]/40" />
                                            <div className="space-y-2">
                                                <p className="font-['Cinzel',serif] text-lg tracking-wider text-[#492f0e]">{item.label}</p>
                                                <p className="font-serif italic text-xs text-[#492f0e]/40 leading-relaxed">{item.desc}</p>
                                            </div>
                                        </div>
                                        <div className={`w-14 h-7 rounded-none flex items-center px-1 cursor-pointer transition-all border border-[#492f0e]/20 ${item.enabled ? "bg-[#492f0e]" : "bg-white"}`}>
                                            <motion.div 
                                                animate={{ x: item.enabled ? 28 : 0 }}
                                                className={`size-5 rounded-none ${item.enabled ? "bg-white" : "bg-[#492f0e]/20"}`} 
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="mt-32 mb-10 flex flex-col items-center opacity-10">
                    <div className="h-[1px] w-20 bg-[#492f0e] mb-4" />
                    <p className="font-['Cinzel',serif] text-[9px] tracking-[0.5em] uppercase text-[#492f0e]">Ornamis Command MMXXVI</p>
                </div>
            </main>
        </div>
    );
}


