/**
 * Role Guard Service
 * Provides role-based access control utilities
 * Used to protect routes and features based on user role
 */

import { UserRole, Profile } from '../lib/firebaseClient';

// =====================================================
// Role Checking Functions
// =====================================================

/**
 * Check if user has required role
 */
export function hasRole(profile: Profile | null, requiredRole: UserRole): boolean {
    if (!profile) return false;
    return profile.role === requiredRole;
}

/**
 * Check if user has any of the required roles
 */
export function hasAnyRole(
    profile: Profile | null,
    requiredRoles: UserRole[]
): boolean {
    if (!profile) return false;
    return requiredRoles.includes(profile.role);
}

/**
 * Check if user is a customer
 */
export function isCustomer(profile: Profile | null): boolean {
    return hasRole(profile, 'customer');
}

/**
 * Check if user is a seller
 */
export function isSeller(profile: Profile | null): boolean {
    return hasRole(profile, 'seller');
}

/**
 * Check if user is an admin
 */
export function isAdmin(profile: Profile | null): boolean {
    return hasRole(profile, 'admin');
}

// =====================================================
// Seller Approval Checks
// =====================================================

/**
 * Check if seller is approved
 */
export function isApprovedSeller(profile: Profile | null): boolean {
    if (!profile || profile.role !== 'seller') return false;
    return profile.seller_status === 'approved';
}

/**
 * Check if seller is pending approval
 */
export function isPendingSeller(profile: Profile | null): boolean {
    if (!profile || profile.role !== 'seller') return false;
    return profile.seller_status === 'pending';
}

/**
 * Check if seller is rejected
 */
export function isRejectedSeller(profile: Profile | null): boolean {
    if (!profile || profile.role !== 'seller') return false;
    return profile.seller_status === 'rejected';
}

/**
 * Get seller status message
 */
export function getSellerStatusMessage(profile: Profile | null): string {
    if (!profile || profile.role !== 'seller') {
        return '';
    }

    switch (profile.seller_status) {
        case 'pending':
            return 'Your seller account is pending approval. You will be notified once approved.';
        case 'approved':
            return 'Your seller account is active.';
        case 'rejected':
            return 'Your seller account has been rejected. Please contact support for more information.';
        default:
            return '';
    }
}

// =====================================================
// Feature Access Control
// =====================================================

/**
 * Check if user can access customer features
 */
export function canAccessCustomerFeatures(profile: Profile | null): boolean {
    return isCustomer(profile);
}

/**
 * Check if user can access seller features
 * Requires both seller role AND approved status
 */
export function canAccessSellerFeatures(profile: Profile | null): boolean {
    return isApprovedSeller(profile);
}

/**
 * Check if user can access admin features
 */
export function canAccessAdminFeatures(profile: Profile | null): boolean {
    return isAdmin(profile);
}

// =====================================================
// Route Protection
// =====================================================

export interface RouteGuardResult {
    allowed: boolean;
    redirectTo?: string;
    message?: string;
}

/**
 * Guard customer routes
 */
export function guardCustomerRoute(profile: Profile | null): RouteGuardResult {
    if (!profile) {
        return {
            allowed: false,
            redirectTo: '/login',
            message: 'Please log in to access this page',
        };
    }

    if (!isCustomer(profile)) {
        return {
            allowed: false,
            redirectTo: '/',
            message: 'You do not have permission to access this page',
        };
    }

    return { allowed: true };
}

/**
 * Guard seller routes
 * Requires approved seller status
 */
export function guardSellerRoute(profile: Profile | null): RouteGuardResult {
    if (!profile) {
        return {
            allowed: false,
            redirectTo: '/login',
            message: 'Please log in to access this page',
        };
    }

    if (!isSeller(profile)) {
        return {
            allowed: false,
            redirectTo: '/',
            message: 'You do not have permission to access this page',
        };
    }

    if (!isApprovedSeller(profile)) {
        return {
            allowed: false,
            redirectTo: '/seller/pending',
            message: 'Your seller account is pending approval',
        };
    }

    return { allowed: true };
}

/**
 * Guard admin routes
 */
export function guardAdminRoute(profile: Profile | null): RouteGuardResult {
    if (!profile) {
        return {
            allowed: false,
            redirectTo: '/login',
            message: 'Please log in to access this page',
        };
    }

    if (!isAdmin(profile)) {
        return {
            allowed: false,
            redirectTo: '/',
            message: 'You do not have permission to access this page',
        };
    }

    return { allowed: true };
}

/**
 * Guard any authenticated route
 */
export function guardAuthenticatedRoute(profile: Profile | null): RouteGuardResult {
    if (!profile) {
        return {
            allowed: false,
            redirectTo: '/login',
            message: 'Please log in to access this page',
        };
    }

    return { allowed: true };
}

// =====================================================
// Role Display Utilities
// =====================================================

/**
 * Get user role display name
 */
export function getRoleDisplayName(role: UserRole): string {
    const roleNames: Record<UserRole, string> = {
        customer: 'Customer',
        seller: 'Seller',
        admin: 'Administrator',
    };
    return roleNames[role];
}

/**
 * Get role badge color (for UI)
 */
export function getRoleBadgeColor(role: UserRole): string {
    const colors: Record<UserRole, string> = {
        customer: 'blue',
        seller: 'green',
        admin: 'red',
    };
    return colors[role];
}

/**
 * Get seller status badge color (for UI)
 */
export function getSellerStatusBadgeColor(
    status: 'pending' | 'approved' | 'rejected'
): string {
    const colors = {
        pending: 'yellow',
        approved: 'green',
        rejected: 'red',
    };
    return colors[status];
}
