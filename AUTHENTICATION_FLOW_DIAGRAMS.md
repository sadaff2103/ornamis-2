# Authentication Flow Diagrams

## 🔐 Overall System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         App (Root)                           │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐   │
│  │        AuthProvider (NEW - Wraps entire app)         │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │            AuthContext                         │  │   │
│  │  │  • user: User | null                          │  │   │
│  │  │  • isAuthenticated: boolean                   │  │   │
│  │  │  • login()                                    │  │   │
│  │  │  • signup()                                   │  │   │
│  │  │  • logout()                                   │  │   │
│  │  │  • localStorage persistence                   │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │          GoldPriceProvider                     │  │   │
│  │  │          ShopProvider                         │  │   │
│  │  │  ┌──────────────────────────────────────────┐ │  │   │
│  │  │  │       AppContent                        │ │  │   │
│  │  │  │  ┌────────────────────────────────────┐ │ │  │   │
│  │  │  │  │  Header (shows user if logged in) │ │ │  │   │
│  │  │  │  └────────────────────────────────────┘ │ │  │   │
│  │  │  │  ┌────────────────────────────────────┐ │ │  │   │
│  │  │  │  │      renderPage()                 │ │ │  │   │
│  │  │  │  │                                   │ │ │  │   │
│  │  │  │  │  For Protected Pages:             │ │ │  │   │
│  │  │  │  │  <ProtectedRoute>                 │ │ │  │   │
│  │  │  │  │    <PageComponent />             │ │ │  │   │
│  │  │  │  │  </ProtectedRoute>                │ │ │  │   │
│  │  │  │  └────────────────────────────────────┘ │ │  │   │
│  │  │  │  ┌────────────────────────────────────┐ │ │  │   │
│  │  │  │  │  Footer                           │ │ │  │   │
│  │  │  │  └────────────────────────────────────┘ │ │  │   │
│  │  │  └──────────────────────────────────────────┘ │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Authentication Lifecycle

```
                  USER JOURNEY
                      ▼
        ┌─────────────────────────────┐
        │ User visits app (unauthenticated)
        └─────────────┬───────────────┘
                      ▼
        ┌─────────────────────────────┐
        │ AuthProvider initializes    │
        │ Check localStorage for user │
        └─────────────┬───────────────┘
                      ▼
        ┌─────────────────────────────┐
        │ User logged in previously?  │
        └──┬──────────────────────┬───┘
           │                      │
          YES                    NO
           │                      │
           ▼                      ▼
    ┌────────────┐        ┌──────────────┐
    │ Load user  │        │ user = null  │
    │from storage│        │isAuth = false│
    │isAuth=true │        └──────────────┘
    └─────┬──────┘              │
          │                      │
          └──────┬───────────────┘
                 ▼
    ┌──────────────────────────────┐
    │ User clicks on page link     │
    └──────────────┬───────────────┘
                   ▼
    ┌──────────────────────────────┐
    │ Is page protected?           │
    └──┬──────────────────────┬────┘
       │                      │
      YES                     NO
       │                      │
       ▼                      ▼
    ┌──────────────┐   ┌──────────────┐
    │ Check auth   │   │ Render page  │
    └──┬───────┬───┘   └──────────────┘
       │       │
   LOGGED  NOT LOGGED
   IN (Yes) IN (No)
    │       │
    ▼       ▼
┌────────┐ ┌────────────────────────────┐
│Render  │ │1. Show error toast         │
│page    │ │2. Redirect to login        │
└────────┘ │3. Display login form       │
           └─────────┬──────────────────┘
                     ▼
           ┌──────────────────────────┐
           │User enters credentials   │
           └──────────┬───────────────┘
                      ▼
           ┌──────────────────────────┐
           │login() called            │
           │- Create user object      │
           │- Save to localStorage    │
           │- Set isAuthenticated true│
           └──────────┬───────────────┘
                      ▼
           ┌──────────────────────────┐
           │Show success toast        │
           │Navigate to dashboard     │
           └──────────┬───────────────┘
                      ▼
           ┌──────────────────────────┐
           │User can access all pages │
           │including protected ones  │
           └──────────┬───────────────┘
                      ▼
           ┌──────────────────────────┐
           │User clicks logout        │
           │logout() called           │
           │- Clear localStorage      │
           │- Set user = null         │
           │- Set isAuth = false      │
           └──────────┬───────────────┘
                      ▼
           ┌──────────────────────────┐
           │Back to unauthenticated   │
           │state (top of diagram)    │
           └──────────────────────────┘
```

---

## 🛡️ Protected Page Access Flow

```
User clicks on protected page (e.g., Cart, Dashboard)
        ↓
handleNavigate("cart") called
        ↓
┌──────────────────────────────────────────┐
│ Check: Is "cart" in PROTECTED_PAGES?     │
└──┬──────────────────────────────┬────────┘
   │                              │
  YES                             NO
   │                              │
   ▼                              ▼
┌──────────────────┐       ┌────────────────┐
│Check: isAuthenticat│   │Proceed with     │
│  ed === true?      │   │navigation       │
└──┬────────┬────────┘   └────────────────┘
   │        │
  YES      NO
   │        │
   ▼        ▼
┌──────┐  ┌────────────────────┐
│Render   │ toast.error()        │
│page     │ setCurrentPage()     │
└──────┘  │ navigate to "login"  │
          └───────────┬──────────┘
                      ▼
          ┌─────────────────────┐
          │LoginPage rendered   │
          │User sees login form │
          └──────────┬──────────┘
                     ▼
          ┌─────────────────────┐
          │After successful     │
          │login, try again:    │
          │handleNavigate("cart")│
          └──────────┬──────────┘
                     ▼
          ┌─────────────────────┐
          │Now isAuth = true    │
          │CartPage renders     │
          └─────────────────────┘
```

