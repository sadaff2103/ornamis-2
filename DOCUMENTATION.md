# ORNAMIS Project Documentation

## Overview
ORNAMIS is a luxury jewelry e-commerce platform built with React, TypeScript, and Vite. It features dynamic gold pricing, AR try-on capabilities, AI-powered design tools, and a comprehensive jewelry catalog.

**Tech Stack:**
- React 18.3.1
- TypeScript
- Vite 6.3.5
- Tailwind CSS
- Motion (Framer Motion)
- Radix UI Components
- Supabase (backend ready)
- TensorFlow (AR features)

---

## Project Structure

```
ornamis-2/
├── src/
│   ├── App.tsx                 # Main app component with routing logic
│   ├── main.tsx                # React entry point
│   ├── index.css               # Tailwind CSS compiled styles
│   ├── components/             # React components
│   ├── contexts/               # React Context providers
│   ├── utils/                  # Helper functions and services
│   ├── styles/                 # Global styles
│   ├── assets/                 # Images and media
│   └── pages/                  # Page components
├── public/                     # Static assets
├── package.json                # Project dependencies
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.js          # Tailwind CSS configuration
└── index.html                  # HTML entry point
```

---

## Key Features

### 1. Dynamic Gold Pricing System
- Real-time gold rate updates
- Automatic jewelry price calculation
- Support for 24K, 22K, and 18K gold
- Fallback demo rates for testing

**File:** `src/utils/goldPriceService.ts`

### 2. Shopping Cart & Wishlist
- Add/remove items from cart
- Wishlist management
- Cart persistence
- Price calculations

**File:** `src/contexts/ShopContext.tsx`

### 3. Multi-page Navigation
- Home page with hero section
- Product catalogs (Rings, Necklaces, Earrings, Bracelets)
- Partner stores (Tanishq, Giva, Palmonas, Juahari)
- AI Designer and AR Try-On pages
- Customer dashboard

### 4. Premium Components
- Animated logo with intro screen
- Live price ticker
- Interactive price estimator
- Product carousel
- Responsive design system

---

## Component Architecture

### Page Components (in `src/components/pages/`)

| Component | Purpose | Key Features |
|-----------|---------|--------------|
| HomePage | Landing page | Hero section, featured products, price estimator |
| AllJewelryCatalogPage | Product browsing | Filter, sort, search |
| RingsCatalogPage | Rings collection | Specific to rings |
| NecklacesCatalogPage | Necklaces | Category-specific |
| AIDesignerPage | AI design tool | Custom jewelry design |
| ARTryOnPage | AR visualization | Try jewelry with camera |
| CustomerDashboard | User profile | Orders, settings, wishlist |
| CartPage | Shopping cart | Checkout interface |
| LoginPage / SignUpPage | Authentication | User registration |

### UI Components (in `src/components/ui/`)
Pre-built components from shadcn/ui:
- Button, Card, Badge
- Dropdown Menu, Dialog, Toast
- Form inputs, Select, Checkbox
- Tabs, Accordion, Slider
- Tooltip, Alert Dialog

### Utility Components
- Header: Navigation bar with search and user menu
- Footer: Site footer with links
- ProductCard: Individual product display
- JewelryCarousel: Featured products slider
- PriceEstimator: Dynamic price calculator
- DemoModeBanner: Gold pricing status banner

---

## Context & State Management

### ShopContext (`src/contexts/ShopContext.tsx`)
Manages shopping functionality:
```typescript
- cart: CartItem[]
- wishlist: Product[]
- searchQuery: string
- addToCart(product)
- removeFromCart(productId)
- addToWishlist(product)
- isInCart(productId): boolean
```

**Usage:**
```tsx
const { cart, addToCart, wishlist } = useShop();
```

### GoldPriceContext (`src/contexts/GoldPriceContext.tsx`)
Manages gold pricing:
```typescript
- rates: GoldRates | null
- loading: boolean
- error: string | null
- refreshRates(): Promise<void>
- calculatePrice(specs): JewelryPriceBreakdown
```

