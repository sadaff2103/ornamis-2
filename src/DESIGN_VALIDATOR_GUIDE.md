# ORNAMIS Design Validator & Generator System

## 📋 Overview

The ORNAMIS Design Validator is a comprehensive system that validates design inputs, checks accessibility compliance (WCAG AA), manages performance budgets, and generates optimized outputs with QA checks.

## 🎯 Key Features

### ✅ Input Validation
- Screen types: `home`, `loading`, `stores`
- Title sizing with overflow handling
- Hex color validation for theme
- Loading duration constraints (0-5000ms)
- Output format validation: `figma`, `svg`, `png`
- Viewport validation: `desktop`, `mobile`, `tablet`

### 🎨 Accessibility (WCAG AA)
- Automatic contrast ratio checking (4.5:1 for normal text, 3:1 for large text)
- Color adjustment for insufficient contrast
- Text shadow recommendations
- ARIA label requirements

### ⚡ Performance Budget
- Total asset size limit: **300 KB** (above-the-fold)
- Automatic asset compression
- Remote asset validation and caching
- Performance grading: `excellent` | `good` | `poor`

### 🔄 Error Handling
- Retry logic with exponential backoff (up to 2 retries)
- Degraded fallbacks on persistent failures
- Idempotent design generation with UUID versioning
- Comprehensive error codes and messages

---

## 📝 API Contract

### Input JSON Schema

```json
{
  "screen": "home|loading|stores",
  "title_text": "string",
  "title_max_px": 72,
  "theme": {
    "primary": "#HEX",
    "accent": "#HEX",
    "bg": "#HEX"
  },
  "loading_duration_ms": 300,
  "stores": [
    {
      "name": "string",
      "logo_url": "string|null"
    }
  ],
  "output_format": "figma|svg|png",
  "viewport": "desktop|mobile|tablet"
}
```

### Output JSON Schema

```json
{
  "status": "success|warning|error",
  "design_version": "uuid",
  "files": [
    {
      "type": "figma|svg|png",
      "path": "string",
      "size_bytes": 12345
    }
  ],
  "qa": [
    {
      "check": "string",
      "result": "pass|fail|warning",
      "details": "string"
    }
  ],
  "warnings": ["string"],
  "errors": ["string"],
  "computed": {
    "title_font_size": 48,
    "title_line_height": 1.2,
    "title_truncated": false,
    "contrast_ratios": {
      "primary-bg": 7.5,
      "accent-bg": 4.8
    },
    "total_asset_size": 250000,
    "performance_grade": "excellent"
  }
}
```

---

## 🚀 API Endpoints

### 1. Generate Design (POST)

**Endpoint:** `POST /make-server-75af7cc1/design/generate`

**Request:**
```json
{
  "screen": "home",
  "title_text": "ORNAMIS",
  "title_max_px": 72,
  "theme": {
    "primary": "#1a0f08",
    "accent": "#d4af37",
    "bg": "#faf8f5"
  },
  "loading_duration_ms": 300,
  "stores": [
    {
      "name": "Tanishq",
      "logo_url": "https://example.com/tanishq-logo.png"
    }
  ],
  "output_format": "png",
  "viewport": "desktop"
}
```

**Response (Success):**
```json
{
  "status": "success",
  "design_version": "550e8400-e29b-41d4-a716-446655440000",
  "files": [
    {
      "type": "png",
      "path": "/output/home-desktop.png",
      "size_bytes": 45000
    },
    {
      "type": "png",
      "path": "/output/home-desktop-fallback.png",
      "size_bytes": 20000
    }
  ],
  "qa": [
    {
      "check": "contrast_primary_bg",
      "result": "pass",
      "details": "Ratio: 7.5:1 (required: 4.5:1)"
    },
    {
      "check": "asset_size",
      "result": "pass",
      "details": "Total: 50.00 KB / 300 KB"
    }
  ],
  "warnings": [],
  "errors": [],
  "computed": {
    "title_font_size": 60,
    "title_line_height": 1.22,
    "title_truncated": false,
    "contrast_ratios": {
      "primary-bg": 7.5,
      "accent-bg": 4.8
    },
    "total_asset_size": 50000,
    "performance_grade": "excellent"
  }
}
```

