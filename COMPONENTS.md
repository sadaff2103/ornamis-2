# Components Documentation

## Overview
This document details all React components used in the ORNAMIS project, organized by category.

---

## Layout Components

### Header.tsx
**Location:** `src/components/Header.tsx`

**Purpose:** Main navigation bar displayed at the top of all pages (except login/signup)

**Props:**
```typescript
interface HeaderProps {
  onNavigate: (page: string) => void
  currentPage: string
  user: { name: string; role: string } | null
  onLogout: () => void
  cartCount?: number
  wishlistCount?: number
}
```

**Key Features:**
- Sticky positioning (z-index: 50)
- Gradient background (brown tones)
- Navigation links (Home, Collections, Stores, etc.)
- Search bar with query handling
- Live price ticker (gold rates)
- User dropdown menu
- Cart badge with item count
- Wishlist badge with count
- Mobile hamburger menu

**Styling:**
- Gradient: `from-[#492f0e] to-[#6c5c4c]`
- Top bar with contact info
- Responsive grid layout
- Hover effects on links

**Usage:**
```tsx
<Header
  onNavigate={handleNavigate}
  currentPage={currentPage}
  user={user}
  onLogout={handleLogout}
/>
```

---

### Footer.tsx
**Location:** `src/components/Footer.tsx`

**Purpose:** Footer component with company info and links

**Props:**
```typescript
interface FooterProps {
  onNavigate: (page: string) => void
}
```

**Sections:**
1. Company info and social links
2. Product categories links
3. Customer service links
4. Quick store links
5. Copyright notice

**Styling:**
- Dark background
- Multi-column layout
- Links with hover effects
- Mobile responsive

---

### DemoModeBanner.tsx
**Location:** `src/components/DemoModeBanner.tsx`

**Purpose:** Status banner showing gold pricing demo mode

**Features:**
- Displays current gold rates
- Shows "DEMO MODE" badge
- System status indicator
- Collapse/expand capability
- Links to documentation

**Triggers:**
- Only visible when rates.source === 'fallback'
- Shows demo gold pricing info

**Styling:**
- Blue gradient background
- Dismissible via close button
- Responsive design

---

## Product Components

### ProductCard.tsx
**Location:** `src/components/ProductCard.tsx`

**Purpose:** Reusable card component for displaying individual products

**Props:**
```typescript
interface ProductCardProps {
  id: string
  title: string
  price: string
  priceValue?: number
  image: string
  category: string
  onView?: () => void
  onAddToCart?: () => void
  rating?: number
  style?: string[]
  material?: string[]
}
```

**Display Elements:**
- Product image with hover zoom
- Product title
- Price display
- Category badge
- Rating (if available)
- Style/Material tags
- Action buttons (View, Add to Cart)

**Interactions:**
- Hover effects (shadow, scale)
- Click to view details
- Quick add to cart
- Add to wishlist button

---

### JewelryCarousel.tsx
**Location:** `src/components/JewelryCarousel.tsx`

**Purpose:** Carousel/slider for featured jewelry items

**Features:**
- Auto-scroll with pause on hover
- Navigation buttons (prev/next)
- Dot indicators
- Responsive sizing
- Smooth transitions

**Props:**
```typescript
interface JewelryCarouselProps {
  items: CarouselItem[]
  onItemClick?: (item: CarouselItem) => void
}
```

---

## Form & Input Components

### SearchBar.tsx
**Location:** `src/components/SearchBar.tsx`

**Purpose:** Product search input component

**Features:**
- Text input with icon
- Search submission
- Clear input button
- Placeholder text
- Accessibility support

**Props:**
```typescript
interface SearchBarProps {
  onSearch?: (query: string) => void
  placeholder?: string
}
```

---

### PriceEstimator.tsx
**Location:** `src/components/PriceEstimator.tsx`

**Purpose:** Interactive tool for calculating jewelry prices based on gold rates

**Inputs:**
- Metal type selector (24K, 22K, 18K)
- Weight input (grams)
- Making charges (percentage)
- Gemstone cost (optional)

