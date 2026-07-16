/**
 * Authentication Service — Firebase Realtime Database Edition
 * Uses Firebase Auth + Realtime Database (no billing required)
 */

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged as firebaseOnAuthStateChanged,
    type User,
} from 'firebase/auth';
import { ref, get, set, update } from 'firebase/database';
import { auth, db } from '../lib/firebaseClient';
import type { UserRole, Profile, AuthUser } from '../lib/firebaseClient';

// ─── Custom Error ─────────────────────────────────────────────────────────────

export class AuthenticationError extends Error {
    constructor(
        message: string,
        public code: string,
        public details?: unknown
    ) {
        super(message);
        this.name = 'AuthenticationError';
    }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function fetchProfile(uid: string): Promise<Profile | null> {
    const snap = await get(ref(db, `profiles/${uid}`));
    if (!snap.exists()) return null;
    return snap.val() as Profile;
}

async function createProfile(
    uid: string,
    email: string,
    role: UserRole,
    sellerStatus: Profile['seller_status'] = null,
    fullName?: string
): Promise<Profile> {
    const now = new Date().toISOString();
    const profile: Profile = {
        id: uid,
        email,
        role,
        seller_status: sellerStatus,
        created_at: now,
        updated_at: now,
        ...(fullName ? { full_name: fullName } : {}),
    };
    await set(ref(db, `profiles/${uid}`), profile);
    return profile;
}

// ─── Customer Auth ────────────────────────────────────────────────────────────

export async function signUpCustomer(email: string, password: string): Promise<AuthUser> {
    try {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        const profile = await createProfile(user.uid, email, 'customer');
        return { user, profile };
    } catch (err: unknown) {
        const e = err as { code?: string };
        throw new AuthenticationError(friendlyMessage(e.code), e.code || 'SIGNUP_ERROR', err);
    }
}

export async function signInCustomer(email: string, password: string): Promise<AuthUser> {
    return signInWithRole(email, password, 'customer');
}

// ─── Seller Auth ──────────────────────────────────────────────────────────────

export async function signUpSeller(
    email: string,
    password: string
): Promise<{ user: User; requiresApproval: boolean }> {
    try {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        await createProfile(user.uid, email, 'seller', 'pending');
        await firebaseSignOut(auth);
        return { user, requiresApproval: true };
    } catch (err: unknown) {
        const e = err as { code?: string };
        throw new AuthenticationError(friendlyMessage(e.code), e.code || 'SIGNUP_ERROR', err);
    }
}

export async function signInSeller(email: string, password: string): Promise<AuthUser> {
    let user: User;
    try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        user = cred.user;
    } catch (err: unknown) {
        const e = err as { code?: string };
        throw new AuthenticationError(friendlyMessage(e.code), e.code || 'SIGNIN_ERROR', err);
    }

    const profile = await fetchProfile(user.uid);
    if (!profile) {
        await firebaseSignOut(auth);
        throw new AuthenticationError('Profile not found', 'PROFILE_NOT_FOUND');
    }
    if (profile.role !== 'seller') {
        await firebaseSignOut(auth);
        throw new AuthenticationError(`Invalid role. Please use the ${profile.role} login tab.`, 'ROLE_MISMATCH');
    }
    if (profile.seller_status !== 'approved') {
        await firebaseSignOut(auth);
        const msgs = {
            pending: 'Your seller account is pending approval. Please wait for admin approval.',
            rejected: 'Your seller account has been rejected. Please contact support.',
        };
        throw new AuthenticationError(
            msgs[profile.seller_status as 'pending' | 'rejected'] || 'Seller account not approved',
            'SELLER_NOT_APPROVED'
        );
    }
    return { user, profile };
}

// ─── Admin Auth ───────────────────────────────────────────────────────────────

export async function signInAdmin(email: string, password: string): Promise<AuthUser> {
    return signInWithRole(email, password, 'admin');
}

// ─── Role-validated sign-in ───────────────────────────────────────────────────

