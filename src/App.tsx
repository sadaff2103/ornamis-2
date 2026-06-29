import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { IntroScreen } from "./components/IntroScreen";
import { LayoutToggle } from "./components/LayoutToggle";
import { GoldPricingQuickStart } from "./components/GoldPricingQuickStart";
import { HomePage } from "./components/pages/HomePage";
import { HomePageMinimal } from "./components/pages/HomePageMinimal";
import { AllJewelryCatalogPage } from "./components/pages/AllJewelryCatalogPage";
import { RingsCatalogPage } from "./components/pages/RingsCatalogPage";
import { NecklacesCatalogPage } from "./components/pages/NecklacesCatalogPage";
import { BraceletsCatalogPage } from "./components/pages/BraceletsCatalogPage";
import { EarringsCatalogPage } from "./components/pages/EarringsCatalogPage";
import { AboutPage } from "./components/pages/AboutPage";
import { AIChatDesigner } from "./components/pages/AIChatDesigner";

import { LoginPage } from "./components/pages/LoginPage";
import { SignUpPage } from "./components/pages/SignUpPage";
import { CustomerDashboard } from "./components/pages/CustomerDashboard";
import { SellerDashboard } from "./components/pages/SellerDashboard";
import { AdminDashboard } from "./components/pages/AdminDashboard";
import { SettingsPage } from "./components/pages/SettingsPage";
import { WishlistPage } from "./components/pages/WishlistPage";
import { CartPage } from "./components/pages/CartPage";
import { PaymentPage } from "./components/pages/PaymentPage";
import { StoresPage } from "./components/pages/StoresPage";
import { KhansStorePage } from "./components/pages/KhansStorePage";
import { GivaStorePage } from "./components/pages/GivaStorePage";
import { PalmonasStorePage } from "./components/pages/PalmonasStorePage";
import { JauhariStorePage } from "./components/pages/JauhariStorePage";
import { JauhariTryOnPage } from "./components/pages/JauhariTryOnPage";
import { UniversalTryOnPage } from "./components/pages/UniversalTryOnPage.tsx";
import { ProductDetailPage } from "./components/pages/ProductDetailPage";

import { StudyAboutOrnaments } from "./components/pages/StudyAboutOrnaments";
import { SearchResultsPage } from "./components/pages/SearchResultsPage";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { AnimatePresence } from "motion/react";
import { ShopProvider } from "./contexts/ShopContext";
import { GoldPriceProvider } from "./contexts/GoldPriceContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { OAuthCallbackPage } from "./components/pages/OAuthCallbackPage";
import { ApprovalWaitPage } from "./components/pages/ApprovalWaitPage";
import { BookingProvider } from "./contexts/BookingContext";


type Page =
  | "home"
  | "collections"
  | "product"
  | "rings"
  | "necklaces"
  | "earrings"
  | "bracelets"
  | "ai-designer"
  | "ar-tryon"
  | "about"
  | "stores"
  | "khans"
  | "giva"
  | "palmonas"
  | "jauhari"
  | "jauhari-tryon"
  | "universal-tryon"
  | "study-ornaments"

  | "login"
  | "signup"
  | "auth-callback"
  | "approval-wait"
  | "dashboard"
  | "orders"
  | "settings"
  | "wishlist"
  | "cart"
  | "payment"
  | "privacy"
  | "terms"
  | "search";

// Pages that require authentication
const PROTECTED_PAGES = new Set<Page>([
  "dashboard",
  "wishlist",
  "cart",
  "payment",
  "orders",
  "settings",
]);