**Output Display:**
- Base gold cost calculation
- Making charges amount
- Gemstone cost
- Total estimated price

**Features:**
- Real-time calculation
- Gold price integration
- Form validation
- Result formatting

---

## Display Components

### OrnamisLogo.tsx
**Location:** `src/components/OrnamisLogo.tsx`

**Purpose:** Static ORNAMIS logo display

**Features:**
- SVG logo rendering
- Color customization
- Size options

---

### OrnamisLogoAnimated.tsx
**Location:** `src/components/OrnamisLogoAnimated.tsx`

**Purpose:** Animated version of ORNAMIS logo

**Animation:**
- Loading spinner effect
- Smooth rotation
- Fade in/out transitions

**Usage:**
- Intro screen
- Loading states
- Transition screens

---

### LivePriceTicker.tsx
**Location:** `src/components/LivePriceTicker.tsx`

**Purpose:** Displays live gold price updates in header

**Information Displayed:**
- 24K gold price per gram
- 22K gold price per gram
- 18K gold price per gram
- Price change indicators (up/down)
- Last update time

**Styling:**
- Compact horizontal layout
- Color indicators for price direction
- Real-time updates

---

### LivePriceIndicator.tsx
**Location:** `src/components/LivePriceIndicator.tsx`

**Purpose:** Visual indicator for gold price status

**Features:**
- Price change percentage
- Direction indicator (up/down arrow)
- Color coding (green for up, red for down)

---

## Page Components

### HomePage.tsx
**Location:** `src/components/pages/HomePage.tsx`

**Purpose:** Main landing page of the application

**Sections:**
1. **Hero Section**
   - Large background image
   - Main heading: "Where Technology Meets Elegance"
   - CTA buttons (Explore Collections, AI Designer)
   - Featured jewelry image

2. **Price Estimator Section**
   - Heading
   - PriceEstimator component
   - Description text

3. **Shop by Category**
   - Category cards (Rings, Necklaces, Earrings, Bracelets)
   - Images and descriptions
   - Click handlers for navigation

4. **Featured Products Carousel**
   - Featured items display
   - Premium product showcase
   - Pricing information

5. **Trust Indicators**
   - Security badges
   - Quality assurance info
   - Trust signals

**Props:**
```typescript
interface HomePageProps {
  onNavigate: (page: string) => void
}
```

**Styling:**
- Gradient backgrounds
- Hero image sizing
- Responsive grid layouts
- Animation transitions

---

### AllJewelryCatalogPage.tsx
**Location:** `src/components/pages/AllJewelryCatalogPage.tsx`

**Purpose:** Complete product catalog with filtering and sorting

**Features:**
- Product grid display
- Filter sidebar (category, material, style)
- Sort options (price, name, rating)
- Search integration
- Pagination/infinite scroll

**Props:**
```typescript
interface AllJewelryCatalogPageProps {
  onNavigate?: (page: string) => void
}
```

---

### Category-Specific Catalog Pages

#### RingsCatalogPage.tsx
**Purpose:** Specialized catalog for rings

**Filters:**
- Ring type (engagement, statement, band)
- Metal type
- Price range
- Gemstone type

#### NecklacesCatalogPage.tsx
**Purpose:** Specialized catalog for necklaces

**Filters:**
- Necklace style
- Length
- Metal type
- Gemstone

#### BraceletsCatalogPage.tsx
**Purpose:** Specialized catalog for bracelets

**Filters:**
- Bracelet type
- Size
- Metal
- Style

#### EarringsCatalogPage.tsx
**Purpose:** Specialized catalog for earrings

**Filters:**
- Earring type (studs, drops, hoops)
- Metal
- Gemstone

---

### AIDesignerPage.tsx
**Location:** `src/components/pages/AIDesignerPage.tsx`

**Purpose:** AI-powered jewelry design tool

**Features:**
- Design input form
- AI generation
- Design preview
- Customization options
- Price estimation