**Response (Validation Error - 400):**
```json
{
  "status": "error",
  "design_version": "uuid",
  "files": [],
  "qa": [],
  "warnings": [],
  "errors": [
    {
      "error_code": "INVALID_COLOR",
      "message": "theme.primary must be a valid hex color (e.g., #FF5733)",
      "field": "theme.primary"
    }
  ],
  "computed": { ... }
}
```

---

### 2. Validate Input (GET)

**Endpoint:** `GET /make-server-75af7cc1/design/validate`

**Query Parameters:**
- `screen` - Screen type
- `title_text` - Title text
- `title_max_px` - Max font size
- `primary` - Primary color (#HEX)
- `accent` - Accent color (#HEX)
- `bg` - Background color (#HEX)
- `loading_duration_ms` - Animation duration
- `output_format` - Output format
- `viewport` - Viewport size

**Example:**
```
GET /make-server-75af7cc1/design/validate?screen=home&title_text=ORNAMIS&primary=%231a0f08&bg=%23faf8f5
```

**Response:**
```json
{
  "valid": true,
  "errors": [],
  "input": {
    "screen": "home",
    "title_text": "ORNAMIS",
    ...
  }
}
```

---

### 3. Health Check (GET)

**Endpoint:** `GET /make-server-75af7cc1/design/health`

**Response:**
```json
{
  "status": "healthy",
  "service": "ORNAMIS Design Generator",
  "version": "1.0.0",
  "timestamp": "2025-01-01T12:00:00Z"
}
```

---

## 🔧 Client-Side Integration

### Using the Design Validator in React

```tsx
import { 
  validateInput, 
  generateDesign, 
  getTitleStyles,
  checkContrast 
} from './utils/design-validator';

function MyComponent() {
  const [design, setDesign] = useState(null);

  const handleGenerate = async () => {
    const input = {
      screen: 'home',
      title_text: 'ORNAMIS',
      title_max_px: 72,
      theme: {
        primary: '#1a0f08',
        accent: '#d4af37',
        bg: '#faf8f5'
      },
      loading_duration_ms: 300,
      stores: [],
      output_format: 'png',
      viewport: 'desktop'
    };

    // Validate first
    const validation = validateInput(input);
    if (!validation.valid) {
      console.error('Validation errors:', validation.errors);
      return;
    }

    // Generate design
    const result = await generateDesign(input);
    if (result.status === 'success' || result.status === 'warning') {
      setDesign(result);
      console.log('Design generated:', result.design_version);
      console.log('QA checks:', result.qa);
    }
  };

  // Get safe title styles
  const titleStyles = getTitleStyles(
    'ORNAMIS',
    72,
    1440,
    { primary: '#1a0f08', bg: '#faf8f5' }
  );

  return (
    <div>
      <h1 style={titleStyles}>ORNAMIS</h1>
      <button onClick={handleGenerate}>Generate Design</button>
    </div>
  );
}
```

---

## 📊 QA Checks Performed

The system automatically runs these checks:

| Check | Description | Pass Criteria |
|-------|-------------|---------------|
| `contrast_primary_bg` | Primary/background contrast | ≥ 4.5:1 (normal text) |
| `contrast_accent_bg` | Accent/background contrast | ≥ 4.5:1 (normal text) |
| `title_overflow` | Title fits in viewport | No truncation needed |
| `asset_size` | Total asset size | ≤ 300 KB |
| `animation_duration` | Loading animation speed | ≤ 500ms recommended |
| `accessibility` | ARIA labels & alt text | All present |

---

## ⚙️ Rules & Constraints

### 1. Title Sizing Algorithm

```
font-size = min(title_max_px, available_width / 12)
font-size = clamp(12px, computed, 72px)
line-height = max(1.1, font-size × 0.02 + 1)
```

If text overflows:
- Truncate with ellipsis (`...`)
- Provide tooltip with full text
- Set `title_truncated: true` in output

### 2. Contrast Ratio Calculation (WCAG)

```
contrast_ratio = (L_lighter + 0.05) / (L_darker + 0.05)
```

Where L = relative luminance:
```
L = 0.2126 × R + 0.7152 × G + 0.0722 × B
```

**Auto-correction:** If contrast fails, system adjusts to:
- `#1a0f08` (dark) for light backgrounds (luminance > 0.5)
- `#ffffff` (white) for dark backgrounds (luminance ≤ 0.5)

### 3. Performance Budget Grading

| Grade | Total Asset Size |
|-------|------------------|
| Excellent | ≤ 210 KB (70% of budget) |
| Good | 211-300 KB |
| Poor | > 300 KB |

### 4. Loading Animation

- **Max duration:** 500ms (capped automatically)
- **Reduced motion:** Animation disabled if user prefers reduced motion
- **Low performance:** Fallback to simple fade (opacity animation)

### 5. Asset Management

- **Remote URLs:** Validated, downloaded, and optimized
- **Max size per asset:** 200 KB
- **Retry logic:** Up to 2 retries with exponential backoff
- **Fallback:** Local placeholder on failure

---

## 🚨 Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `INVALID_SCREEN` | Invalid screen type | 400 |
| `INVALID_TITLE` | Empty or invalid title | 400 |
| `INVALID_TITLE_SIZE` | title_max_px out of range (12-120) | 400 |
| `INVALID_THEME` | Missing or invalid theme object | 400 |
| `INVALID_COLOR` | Invalid hex color format | 400 |
| `INVALID_DURATION` | loading_duration_ms out of range (0-5000) | 400 |
| `INVALID_STORES` | stores not an array | 400 |
| `INVALID_STORE_NAME` | Store missing name | 400 |
| `INVALID_LOGO_URL` | Invalid logo URL | 400 |
| `INVALID_OUTPUT_FORMAT` | Invalid output format | 400 |
| `INVALID_VIEWPORT` | Invalid viewport | 400 |
| `INTERNAL_ERROR` | Server-side error | 500 |
| `VALIDATION_ERROR` | General validation error | 400 |

---

## 📦 Output Files

Every design generation produces:

1. **Primary output** - In requested format (figma/svg/png)
2. **Fallback PNG** - Always included for immediate preview
3. **Thumbnails** - 3 preview images (mobile, tablet, desktop)

Example file structure:
```
/output/
  ├── home-desktop.png (primary)
  ├── home-desktop-fallback.png (fallback)
  ├── home-mobile-preview.png (thumbnail)
  ├── home-tablet-preview.png (thumbnail)
  └── home-desktop-preview.png (thumbnail)
```

---

## 🧪 Testing Example

```bash
# Test validation endpoint
curl -X GET "http://localhost:8000/make-server-75af7cc1/design/validate?screen=home&title_text=ORNAMIS&primary=%231a0f08&bg=%23faf8f5"

# Test generation endpoint
curl -X POST "http://localhost:8000/make-server-75af7cc1/design/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "screen": "home",
    "title_text": "ORNAMIS",
    "title_max_px": 72,
    "theme": {
      "primary": "#1a0f08",
      "accent": "#d4af37",
      "bg": "#faf8f5"
    },
    "loading_duration_ms": 300,
    "stores": [
      {"name": "Tanishq", "logo_url": null}
    ],
    "output_format": "png",
    "viewport": "desktop"
  }'
```

---

## 🎯 Best Practices

### ✅ DO:
- Always validate input before generating
- Check QA results and address warnings
- Use safe color adjustments for accessibility
- Keep total asset size under 300 KB
- Implement retry logic for asset downloads
- Provide fallback placeholders
- Log all design generations for debugging

### ❌ DON'T:
- Skip input validation
- Ignore contrast warnings
- Use loading animations > 500ms
- Load remote assets without validation
- Forget to handle prefers-reduced-motion
- Neglect error handling
- Exceed performance budget without optimization

---

## 📚 Additional Resources

- **WCAG 2.1 Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/
- **Color Contrast Checker:** https://webaim.org/resources/contrastchecker/
- **Performance Budget:** https://web.dev/performance-budgets-101/
- **Reduced Motion:** https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion

---

## 🔄 Versioning

Each design output includes:
- **design_version:** UUID for tracking
- **timestamp:** ISO 8601 format
- **changelog:** Modifications made during generation

This ensures idempotency and allows for version comparison.

---

## 📞 Support

For issues or questions:
1. Check error codes in response
2. Review QA checks for warnings
3. Verify input against schema
4. Check server logs for detailed traces

---

**System Version:** 1.0.0  
**Last Updated:** December 2, 2025  
**Status:** Production Ready ✅