**Usage:**
```tsx
const { rates, calculatePrice } = useGoldPrice();
```

---

## Routing & Navigation

The app uses state-based routing (no React Router):

```tsx
type Page = 
  | "home" | "collections" | "rings" | "necklaces"
  | "earrings" | "bracelets" | "ai-designer" | "ar-tryon"
  | "about" | "stores" | "login" | "signup" | "dashboard"
  | "orders" | "wishlist" | "cart" | "privacy" | "terms"

// Navigate using:
handleNavigate(page: Page)
```

Each page is rendered in the main component via `renderPage()` switch statement.

---

## Styling

### Tailwind CSS
- Primary colors: `#492f0e` (brown), `#362312` (dark brown)
- Accent colors: Gold tones, cream, white
- Responsive design with mobile-first approach
- Custom fonts: Cinzel Decorative (serif)

### CSS Files
- `src/index.css` - Tailwind compiled output
- `src/styles/globals.css` - Global CSS variables and theme

### Theme Variables (in globals.css)
```css
--primary: #030213 (dark)
--background: #ffffff (light)
--accent: #e9ebef (light gray)
--radius: 0.625rem (border radius)
```

---

## Key Files Breakdown

### App.tsx - Main Application Component
**Purpose:** Root component managing all routing, state, and providers

**Key Features:**
- Intro screen auto-hide (5.8 seconds)
- Page routing with switch statement
- User authentication state
- Header/Footer visibility logic
- Layout toggle (minimal vs full)

**State:**
- `showIntro: boolean` - Intro screen visibility
- `currentPage: Page` - Current page
- `user: User | null` - User data
- `useMinimalLayout: boolean` - Layout mode

**Providers:**
- GoldPriceProvider - Gold pricing context
- ShopProvider - Shopping context

---

### Header.tsx - Navigation Component
**Purpose:** Main navigation bar with search and user menu

**Features:**
- Search functionality
- Navigation links
- User dropdown menu
- Cart and wishlist badges
- Live price ticker
- Sticky positioning

**Props:**
```tsx
{
  onNavigate: (page: string) => void
  currentPage: string
  user: { name: string; role: string } | null
  onLogout: () => void
}
```

---

### HomePage.tsx - Landing Page
**Purpose:** Main landing page with hero section and featured content

**Sections:**
1. **Hero Section** - Main heading with CTA buttons
2. **Price Estimator** - Interactive jewelry pricing
3. **Shop by Category** - Product category cards
4. **Featured Carousel** - Premium jewelry showcase
5. **Trust Indicators** - Security and quality badges

---

### ProductCard.tsx - Product Display Component
**Purpose:** Reusable product card for catalogs

**Props:**
```tsx
{
  id: string
  title: string
  price: string
  image: string
  category: string
  onView?: () => void
  onAddToCart?: () => void
  rating?: number
}
```

---

### PriceEstimator.tsx - Dynamic Pricing Tool
**Purpose:** Calculate jewelry prices based on gold rates

**Inputs:**
- Gold weight (grams)
- Purity (24K, 22K, 18K)
- Making charges (%)
- Gemstone cost

**Output:**
- Base gold cost
- Making charges
- Gemstone cost
- Total price

---

## Utilities & Services

### goldPriceService.ts
Functions:
- `fetchGoldRates()` - Get current gold prices
- `calculateJewelryPrice()` - Calculate final price
- `formatPrice()` - Format currency display

```typescript
// Usage
const rates = await fetchGoldRates();
const breakdown = calculateJewelryPrice({
  weight: 10,
  purity: '22k',
  makingCharges: 10
});
```

### design-validator.ts
Validates jewelry design specifications:
- Metal compatibility
- Gemstone specifications
- Weight calculations
- Design feasibility

### goldPriceService.ts
Functions for gold price calculations and formatting.

---

## Data Types & Interfaces

