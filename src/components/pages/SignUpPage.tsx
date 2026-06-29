import { useState } from "react";
import { motion } from "motion/react";
import { Eye, EyeOff, Mail, Lock, UserPlus, AlertCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Separator } from "../ui/separator";
import { OrnamisLogo } from "../OrnamisLogo";
import { BackButton } from "../BackButton";
import { signUpCustomer, signUpSeller, AuthenticationError } from "../../services/authService";

interface SignUpPageProps {
  onSignupSuccess: (message: string) => void;
  onNavigate: (page: string) => void;
  onBack?: () => void;
}

export function SignUpPage({ onSignupSuccess, onNavigate, onBack }: SignUpPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState<"customer" | "seller">("customer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      if (role === "customer") {
        await signUpCustomer(email, password);
        onSignupSuccess(
          "Account created! Please check your email to verify your account before logging in."
        );
      } else if (role === "seller") {
        await signUpSeller(email, password);
        onSignupSuccess(
          "Seller account created! Your account is pending approval. You will receive an email once approved."
        );
      }
    } catch (err) {
      if (err instanceof AuthenticationError) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
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
          <div className="text-center mb-6">
            <h2 className="text-[#492f0e]">Create Account</h2>
            <p className="text-sm text-gray-600">Join the ORNAMIS community</p>
          </div>

          <Tabs value={role} onValueChange={setRole} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="customer">Customer</TabsTrigger>
              <TabsTrigger value="seller">Seller</TabsTrigger>
            </TabsList>

            <TabsContent value={role}>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
                    <AlertCircle className="size-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                {/* Seller Info Banner */}
                {role === "seller" && (
                  <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg">
                    <p className="text-sm font-medium mb-1">Seller Account Approval Required</p>
                    <p className="text-xs">
                      Your seller account will be reviewed by our admin team. You will receive an email once approved and can then log in to start selling.
                    </p>
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
                  <p className="text-xs text-gray-500 mt-1">At least 6 characters</p>
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      disabled={loading}
                    >
                      {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
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
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 size-5" />
                      Create Account
                    </>
                  )}
                </Button>
              </form>

              <Separator className="my-6" />

              <div className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={() => onNavigate("login")}
                  className="text-[#492f0e] hover:underline"
                  disabled={loading}
                >
                  Sign in
                </button>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </motion.div>
    </div>
  );
}