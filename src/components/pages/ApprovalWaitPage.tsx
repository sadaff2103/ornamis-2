import { useState } from "react";
import { motion } from "motion/react";
import { Clock, Store, LogOut, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "../ui/button";
import { OrnamisLogo } from "../OrnamisLogo";
import { useAuth } from "../../contexts/AuthContext";
import { requestSellerRole, AuthenticationError } from "../../services/authService";

interface ApprovalWaitPageProps {
    onNavigate: (page: string) => void;
}

/**
 * ApprovalWaitPage
 * Shown to:
 * - Pending sellers waiting for admin approval
 * - Google-login customers who want to become sellers (can request here)
 */
export function ApprovalWaitPage({ onNavigate }: ApprovalWaitPageProps) {
    const { user, logout, refreshUser } = useAuth();
    const [requesting, setRequesting] = useState(false);
    const [requestSent, setRequestSent] = useState(false);
    const [error, setError] = useState("");

    const isPendingSeller =
        user?.role === "seller" && user?.seller_status === "pending";
    const isCustomer = user?.role === "customer";

    const handleRequestSellerRole = async () => {
        if (!user) return;
        setError("");
        setRequesting(true);

        try {
            await requestSellerRole(user.id);
            await refreshUser();
            setRequestSent(true);
        } catch (err) {
            if (err instanceof AuthenticationError) {
                setError(err.message);
            } else {
                setError("Failed to submit request. Please try again.");
            }
        } finally {
            setRequesting(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        onNavigate("home");
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center py-16 px-4"
            style={{
                background:
                    "radial-gradient(ellipse at center, #f6f3f0 0%, #d5ccbf 55%, #b5a48f 100%)",
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <OrnamisLogo size={90} showText={true} variant="full" />
                    </div>
                </div>

                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center">
                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                        <div className="size-16 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center">
                            <Clock className="size-8 text-amber-500" />
                        </div>
                    </div>

                    {/* — Pending Seller View — */}
                    {isPendingSeller && (
                        <>
                            <h1 className="text-xl font-bold text-[#492f0e] mb-2">
                                Application Under Review
                            </h1>
                            <p className="text-gray-600 text-sm leading-relaxed mb-6">
                                Your seller application has been submitted and is being reviewed
                                by our team. You'll be notified once it's approved.
                            </p>
                            <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800 mb-6">
                                Typical review time: <strong>1–2 business days</strong>
                            </div>
                        </>
                    )}

                    {/* — Customer View (wants to become seller) — */}
                    {isCustomer && !requestSent && (
                        <>
                            <h1 className="text-xl font-bold text-[#492f0e] mb-2">
                                Become a Seller on ORNAMIS
                            </h1>
                            <p className="text-gray-600 text-sm leading-relaxed mb-6">
                                You're currently logged in as a customer. Apply below to open
                                your own jewelry store on ORNAMIS. Your application will be
                                reviewed by an admin.
                            </p>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2 mb-4 text-left">
                                    <AlertCircle className="size-4 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm">{error}</span>
                                </div>
                            )}

                            <Button
                                onClick={handleRequestSellerRole}
                                disabled={requesting}
                                className="w-full bg-gradient-to-r from-[#b39978] to-[#492f0e] hover:from-[#9a8567] hover:to-[#362312] text-white mb-3"
                                size="lg"
                            >
                                {requesting ? (
                                    <>
                                        <div className="mr-2 size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Submitting…
                                    </>
                                ) : (
                                    <>
                                        <Store className="mr-2 size-5" />
                                        Apply to Become a Seller
                                    </>
                                )}
                            </Button>
                        </>
                    )}

                    {/* — Request Sent Confirmation — */}
                    {isCustomer && requestSent && (
                        <>
                            <h1 className="text-xl font-bold text-[#492f0e] mb-2">
                                Application Submitted!
                            </h1>
                            <div className="flex justify-center mb-4">
                                <CheckCircle className="size-12 text-green-500" />
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed mb-6">
                                Your seller application is now under review. We'll notify you
                                once approved. You can continue shopping as a customer in the
                                meantime.
                            </p>
                        </>
                    )}

                    {/* Action buttons — always shown */}
                    <div className="flex flex-col gap-2 mt-2">
                        <Button
                            variant="outline"
                            onClick={() => onNavigate("home")}
                            className="w-full border-[#b39978] text-[#492f0e] hover:bg-[#f6f3f0]"
                        >
                            Continue as Customer
                        </Button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700 py-2"
                        >
                            <LogOut className="size-4" />
                            Log Out
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
