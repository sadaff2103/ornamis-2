# Utilities & Services Documentation

## Overview
This document describes all utility functions, services, and helper modules used throughout the ORNAMIS application.

---

## Gold Pricing Service

**File:** `src/utils/goldPriceService.ts`

### Overview
Handles all gold price calculations, API integration, and jewelry pricing logic.

### Interfaces

#### GoldRates
```typescript
interface GoldRates {
  gold24k: number      // Price per gram in INR
  gold22k: number      // Price per gram in INR
  gold18k: number      // Price per gram in INR
  source: 'api' | 'cache' | 'fallback'  // Data source
  timestamp: number    // Update time (milliseconds)
}
```

#### JewelrySpecs
```typescript
interface JewelrySpecs {
  weight: number              // Weight in grams
  purity: '24k' | '22k' | '18k'  // Gold purity level
  makingCharges: number       // Making charges as percentage
  gemstonesCost?: number      // Fixed gemstone cost in INR
}
```

#### JewelryPriceBreakdown
```typescript
interface JewelryPriceBreakdown {
  goldCost: number           // Base gold cost
  makingCharges: number      // Making charges amount
  gemstoneCost: number       // Gemstone cost
  totalPrice: number         // Final price (sum of above)
  pricePerGram: number       // Cost per gram of gold
}
```

### Functions

#### fetchGoldRates()
**Purpose:** Retrieve current gold prices

**Signature:**
```typescript
async fetchGoldRates(): Promise<GoldRates>
```

**Returns:**
- Live rates from API (if configured)
- Cached rates (if fresh within time window)
- Demo fallback rates (for testing)

**Sources Priority:**
1. Live API (requires API key configuration)
2. Cached data (if < 1 hour old)
3. Demo rates (fallback)

**Error Handling:**
- Returns fallback rates on API failure
- Logs errors for debugging
- Shows toast notification on failure

**Usage:**
```typescript
const rates = await fetchGoldRates();
console.log(`24K Gold: ₹${rates.gold24k}/gram`);
```

#### calculateJewelryPrice()
**Purpose:** Calculate final jewelry price based on specifications

**Signature:**
```typescript
function calculateJewelryPrice(specs: JewelrySpecs): JewelryPriceBreakdown | null
```

**Parameters:**
- `weight` - Jewelry weight in grams
- `purity` - Gold purity (24k/22k/18k)
- `makingCharges` - Percentage of gold cost
- `gemstonesCost` - (Optional) Fixed gemstone amount

**Calculation Formula:**
```
goldCost = weight × pricePerGram
makingCharges = goldCost × (makingChargesPercentage / 100)
gemstoneCost = gemstonesCost || 0
totalPrice = goldCost + makingCharges + gemstoneCost
```

**Returns:**
- `JewelryPriceBreakdown` object with all calculations
- `null` if rates not available

**Usage:**
```typescript
const breakdown = calculateJewelryPrice({
  weight: 10,
  purity: '22k',
  makingCharges: 10,
  gemstonesCost: 5000
});

console.log(`Total: ₹${breakdown.totalPrice}`);
```

#### formatPrice()
**Purpose:** Format numbers as Indian currency

**Signature:**
```typescript
function formatPrice(amount: number): string
```

**Returns:** Formatted string like "₹5,00,000"

**Features:**
- Indian numbering system (lakhs, crores)
- Rupee symbol prefix
- Thousands separator with commas

**Usage:**
```typescript
const formatted = formatPrice(325000);  // "₹3,25,000"
```

### Configuration

#### Demo Rates (Fallback)
Used when API is not available:
```typescript
const DEMO_RATES = {
  gold24k: 6800,    // per gram
  gold22k: 6200,    // per gram
  gold18k: 4650,    // per gram
  source: 'fallback' as const
};
```

#### Rate Caching
- Cache duration: 1 hour
- Local storage key: 'ornamis_gold_rates'
- Auto-refresh on expiry

---

## Design Validator

**File:** `src/utils/design-validator.ts`

### Overview
Validates jewelry design specifications for feasibility and compatibility.

### Interfaces

#### DesignSpecs
```typescript
interface DesignSpecs {
  metalType: 'gold' | 'silver' | 'platinum' | 'white gold'
  weight: number          // in grams
  mainGemstone?: {
    type: string
    weight: number
    color: string
  }
  accentGemstones?: {
    type: string
    count: number
    weight: number
  }
  complexity: 'simple' | 'moderate' | 'complex'
}
```

