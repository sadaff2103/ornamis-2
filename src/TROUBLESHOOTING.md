# 🔧 ORNAMIS Troubleshooting Guide

## Common Questions & Solutions

### ❓ "I see a warning about Demo Mode - is something wrong?"

**Answer: NO! This is completely normal and expected behavior.** ✅

The message **"⚠ No API keys configured or all APIs unavailable. Using fallback rates"** is NOT an error. It means:

- ✅ Your app is working perfectly
- ✅ Gold pricing is fully functional
- ✅ Using reliable approximate gold rates
- ✅ Perfect for development and testing
- ✅ No setup or configuration needed

**You can use the app as-is without any changes!**

---

### 🎯 Understanding System Status

#### Demo Mode (Default - No Setup)
```
Status: ✅ WORKING NORMALLY
Banner: Blue "DEMO MODE" badge
Console: "✅ DEMO MODE ACTIVE - System Working Perfectly!"
Rates: Approximate gold rates (₹6,200/g for 24k)
Use Case: Development, testing, demos, prototyping
Action Required: NONE - ready to use!
```

#### Live Mode (Optional Upgrade)
```
Status: 🔴 LIVE API CONNECTED
Banner: Green "LIVE API" badge
Console: "🔴 LIVE API CONNECTED - [Provider Name]"
Rates: Real-time international market rates
Use Case: Production deployment
Action Required: Add API key to .env file
```

---

## 📊 Gold Pricing Status Messages

### Console Message Meanings

#### ✅ Normal Operation Messages

**"✅ DEMO MODE ACTIVE - System Working Perfectly!"**
- **Meaning**: Gold pricing using approximate fallback rates
- **Status**: Normal operation
- **Action**: None required (optional: add API key for live rates)

**"✓ Using cached gold rates from [date/time]"**
- **Meaning**: Using recently fetched rates (< 30 min old)
- **Status**: Normal operation
- **Action**: None

**"🔴 LIVE API CONNECTED - [Provider]"**
- **Meaning**: Successfully connected to live gold price API
- **Status**: Optimal operation
- **Action**: None

#### ℹ️ Informational Messages

**"⚡ Fetching live gold rates..."**
- **Meaning**: Attempting to fetch fresh rates
- **Status**: Normal process
- **Action**: Wait for completion

**"[API Name]: No API key configured, skipping..."**
- **Meaning**: That specific API not configured (trying next)
- **Status**: Normal fallback behavior
- **Action**: None (or add key if you want to use that API)

#### ⚠️ Warning Messages (Not Errors!)

**"All gold price APIs failed, using fallback rates"**
- **Meaning**: Could not reach APIs, using demo rates
- **Status**: Safe fallback mode
- **Action**: Check internet connection or add API keys

---

## 🚀 Enabling Live Gold Pricing (Optional)

### Why You Might Want This

**Keep Demo Mode if**:
- You're in development
- Testing features
- Creating demos
- Don't need market-accurate pricing

**Enable Live Mode if**:
- Deploying to production
- Need real-time market prices
- Want professional pricing accuracy
- Targeting jewelry customers

### Step-by-Step Setup

#### 1. Get a Free API Key