**Workflow:**
1. User describes desired jewelry
2. AI generates design options
3. User customizes parameters
4. Gets instant price estimate
5. Can add to cart

---

### ARTryOnPage.tsx
**Location:** `src/components/pages/ARTryOnPage.tsx`

**Purpose:** Augmented Reality try-on experience

**Features:**
- Camera integration
- Jewelry overlay
- Real-time preview
- Multiple product options
- Save/share functionality

**Tech Stack:**
- TensorFlow for face detection
- WebGL for 3D rendering
- Motion tracking

---

### CartPage.tsx
**Location:** `src/components/pages/CartPage.tsx`

**Purpose:** Shopping cart and checkout

**Sections:**
1. Cart items list
   - Product images
   - Product names
   - Prices
   - Quantity controls
   - Remove buttons

2. Order summary
   - Subtotal
   - Taxes
   - Shipping
   - Total

3. Checkout section
   - Address input
   - Payment method selection
   - Order placement button

**Features:**
- Update quantities
- Remove items
- Proceed to checkout
- Continue shopping link

---

### LoginPage.tsx
**Location:** `src/components/pages/LoginPage.tsx`

**Purpose:** User login interface

**Form Fields:**
- Email input
- Password input
- Role selector (Customer, Designer, Vendor)
- Remember me checkbox

**Props:**
```typescript
interface LoginPageProps {
  onLogin: (email: string, password: string, role: string) => void
  onNavigate: (page: string) => void
}
```

**Validation:**
- Email format
- Password required
- Role selection

---

### SignUpPage.tsx
**Location:** `src/components/pages/SignUpPage.tsx`

**Purpose:** User registration interface

**Form Fields:**
- Full name
- Email address
- Phone number
- Password
- Confirm password
- Role selector

**Props:**
```typescript
interface SignUpPageProps {
  onSignUp: (name: string, email: string, phone: string, password: string, role: string) => void
  onNavigate: (page: string) => void
}
```

**Validation:**
- Name required
- Valid email
- Phone format
- Password strength
- Passwords match

---

### CustomerDashboard.tsx
**Location:** `src/components/pages/CustomerDashboard.tsx`

**Purpose:** User profile and account management

**Tabs:**
1. **Profile**
   - User information
   - Address book
   - Preferences

2. **Orders**
   - Order history
   - Order details
   - Tracking information

3. **Settings**
   - Account settings
   - Notification preferences
   - Gold pricing settings
   - Payment methods

4. **Wishlist**
   - Saved items
   - Remove from wishlist
   - Add to cart

**Props:**
```typescript
interface CustomerDashboardProps {
  user: { name: string; email: string; role: string }
  onNavigate: (page: string) => void
}
```

---

### Store Pages

#### TanishqStorePage.tsx
**Purpose:** Tanishq brand jewelry catalog

**Features:**
- Premium jewelry collection
- Brand-specific filtering
- Pricing and details

#### GivaStorePage.tsx
**Purpose:** Giva brand jewelry catalog

#### PalmonasStorePage.tsx
**Purpose:** Palmonas brand jewelry catalog

#### JuahariStorePage.tsx
**Purpose:** Juahari luxury collection

**Features:**
- High-end jewelry showcase
- Exclusive collections
- Premium pricing
- Detailed specifications

---

### Other Pages

#### AboutPage.tsx
**Purpose:** Company information and story

#### StudyAboutOrnaments.tsx
**Purpose:** Educational content about jewelry and ornaments

#### WishlistPage.tsx
**Purpose:** User's saved favorites

#### StoresPage.tsx
**Purpose:** Physical store locations and partner information

---

## Screen Components

### IntroScreen.tsx
**Location:** `src/components/IntroScreen.tsx`

**Purpose:** Welcome/intro animation shown on app load

**Features:**
- Auto-advancing slides (1.8s per slide)
- Three featured product images
- Smooth transitions
- Auto-completes after 5.8 seconds
- Can be manually closed

**Animation:**
- Slide transitions (opacity, position)
- Image rotation and scaling
- Elegant fade effects