#### ValidationResult
```typescript
interface ValidationResult {
  isValid: boolean
  warnings: string[]
  errors: string[]
  estimatedTime: number  // in hours
}
```

### Functions

#### validateDesign()
**Purpose:** Validate design feasibility

**Signature:**
```typescript
function validateDesign(specs: DesignSpecs): ValidationResult
```

**Validations:**
1. Metal compatibility with gemstones
2. Weight feasibility
3. Gemstone size compatibility
4. Design complexity feasibility
5. Structural integrity

**Returns:**
- `isValid` - Overall validity
- `warnings` - Non-blocking issues
- `errors` - Blocking issues
- `estimatedTime` - Production time estimate

**Usage:**
```typescript
const result = validateDesign({
  metalType: 'white gold',
  weight: 8,
  mainGemstone: {
    type: 'diamond',
    weight: 2,
    color: 'D'
  },
  complexity: 'moderate'
});

if (result.isValid) {
  console.log(`Production time: ${result.estimatedTime} hours`);
} else {
  console.error('Design issues:', result.errors);
}
```

#### estimateProduction()
**Purpose:** Estimate production time

**Signature:**
```typescript
function estimateProduction(specs: DesignSpecs): number
```

**Returns:** Estimated hours

**Factors:**
- Design complexity
- Metal type
- Gemstone setting requirements
- Total weight

---

## Shopping Context Utilities

**File:** `src/contexts/ShopContext.tsx`

### Overview
React Context providing shopping cart and wishlist functionality.

### Shop Context Type
```typescript
interface ShopContextType {
  cart: CartItem[]
  wishlist: Product[]
  searchQuery: string
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  isInCart: (productId: string) => boolean
  setSearchQuery: (query: string) => void
  getCartTotal: () => number
  getCartCount: () => number
}
```

### Usage Hook

```typescript
const { 
  cart, 
  addToCart, 
  removeFromCart, 
  getCartTotal 
} = useShop();
```

### Key Functions

#### addToCart()
Adds product to cart or increments quantity

```typescript
addToCart({
  id: 'ring-001',
  title: 'Diamond Ring',
  price: '₹50,000',
  priceValue: 50000,
  image: 'image-url',
  category: 'Rings'
});
```

#### removeFromCart()
Removes entire product from cart

```typescript
removeFromCart('ring-001');
```

#### updateQuantity()
Changes product quantity

```typescript
updateQuantity('ring-001', 3);
```

#### getCartTotal()
Calculates total price of all items

```typescript
const total = getCartTotal();  // returns number
```

#### addToWishlist()
Adds product to favorites

```typescript
addToWishlist(product);
```

#### isInCart()
Checks if product is in cart

```typescript
if (isInCart('ring-001')) {
  // Product already in cart
}
```

---

## Gold Price Context Utilities

**File:** `src/contexts/GoldPriceContext.tsx`

### Overview
React Context managing gold rates and price calculations.

### Gold Price Context Type
```typescript
interface GoldPriceContextType {
  rates: GoldRates | null
  loading: boolean
  error: string | null
  refreshRates: () => Promise<void>
  calculatePrice: (specs: JewelrySpecs) => JewelryPriceBreakdown | null
}
```

### Usage Hook

```typescript
const { rates, calculatePrice, refreshRates } = useGoldPrice();
```

### Key Features

#### Automatic Rate Loading
- Loads rates on component mount
- Shows loading state
- Handles errors gracefully

#### Real-time Updates
```typescript
const refreshRates = async () => {
  await refreshRates();
  toast.success('Gold rates updated');
};
```

#### Price Calculation
```typescript
const breakdown = calculatePrice({
  weight: 10,
  purity: '22k',
  makingCharges: 10
});
```

---

## Helper Functions

### formatPrice()
**File:** `src/utils/goldPriceService.ts`

Formats numbers with Indian currency format

```typescript
formatPrice(100000)   // "₹1,00,000"
formatPrice(5000)     // "₹5,000"
formatPrice(123456)   // "₹1,23,456"
```

### Currency Conversion
Future utility for multi-currency support:
```typescript
convertCurrency(amount: number, from: string, to: string): number
```

