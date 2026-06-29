# 🌟 ORNAMIS Real-Time Gold Pricing System

## Overview

ORNAMIS features a comprehensive real-time gold pricing system that automatically calculates jewelry prices based on live gold market rates. This provides transparency and accuracy to customers while keeping prices aligned with current precious metal values.

## ✨ Features

### 🔴 Live Gold Rates
- Fetches current gold prices from international markets (XAU/INR)
- Updates every 30 minutes automatically
- Manual refresh option available
- Supports 24k, 22k, and 18k gold purity

### 💰 Dynamic Price Calculation
- **Gold Cost**: Based on weight (grams) × purity × live rate
- **Making Charges**: Configurable percentage of gold cost
- **Gemstone Cost**: Additional fixed costs for stones
- **GST**: Automatic 3% tax calculation on jewelry

### 🎯 Smart Fallback System
1. **Primary**: Live API data
2. **Secondary**: Cached data (valid for 30 min)
3. **Tertiary**: Fallback approximate rates

### 📊 Price Transparency
- Expandable price breakdown on product cards
- "LIVE" badge on dynamically priced items
- Real-time updates in cart
- Market fluctuation notices

## 🚀 Quick Start

### Demo Mode (No Setup Required)

The system works out-of-the-box with approximate fallback rates. Perfect for:
- Development and testing
- Demos and prototypes
- Preview without API dependencies

**Status**: Shows "DEMO MODE" badge with approximate gold rates

### Live Mode (Recommended for Production)

#### Step 1: Choose an API Provider

We support three gold price APIs (all have free tiers):

