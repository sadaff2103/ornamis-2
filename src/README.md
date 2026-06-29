# 💎 ORNAMIS - Modern Jewelry Marketplace

A comprehensive online jewelry marketplace platform with AI-powered design tools, AR virtual try-on, and real-time gold pricing.

> **👋 First time here?** See [DEMO_MODE_INFO.md](./DEMO_MODE_INFO.md) for a quick explanation of the "DEMO MODE" message you might see. **TL;DR:** It's completely normal and means everything is working! ✅

## ✨ Key Features

### 🛍️ Customer Experience
- **Jewelry Catalog** with advanced filtering (material, price, occasion, style)
- **AI Jewelry Designer** for custom designs
- **AR Virtual Try-On** functionality
- **Dynamic Gold Pricing** with real-time market rates
- **Personalized Recommendations**
- **Wishlist & Cart** with persistent storage
- **Customer Dashboard** with order tracking

### 💰 Real-Time Gold Pricing
- Live gold rates from international markets
- Automatic price calculation (gold + making charges + GST)
- Support for 24k, 22k, and 18k gold purity
- **Works out-of-the-box in Demo Mode** (no setup required!)
- Optional API integration for live market pricing

### 👥 User Roles
- **Customers**: Browse, design, try-on, purchase
- **Sellers**: Product uploads, verification, dashboard
- **Admins**: Analytics, user management, approvals

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will start at `http://localhost:5173`

**That's it!** The gold pricing system works immediately in Demo Mode with approximate rates.

### Optional: Enable Live Gold Pricing

Want real-time gold prices from international markets? Follow these steps:

1. **Get a free API key** from [GoldAPI.io](https://www.goldapi.io/)

2. **Create a `.env` file** in the project root:
   ```env
   VITE_GOLD_API_KEY=your_api_key_here
   ```

3. **Restart the dev server**:
   ```bash
   npm run dev
   ```

4. **Verify** the status changed from "DEMO MODE" to "LIVE API" in the banner

See [GOLD_PRICING_GUIDE.md](./GOLD_PRICING_GUIDE.md) for detailed documentation.

## 📊 Gold Pricing System

### Demo Mode (Default - No Setup Required)
- ✅ Uses approximate gold rates (₹6,200/g for 24k)
- ✅ Perfect for development and testing
- ✅ No API keys or configuration needed
- ✅ All pricing features work normally
- ℹ️ Shows blue "DEMO MODE" banner at top

### Live Mode (Optional)
- 🔴 Real-time gold rates from international markets
- 🔄 Auto-updates every 30 minutes
- 📈 Market-accurate pricing
- 💼 Professional for production use
- ✅ Shows "LIVE API" status badge

The system automatically falls back to Demo Mode if APIs are unavailable.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **State Management**: React Context API
- **Animations**: Motion (Framer Motion)
- **UI Components**: Shadcn/ui
- **Icons**: Lucide React
- **Charts**: Recharts
- **Backend**: Supabase (Edge Functions, Database, Auth, Storage)
- **Gold Pricing**: GoldAPI.io / MetalpriceAPI / Metals-API

## 📁 Project Structure

```
├── App.tsx                      # Main application component
├── components/
│   ├── DynamicPrice.tsx         # Dynamic gold price component
│   ├── LivePriceIndicator.tsx   # Current gold rates display
│   ├── GoldPriceSettings.tsx    # API configuration UI
│   ├── pages/                   # Page components
│   └── ui/                      # Shadcn UI components
├── contexts/
│   ├── GoldPriceContext.tsx     # Gold pricing state management
│   └── ShopContext.tsx          # Cart & wishlist state
├── utils/
│   └── goldPriceService.ts      # Gold API integration
└── styles/
    └── globals.css              # Tailwind v4 configuration
```

## 🎨 Features Breakdown

### Jewelry Catalog
- Multiple categories (Rings, Necklaces, Bracelets, Earrings)
- Advanced filtering and search
- Dynamic pricing with market-based calculations
- Price breakdown transparency

### AI Designer
- Text-to-design generation
- Style customization
- Material selection
- Export designs

### AR Try-On
- Camera integration
- Real-time overlay
- Multiple jewelry positions
- Photo capture

### Shopping Features
- Cart with dynamic pricing
- Wishlist management
- Order tracking
- Secure checkout

## 🔧 Configuration

### Environment Variables

Create a `.env` file (optional):

```env
# Gold Pricing API (Optional - works without this)
VITE_GOLD_API_KEY=your_goldapi_key

# Alternative APIs (for redundancy)
VITE_METAL_PRICE_API_KEY=your_metalprice_key
VITE_METALS_API_KEY=your_metals_api_key
```

**Note**: The app works perfectly without any environment variables!

### Supabase Setup

If you want to use backend features:
1. Create a Supabase project
2. Configure in `/utils/supabase/info.tsx`
3. Deploy edge functions from `/supabase/functions/`

## 📱 Responsive Design

- Mobile-first approach
- Tablet optimization
- Desktop experience
- Touch-friendly controls
- Sliding animations

## 🎯 User Flows

### Customer Journey
1. Browse catalog with live pricing
2. Filter by preferences
3. Use AI designer for custom pieces
4. Try-on with AR
5. Add to cart/wishlist
6. Checkout with locked-in prices
7. Track orders in dashboard

### Seller Journey
1. Register and verify account
2. Upload products with gold specs
3. Manage inventory
4. Track sales analytics
5. Handle orders

### Admin Journey
1. Review seller applications
2. Monitor platform analytics
3. Manage users and products
4. Handle disputes

## 🌟 Pricing Transparency

Every product with dynamic pricing shows:
- Current gold market rate
- Gold weight and purity
- Making charges percentage
- Gemstone costs (if any)
- GST (3%)
- **Total price**

Click "Show Details" on any product to see the breakdown.

## 📖 Documentation

- **[Demo Mode Info](./DEMO_MODE_INFO.md)** - Quick reference for "DEMO MODE" status ⭐ START HERE
- [Gold Pricing Guide](./GOLD_PRICING_GUIDE.md) - Comprehensive pricing system docs
- [Troubleshooting Guide](./TROUBLESHOOTING.md) - Common issues and solutions
- [AI API Integration](./guidelines/AI_API_Integration_Guide.md) - AI Designer setup
- [Guidelines](./guidelines/Guidelines.md) - Development guidelines

## 🐛 Troubleshooting

### "DEMO MODE" showing
- This is **NORMAL** and intentional! ✅
- Your app is working perfectly
- To enable live pricing, add API key to `.env`

### Prices not updating
- In Demo Mode: Prices use fallback rates (expected)
- In Live Mode: Check API key validity and internet connection

### API errors in console
- Verify `.env` file location (project root)
- Ensure API key is uncommented and correct
- Restart development server
- Check API service status

## 🤝 Contributing

This is a prototype/demonstration project. Feel free to:
- Fork and customize
- Add new features
- Improve UI/UX
- Optimize performance

## 📄 License

This project is a demonstration/prototype for the ORNAMIS jewelry marketplace concept.

## 🙏 Acknowledgments

- Gold rate APIs: GoldAPI.io, MetalpriceAPI, Metals-API
- UI Components: Shadcn/ui
- Icons: Lucide
- Design inspiration: Modern jewelry e-commerce platforms

---

**Built with React, TypeScript, and attention to detail** ✨

For questions or support, check the documentation files or review the inline code comments.