---

## Utility Components

### FilterSidebar.tsx
**Location:** `src/components/FilterSidebar.tsx`

**Purpose:** Filtering interface for product catalogs

**Filter Options:**
- Category
- Price range
- Material type
- Style
- Rating

**Features:**
- Checkbox selections
- Price slider
- Filter application
- Clear filters button

---

### LayoutToggle.tsx
**Location:** `src/components/LayoutToggle.tsx`

**Purpose:** Toggle between minimal and full layout

**Features:**
- Grid/list view toggle
- Layout preference display
- Position: bottom-right corner
- Smooth transitions

---

### GoldPriceSettings.tsx
**Location:** `src/components/GoldPriceSettings.tsx`

**Purpose:** Configure gold pricing settings

**Options:**
- API key configuration
- Rate update frequency
- Notification preferences
- Demo mode toggle

---

### GoldPricingQuickStart.tsx
**Location:** `src/components/GoldPricingQuickStart.tsx`

**Purpose:** Quick setup guide for gold pricing

**Content:**
- Setup instructions
- API information
- Demo mode info
- Getting started tips

---

### DesignValidatorDemo.tsx
**Location:** `src/components/DesignValidatorDemo.tsx`

**Purpose:** Demo of jewelry design validation

**Features:**
- Validate design specifications
- Show compatibility checks
- Display feasibility assessment

---

## Figma Integration

### ImageWithFallback.tsx
**Location:** `src/components/figma/ImageWithFallback.tsx`

**Purpose:** Image component with fallback handling

**Features:**
- Lazy loading
- Fallback image on error
- Responsive sizing
- Loading states

**Props:**
```typescript
interface ImageWithFallbackProps {
  src: string
  fallback?: string
  alt: string
  className?: string
}
```

---

## Component Usage Patterns

### Adding Navigation
```tsx
const handleNavigate = (page: string) => {
  setCurrentPage(page);
  window.scrollTo({ top: 0, behavior: "smooth" });
};

<Header onNavigate={handleNavigate} />
```

### Using Shop Context
```tsx
const { cart, addToCart, removeFromCart } = useShop();

addToCart({
  id: "product-1",
  title: "Diamond Ring",
  price: "₹50,000",
  // ... other properties
});
```

### Using Gold Price Context
```tsx
const { rates, calculatePrice } = useGoldPrice();

const price = calculatePrice({
  weight: 10,
  purity: '22k',
  makingCharges: 10
});
```

---

## Component Best Practices

1. **Props Interface Definition**
   - Always define TypeScript interfaces
   - Document required vs optional props
   - Include usage examples

2. **Error Handling**
   - Implement fallback UI
   - Handle missing data gracefully
   - Show appropriate error messages

3. **Accessibility**
   - Use semantic HTML
   - Include ARIA labels
   - Support keyboard navigation

4. **Performance**
   - Memoize where appropriate
   - Avoid unnecessary re-renders
   - Use lazy loading for images

5. **Styling**
   - Use Tailwind classes consistently
   - Follow color scheme
   - Maintain responsive design

---

## Component Dependencies

```
App.tsx (root)
├── Header
├── IntroScreen
├── HomePage
│   ├── PriceEstimator
│   ├── ProductCard
│   └── JewelryCarousel
├── RingsCatalogPage
│   ├── FilterSidebar
│   ├── ProductCard (multiple)
│   └── Pagination
├── CartPage
│   └── ProductCard (cart items)
├── CustomerDashboard
│   ├── Profile section
│   ├── Orders section
│   ├── Settings section
│   └── Wishlist section
├── Footer
└── Toaster (notifications)
```

---

## Future Component Plans

- [ ] Advanced search component
- [ ] Chat/support widget
- [ ] Recommendation engine
- [ ] Product comparison tool
- [ ] Virtual showroom 3D viewer
- [ ] Live chat component
- [ ] Video showcase player
- [ ] Size guide interactive tool

---

**Last Updated:** December 4, 2025
