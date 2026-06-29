import { useState } from "react";
import { motion } from "motion/react";
import { Eye, EyeOff, Mail, Lock, LogIn, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Separator } from "../ui/separator";
import { OrnamisLogo } from "../OrnamisLogo";
import { BackButton } from "../BackButton";
import { signInCustomer, signInSeller, signInAdmin, sendPasswordReset, signInWithGoogle, AuthenticationError } from "../../services/authService";

import type { UserRole } from "../../lib/firebaseClient";

interface LoginPageProps {
  onLoginSuccess: (email: string, role: UserRole) => void;
  onNavigate: (page: string) => void;
  onBack?: () => void;
}

export function LoginPage({ onLoginSuccess, onNavigate, onBack }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>("customer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      let authUser;

      // Call appropriate sign-in function based on selected role
      if (role === "customer") {
        authUser = await signInCustomer(email, password);
      } else if (role === "seller") {
        authUser = await signInSeller(email, password);
      } else if (role === "admin") {
        authUser = await signInAdmin(email, password);
      }

      if (authUser) {
        onLoginSuccess(authUser.user.email || email, authUser.profile.role);
      }
    } catch (err) {
      if (err instanceof AuthenticationError) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address first");
      return;
    }

    setLoading(true);
    setError("");
    setResetSent(false);

    try {
      await sendPasswordReset(email);
      setResetSent(true);
      setError("");
    } catch (err) {
      if (err instanceof AuthenticationError) {
        setError(err.message);
      } else {
        setError("Failed to send reset email. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleError("");
    setGoogleLoading(true);
    try {
      // Firebase uses a popup — returns AuthUser directly, no redirect
      const authUser = await signInWithGoogle();
      onLoginSuccess(authUser.user.email || "", authUser.profile.role);
    } catch (err) {
      setGoogleLoading(false);
      if (err instanceof AuthenticationError) {
        setGoogleError(err.message);
      } else {
        setGoogleError("Failed to connect to Google. Please try again.");
      }
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4"
      style={{
        backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 1440 1134\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(4.4087e-15 56.7 -72 3.4719e-15 720 567)\\'><stop stop-color=\\'rgba(246,243,240,1)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(213,204,191,1)\\' offset=\\'0.5\\'/><stop stop-color=\\'rgba(181,164,143,1)\\' offset=\\'1\\'/></radialGradient></defs></svg>')"
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Navigation Buttons */}
        <div className="flex items-center gap-3 mb-6">
          <BackButton label="Back" onClick={onBack} />
          <BackButton onNavigate={onNavigate} targetPage="home" label="Home" type="home" />
        </div>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <OrnamisLogo size={100} showText={true} variant="full" />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            "Step into a world where style meets elevation—your journey begins here."
          </p>
        </div>

        <Card className="p-8 backdrop-blur-sm bg-white/95 shadow-xl">
          <Tabs value={role} onValueChange={(v: string) => setRole(v as UserRole)} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="customer">Customer</TabsTrigger>
              <TabsTrigger value="seller">Seller</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>

            <TabsContent value={role}>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Success Message */}
                {resetSent && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start gap-2">
                    <CheckCircle className="size-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Password reset email sent! Check your inbox.</span>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
                    <AlertCircle className="size-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" disabled={loading} />
                    <span className="text-gray-600">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-[#492f0e] hover:underline"
                    disabled={loading}
                  >
                    Forgot password?
                  </button>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#b39978] to-[#492f0e] hover:from-[#9a8567] hover:to-[#362312] text-white"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="mr-2 size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 size-5" />
                      Sign In
                    </>
                  )}
                </Button>
              </form>

              <Separator className="my-6" />

              {/* Google Sign-In */}
              {googleError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2 mb-3">
                  <AlertCircle className="size-5 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{googleError}</span>
                </div>
              )}

              <button
                type="button"
                id="google-signin-btn"
                onClick={handleGoogleLogin}
                disabled={googleLoading || loading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed text-sm font-medium text-gray-700"
              >
                {googleLoading ? (
                  <div className="size-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                ) : (
                  /* Official Google G logo */
                  <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                )}
                {googleLoading ? "Connecting to Google…" : "Continue with Google"}
              </button>

              <div className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  onClick={() => onNavigate("signup")}
                  className="text-[#492f0e] hover:underline"
                  disabled={loading}
                >
                  Sign up
                </button>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </motion.div>
    </div>
  );
}