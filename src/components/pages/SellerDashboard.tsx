import { useState } from "react";
import { motion } from "motion/react";
import {
  ShoppingBag, Package, TrendingUp, Plus, Search, MoreVertical,
  Store, CreditCard, Bell, Settings, DollarSign, ArrowUpRight,
  ArrowDownRight, Calendar, CheckCircle2, Clock, Truck, AlertCircle, Wallet,
  IndianRupee, ShoppingCart
} from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { BackButton } from "../BackButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Area, AreaChart
} from "recharts";
import { storeDataMap, type StoreData } from "../../data/sellerDashboardData";

interface SellerDashboardProps {
  user: { name: string; email: string };
  onNavigate: (page: string) => void;
  onBack?: () => void;
}

function getStoreForUser(email: string): StoreData {
  const e = email.toLowerCase();
  if (e.includes("giva")) return storeDataMap.giva;
  if (e.includes("palmonas")) return storeDataMap.palmonas;
  return storeDataMap.jauhari;
}

const statusIcon = (s: string) => {
  if (s === "Delivered") return <CheckCircle2 className="size-3.5" />;
  if (s === "Shipped") return <Truck className="size-3.5" />;
  if (s === "Processing") return <Clock className="size-3.5" />;
  return <AlertCircle className="size-3.5" />;
};