---

## API Helpers

**File:** `src/utils/ai-api-helpers.ts`

### Overview
Helper functions for AI Designer API integration

### Functions

#### generateDesign()
**Purpose:** Call AI API to generate jewelry design

**Signature:**
```typescript
async function generateDesign(
  description: string,
  preferences?: DesignPreferences
): Promise<GeneratedDesign>
```

#### getDesignVariations()
**Purpose:** Get design variations

```typescript
async function getDesignVariations(
  baseDesignId: string,
  variationCount: number
): Promise<GeneratedDesign[]>
```

#### estimateDesignPrice()
**Purpose:** Get price estimate for generated design

```typescript
async function estimateDesignPrice(
  designId: string
): Promise<JewelryPriceBreakdown>
```

---

## Supabase Integration

**File:** `src/supabase/`

### Overview
Database and backend integration setup (ready for implementation)

### Configuration
- Project URL
- Anon public key
- Real-time subscriptions enabled

### Planned Functions
- User authentication
- Order management
- Product database queries
- Design storage
- Payment processing

---

## Type Definitions

### Product Type
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

### CartItem Type
```typescript
interface CartItem extends Product {
  quantity: number
}
```

### User Type
```typescript
interface User {
  id?: string
  name: string
  email: string
  phone?: string
  role: 'customer' | 'designer' | 'vendor'
}
```

### Order Type
```typescript
interface Order {
  id: string
  userId: string
  items: CartItem[]
  totalPrice: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered'
  createdAt: Date
  updatedAt: Date
}
```

---

## Constants

**Common Constants:**

```typescript
// Gold Purity Levels
const PURITY_LEVELS = ['24k', '22k', '18k'] as const

// Metal Types
const METAL_TYPES = ['gold', 'silver', 'platinum', 'white gold'] as const

// Design Complexity
const COMPLEXITY_LEVELS = ['simple', 'moderate', 'complex'] as const

// User Roles
const USER_ROLES = ['customer', 'designer', 'vendor'] as const

// Order Status
const ORDER_STATUS = ['pending', 'processing', 'shipped', 'delivered'] as const
```

---

## Error Handling

### Standard Error Format
```typescript
interface ApiError {
  code: string
  message: string
  details?: string
}
```

### Common Errors
- `RATES_UNAVAILABLE` - Gold rates cannot be fetched
- `INVALID_PRODUCT` - Product data invalid
- `CART_ERROR` - Cart operation failed
- `AUTH_FAILED` - Authentication error
- `NETWORK_ERROR` - Network connectivity issue

### Error Handling Pattern
```typescript
try {
  const rates = await fetchGoldRates();
} catch (error) {
  const apiError = error as ApiError;
  console.error(`Error: ${apiError.message}`);
  toast.error(apiError.message);
}
```

---

## Performance Utilities

### Memoization
For expensive calculations:
```typescript
const calculatePrice = useMemo(
  () => calculateJewelryPrice(specs),
  [specs]
);
```

### Debouncing
For search and input handling:
```typescript
const debouncedSearch = useCallback(
  debounce((query: string) => {
    // search logic
  }, 500),
  []
);
```

### Lazy Loading
For components and images:
```typescript
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

---

## Testing Utilities

### Mock Data Generators
```typescript
function generateMockProduct(): Product {
  return {
    id: `prod-${Date.now()}`,
    title: 'Test Product',
    price: '₹50,000',
    // ... other properties
  };
}
```

### Test Helpers
- Setup test providers
- Mock API responses
- Generate test data

---

## Future Utilities

- [ ] Payment processing helper
- [ ] Email template renderer
- [ ] PDF invoice generator
- [ ] Image optimization
- [ ] Analytics tracker
- [ ] Error reporting service
- [ ] Notification service
- [ ] Data export utilities

---

## Best Practices

1. **Error Handling**
   - Always wrap async operations in try-catch
   - Provide meaningful error messages
   - Log errors for debugging

2. **Performance**
   - Use useMemo for expensive calculations
   - Implement debouncing for frequent calls
   - Cache API responses

3. **Type Safety**
   - Use TypeScript interfaces
   - Validate input data
   - Handle null/undefined cases

4. **Documentation**
   - Document function parameters
   - Include usage examples
   - Explain complex logic

---

**Last Updated:** December 4, 2025
