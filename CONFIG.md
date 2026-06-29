# Configuration & Setup Documentation

## Overview
This document covers all configuration files, environment setup, and project initialization.

---

## Project Configuration Files

## 1. package.json

**Location:** `/package.json`

**Purpose:** Defines project metadata, dependencies, and build scripts

### Key Information
```json
{
  "name": "ornamis",
  "version": "0.1.0",
  "private": true
}
```

### Scripts
```json
{
  "scripts": {
    "dev": "vite",          // Start development server
    "build": "vite build"   // Production build
  }
}
```

**Running:**
```bash
npm install          # Install dependencies
npm run dev          # Start dev server (port 3002)
npm run build        # Build for production
```

### Dependencies Overview

#### Core React
- `react@18.3.1` - UI library
- `react-dom@18.3.1` - DOM rendering

#### State Management
- `motion/react` - Animations (formerly Framer Motion)
- `next-themes@0.4.6` - Theme management

#### UI Components & Styling
- `@radix-ui/*` - 30+ accessible UI components
- `tailwind-merge` - Tailwind class merging
- `clsx` - Conditional classnames
- `class-variance-authority` - CSS-in-JS variants

#### Form & Input
- `react-hook-form@7.55.0` - Form state management
- `react-day-picker@8.10.1` - Date picker
- `input-otp@1.4.2` - OTP input component

#### UI Library Components
- `lucide-react@0.487.0` - 400+ icons
- `embla-carousel-react@8.6.0` - Carousel component
- `react-resizable-panels@2.1.7` - Resizable panels
- `recharts@2.15.2` - Charting library
- `sonner@2.0.3` - Toast notifications
- `vaul@1.1.2` - Drawer component

#### AI & ML
- `@tensorflow/tfjs-core` - TensorFlow JS core
- `@tensorflow/tfjs-backend-webgl` - WebGL backend
- `@tensorflow-models/face-landmarks-detection` - Face detection

#### Backend
- `hono` - Lightweight web framework
- `@jsr/supabase__supabase-js@2.49.8` - Supabase client

#### Utilities
- `uuid` - Unique ID generation

### Dev Dependencies
```json
{
  "@types/node": "^20.10.0",
  "@vitejs/plugin-react-swc": "^3.10.2",
  "vite": "6.3.5"
}
```

---

## 2. vite.config.ts

**Location:** `/vite.config.ts`

**Purpose:** Vite build tool configuration

### Key Configuration

#### React Plugin
```typescript
plugins: [react()]  // Enables JSX transformation with SWC
```

#### Asset Aliases
Maps Figma asset imports to local files:
```typescript
alias: {
  'figma:asset/[hash].png': path.resolve(__dirname, './src/assets/[hash].png')
}
```

**Purpose:** Allows imports like:
```tsx
import image from 'figma:asset/abc123def456.png'
```

#### File Extensions
```typescript
resolve: {
  extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
}
```

### Build Output
- Output directory: `dist/`
- Minified and optimized
- Source maps for debugging
- Hashed filenames for caching

### Development Server
- **Port:** Auto-selects 3000, 3001, or 3002 if ports occupied
- **Hot Module Replacement (HMR):** Enabled
- **CSS Processing:** Built-in

---

## 3. tsconfig.json

**Location:** `/tsconfig.json`

**Purpose:** TypeScript compiler configuration

### Key Settings

#### Compilation Target
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"]
  }
}
```

#### JSX Processing
```json
{
  "jsx": "react-jsx",
  "jsxImportSource": "react"
}
```

#### Module Resolution
```json
{
  "moduleResolution": "bundler",
  "resolveJsonModule": true,
  "isolatedModules": true
}
```

#### Type Checking
```json
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true,
  "strictFunctionTypes": true,
  "strictBindCallApply": true,
  "noImplicitThis": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noImplicitReturns": true
}
```

#### Skip Library Checks
```json
{
  "skipLibCheck": true
}
```

---

## 4. tailwind.config.js

**Location:** `/tailwind.config.js`

**Purpose:** Tailwind CSS customization

### Theme Configuration

#### Color Palette
```javascript
{
  colors: {
    // Custom ORNAMIS colors
    primary: '#492f0e',      // Brown
    dark: '#362312',         // Dark brown
    accent: '#d4af37',       // Gold
    light: '#f6f3f0'         // Cream
  }
}
```

#### Typography
```javascript
{
  fontFamily: {
    serif: ['Cinzel Decorative', 'serif'],
    sans: ['Inter', 'sans-serif']
  }
}
```

#### Spacing
```javascript
{
  spacing: {
    // Tailwind default spacing (0.25rem increments)
  }
}
```

#### Extend Settings
```javascript
extend: {
  animation: {
    // Custom animations
  },
  keyframes: {
    // Custom keyframes
  }
}
```

---

## 5. index.html

**Location:** `/index.html`

**Purpose:** HTML entry point for the application

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ornamis</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### Key Points
- Single root div for React mounting
- Module-type script loads main.tsx
- Viewport meta for responsive design

---

## Environment Variables

### Current Setup
No `.env` file currently configured (using demo/fallback modes)

### Future Environment Variables

Create `.env.local` for local development:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Gold Price API (Optional)
VITE_GOLD_API_KEY=your_api_key_here
VITE_GOLD_API_URL=https://api.example.com/gold-rates

# AI Designer API
VITE_AI_API_KEY=your_ai_api_key
VITE_AI_API_URL=https://api.example.com/design

# Payment Gateway
VITE_PAYMENT_API_KEY=your_payment_key
VITE_PAYMENT_MERCHANT_ID=your_merchant_id

# Analytics
VITE_ANALYTICS_ID=your_analytics_id
```