async function signInWithRole(email: string, password: string, expectedRole: UserRole): Promise<AuthUser> {
    let user: User;
    try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        user = cred.user;
    } catch (err: unknown) {
        const e = err as { code?: string };
        throw new AuthenticationError(friendlyMessage(e.code), e.code || 'SIGNIN_ERROR', err);
    }

    let profile = await fetchProfile(user.uid);
    if (!profile) {
        // Automatically create a profile if it doesn't exist yet
        // (Handles users created manually in Firebase Console or migrated from Supabase)
        profile = await createProfile(
            user.uid, 
            user.email!, 
            expectedRole, 
            expectedRole === 'seller' ? 'pending' : null
        );
    }
    if (profile.role !== expectedRole) {
        await firebaseSignOut(auth);
        throw new AuthenticationError(
            `Invalid role. Please use the ${profile.role} login tab.`,
            'ROLE_MISMATCH',
            { expected: expectedRole, actual: profile.role }
        );
    }
    return { user, profile };
}

// ─── Google OAuth ─────────────────────────────────────────────────────────────

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

export async function signInWithGoogle(): Promise<AuthUser> {
    try {
        const { user } = await signInWithPopup(auth, googleProvider);
        let profile = await fetchProfile(user.uid);
        if (!profile) {
            profile = await createProfile(user.uid, user.email!, 'customer', null, user.displayName || undefined);
        }
        return { user, profile };
    } catch (err: unknown) {
        const e = err as { code?: string };
        if (e.code === 'auth/popup-closed-by-user') {
            throw new AuthenticationError('Sign-in was cancelled.', 'POPUP_CLOSED');
        }
        throw new AuthenticationError(friendlyMessage(e.code), e.code || 'GOOGLE_AUTH_ERROR', err);
    }
}

// ─── OAuth callback (no-op — popup already completed) ────────────────────────

export async function handleOAuthCallback(): Promise<AuthUser> {
    const user = auth.currentUser;
    if (!user) throw new AuthenticationError('No user found after OAuth', 'OAUTH_SESSION_MISSING');
    const profile = await fetchProfile(user.uid);
    if (!profile) throw new AuthenticationError('Profile not found', 'PROFILE_NOT_FOUND');
    return { user, profile };
}

// ─── Session helpers ──────────────────────────────────────────────────────────

export async function getCurrentAuthUser(): Promise<AuthUser | null> {
    const user = auth.currentUser;
    if (!user) return null;
    const profile = await fetchProfile(user.uid);
    if (!profile) return null;
    return { user, profile };
}

export async function refreshProfile(userId: string): Promise<Profile | null> {
    return fetchProfile(userId);
}

export async function signOut(): Promise<void> {
    await firebaseSignOut(auth);
}

export async function sendPasswordReset(email: string): Promise<void> {
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (err: unknown) {
        const e = err as { code?: string };
        throw new AuthenticationError('Failed to send password reset email', e.code || 'PASSWORD_RESET_ERROR', err);
    }
}

export async function requestSellerRole(userId: string): Promise<void> {
    await update(ref(db, `profiles/${userId}`), {
        role: 'seller',
        seller_status: 'pending',
        updated_at: new Date().toISOString(),
    });
}

export function onAuthStateChange(callback: (user: User | null) => void): () => void {
    return firebaseOnAuthStateChanged(auth, callback);
}

// ─── Error messages ───────────────────────────────────────────────────────────

function friendlyMessage(code?: string): string {
    const map: Record<string, string> = {
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/invalid-credential': 'Invalid login credentials.',
        'auth/email-already-in-use': 'An account with this email already exists.',
        'auth/weak-password': 'Password must be at least 6 characters.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/too-many-requests': 'Too many attempts. Please try again later.',
        'auth/network-request-failed': 'Network error. Please check your internet connection.',
    };
    return map[code || ''] || 'An unexpected error occurred. Please try again.';
}