| Provider | Free Tier | Update Frequency | Recommended |
|----------|-----------|------------------|-------------|
| [GoldAPI.io](https://www.goldapi.io/) | ✅ | Real-time | ⭐ Primary |
| [MetalpriceAPI](https://metalpriceapi.com/) | ✅ | Hourly | Fallback 1 |
| [Metals-API](https://metals-api.com/) | ✅ | Hourly | Fallback 2 |

#### Step 2: Get Your API Key

1. Visit your chosen provider's website
2. Sign up for a free account
3. Copy your API key from the dashboard

#### Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Add your API key to `.env`:
   ```env
   # Uncomment and add your key
   VITE_GOLD_API_KEY=your_actual_api_key_here
   ```

3. Restart your development server:
   ```bash
   npm run dev
   ```

#### Step 4: Verify Live Status

1. Navigate to Customer Dashboard
2. Scroll to "Gold Pricing Status" section
3. Confirm "LIVE API" badge is displayed
4. Check that rates are current

**Status**: Shows "LIVE" badge with real-time market rates

## 🛠️ Implementation Guide

### Adding Dynamic Pricing to Products

```typescript
// Example product with dynamic pricing
const product = {
  id: "ring-001",
  title: "Emerald Halo Ring",
  category: "Rings",
  material: ["Gold", "Emerald"],
  
  // Enable dynamic pricing
  isDynamicPricing: true,
  
  // Gold specifications
  goldSpecs: {
    weight: 8.5,              // grams of gold
    purity: "18k",            // 24k, 22k, or 18k
    makingCharges: 15,        // percentage (15%)
    gemstonesCost: 125000,    // fixed cost in INR (optional)
  },
  
  // Fallback price (used if dynamic pricing fails)
  price: "₹3,25,000",
  priceValue: 325000,
};
```

### Using the DynamicPrice Component

```tsx
import { DynamicPrice } from "./components/DynamicPrice";

// In your product card
<DynamicPrice 
  product={product} 
  showBreakdown={true}  // Shows expandable price breakdown
/>
```

### Price Calculation Formula

```
Gold Cost = Gold Weight × Purity Rate × Current Gold Price
Making Charges = Gold Cost × (Making Charges % / 100)
Subtotal = Gold Cost + Making Charges + Gemstone Cost
GST = Subtotal × 0.03 (3%)
Total Price = Subtotal + GST
```

### Example Calculation

```
Product: 18k Gold Ring
Weight: 8.5g
Live 18k Rate: ₹4,650/g
Making Charges: 15%
Gemstones: ₹125,000

Calculation:
- Gold Cost: 8.5g × ₹4,650/g = ₹39,525
- Making Charges: ₹39,525 × 15% = ₹5,929
- Gemstones: ₹125,000
- Subtotal: ₹170,454
- GST (3%): ₹5,114
- TOTAL: ₹175,568
```

## 🎨 UI Components

### LivePriceIndicator
Displays current gold rates with status and refresh button.

```tsx
import { LivePriceIndicator } from "./components/LivePriceIndicator";

<LivePriceIndicator />
```

**Features**:
- Current rates for 24k, 22k, 18k gold
- LIVE/CACHED/FALLBACK status badge
- Last update timestamp
- Manual refresh button
- Expandable rate details

### GoldPriceSettings
Shows API configuration status and setup instructions.

```tsx
import { GoldPriceSettings } from "./components/GoldPriceSettings";

<GoldPriceSettings />
```

**Features**:
- API connection status
- Configuration instructions
- How pricing works explanation
- Links to get API keys

## 🔧 Advanced Configuration

### Caching Strategy

The system uses localStorage to cache gold rates for 30 minutes:

```typescript
// Cache configuration
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
const CACHE_KEY = 'ornamis_gold_rates';
```

### Fallback Rates

Default approximate rates used when APIs are unavailable:

```typescript
const FALLBACK_RATES = {
  gold24k: 15270,  // ₹15,270 per gram (April 30, 2026 - Hyderabad Spot)
  gold22k: 13998,  // ₹13,998 per gram (91.67% of 24k)
  gold18k: 11453,  // ₹11,453 per gram (75% of 24k)
};
```

### Auto-Refresh

Gold rates automatically refresh every 30 minutes:

```typescript
// In GoldPriceContext
useEffect(() => {
  const interval = setInterval(() => {
    loadRates(false);
  }, 30 * 60 * 1000);
  
  return () => clearInterval(interval);
}, []);
```

## 📱 User Experience

### Product Listings
- Products show dynamic prices with "LIVE" badge
- Hover to see price breakdown
- Prices update smoothly with animation

### Cart Page
- Live pricing notice if cart contains dynamic items
- Total recalculates based on current rates
- Price breakdown available for each item
- Clear indication of market-based pricing

### Checkout
- Final price confirmation
- Notice about market fluctuations
- Locked-in price at checkout

## 🔍 Monitoring & Debugging

### Console Logging

The system provides detailed console logs:

```
✓ Using cached gold rates from 10/18/2025, 2:30 PM
⚡ Fetching live gold rates...
✓ Successfully fetched live rates from GoldAPI
  24k: ₹6,245/g | 22k: ₹5,725/g | 18k: ₹4,684/g
```

### Error Handling

If APIs fail, the system:
1. Logs the error to console
2. Tries next API in chain
3. Falls back to cache if available
4. Uses fallback rates as last resort
5. Notifies user of demo mode

### Status Indicators

- **🟢 LIVE**: Connected to API, real-time rates
- **🔵 CACHED**: Using recent cached data (< 30 min old)
- **🟠 DEMO MODE**: Using fallback approximate rates

## 🌐 API Integration Details

### GoldAPI.io
```typescript
// Endpoint
GET https://www.goldapi.io/api/XAU/INR

// Headers
x-access-token: YOUR_API_KEY

// Response
{
  "price": 193421.50,  // Price per troy ounce in INR
  "timestamp": 1234567890
}
```

### MetalpriceAPI
```typescript
// Endpoint
GET https://api.metalpriceapi.com/v1/latest
  ?api_key=YOUR_KEY
  &base=INR
  &currencies=XAU

// Response
{
  "rates": {
    "XAU": 0.0000052  // INR to XAU conversion
  }
}
```

### Metals-API
```typescript
// Endpoint
GET https://metals-api.com/api/latest
  ?access_key=YOUR_KEY
  &base=XAU
  &symbols=INR

// Response
{
  "rates": {
    "INR": 193421.50  // XAU to INR rate
  }
}
```

## 🎯 Best Practices

### For Development
1. Use demo mode (no API key) during development
2. Test with fallback rates first
3. Add API key before deploying to production
4. Monitor console for API errors

### For Production
1. Configure at least one API key
2. Set up multiple APIs for redundancy
3. Monitor API usage limits
4. Test cache expiration behavior
5. Have customer support ready for pricing questions

### For Price Accuracy
1. Update fallback rates periodically
2. Monitor gold market for major changes
3. Communicate price variability to customers
4. Lock prices at checkout
5. Handle price changes gracefully

## 🤝 Support & Resources

### Documentation
- [GoldAPI Documentation](https://www.goldapi.io/documentation)
- [MetalpriceAPI Docs](https://metalpriceapi.com/documentation)
- [Metals-API Docs](https://metals-api.com/documentation)

### Troubleshooting

**Problem**: Prices not updating
- **Solution**: Check API key in `.env`, restart server, verify internet connection

**Problem**: "Demo Mode" showing despite API key
- **Solution**: Ensure `.env` file is in root, key is uncommented, server restarted

**Problem**: Console shows API errors
- **Solution**: Verify API key is valid, check API service status, review rate limits

**Problem**: Prices seem incorrect
- **Solution**: Verify gold specs (weight/purity), check live gold rates online, review calculation

## 📊 Testing Checklist

- [ ] System works in demo mode without API keys
- [ ] API key successfully connects and shows "LIVE" status
- [ ] Prices update when rates are refreshed
- [ ] Cache works (check after < 30 min)
- [ ] Fallback activates when API fails
- [ ] Price breakdown shows correctly
- [ ] Cart totals recalculate properly
- [ ] Mobile responsive design works
- [ ] Console shows appropriate logs
- [ ] Customer dashboard displays status

## 📝 License & Credits

This pricing system is part of the ORNAMIS jewelry marketplace platform.

Gold rate conversion formula:
- 1 Troy Ounce = 31.1035 grams
- 24k = 99.9% pure gold (reference)
- 22k = 91.67% pure gold (24k × 0.9167)
- 18k = 75% pure gold (24k × 0.75)

---

**Built with transparency, accuracy, and customer trust in mind.** 💎