### Product Interface
```typescript
interface Product {
  id: string
  title: string
  price: string
  priceValue: number
  image: string
  category: string
  material: string[]
  style: string[]
  description?: string
  isDynamicPricing?: boolean
}
```

### CartItem Interface
```typescript
interface CartItem extends Product {
  quantity: number
}
```

### GoldRates Interface
```typescript
interface GoldRates {
  gold24k: number      // Price per gram
  gold22k: number
  gold18k: number
  source: 'api' | 'cache' | 'fallback'
  timestamp: number
}
```

### JewelrySpecs Interface
```typescript
interface JewelrySpecs {
  weight: number              // in grams
  purity: '24k' | '22k' | '18k'
  makingCharges: number       // percentage
  gemstonesCost?: number      // fixed cost in INR
}
```

---

## Configuration Files

### vite.config.ts
- React SWC compiler plugin for faster builds
- Asset aliases for Figma imports
- CSS processing
- Build optimization

### tsconfig.json
- ES2020 target
- React JSX support
- Strict type checking
- Module resolution

### tailwind.config.js
- Custom color scheme
- Typography setup
- Animation configurations
- Plugin extensions

### package.json
**Scripts:**
- `npm run dev` - Start dev server (runs on port 3002 if 3000-3001 occupied)
- `npm run build` - Production build

**Key Dependencies:**
- react, react-dom (UI)
- motion/react (animations)
- @radix-ui/* (components)
- lucide-react (icons)
- tailwind-merge, clsx (styling)

---

## Authentication Flow

### Login Process
1. User enters email, password, and role
2. Simulated authentication (no backend yet)
3. User state updated with name, email, role
4. Navigate to dashboard
5. Show welcome toast notification

### User Roles
- Customer (default)
- Designer
- Vendor

---

## Shopping Features

### Cart Management
```tsx
// Add to cart
addToCart(product)

// Remove from cart
removeFromCart(productId)

// Update quantity
updateQuantity(productId, quantity)

// Get total
getCartTotal(): number
```

### Wishlist Management
```tsx
// Add to wishlist
addToWishlist(product)

// Remove from wishlist
removeFromWishlist(productId)

// Check if in wishlist
isInWishlist(productId): boolean
```

---

## Responsive Design

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Mobile-First Approach
- Base styles for mobile
- Media queries for larger screens
- Responsive images and containers

---

## Performance Optimizations

1. **Image Optimization**
   - Figma asset aliases
   - Lazy loading ready

2. **Code Splitting**
   - Page components are separate
   - Dynamic imports possible

3. **Animations**
   - Motion library for smooth transitions
   - GPU-accelerated transforms

4. **Caching**
   - Gold price rate caching
   - Local storage ready

---

## Known Limitations & TODO

- [ ] Backend API integration
- [ ] Real database implementation
- [ ] Live AR try-on camera
- [ ] Payment gateway integration
- [ ] User authentication with Supabase
- [ ] Order management system
- [ ] Real-time notifications
- [ ] Admin dashboard

---

## Setup & Running

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation
```bash
cd ornamis-2
npm install
npm run dev
```

### Build
```bash
npm run build
```

### Access
- Development: `http://localhost:3002`
- Demo Mode: Active (shows gold pricing demo)

---

## Troubleshooting

### Blank White Screen
- Check browser console for errors
- Verify all imports are correct
- Clear browser cache and reload

### Port Already in Use
- Dev server auto-selects next available port
- Check terminal for actual port number
- Default tries: 3000 → 3001 → 3002

### Missing Images
- Verify Figma asset aliases in vite.config.ts
- Check src/assets/ folder
- Ensure import paths are correct

---

## Contributors
- Development Team: ORNAMIS
- UI Components: shadcn/ui
- Icons: Lucide React
- Animations: Motion

---

## License
Proprietary - ORNAMIS Inc.

---

## Support
For issues or questions, refer to the specific file documentation or component comments.

**Last Updated:** December 4, 2025
