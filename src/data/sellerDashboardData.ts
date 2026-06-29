// Store-specific seller dashboard data for Jauhari, Giva, Palmonas

export interface StoreStats {
  totalRevenue: string;
  revenueChange: string;
  activeOrders: number;
  ordersChange: string;
  totalProducts: number;
  productsChange: string;
  pendingPayout: string;
  payoutStatus: string;
  conversionRate: string;
  conversionChange: string;
  avgOrderValue: string;
  avgOrderChange: string;
}

export interface RevenueData {
  month: string;
  revenue: number;
  orders: number;
}

export interface RecentOrder {
  id: string;
  customer: string;
  product: string;
  amount: string;
  status: "Delivered" | "Processing" | "Shipped" | "Pending";
  date: string;
}

export interface TopProduct {
  name: string;
  sold: number;
  revenue: string;
  trend: "up" | "down" | "stable";
}

export interface PaymentRecord {
  id: string;
  date: string;
  amount: string;
  status: "Completed" | "Pending" | "Processing";
  method: string;
}

export interface StoreData {
  storeName: string;
  storeTagline: string;
  accentColor: string;
  accentColorLight: string;
  gradientFrom: string;
  gradientTo: string;
  stats: StoreStats;
  revenueData: RevenueData[];
  recentOrders: RecentOrder[];
  topProducts: TopProduct[];
  payments: PaymentRecord[];
  mockProducts: { id: string; name: string; stock: number; price: string; status: string }[];
}