### Accessing in Code
```typescript
// In React components
const API_KEY = import.meta.env.VITE_GOLD_API_KEY

// Example
if (import.meta.env.PROD) {
  // Production only code
}
```

---

## Build & Deployment

### Development
```bash
npm install
npm run dev
```

**Output:**
- Development server on http://localhost:3002
- Hot reload enabled
- Source maps for debugging

### Production Build
```bash
npm run build
```

**Output:**
- Optimized files in `dist/` folder
- Minified JavaScript and CSS
- Hashed filenames for caching
- Ready for deployment

### Deployment Checklist
- [ ] Build completes without errors
- [ ] Test build locally: `npm run preview`
- [ ] Environment variables configured
- [ ] API endpoints updated for production
- [ ] Database migrations run
- [ ] SSL certificates ready
- [ ] CDN configured (optional)

---

## Project Structure

```
ornamis-2/
├── src/
│   ├── App.tsx                 # Root component
│   ├── main.tsx                # Entry point
│   ├── index.css               # Global styles
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── CartPage.tsx
│   │   │   └── ... (other pages)
│   │   └── ui/
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       └── ... (UI components)
│   ├── contexts/
│   │   ├── ShopContext.tsx
│   │   └── GoldPriceContext.tsx
│   ├── utils/
│   │   ├── goldPriceService.ts
│   │   ├── design-validator.ts
│   │   └── ai-api-helpers.ts
│   ├── assets/
│   │   └── [image files]
│   └── styles/
│       └── globals.css
├── public/
│   └── [static assets]
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── index.html
```

---

## Installation & Setup Guide

### Prerequisites
- Node.js 16+ (Recommended: 18 LTS)
- npm 8+ or yarn 3+

### Step 1: Clone & Install
```bash
cd ornamis-2
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

Check terminal output for the actual port (usually 3002)

### Step 3: Open in Browser
```
http://localhost:3002
```

### Step 4: Configuration (Optional)

#### For Live Gold Rates
1. Get API key from gold rate provider
2. Create `.env.local` file
3. Add `VITE_GOLD_API_KEY=your_key`
4. Restart dev server

#### For Database
1. Create Supabase project
2. Add credentials to `.env.local`
3. Run migrations
4. Test connection

---

## Troubleshooting

### Common Issues

#### 1. Port Already in Use
**Error:** "Port 3000 is in use"

**Solution:**
- Dev server auto-selects next port
- Check terminal for actual port (usually 3002)
- Or kill process on specific port

#### 2. Module Not Found
**Error:** "Cannot find module '@/components'"

**Solution:**
- Check tsconfig.json paths are correct
- Verify imports use correct relative paths
- Clear node_modules and reinstall: `npm install`

#### 3. Tailwind Styles Not Applying
**Error:** Styles don't appear

**Solution:**
- Verify tailwind.config.js content paths
- Check index.css imports Tailwind directives
- Restart dev server

#### 4. Out of Memory
**Error:** "JavaScript heap out of memory"

**Solution:**
```bash
# Increase Node memory
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

#### 5. Missing Dependencies
**Error:** Module not found errors

**Solution:**
```bash
npm install [missing-package]
# Or reinstall all
npm ci
```

---

## Performance Optimization

### Development
- Use development mode (auto-enabled in `npm run dev`)
- Enable source maps for easier debugging
- Hot reload enabled automatically

### Production
- Minification enabled (vite default)
- Tree-shaking for unused code
- Lazy loading for routes
- Image optimization

### CSS
- Tailwind purging removes unused styles
- PurgeCSS integrated
- File size: ~30KB gzipped

### JavaScript
- Code splitting by default
- Async chunk loading
- Estimated bundle size: ~150KB gzipped

---

## Browser Support

### Supported Browsers
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Mobile)

### Features Used
- ES2020 syntax
- CSS Grid and Flexbox
- CSS Custom Properties
- Modern JavaScript APIs

---

## Development Best Practices

### Code Style
- Use TypeScript for type safety
- Follow Tailwind class naming
- Keep components small and focused
- Document complex logic

### Git Workflow
```bash
git checkout -b feature/feature-name
# Make changes
git commit -m "feat: description"
git push origin feature/feature-name
```

### Testing Recommendations
- Unit tests for utilities
- Component tests for complex components
- E2E tests for critical flows

---

## Deployment Options

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

### Static Hosting (AWS S3, etc.)
1. Build: `npm run build`
2. Upload `dist/` folder to hosting
3. Configure index.html as default document
4. Set up redirects for SPA routing

---

## Next Steps

1. **Set up database:** Configure Supabase
2. **Add authentication:** Implement user signup/login
3. **Connect payment:** Integrate payment gateway
4. **Deploy:** Choose hosting and deploy
5. **Monitor:** Set up analytics and error tracking

---

**Last Updated:** December 4, 2025
