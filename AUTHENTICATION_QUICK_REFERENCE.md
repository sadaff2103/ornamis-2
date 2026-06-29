# Authentication Redirect Logic - Quick Reference

## How It Works

### 1. **Authentication Context** (AuthContext.tsx)
```typescript
// Use this hook in any component to access auth state
const { user, isAuthenticated, login, signup, logout } = useAuth();
```

### 2. **Protected Routes**
The app automatically redirects users to `/login` if they try to access:
- Dashboard (`/dashboard`)
- Wishlist (`/wishlist`)
- Cart (`/cart`)
- AI Designer (`/ai-designer`)
- AR Try-On (`/ar-tryon`)

### 3. **How Redirect Logic Works**

#### In App.tsx
```typescript
const handleNavigate = (page: Page) => {
  // Check if the page requires authentication
  if (PROTECTED_PAGES.has(page) && !isAuthenticated) {
    toast.error("You need to be logged in to access this page.");
    setCurrentPage("login");
    return;
  }
  // Normal navigation
  setCurrentPage(page);
};
```

#### In Individual Pages
```typescript
// Pages check authentication and redirect themselves
export function WishlistPage({ onNavigate }) {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      onNavigate("login");
    }
  }, [isAuthenticated, onNavigate]);

  if (!isAuthenticated) {
    return null;
  }

  // Normal page content...
}
```

## Implementation Pattern for New Pages

To add authentication to a new page:

```typescript
import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

export function MyProtectedPage({ onNavigate }) {
  const { isAuthenticated } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      onNavigate("login");
    }
  }, [isAuthenticated, onNavigate]);

  // Return null while checking/redirecting
  if (!isAuthenticated) {
    return null;
  }

  // Normal content
  return (
    <div>
      {/* Page content */}
    </div>
  );
}
```

## Session Management

### Login
```typescript
const { login } = useAuth();
login(email, password, role);
// Session saved to localStorage
```

### Logout
```typescript
const { logout } = useAuth();
logout();
// Session cleared
```

### Check Authentication
```typescript
const { isAuthenticated, user } = useAuth();

if (isAuthenticated) {
  console.log("User:", user.name, user.email);
}
```

## Test Scenarios

### Scenario 1: Unauthenticated Access
1. Open app (no login)
2. Try to click "Cart"
3. Expected: Redirected to login, toast message shown

### Scenario 2: Authenticated Access
1. Login with any email/password
2. Can access all pages
3. Dashboard shows user info
4. Logout clears session

### Scenario 3: Session Persistence
1. Login
2. Refresh page
3. Session should persist (localStorage)
4. Can still access protected pages

### Scenario 4: AI Designer Protection
1. Try to access AI Designer without login
2. See locked-feature message with login button
3. Login and retry
4. Full access granted

## Configuration

To add more pages to protected list, edit in App.tsx:

```typescript
const PROTECTED_PAGES = new Set<Page>([
  "dashboard",
  "wishlist",
  "cart",
  "orders",
  "settings",
  "your-new-page", // Add here
]);
```

## Error Messages

Users see helpful toast messages:
- "You need to be logged in to access this page." → When trying to navigate to protected page
- "Welcome back! You've successfully logged in." → On successful login
- "You've been logged out. See you soon!" → On logout

## Component Hierarchy

```
App
├── AuthProvider (NEW)
│   └── GoldPriceProvider
│       └── ShopProvider
│           └── AppContent
│               ├── Header (shows user info)
│               ├── Footer
│               └── renderPage() (with ProtectedRoute wrapping)
```

## Browser DevTools

To test, open DevTools → Application → Local Storage → `ornamisUser`:
- Shows: `{"name":"User","email":"user@email.com","role":"customer"}`
- On logout: Entry is deleted

## Important Notes

1. **Demo Mode**: Passwords are not validated (demo/prototype only)
2. **localStorage**: Used for demo; replace with secure backend for production
3. **No Breaking Changes**: All existing functionality preserved
4. **Backward Compatible**: Works with existing App structure
5. **Toast Notifications**: Via existing Sonner component

## Troubleshooting

### User keeps redirecting to login
- Check: Is `AuthProvider` wrapping the app? (See App.tsx)
- Check: Is `useAuth()` being called? Need to be inside `AuthProvider`

### Session not persisting
- Check: localStorage is enabled in browser
- Check: Not in private/incognito mode

### Can't access protected page even when logged in
- Check: `PROTECTED_PAGES` set includes that page (if needed)
- Check: `isAuthenticated` is true

## Next Steps

1. Replace localStorage with real backend authentication
2. Add JWT tokens for secure sessions
3. Implement refresh token rotation
4. Add role-based access control (RBAC)
5. Add email verification
6. Add password reset flow