export const storeDataMap: Record<string, StoreData> = {
  jauhari: {
    storeName: "Jauhari Jewels",
    storeTagline: "Heritage craftsmanship meets modern luxury",
    accentColor: "#d4af37",
    accentColorLight: "#f5e6b8",
    gradientFrom: "#d4af37",
    gradientTo: "#b8860b",
    stats: {
      totalRevenue: "₹18,45,200",
      revenueChange: "+14.2%",
      activeOrders: 23,
      ordersChange: "+6",
      totalProducts: 42,
      productsChange: "+3",
      pendingPayout: "₹3,25,000",
      payoutStatus: "Due May 20",
      conversionRate: "4.8%",
      conversionChange: "+0.6%",
      avgOrderValue: "₹1,24,000",
      avgOrderChange: "+8.3%",
    },
    revenueData: [
      { month: "Jan", revenue: 245000, orders: 12 },
      { month: "Feb", revenue: 318000, orders: 16 },
      { month: "Mar", revenue: 290000, orders: 14 },
      { month: "Apr", revenue: 420000, orders: 21 },
      { month: "May", revenue: 385000, orders: 18 },
      { month: "Jun", revenue: 510000, orders: 24 },
    ],
    recentOrders: [
      { id: "JH-1042", customer: "Priya Sharma", product: "Royal Emerald Necklace", amount: "₹2,45,000", status: "Delivered", date: "May 12" },
      { id: "JH-1041", customer: "Rahul Mehta", product: "Diamond Solitaire Ring", amount: "₹1,85,000", status: "Processing", date: "May 11" },
      { id: "JH-1040", customer: "Anita Verma", product: "Pearl Drop Earrings", amount: "₹95,000", status: "Shipped", date: "May 10" },
      { id: "JH-1039", customer: "Vikram Singh", product: "Gold Kundan Set", amount: "₹3,20,000", status: "Pending", date: "May 9" },
      { id: "JH-1038", customer: "Neha Gupta", product: "Ruby Temple Necklace", amount: "₹1,75,000", status: "Delivered", date: "May 8" },
    ],
    topProducts: [
      { name: "Royal Emerald Necklace", sold: 18, revenue: "₹44,10,000", trend: "up" },
      { name: "Diamond Solitaire Ring", sold: 24, revenue: "₹44,40,000", trend: "up" },
      { name: "Pearl Drop Earrings", sold: 31, revenue: "₹29,45,000", trend: "stable" },
      { name: "Gold Kundan Set", sold: 8, revenue: "₹25,60,000", trend: "down" },
    ],
    payments: [
      { id: "PAY-5012", date: "May 10, 2026", amount: "₹4,85,000", status: "Completed", method: "Bank Transfer" },
      { id: "PAY-5011", date: "Apr 25, 2026", amount: "₹3,92,000", status: "Completed", method: "Bank Transfer" },
      { id: "PAY-5010", date: "Apr 10, 2026", amount: "₹5,15,000", status: "Completed", method: "Bank Transfer" },
      { id: "PAY-5009", date: "May 20, 2026", amount: "₹3,25,000", status: "Pending", method: "Bank Transfer" },
    ],
    mockProducts: [
      { id: "JH-N001", name: "Royal Emerald Necklace", stock: 2, price: "₹2,45,000", status: "In Stock" },
      { id: "JH-R012", name: "Diamond Solitaire Ring", stock: 0, price: "₹1,85,000", status: "Out of Stock" },
      { id: "JH-E005", name: "Pearl Drop Earrings", stock: 5, price: "₹95,000", status: "In Stock" },
      { id: "JH-S003", name: "Gold Kundan Set", stock: 1, price: "₹3,20,000", status: "Low Stock" },
      { id: "JH-N008", name: "Ruby Temple Necklace", stock: 3, price: "₹1,75,000", status: "In Stock" },
    ],
  },

  giva: {
    storeName: "GIVA Silver",
    storeTagline: "Affordable luxury in sterling silver",
    accentColor: "#7c8db0",
    accentColorLight: "#c5cfe2",
    gradientFrom: "#7c8db0",
    gradientTo: "#5a6d8e",
    stats: {
      totalRevenue: "₹8,72,500",
      revenueChange: "+22.1%",
      activeOrders: 47,
      ordersChange: "+12",
      totalProducts: 86,
      productsChange: "+8",
      pendingPayout: "₹1,48,000",
      payoutStatus: "Due May 18",
      conversionRate: "6.2%",
      conversionChange: "+1.1%",
      avgOrderValue: "₹4,200",
      avgOrderChange: "+5.7%",
    },
    revenueData: [
      { month: "Jan", revenue: 120000, orders: 38 },
      { month: "Feb", revenue: 145000, orders: 42 },
      { month: "Mar", revenue: 168000, orders: 51 },
      { month: "Apr", revenue: 195000, orders: 58 },
      { month: "May", revenue: 210000, orders: 64 },
      { month: "Jun", revenue: 248000, orders: 72 },
    ],
    recentOrders: [
      { id: "GV-2087", customer: "Sneha Patel", product: "Silver Infinity Bracelet", amount: "₹3,200", status: "Delivered", date: "May 12" },
      { id: "GV-2086", customer: "Kavya Nair", product: "Moonstone Pendant Chain", amount: "₹4,800", status: "Processing", date: "May 11" },
      { id: "GV-2085", customer: "Ritu Joshi", product: "Rose Gold Huggie Hoops", amount: "₹2,600", status: "Shipped", date: "May 11" },
      { id: "GV-2084", customer: "Meera Das", product: "Zirconia Stud Set", amount: "₹5,400", status: "Delivered", date: "May 10" },
      { id: "GV-2083", customer: "Aisha Khan", product: "Silver Chain Anklet", amount: "₹1,800", status: "Pending", date: "May 9" },
    ],
    topProducts: [
      { name: "Silver Infinity Bracelet", sold: 142, revenue: "₹4,54,400", trend: "up" },
      { name: "Moonstone Pendant Chain", sold: 98, revenue: "₹4,70,400", trend: "up" },
      { name: "Rose Gold Huggie Hoops", sold: 116, revenue: "₹3,01,600", trend: "stable" },
      { name: "Zirconia Stud Set", sold: 87, revenue: "₹4,69,800", trend: "up" },
    ],
    payments: [
      { id: "PAY-8034", date: "May 10, 2026", amount: "₹1,82,000", status: "Completed", method: "UPI" },
      { id: "PAY-8033", date: "Apr 25, 2026", amount: "₹1,56,000", status: "Completed", method: "UPI" },
      { id: "PAY-8032", date: "Apr 10, 2026", amount: "₹1,38,000", status: "Completed", method: "UPI" },
      { id: "PAY-8031", date: "May 18, 2026", amount: "₹1,48,000", status: "Processing", method: "UPI" },
    ],
    mockProducts: [
      { id: "GV-B010", name: "Silver Infinity Bracelet", stock: 24, price: "₹3,200", status: "In Stock" },
      { id: "GV-P005", name: "Moonstone Pendant Chain", stock: 15, price: "₹4,800", status: "In Stock" },
      { id: "GV-E012", name: "Rose Gold Huggie Hoops", stock: 0, price: "₹2,600", status: "Out of Stock" },
      { id: "GV-S008", name: "Zirconia Stud Set", stock: 32, price: "₹5,400", status: "In Stock" },
      { id: "GV-A003", name: "Silver Chain Anklet", stock: 3, price: "₹1,800", status: "Low Stock" },
    ],
  },

  palmonas: {
    storeName: "Palmonas",
    storeTagline: "Contemporary designs for the modern woman",
    accentColor: "#c97b63",
    accentColorLight: "#f0d5cb",
    gradientFrom: "#c97b63",
    gradientTo: "#a85d47",
    stats: {
      totalRevenue: "₹12,38,000",
      revenueChange: "+18.5%",
      activeOrders: 34,
      ordersChange: "+9",
      totalProducts: 64,
      productsChange: "+5",
      pendingPayout: "₹2,15,000",
      payoutStatus: "Due May 22",
      conversionRate: "5.4%",
      conversionChange: "+0.8%",
      avgOrderValue: "₹8,600",
      avgOrderChange: "+11.2%",
    },
    revenueData: [
      { month: "Jan", revenue: 180000, orders: 22 },
      { month: "Feb", revenue: 215000, orders: 28 },
      { month: "Mar", revenue: 198000, orders: 25 },
      { month: "Apr", revenue: 275000, orders: 35 },
      { month: "May", revenue: 310000, orders: 40 },
      { month: "Jun", revenue: 345000, orders: 44 },
    ],
    recentOrders: [
      { id: "PM-3055", customer: "Divya Reddy", product: "Gold Vermeil Choker", amount: "₹12,500", status: "Delivered", date: "May 12" },
      { id: "PM-3054", customer: "Shruti Iyer", product: "Layered Pearl Necklace", amount: "₹8,900", status: "Shipped", date: "May 11" },
      { id: "PM-3053", customer: "Pooja Kapoor", product: "Twisted Hoop Earrings", amount: "₹6,200", status: "Processing", date: "May 10" },
      { id: "PM-3052", customer: "Tanvi Bhatt", product: "Charm Link Bracelet", amount: "₹7,800", status: "Delivered", date: "May 9" },
      { id: "PM-3051", customer: "Isha Malhotra", product: "Statement Cuff Ring", amount: "₹4,500", status: "Pending", date: "May 8" },
    ],
    topProducts: [
      { name: "Gold Vermeil Choker", sold: 64, revenue: "₹8,00,000", trend: "up" },
      { name: "Layered Pearl Necklace", sold: 52, revenue: "₹4,62,800", trend: "stable" },
      { name: "Twisted Hoop Earrings", sold: 78, revenue: "₹4,83,600", trend: "up" },
      { name: "Charm Link Bracelet", sold: 45, revenue: "₹3,51,000", trend: "down" },
    ],
    payments: [
      { id: "PAY-6021", date: "May 10, 2026", amount: "₹2,95,000", status: "Completed", method: "NEFT" },
      { id: "PAY-6020", date: "Apr 25, 2026", amount: "₹2,42,000", status: "Completed", method: "NEFT" },
      { id: "PAY-6019", date: "Apr 10, 2026", amount: "₹2,18,000", status: "Completed", method: "NEFT" },
      { id: "PAY-6018", date: "May 22, 2026", amount: "₹2,15,000", status: "Pending", method: "NEFT" },
    ],
    mockProducts: [
      { id: "PM-C001", name: "Gold Vermeil Choker", stock: 8, price: "₹12,500", status: "In Stock" },
      { id: "PM-N004", name: "Layered Pearl Necklace", stock: 5, price: "₹8,900", status: "In Stock" },
      { id: "PM-E007", name: "Twisted Hoop Earrings", stock: 0, price: "₹6,200", status: "Out of Stock" },
      { id: "PM-B002", name: "Charm Link Bracelet", stock: 12, price: "₹7,800", status: "In Stock" },
      { id: "PM-R009", name: "Statement Cuff Ring", stock: 2, price: "₹4,500", status: "Low Stock" },
    ],
  },
};

// Default to jauhari if no store match
export function getStoreData(userEmail?: string): StoreData {
  if (!userEmail) return storeDataMap.jauhari;
  const lower = userEmail.toLowerCase();
  if (lower.includes("giva")) return storeDataMap.giva;
  if (lower.includes("palmonas")) return storeDataMap.palmonas;
  return storeDataMap.jauhari;
}
