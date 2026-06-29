# 🎯 ORNAMIS Demo Mode - Quick Reference

## TL;DR - Everything is Working! ✅

**If you see "DEMO MODE" - that's completely normal and intentional!** Your ORNAMIS platform is fully functional and ready to use right out of the box.

---

## What You're Seeing

### Blue Banner at Top
```
🔵 DEMO MODE | ✅ System working perfectly!
Dynamic pricing active with demo rates: 24k @ ₹6,200/g • 22k @ ₹5,683/g • 18k @ ₹4,650/g
```

**This means:**
- ✅ Gold pricing system is active
- ✅ All features are working normally
- ✅ Using reliable approximate gold rates
- ✅ Perfect for development and testing
- ✅ No setup or configuration required

---

## Console Messages Explained

### Green Message (Normal)
```
✅ DEMO MODE ACTIVE - System Working Perfectly!
ℹ️  Using Approximate Gold Rates
   24k Gold: ₹6,200/g | 22k: ₹5,683/g | 18k: ₹4,650/g
   All pricing features are fully functional ✓
```

**Translation:** Everything is working great! You're using demo rates which is perfect for testing.

### Red Message (When Live)
```
🔴 LIVE PRICING ACTIVE - GoldAPI Connected
   24k Gold: ₹6,245/g | 22k: ₹5,725/g | 18k: ₹4,684/g
   Real-time market rates ✓
```

**Translation:** You've connected to live gold price APIs! Rates now update from real markets.

### Blue Message (Cached)
```
💾 Using Cached Rates
   Cached at: 10/18/2025, 2:30 PM (still fresh ✓)
```

**Translation:** Using recently fetched rates that are still valid (< 30 min old).

---

## Quick Start Guide

### Option 1: Use As-Is (Recommended for Development)

**No action needed!** Just start using:

```bash
npm install
npm run dev
```

- All pricing features work immediately
- Jewelry catalog displays with calculated prices
- Cart, wishlist, checkout all functional
- Perfect for prototyping and testing

### Option 2: Enable Live Pricing (Optional)

**Only if you want real-time gold market rates:**

1. **Get API Key** (free)
   - Visit: https://www.goldapi.io/
   - Sign up for free account
   - Copy your API key

2. **Create `.env` file** in project root:
   ```env
   VITE_GOLD_API_KEY=your_api_key_here
   ```

3. **Restart server**:
   ```bash
   npm run dev
   ```

4. **Verify**: Banner changes from "DEMO MODE" to "LIVE API"

---

## Features That Work in Demo Mode

### ✅ Fully Functional
- Dynamic jewelry pricing based on gold specs
- Price breakdowns (gold + making charges + GST)
- Shopping cart with automatic calculations
- Wishlist management
- Product filtering and search
- AR try-on and AI designer
- Customer dashboard
- Order tracking

### 🔄 Updates to Live Mode
- Gold rates update from real-time international markets
- Prices recalculate every 30 minutes automatically
- Market-accurate pricing for customers
- "LIVE API" badge instead of "DEMO MODE"

---

## What Demo Rates Mean

Demo rates are approximate market values updated periodically:

| Purity | Demo Rate | Based On |
|--------|-----------|----------|
| 24k Gold | ₹6,200/g | Typical market average |
| 22k Gold | ₹5,683/g | 91.67% of 24k (standard) |
| 18k Gold | ₹4,650/g | 75% of 24k (standard) |

These are **real, usable rates** - just not dynamically updated from live markets.

---

## Pricing Calculation Example

### Sample Product: Diamond Ring
```
Gold: 18k, 8.5g
Making Charges: 15%
Gemstones: ₹125,000

Calculation:
• Gold Cost: 8.5g × ₹4,650/g = ₹39,525
• Making: ₹39,525 × 15% = ₹5,929
• Gemstones: ₹125,000
• Subtotal: ₹170,454
• GST (3%): ₹5,114
• TOTAL: ₹175,568
```

Works identically in both Demo and Live modes - only the gold rate differs.

---

## Visual Indicators