Visit [GoldAPI.io](https://www.goldapi.io/) and:
1. Click "Sign Up" or "Get API Key"
2. Create a free account (takes 2 minutes)
3. Copy your API key from the dashboard

**Alternative Providers**:
- [MetalpriceAPI](https://metalpriceapi.com/)
- [Metals-API](https://metals-api.com/)

#### 2. Create .env File

In your **project root** (same folder as `package.json`):

```bash
# Create the file
touch .env
```

Or create it manually in your editor.

#### 3. Add Your API Key

Open `.env` and add:

```env
VITE_GOLD_API_KEY=your_actual_api_key_here
```

**Example**:
```env
VITE_GOLD_API_KEY=goldapi-abc123xyz456
```

**Important**:
- ❌ Don't use quotes around the key
- ❌ Don't commit `.env` to Git (it's in `.gitignore`)
- ✅ Copy the key exactly as provided
- ✅ Remove any spaces before/after

#### 4. Restart Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

#### 5. Verify It's Working

Look for these changes:

**In Browser**:
- Banner changes from blue "DEMO MODE" to green "LIVE API"
- Gold rates will be current market rates

**In Console**:
- Should see: "🔴 LIVE API CONNECTED - GoldAPI"
- Current market rates displayed

**In Customer Dashboard**:
- "Gold Pricing Status" card shows "LIVE API" badge
- API configuration shows green checkmarks

---

## 🐛 Troubleshooting Issues

### Issue: "DEMO MODE" still showing after adding API key

**Possible Causes & Solutions**:

1. **Server not restarted**
   ```bash
   # Stop server (Ctrl+C) and restart:
   npm run dev
   ```

2. **.env file in wrong location**
   - Should be in project root (same folder as `package.json`)
   - NOT in `/src` or `/components`

3. **Typo in environment variable name**
   - Must be exactly: `VITE_GOLD_API_KEY`
   - Check for typos or extra spaces

4. **API key has quotes or spaces**
   ```env
   # ❌ Wrong:
   VITE_GOLD_API_KEY="abc123"
   VITE_GOLD_API_KEY = abc123
   
   # ✅ Correct:
   VITE_GOLD_API_KEY=abc123
   ```

5. **Invalid API key**
   - Log in to your API provider
   - Verify the key is correct
   - Check if key is active/not expired

### Issue: Prices seem incorrect

**Solutions**:

1. **Check gold specifications**
   - Verify weight is in grams (not ounces)
   - Confirm purity (24k/22k/18k) is correct
   - Check making charges percentage

2. **Compare with current market**
   - Google "gold price per gram India"
   - Compare 24k rate with market rate
   - Account for making charges (typically 10-20%)

3. **Review price breakdown**
   - Click "Show Details" on any product
   - Verify each component makes sense
   - Check GST calculation (3%)

### Issue: Console shows API errors

**Solutions**:

1. **"Failed to fetch" errors**
   - Check internet connection
   - Try a different API provider
   - Verify firewall/proxy settings

2. **"401 Unauthorized" errors**
   - API key is invalid
   - Get a new key from provider
   - Check key hasn't expired

3. **"429 Too Many Requests" errors**
   - Hit API rate limit
   - Wait a few minutes
   - System will use cached data
   - Consider upgrading API plan

### Issue: Prices not updating

**Solutions**:

1. **In Demo Mode**
   - This is expected - demo rates are static
   - Add API key for live updates

2. **In Live Mode**
   - Rates update every 30 minutes automatically
   - Click refresh button to update manually
   - Check if cached rates are being used

3. **Cache issue**
   - Open browser dev tools
   - Go to Application → Local Storage
   - Clear `ornamis_gold_rates` key
   - Refresh page

---

## 📱 Browser-Specific Issues

### Chrome/Edge
- Open DevTools (F12) → Console tab
- Check for any red error messages
- Look at Network tab for failed requests

### Firefox
- Open Web Console (F12) → Console
- Check "Security" tab for blocked requests
- Verify localStorage is enabled

### Safari
- Enable developer menu: Preferences → Advanced → Show Developer Menu
- Open Console (Cmd+Option+C)
- Check Console and Network tabs

---

## 🔍 Diagnostic Checklist

Use this checklist to diagnose issues:

- [ ] Is node_modules installed? (`npm install`)
- [ ] Is dev server running? (`npm run dev`)
- [ ] Is browser console open? (F12)
- [ ] What status badge is showing? (DEMO MODE / LIVE API)
- [ ] Are there red errors in console?
- [ ] Is .env file in project root?
- [ ] Is .env variable name exactly `VITE_GOLD_API_KEY`?
- [ ] Has server been restarted after .env changes?
- [ ] Is internet connection working?
- [ ] Can you access https://www.goldapi.io/ ?

---

## 📚 Additional Resources

### Documentation
- [README.md](./README.md) - Quick start guide
- [GOLD_PRICING_GUIDE.md](./GOLD_PRICING_GUIDE.md) - Comprehensive pricing docs
- [.env.example](./.env.example) - Environment variable template

### External Resources
- [GoldAPI Documentation](https://www.goldapi.io/documentation)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Gold Rate Calculator](https://www.goodreturns.in/gold-rates/)

### Quick Links
- [Get GoldAPI Key](https://www.goldapi.io/)
- [Get MetalpriceAPI Key](https://metalpriceapi.com/)
- [Get Metals-API Key](https://metals-api.com/)

---

## 💡 Pro Tips

### For Development
1. Use Demo Mode - no setup needed
2. Test with various products
3. Verify price breakdowns
4. Check responsive design

### For Testing
1. Test both Demo and Live modes
2. Verify cache behavior (30 min expiry)
3. Test with API key removed
4. Check error handling

### For Production
1. Always use Live Mode with API key
2. Configure multiple APIs for redundancy
3. Monitor API usage in provider dashboard
4. Set up error alerts
5. Test failover to cached/fallback rates

---

## 🆘 Still Need Help?

If you're still experiencing issues:

1. **Check the Browser Console**
   - Open DevTools (F12)
   - Look for detailed error messages
   - Copy exact error text

2. **Review File Structure**
   - Ensure .env is in correct location
   - Verify all dependencies installed
   - Check file permissions

3. **Try a Clean Start**
   ```bash
   # Remove node_modules and reinstall
   rm -rf node_modules
   npm install
   
   # Clear npm cache if needed
   npm cache clean --force
   
   # Restart
   npm run dev
   ```

4. **Test in Incognito Mode**
   - Rules out browser extensions
   - Starts with clean localStorage
   - No cached data

---

## ✅ Summary: This is NOT an Error!

**Key Takeaway**: The "Demo Mode" warning you see is **completely normal and expected behavior**. The ORNAMIS platform is designed to work perfectly right out of the box without any configuration. 

- ✅ No errors to fix
- ✅ System working as designed
- ✅ All features fully functional
- ✅ Ready to use immediately

Adding an API key is **optional** and only needed if you want real-time market pricing for production use.

**Happy building with ORNAMIS!** 💎✨