export function SellerDashboard({ user, onNavigate, onBack }: SellerDashboardProps) {
  const store = getStoreForUser(user.email);
  const [activeTab, setActiveTab] = useState("overview");

  const statCards = [
    { label: "Total Revenue", value: store.stats.totalRevenue, change: store.stats.revenueChange, icon: IndianRupee, positive: true },
    { label: "Active Orders", value: String(store.stats.activeOrders), change: store.stats.ordersChange, icon: ShoppingCart, positive: true },
    { label: "Total Products", value: String(store.stats.totalProducts), change: store.stats.productsChange, icon: Package, positive: true },
    { label: "Pending Payout", value: store.stats.pendingPayout, change: store.stats.payoutStatus, icon: Wallet, positive: false },
    { label: "Conversion Rate", value: store.stats.conversionRate, change: store.stats.conversionChange, icon: TrendingUp, positive: true },
    { label: "Avg. Order Value", value: store.stats.avgOrderValue, change: store.stats.avgOrderChange, icon: DollarSign, positive: true },
  ];

  return (
    <div className="min-h-screen bg-[#fcf9f2] text-[#492f0e] selection:bg-[#492f0e]/10">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-[#492f0e]/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BackButton label="Back" onClick={onBack} className="border-[#492f0e]/30 text-[#492f0e]" />
            <BackButton onNavigate={onNavigate} targetPage="home" label="Home" type="home" className="border-[#492f0e]/30 text-[#492f0e]" />
          </div>
          <div className="flex items-center gap-6">
            <button className="p-2.5 rounded-none border border-[#492f0e]/10 hover:bg-[#492f0e]/5 transition-colors relative">
              <Bell className="size-4 text-[#492f0e]" />
              <span className="absolute top-1.5 right-1.5 size-2 bg-[#d4af37] border-2 border-white" />
            </button>
            <div className="flex items-center gap-4 pl-6 border-l border-[#492f0e]/10">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-['Cinzel'] font-bold text-[#492f0e] uppercase tracking-wider">{user.name}</p>
                <p className="text-[10px] text-[#492f0e]/60 font-serif italic">Master Artisan</p>
              </div>
              <div className="size-10 rounded-none border-2 border-[#492f0e] flex items-center justify-center font-['Cinzel'] font-bold text-[#492f0e] text-sm bg-white shadow-[3px_3px_0_rgba(61,43,31,0.1)]">
                {user.name.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <h1 className="font-['Cinzel',serif] text-3xl md:text-4xl text-[#362312] mb-2 tracking-wide">
                {store.storeName}
              </h1>
              <p className="text-[#492f0e]/60 text-sm font-serif italic">{store.storeTagline}</p>
              <div className="h-[1px] w-32 bg-[#d4af37] mt-6" />
            </div>
            <div className="flex items-center gap-2 text-[10px] text-[#492f0e]/40 font-['Cinzel'] tracking-widest uppercase">
              <Calendar className="size-3.5" />
              <span>Log Date: May 14, 2026</span>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-12">
          {statCards.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="bg-white border-[#492f0e]/10 p-6 rounded-none shadow-[6px_6px_0_rgba(61,43,31,0.02)] hover:shadow-[10px_10px_0_rgba(61,43,31,0.04)] transition-all group">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-[#fcf9f2] border border-[#492f0e]/5 text-[#492f0e] group-hover:bg-[#492f0e] group-hover:text-white transition-all">
                      <s.icon className="size-4" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 border ${s.positive ? 'border-emerald-200 text-emerald-600 bg-emerald-50' : 'border-amber-200 text-amber-600 bg-amber-50'}`}>
                      {s.change}
                    </span>
                  </div>
                  <p className="text-[10px] font-['Cinzel'] tracking-widest text-[#492f0e]/50 uppercase mb-1">{s.label}</p>
                  <p className="text-xl font-bold text-[#492f0e] tabular-nums">{s.value}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-10">
          <div className="flex justify-start border-b border-[#492f0e]/10">
            <TabsList className="bg-transparent h-auto p-0 gap-8">
              {["overview", "inventory", "orders", "payments"].map(t => (
                <TabsTrigger key={t} value={t}
                  className="px-0 py-4 rounded-none border-b-2 border-transparent data-[state=active]:border-[#492f0e] data-[state=active]:bg-transparent text-[#492f0e]/40 data-[state=active]:text-[#492f0e] font-['Cinzel'] text-xs tracking-[0.2em] uppercase transition-all"
                >
                  {t}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-10 focus:outline-none">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
              {/* Revenue Chart */}
              <Card className="lg:col-span-3 bg-white border-[#492f0e]/10 p-8 rounded-none shadow-[10px_10px_0_rgba(61,43,31,0.02)]">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-['Cinzel',serif] text-sm tracking-widest uppercase">Revenue Ledger</h3>
                  <div className="text-[10px] font-bold text-[#492f0e]/40 border border-[#492f0e]/10 px-3 py-1">6_MONTH_LOG</div>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={store.revenueData}>
                      <defs>
                        <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3d2b1f" stopOpacity={0.1} />
                          <stop offset="100%" stopColor="#3d2b1f" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#3d2b1f10" vertical={false} />
                      <XAxis dataKey="month" tick={{ fill: '#3d2b1f', fontSize: 10, fontFamily: 'Cinzel' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#3d2b1f', fontSize: 10, fontFamily: 'Cinzel' }} axisLine={false} tickLine={false}
                        tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`} />
                      <Tooltip 
                        contentStyle={{ background: '#fff', border: '1px solid #3d2b1f20', boxShadow: '10px 10px 0 rgba(61,43,31,0.05)', borderRadius: 0 }}
                        itemStyle={{ color: '#3d2b1f', fontSize: 12, fontWeight: 'bold' }}
                        labelStyle={{ color: '#3d2b1f80', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}
                        formatter={(v: number) => [`₹${v.toLocaleString()}`, 'REVENUE']} />
                      <Area type="monotone" dataKey="revenue" stroke="#3d2b1f" strokeWidth={2}
                        fill="url(#revenueGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Orders Chart */}
              <Card className="lg:col-span-2 bg-white border-[#492f0e]/10 p-8 rounded-none shadow-[10px_10px_0_rgba(61,43,31,0.02)]">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-['Cinzel',serif] text-sm tracking-widest uppercase">Transaction Volume</h3>
                  <ShoppingBag className="size-4 text-[#492f0e]/30" />
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={store.revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#3d2b1f10" vertical={false} />
                      <XAxis dataKey="month" tick={{ fill: '#3d2b1f', fontSize: 10, fontFamily: 'Cinzel' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#3d2b1f', fontSize: 10, fontFamily: 'Cinzel' }} axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ background: '#fff', border: '1px solid #3d2b1f20', boxShadow: '10px 10px 0 rgba(61,43,31,0.05)', borderRadius: 0 }}
                        itemStyle={{ color: '#3d2b1f', fontSize: 12, fontWeight: 'bold' }}
                        labelStyle={{ color: '#3d2b1f80', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}
                      />
                      <Bar dataKey="orders" fill="#3d2b1f" radius={0} opacity={0.6} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Top Products */}
              <Card className="bg-white border-[#492f0e]/10 p-8 rounded-none shadow-[10px_10px_0_rgba(61,43,31,0.02)]">
                <h3 className="font-['Cinzel',serif] text-sm tracking-widest uppercase mb-6">Elite Creations</h3>
                <div className="space-y-4">
                  {store.topProducts.map((p, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-[#fcf9f2] border border-[#492f0e]/5 hover:border-[#492f0e]/20 transition-all group">
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-['Cinzel'] font-bold text-[#492f0e]/30">#{i + 1}</span>
                        <div>
                          <p className="text-sm font-bold text-[#492f0e] uppercase tracking-wide">{p.name}</p>
                          <p className="text-[10px] font-serif italic text-[#492f0e]/50">{p.sold} Units · {p.revenue}</p>
                        </div>
                      </div>
                      {p.trend === "up" ? <ArrowUpRight className="size-4 text-emerald-500" /> :
                        p.trend === "down" ? <ArrowDownRight className="size-4 text-red-500" /> :
                        <div className="size-4 flex items-center justify-center"><div className="w-3 h-[1px] bg-[#492f0e]/20" /></div>}
                    </div>
                  ))}
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-white border-[#492f0e]/10 p-8 rounded-none shadow-[10px_10px_0_rgba(61,43,31,0.02)]">
                <h3 className="font-['Cinzel',serif] text-sm tracking-widest uppercase mb-6">Guild Actions</h3>
                <div className="space-y-3">
                  <Button className="w-full bg-[#492f0e] hover:bg-[#2d1b0f] text-white rounded-none font-['Cinzel'] text-[10px] tracking-widest uppercase h-12 shadow-lg">
                    <Plus className="size-4 mr-2" /> Manifest Product
                  </Button>
                  <Button variant="outline" className="w-full border-[#492f0e]/20 text-[#492f0e] rounded-none font-['Cinzel'] text-[10px] tracking-widest uppercase h-12 hover:bg-[#492f0e]/5">
                    <Store className="size-4 mr-2" /> Inspect Gallery
                  </Button>
                  <Button variant="outline" className="w-full border-[#492f0e]/20 text-[#492f0e] rounded-none font-['Cinzel'] text-[10px] tracking-widest uppercase h-12 hover:bg-[#492f0e]/5"
                    onClick={() => onNavigate("settings")}>
                    <Settings className="size-4 mr-2" /> Artisan Settings
                  </Button>
                </div>

                {/* Performance */}
                <div className="mt-8 pt-6 border-t border-[#492f0e]/5">
                  <p className="text-[10px] font-['Cinzel'] tracking-widest text-[#492f0e]/40 uppercase mb-4">Guild Standing</p>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-[#492f0e]/60 uppercase tracking-tighter">Response Merit</span>
                        <span className="text-emerald-600">98%</span>
                      </div>
                      <div className="w-full h-[1px] bg-[#492f0e]/5">
                        <div className="h-full bg-emerald-500" style={{ width: '98%' }} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-[#492f0e]/60 uppercase tracking-tighter">Patron Rating</span>
                        <span className="text-[#d4af37]">4.8 / 5.0</span>
                      </div>
                      <div className="w-full h-[1px] bg-[#492f0e]/5">
                        <div className="h-full bg-[#d4af37]" style={{ width: '96%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Recent Payments */}
              <Card className="bg-white border-[#492f0e]/10 p-8 rounded-none shadow-[10px_10px_0_rgba(61,43,31,0.02)]">
                <h3 className="font-['Cinzel',serif] text-sm tracking-widest uppercase mb-6">Recent Tributes</h3>
                <div className="space-y-4">
                  {store.payments.map((p) => (
                    <div key={p.id} className="p-4 bg-[#fcf9f2] border border-[#492f0e]/5 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-[#492f0e] tabular-nums">{p.amount}</p>
                        <p className="text-[9px] font-['Cinzel'] text-[#492f0e]/40 uppercase tracking-widest">{p.date} · {p.method}</p>
                      </div>
                      <div className={`text-[8px] font-bold px-2 py-1 border uppercase tracking-widest ${
                        p.status === 'Completed' ? 'border-emerald-200 text-emerald-600 bg-white' : 'border-amber-200 text-amber-600 bg-white'
                      }`}>
                        {p.status}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-[#492f0e]/5 flex items-center justify-between">
                  <span className="text-[10px] font-['Cinzel'] tracking-widest text-[#492f0e]/40 uppercase">Pending Tribute</span>
                  <span className="text-sm font-bold text-[#492f0e] tabular-nums">{store.stats.pendingPayout}</span>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* INVENTORY TAB */}
          <TabsContent value="inventory" className="focus:outline-none">
            <Card className="bg-white border-[#492f0e]/10 rounded-none shadow-[15px_15px_0_rgba(61,43,31,0.02)] overflow-hidden">
              <div className="p-8 border-b border-[#492f0e]/5 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <h3 className="font-['Cinzel',serif] text-xl tracking-widest uppercase">Master Catalog</h3>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#492f0e]/40" />
                    <input type="text" placeholder="Search archives..."
                      className="bg-[#fcf9f2] border border-[#492f0e]/10 rounded-none pl-10 pr-4 py-2.5 text-xs font-serif italic focus:outline-none focus:border-[#492f0e]/30 w-full sm:w-64" />
                  </div>
                  <Button size="sm" className="bg-[#492f0e] text-white rounded-none font-['Cinzel'] text-[10px] tracking-widest uppercase px-6">
                    <Plus className="size-3 mr-1" /> Add
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#fcf9f2] text-[10px] font-['Cinzel'] tracking-[0.2em] text-[#492f0e]/60 uppercase">
                    <tr>
                      <th className="px-8 py-5 font-bold">Creation</th>
                      <th className="px-8 py-5 font-bold">Reference</th>
                      <th className="px-8 py-5 font-bold">Stock</th>
                      <th className="px-8 py-5 font-bold">Value</th>
                      <th className="px-8 py-5 font-bold">Standing</th>
                      <th className="px-8 py-5 font-bold text-right">Decree</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#3d2b1f]/5">
                    {store.mockProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-[#fcf9f2]/50 transition-colors">
                        <td className="px-8 py-6 text-sm font-bold text-[#492f0e] uppercase tracking-wide">{p.name}</td>
                        <td className="px-8 py-6 text-[10px] font-mono text-[#492f0e]/40">{p.id}</td>
                        <td className="px-8 py-6 text-xs font-serif italic text-[#492f0e]/60">{p.stock} Units</td>
                        <td className="px-8 py-6 text-sm font-bold text-[#492f0e] tabular-nums">{p.price}</td>
                        <td className="px-8 py-6">
                          <div className={`text-[8px] font-bold px-2 py-1 border uppercase tracking-widest w-fit ${
                            p.status === 'In Stock' ? 'border-emerald-200 text-emerald-600' :
                            p.status === 'Low Stock' ? 'border-amber-200 text-amber-600' :
                            'border-red-200 text-red-600'
                          }`}>
                            {p.status}
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button className="text-[#492f0e]/30 hover:text-[#492f0e] transition-all">
                            <MoreVertical className="size-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* ORDERS TAB */}
          <TabsContent value="orders" className="focus:outline-none">
            <Card className="bg-white border-[#492f0e]/10 rounded-none shadow-[15px_15px_0_rgba(61,43,31,0.02)] overflow-hidden">
              <div className="p-8 border-b border-[#492f0e]/5">
                <h3 className="font-['Cinzel',serif] text-xl tracking-widest uppercase">Acquisition History</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#fcf9f2] text-[10px] font-['Cinzel'] tracking-[0.2em] text-[#492f0e]/60 uppercase">
                    <tr>
                      <th className="px-8 py-5 font-bold">Order_ID</th>
                      <th className="px-8 py-5 font-bold">Noble Patron</th>
                      <th className="px-8 py-5 font-bold">Creation</th>
                      <th className="px-8 py-5 font-bold">Amount</th>
                      <th className="px-8 py-5 font-bold">Date</th>
                      <th className="px-8 py-5 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#3d2b1f]/5">
                    {store.recentOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-[#fcf9f2]/50 transition-colors">
                        <td className="px-8 py-6 text-[10px] font-mono font-bold text-[#492f0e]">{o.id}</td>
                        <td className="px-8 py-6 text-sm font-bold text-[#492f0e] uppercase tracking-wide">{o.customer}</td>
                        <td className="px-8 py-6 text-xs font-serif italic text-[#492f0e]/60">{o.product}</td>
                        <td className="px-8 py-6 text-sm font-bold text-[#492f0e] tabular-nums">{o.amount}</td>
                        <td className="px-8 py-6 text-[10px] font-['Cinzel'] text-[#492f0e]/40">{o.date}</td>
                        <td className="px-8 py-6">
                          <div className={`text-[8px] font-bold px-3 py-1 border flex items-center gap-2 w-fit uppercase tracking-widest ${
                            o.status === "Delivered" ? "border-emerald-200 text-emerald-600 bg-emerald-50/30" : 
                            o.status === "Shipped" ? "border-blue-200 text-blue-600 bg-blue-50/30" :
                            "border-amber-200 text-amber-600 bg-amber-50/30"
                          }`}>
                            {statusIcon(o.status)} {o.status}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* PAYMENTS TAB */}
          <TabsContent value="payments" className="space-y-10 focus:outline-none">
            {/* Payout Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white border-[#492f0e]/10 p-8 rounded-none shadow-[10px_10px_0_rgba(61,43,31,0.02)]">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-500"><CheckCircle2 className="size-5" /></div>
                  <span className="text-[10px] font-['Cinzel'] tracking-widest text-[#492f0e]/50 uppercase">Total Paid Out</span>
                </div>
                <p className="text-2xl font-bold text-[#492f0e] tabular-nums">
                  {store.payments.filter(p => p.status === "Completed").reduce((_, p) => {
                    const nums = p.amount.replace(/[^\d]/g, '');
                    return _ + parseInt(nums);
                  }, 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
                </p>
                <p className="text-[10px] font-serif italic text-[#492f0e]/40 mt-2">{store.payments.filter(p => p.status === "Completed").length} Transactions Logged</p>
              </Card>

              <Card className="bg-white border-[#492f0e]/10 p-8 rounded-none shadow-[10px_10px_0_rgba(61,43,31,0.02)]">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-amber-50 border border-amber-100 text-amber-500"><Clock className="size-5" /></div>
                  <span className="text-[10px] font-['Cinzel'] tracking-widest text-[#492f0e]/50 uppercase">Pending Tribute</span>
                </div>
                <p className="text-2xl font-bold text-[#492f0e] tabular-nums">{store.stats.pendingPayout}</p>
                <p className="text-[10px] font-serif italic text-[#492f0e]/40 mt-2">{store.stats.payoutStatus}</p>
              </Card>

              <Card className="bg-white border-[#492f0e]/10 p-8 rounded-none shadow-[10px_10px_0_rgba(61,43,31,0.02)]">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-[#fcf9f2] border border-[#492f0e]/10 text-[#492f0e]"><CreditCard className="size-5" /></div>
                  <span className="text-[10px] font-['Cinzel'] tracking-widest text-[#492f0e]/50 uppercase">Vault Destination</span>
                </div>
                <p className="text-2xl font-bold text-[#492f0e] uppercase tracking-tighter">{store.payments[0]?.method}</p>
                <p className="text-[10px] font-serif italic text-[#492f0e]/40 mt-2">Primary Artisan Account</p>
              </Card>
            </div>

            {/* Payment History Table */}
            <Card className="bg-white border-[#492f0e]/10 rounded-none shadow-[15px_15px_0_rgba(61,43,31,0.02)] overflow-hidden">
              <div className="p-8 border-b border-[#492f0e]/5">
                <h3 className="font-['Cinzel',serif] text-xl tracking-widest uppercase">Transaction Archives</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#fcf9f2] text-[10px] font-['Cinzel'] tracking-[0.2em] text-[#492f0e]/60 uppercase">
                    <tr>
                      <th className="px-8 py-5 font-bold">Transaction_ID</th>
                      <th className="px-8 py-5 font-bold">Manifest Date</th>
                      <th className="px-8 py-5 font-bold">Amount</th>
                      <th className="px-8 py-5 font-bold">Method</th>
                      <th className="px-8 py-5 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#3d2b1f]/5">
                    {store.payments.map(p => (
                      <tr key={p.id} className="hover:bg-[#fcf9f2]/50 transition-colors">
                        <td className="px-8 py-6 text-[10px] font-mono font-bold text-[#492f0e]">{p.id}</td>
                        <td className="px-8 py-6 text-[10px] font-['Cinzel'] text-[#492f0e]/40">{p.date}</td>
                        <td className="px-8 py-6 text-sm font-bold text-[#492f0e] tabular-nums">{p.amount}</td>
                        <td className="px-8 py-6 text-xs font-serif italic text-[#492f0e]/60">{p.method}</td>
                        <td className="px-8 py-6">
                          <div className={`text-[8px] font-bold px-3 py-1 border uppercase tracking-widest w-fit ${
                            p.status === 'Completed' ? 'border-emerald-200 text-emerald-600' : 'border-amber-200 text-amber-600'
                          }`}>{p.status}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Imperial Footer */}
        <div className="mt-32 flex flex-col items-center opacity-20">
          <div className="h-[1px] w-20 bg-[#492f0e] mb-6" />
          <p className="font-['Cinzel'] text-[10px] tracking-[0.6em] uppercase">Guild of Ornamis MMXXVI</p>
        </div>
      </div>
    </div>
  );
}
