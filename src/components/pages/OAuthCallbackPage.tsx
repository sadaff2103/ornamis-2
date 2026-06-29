import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { AlertCircle } from "lucide-react";
import { OrnamisLogo } from "../OrnamisLogo";
import { AuthenticationError } from "../../services/authService";
import { auth, db } from "../../lib/firebaseClient";
import { ref, get } from "firebase/database";
import type { UserRole } from "../../lib/firebaseClient";

interface OAuthCallbackPageProps {
    onLoginSuccess: (email: string, role: UserRole, sellerStatus?: string | null) => void;
    onNavigate: (page: string) => void;
}

/**
 * OAuthCallbackPage
 * For Firebase, Google sign-in uses a popup (not a redirect),
 * so by the time this page renders, the user is already signed in.
 * We just read the current Firebase user + their Firestore profile.
 */
export function OAuthCallbackPage({ onLoginSuccess, onNavigate }: OAuthCallbackPageProps) {
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function processCallback() {
            try {
                const user = auth.currentUser;
                if (!user) {
                    throw new AuthenticationError(
                        "Sign-in was cancelled or failed. Please try again.",
                        "NO_USER"
                    );
                }

                const snap = await get(ref(db, `profiles/${user.uid}`));
                if (!snap.exists()) {
                    throw new AuthenticationError("Profile not found.", "PROFILE_NOT_FOUND");
                }
                const profile = snap.val() as { role: UserRole; seller_status?: string | null };

                if (!cancelled) {
                    onLoginSuccess(user.email ?? "", profile.role, profile.seller_status ?? null);
                }
            } catch (err) {
                if (cancelled) return;
                if (err instanceof AuthenticationError) {
                    setError(err.message);
                } else {
                    setError("Something went wrong during sign-in. Please try again.");
                }
            }
        }

        processCallback();
        return () => { cancelled = true; };
    }, [onLoginSuccess]);

    return (
        <div
            className="min-h-screen flex items-center justify-center"
            style={{
                background:
                    "radial-gradient(ellipse at center, #f6f3f0 0%, #d5ccbf 50%, #b5a48f 100%)",
            }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center max-w-sm mx-auto px-6"
            >
                <div className="flex justify-center mb-8">
                    <OrnamisLogo size={80} showText={true} variant="full" />
                </div>

                {error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex flex-col items-center gap-3">
                        <AlertCircle className="size-8 text-red-400" />
                        <p className="text-sm font-medium">{error}</p>
                        <button
                            onClick={() => onNavigate("login")}
                            className="mt-2 text-sm underline text-red-600 hover:text-red-800"
                        >
                            Back to Login
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4">
                        <div className="size-14 border-4 border-[#b39978]/30 border-t-[#492f0e] rounded-full animate-spin" />
                        <p className="text-[#492f0e] font-semibold text-lg">Signing you in…</p>
                        <p className="text-sm text-gray-500">Setting up your account, please wait.</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