function AppContent() {
  const { user, isAuthenticated, isLoading, logout: authLogout } = useAuth();
  const [showIntro, setShowIntro] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [selectedBrandId, setSelectedBrandId] = useState<string>("");
  const [useMinimalLayout, setUseMinimalLayout] = useState(false);
  const [paymentItems, setPaymentItems] = useState<any[]>([]);

  const [scrollPositions, setScrollPositions] = useState<Record<string, number>>({});
  const [navigationHistory, setNavigationHistory] = useState<Page[]>(["home"]);

  // Detect OAuth redirect (Supabase puts access_token in URL hash or code in query)
  useEffect(() => {
    const hash = window.location.hash;
    const search = window.location.search;
    const isOAuthReturn =
      hash.includes('access_token') ||
      hash.includes('error_description') ||
      search.includes('code=') ||
      search.includes('error=');

    if (isOAuthReturn) {
      setCurrentPage("auth-callback");
    }
  }, []);

  useEffect(() => {
    // Auto-hide intro after 5.8 seconds (3 slides × 1.8s + 0.4s buffer)
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 5800);

    return () => clearTimeout(timer);
  }, []);

  const handleNavigate = (page: string, params?: any) => {
    // Save current scroll position before navigating
    setScrollPositions(prev => ({
      ...prev,
      [currentPage]: window.scrollY
    }));

    // Store productId if navigating to product page or try-on page
    if ((page === "product" || page === "jauhari-tryon" || page === "universal-tryon" || page === "ar-tryon") && params?.productId) {
      setSelectedProductId(params.productId);
      if (params.brandId) setSelectedBrandId(params.brandId);
      console.log("Navigating to", page, "with product:", params.productId, "brand:", params.brandId);
    }

    // Store booking items if navigating to payment page
    if (page === "payment" && params?.items) {
      setPaymentItems(params.items);
    }


    // Check if the page requires authentication
    if (PROTECTED_PAGES.has(page as Page) && !isAuthenticated) {
      toast.error("You need to be logged in to access this page.");
      setCurrentPage("login");
      return;
    }

    setShowIntro(false);
    setCurrentPage(page as Page);

    // Add to navigation history
    setNavigationHistory(prev => [...prev, page as Page]);

    // Restore scroll position after a brief delay to ensure page is rendered
    setTimeout(() => {
      const savedPosition = scrollPositions[page];
      if (savedPosition !== undefined) {
        window.scrollTo(0, savedPosition);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 100);
  };

  const handleBack = () => {
    if (navigationHistory.length > 1) {
      // Remove current page from history
      const newHistory = [...navigationHistory];
      newHistory.pop();

      // Get previous page
      const previousPage = newHistory[newHistory.length - 1];

      // Update state
      setNavigationHistory(newHistory);
      setCurrentPage(previousPage);

      // Restore scroll position
      setTimeout(() => {
        const savedPosition = scrollPositions[previousPage];
        if (savedPosition !== undefined) {
          window.scrollTo(0, savedPosition);
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 100);
    } else {
      // If no history, go to home
      handleNavigate("home");
    }
  };

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  const handleLoginSuccess = (_email: string, role: string, sellerStatus?: string | null) => {
    // Clear OAuth params from URL so they don't trigger re-detection on refresh
    if (window.history.replaceState) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    if (role === 'admin') {
      toast.success(`Welcome, Admin! You have full access.`);
      setCurrentPage("dashboard");
    } else if (role === 'seller' && sellerStatus === 'approved') {
      toast.success(`Welcome back! Redirecting to your Seller Dashboard.`);
      setCurrentPage("dashboard");
    } else if (role === 'seller' && sellerStatus === 'pending') {
      toast.info("Your seller account is pending approval.");
      setCurrentPage("approval-wait");
    } else {
      // customer (or fallback)
      toast.success(`Welcome back! You've successfully signed in.`);
      setCurrentPage("home");
    }
  };

  const handleSignupSuccess = (message: string) => {
    toast.success(message);
    setCurrentPage("login");
  };

  const handleLogout = async () => {
    try {
      await authLogout();
      toast.info("You've been logged out. See you soon!");
      setCurrentPage("home");
    } catch (error) {
      toast.error("Failed to log out. Please try again.");
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return useMinimalLayout ? <HomePageMinimal onNavigate={handleNavigate} onBack={handleBack} /> : <HomePage onNavigate={handleNavigate} onBack={handleBack} />;
      case "collections":
        return <AllJewelryCatalogPage onNavigate={handleNavigate} onBack={handleBack} />;
      case "product":
        return <ProductDetailPage key={selectedProductId} productId={selectedProductId} onNavigate={handleNavigate} onBack={handleBack} />;
      case "rings":
        return <RingsCatalogPage onNavigate={handleNavigate} onBack={handleBack} />;
      case "necklaces":
        return <NecklacesCatalogPage onNavigate={handleNavigate} onBack={handleBack} />;
      case "bracelets":
        return <BraceletsCatalogPage onNavigate={handleNavigate} onBack={handleBack} />;
      case "earrings":
        return <EarringsCatalogPage onNavigate={handleNavigate} onBack={handleBack} />;
      case "ai-designer":
        return <AIChatDesigner onNavigate={handleNavigate} onBack={handleBack} />;
      case "ar-tryon":
      case "universal-tryon":
        return <UniversalTryOnPage onBack={handleBack} brandId={selectedBrandId} productId={selectedProductId} />;

      case "login":
        return <LoginPage onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate} onBack={handleBack} />;
      case "signup":
        return <SignUpPage onSignupSuccess={handleSignupSuccess} onNavigate={handleNavigate} onBack={handleBack} />;
      case "auth-callback":
        return <OAuthCallbackPage onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate} />;
      case "approval-wait":
        return <ApprovalWaitPage onNavigate={handleNavigate} />;

      case "dashboard":
        return (
          <ProtectedRoute onNavigate={handleNavigate} requiresAuth={true}>
            {user?.role === 'admin' ? (
              <AdminDashboard user={user} onNavigate={handleNavigate} onBack={handleBack} />
            ) : user?.role === 'seller' ? (
              <SellerDashboard user={user} onNavigate={handleNavigate} onBack={handleBack} />
            ) : user ? (
              <CustomerDashboard user={user} onNavigate={handleNavigate} onBack={handleBack} />
            ) : null}
          </ProtectedRoute>
        );
      case "about":
        return <AboutPage onNavigate={handleNavigate} onBack={handleBack} />;
      case "stores":
        return <StoresPage onNavigate={handleNavigate} onBack={handleBack} />;
      case "khans":
        return <KhansStorePage onNavigate={handleNavigate} onBack={handleBack} />;
      case "giva":
        return <GivaStorePage onNavigate={handleNavigate} onBack={handleBack} />;
      case "palmonas":
        return <PalmonasStorePage onNavigate={handleNavigate} onBack={handleBack} />;
      case "jauhari":
        return <JauhariStorePage onNavigate={handleNavigate} onBack={handleBack} />;
      case "jauhari-tryon":
        return <JauhariTryOnPage onNavigate={handleNavigate} onBack={handleBack} initialProductId={selectedProductId} />;

      case "study-ornaments":

        return <StudyAboutOrnaments onNavigate={handleNavigate} onBack={handleBack} />;
      case "wishlist":
        return (
          <ProtectedRoute onNavigate={handleNavigate} requiresAuth={true}>
            <WishlistPage onNavigate={handleNavigate} onBack={handleBack} />
          </ProtectedRoute>
        );
      case "cart":
        return (
          <ProtectedRoute onNavigate={handleNavigate} requiresAuth={true}>
            <CartPage onNavigate={handleNavigate} onBack={handleBack} />
          </ProtectedRoute>
        );
      case "payment":
        return (
          <ProtectedRoute onNavigate={handleNavigate} requiresAuth={true}>
            <PaymentPage
              onNavigate={handleNavigate}
              onBack={handleBack}
              items={paymentItems}
            />
          </ProtectedRoute>
        );
      case "settings":
        return (
          <ProtectedRoute onNavigate={handleNavigate} requiresAuth={true}>
            <SettingsPage onNavigate={handleNavigate} onBack={handleBack} />
          </ProtectedRoute>
        );
      case "search":
        return <SearchResultsPage onNavigate={handleNavigate} onBack={handleBack} />;
      case "privacy":
        return <PrivacyPage />;
      case "terms":
        return <TermsPage />;
      default:
        return <HomePage onNavigate={handleNavigate} onBack={handleBack} />;
    }
  };

  const showHeaderFooter = 
    currentPage !== "login" && 
    currentPage !== "signup" && 
    currentPage !== "payment" &&
    currentPage !== "ar-tryon" &&
    currentPage !== "universal-tryon";

  // Show loading screen while checking auth state
  if (isLoading && showIntro === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f6f3f0] via-[#d5ccbf] to-[#b5a48f]">
        <div className="text-center">
          <div className="size-16 border-4 border-[#492f0e]/20 border-t-[#492f0e] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#492f0e] font-medium">Loading ORNAMIS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AnimatePresence mode="wait">
        {showIntro ? (
          <IntroScreen key="intro" onComplete={handleIntroComplete} />
        ) : null}
      </AnimatePresence>

      {!showIntro && (
        <>
          {showHeaderFooter && (
            <Header
              onNavigate={handleNavigate}
              currentPage={currentPage}
              user={user}
              onLogout={handleLogout}
            />
          )}

          <main className="flex-1">{renderPage()}</main>

          {showHeaderFooter && <Footer onNavigate={handleNavigate} />}

          {/* Show layout toggle only on home page */}
          {currentPage === "home" && (
            <LayoutToggle
              isMinimal={useMinimalLayout}
              onToggle={() => setUseMinimalLayout(!useMinimalLayout)}
            />
          )}

          <GoldPricingQuickStart />
        </>
      )}

      <Toaster position="top-right" richColors />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <GoldPriceProvider>
          <ShopProvider>
            <AppContent />
          </ShopProvider>
        </GoldPriceProvider>
      </BookingProvider>
    </AuthProvider>
  );
}

// Placeholder components for remaining pages
function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="mb-8">Privacy Policy</h1>
        <div className="prose max-w-none">
          <p>This is a prototype application. No real user data is collected or stored.</p>
        </div>
      </div>
    </div>
  );
}

function TermsPage() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="mb-8">Terms & Conditions</h1>
        <div className="prose max-w-none">
          <p>This is a prototype application. Terms and conditions would be defined here.</p>
        </div>
      </div>
    </div>
  );
}