### Demo Mode
- 🔵 Blue "DEMO MODE" badge in banner
- Console: Green "✅ DEMO MODE ACTIVE"
- Dashboard: Shows "DEMO MODE" status
- Products: Prices with demo rate calculations

### Live Mode
- 🔴 Red "LIVE API" badge in banner
- Console: Red "🔴 LIVE PRICING ACTIVE"
- Dashboard: Shows "LIVE API" status with green checkmark
- Products: Prices with current market rates

### Cached Mode
- 🔵 Blue "CACHED DATA" badge
- Console: Blue "💾 Using Cached Rates"
- Using recent data (< 30 min old)
- Saves API calls

---

## Common Questions

### Q: Is something broken?
**A:** No! Demo mode is the default, intended behavior. Everything works perfectly.

### Q: Do I need to add an API key?
**A:** Only if you want live market pricing. For development/testing, demo mode is ideal.

### Q: Will prices be accurate?
**A:** Demo rates are approximate market values. For production, use live mode for exact accuracy.

### Q: Can I test checkout in demo mode?
**A:** Yes! All features including checkout work normally in demo mode.

### Q: How do I know if live mode is working?
**A:** The banner will say "LIVE API" instead of "DEMO MODE" and console will show "🔴 LIVE PRICING ACTIVE".

### Q: Can I switch between modes?
**A:** Yes! Add/remove API key from `.env` and restart. System automatically detects and switches.

---

## When to Use Each Mode

### Use Demo Mode If:
- ✅ Developing features
- ✅ Testing functionality
- ✅ Creating demos/prototypes
- ✅ Learning the system
- ✅ Don't need exact market prices
- ✅ Want zero setup hassle

### Use Live Mode If:
- 🔴 Deploying to production
- 🔴 Need market-accurate pricing
- 🔴 Serving real customers
- 🔴 Want automatic price updates
- 🔴 Building professional store

---

## Troubleshooting Quick Fixes

### "DEMO MODE showing but I added API key"
1. Restart development server
2. Check `.env` is in project root (not `/src`)
3. Verify: `VITE_GOLD_API_KEY=key` (no quotes, no spaces)
4. Clear browser cache and refresh

### "Console shows warnings"
- These are informational, not errors
- Green "✅" means everything is working
- Demo mode warnings are expected

### "Prices seem high/low"
- Check gold specifications (weight, purity)
- Verify making charges percentage
- Review price breakdown (click "Show Details")
- Compare with current market rates online

### "Quick start popup shows every time"
- Click "Don't show again" to dismiss permanently
- Or add API key to enable live mode
- Or close it - won't affect functionality

---

## System Status at a Glance

```
╔═══════════════════════════════════════════════════╗
║  ORNAMIS GOLD PRICING SYSTEM STATUS               ║
╠═══════════════════════════════════════════════════╣
║  ✅ Core System: ACTIVE                           ║
║  🔵 Mode: DEMO (No API key configured)            ║
║  💰 Rates: Approximate (₹6,200/g for 24k)         ║
║  ⚙️  Features: 100% Functional                     ║
║  🎯 Status: READY TO USE                          ║
╚═══════════════════════════════════════════════════╝

To enable live pricing (optional):
→ Add VITE_GOLD_API_KEY to .env
→ Restart server
→ Status changes to: 🔴 LIVE API ACTIVE
```

---

## Documentation Links

- 📖 [README.md](./README.md) - Main documentation
- 🔧 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Detailed troubleshooting
- 💰 [GOLD_PRICING_GUIDE.md](./GOLD_PRICING_GUIDE.md) - Complete pricing system guide
- 🎯 [.env.example](./.env.example) - Environment setup template

---

## Final Word

**Demo mode is not a limitation - it's a feature!** It allows you to:

- Start development immediately
- Test all functionality without setup
- Prototype without API dependencies
- Learn the system without complications
- Switch to live mode anytime you want

The ORNAMIS platform is designed to work perfectly right out of the box. Demo mode ensures you can start building immediately while maintaining the option to add live pricing whenever you're ready.

**Happy building!** 💎✨

---

*Last updated: October 18, 2025*