---

## 🔀 Component-Level Protection

```
Protected Page Component Flow
┌─────────────────────────────────────┐
│ export function CartPage({...})     │
├─────────────────────────────────────┤
│ const { isAuthenticated } = useAuth()│
│                                     │
│ useEffect(() => {                   │
│   if (!isAuthenticated) {           │
│     onNavigate("login")             │
│   }                                 │
│ }, [isAuthenticated, onNavigate])   │
│                                     │
│ if (!isAuthenticated) {             │
│   return null  ← Don't render       │
│ }                                   │
│                                     │
│ return (                            │
│   <div>                             │
│     {/* Page Content */}            │
│   </div>                            │
│ )                                   │
└─────────────────────────────────────┘

Timeline:
┌──────┬──────┬──────┬──────┬──────────────┐
│Mount │Check │Effect│Return│Render Normal │
│Comp │Auth  │Runs  │null  │Content       │
├──────┼──────┼──────┼──────┼──────────────┤
│1     │2     │3     │4     │5             │
│      │      │      │      │              │
│(if   │Yes   │Check │Yes   │Render page   │
│ not  │(if   │passed│render content       │
│ auth) already│     │      │              │
│      │logged)      │      │              │
│      │      │Redirect if│Not rendered  │
│      │      │not auth   │(returns null)│
└──────┴──────┴──────┴──────┴──────────────┘
```

---

## 💾 Session Storage

```
LocalStorage Structure
┌─────────────────────────────────────┐
│ Browser LocalStorage                │
├─────────────────────────────────────┤
│ Key: "ornamisUser"                  │
│ Value: {                            │
│   name: "John",                     │
│   email: "john@example.com",        │
│   role: "customer"                  │
│ }                                   │
│                                     │
│ Created: On login/signup            │
│ Updated: On role change             │
│ Deleted: On logout                  │
│ Persisted: Across page refreshes    │
└─────────────────────────────────────┘

Lifecycle:
┌─────────────────────────────────────┐
│ AuthContext useEffect on mount:     │
│                                     │
│ 1. Check if "ornamisUser" exists    │
│ 2. If exists → Parse & load user    │
│ 3. If not → user = null             │
│ 4. Set isAuthenticated accordingly  │
└─────────────────────────────────────┘
```

---

## 🎯 Page Access Matrix

```
                   Unauthenticated    Authenticated
                   User               User
┌──────────────────┬──────────────┬─────────────────┐
│ Home             │ ✅ Access    │ ✅ Access       │
├──────────────────┼──────────────┼─────────────────┤
│ Collections      │ ✅ Access    │ ✅ Access       │
├──────────────────┼──────────────┼─────────────────┤
│ About            │ ✅ Access    │ ✅ Access       │
├──────────────────┼──────────────┼─────────────────┤
│ Stores           │ ✅ Access    │ ✅ Access       │
├──────────────────┼──────────────┼─────────────────┤
│ Login            │ ✅ Access    │ ✅ Redirect     │
│                  │              │ to home         │
├──────────────────┼──────────────┼─────────────────┤
│ Sign Up          │ ✅ Access    │ ✅ Redirect     │
│                  │              │ to home         │
├──────────────────┼──────────────┼─────────────────┤
│ Dashboard        │ ❌ Redirect  │ ✅ Access       │
│                  │ to login     │                 │
├──────────────────┼──────────────┼─────────────────┤
│ Wishlist         │ ❌ Redirect  │ ✅ Access       │
│                  │ to login     │                 │
├──────────────────┼──────────────┼─────────────────┤
│ Cart             │ ❌ Redirect  │ ✅ Access       │
│                  │ to login     │                 │
├──────────────────┼──────────────┼─────────────────┤
│ AI Designer      │ ❌ Locked    │ ✅ Access       │
│                  │ screen       │                 │
├──────────────────┼──────────────┼─────────────────┤
│ AR Try-On        │ ❌ Locked    │ ✅ Access       │
│                  │ screen       │                 │
└──────────────────┴──────────────┴─────────────────┘

Legend:
✅ Access    = Full access, page renders
❌ Redirect  = Automatic redirect to login
❌ Locked    = Locked screen explaining auth needed
```

---

## 🔗 Data Flow

```
App State Update
    ↓
User Action (click, navigate)
    ↓
handleNavigate(page) called
    ↓
┌────────────────────────────────┐
│ handleNavigate() logic         │
│                                │
│ if PROTECTED_PAGES and !auth   │
│   → Show toast error           │
│   → Set currentPage = "login"  │
│   → Return (don't navigate)    │
│                                │
│ else                           │
│   → Set currentPage = page     │
│   → Continue normally          │
└────────────────────────────────┘
    ↓
React renders renderPage()
    ↓
┌────────────────────────────────┐
│ renderPage() returns:          │
│                                │
│ if protected:                  │
│   <ProtectedRoute>             │
│     <PageComponent />          │
│   </ProtectedRoute>            │
│                                │
│ else:                          │
│   <PageComponent />            │
└────────────────────────────────┘
    ↓
ProtectedRoute checks isAuthenticated
    ↓
│ if !isAuthenticated            │
│   → onNavigate("login")        │
│   → return null                │
│                                │
│ else                           │
│   → return children            │
└────────────────────────────────┘
    ↓
Page Component renders or LoginPage shows
```

---

## ✨ Summary

The multi-layered approach ensures:
1. **App-Level**: handleNavigate prevents navigation
2. **Component-Level**: useEffect redirects if auth missing
3. **Route-Level**: ProtectedRoute prevents rendering
4. **User-Facing**: Toast + UI provides clear feedback

This triple-layer protection makes the system robust and user-friendly!
