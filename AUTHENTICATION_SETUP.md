# ORNAMIS Supabase Authentication Setup

## 🎯 Overview

This document provides complete setup instructions for the ORNAMIS Supabase authentication system with role-based access control (RBAC).

**Roles**: Customer, Seller (requires approval), Admin (manual creation only)

---

## 📋 Prerequisites

1. **Supabase Project**: Create a free project at [supabase.com](https://supabase.com)
2. **Node.js**: Version 16+ installed
3. **Dependencies**: Already installed via `npm install @supabase/supabase-js`

---

## ⚙️ Setup Steps

### Step 1: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Get your Supabase credentials:
   - Go to your Supabase project dashboard
   - Navigate to **Settings > API**
   - Copy the **Project URL** and **anon/public key**

3. Update `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### Step 2: Run SQL Migrations

Execute the SQL migration files in order via **Supabase SQL Editor**:

1. Go to **SQL Editor** in your Supabase dashboard
2. Run each migration file in sequence:

   **001_create_profiles_table.sql**
   - Creates `profiles` table with role and seller approval fields
   - Sets up enum types for roles and seller status
   - Adds constraints to prevent self-admin assignment

   **002_enable_rls_profiles.sql**
   - Enables Row Level Security on profiles table
   - Creates RLS policies for read/update access
   - Adds helper functions (`is_admin()`, `is_approved_seller()`, etc.)

   **003_auth_triggers.sql**
   - Auto-creates profile on user signup
   - Implements seller approval workflow functions
   - Sets up role change audit logging

   **004_admin_setup.sql** ⚠️ **MANUAL ONLY**
   - Template for creating admin users
   - DO NOT run automatically
   - See "Creating Admin Users" section below

   **005_customer_rls.sql**
   - Customer-specific RLS policies
   - Creates orders table (if needed)
   - Restricts customers to their own data

   **006_seller_rls.sql**
   - Seller-specific RLS policies
   - Creates products table (if needed)
   - Blocks unapproved sellers from data access

   **007_admin_rls.sql**
   - Admin full access policies
   - Admin action audit logging
   - Admin-only management functions

   **008_otp_security.sql** (Optional)
   - Login attempt tracking
   - Suspicious activity detection
   - Session management
   - Password reset security

### Step 3: Enable Email Confirmation

1. Go to **Authentication > Settings** in Supabase dashboard
2. Enable **Email Confirmations**
3. Configure email templates (optional)

### Step 4: Test the Application

```bash
npm run dev
```

Navigate to the signup/login pages and test:
- Customer signup → Email verification → Login
- Seller signup → Pending approval message
- Admin login (after manual creation)

---

## 👤 Creating Admin Users

Admins can ONLY be created manually via SQL for security:

### Method 1: Via Supabase Dashboard

1. Go to **Authentication > Users**
2. Click **Add User**
3. Enter admin email and password
4. Check **Auto Confirm User**
5. Copy the generated User ID

6. Go to **SQL Editor** and run:
   ```sql
   UPDATE public.profiles
   SET 
     role = 'admin',
     seller_status = NULL,
     updated_at = NOW()
   WHERE id = 'PASTE_USER_ID_HERE';
   ```

7. Verify:
   ```sql
   SELECT id, email, role, created_at 
   FROM public.profiles 
   WHERE role = 'admin';
   ```

### Method 2: Direct SQL (Advanced)

```sql
-- First create the auth user in Supabase Dashboard
-- Then update their profile:
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'admin@ornamis.com';
```

---

## 🔐 Security Features

### Role-Based Access Control (RBAC)

- **Customer**: Can only access their own orders and data
- **Seller**: Can only access their own products and orders (if approved)
- **Admin**: Full access to all data with audit logging

### Seller Approval Workflow

1. Seller signs up → `seller_status = 'pending'`
2. Login blocked until approved
3. Admin approves via:
   ```sql
   SELECT approve_seller('seller_user_id');
   ```
4. Seller receives email notification (configure in Supabase)
5. Seller can now log in

### Cross-Role Login Prevention

- Users must log in via the correct role tab
- Attempting to log in as a different role will fail with error message
- Example: Customer cannot log in via Seller or Admin tabs

### Row Level Security (RLS)

All database policies are enforced at the PostgreSQL level:
- Frontend cannot bypass security
- Direct database access is also protected
- Policies use `auth.uid()` for user identification

---

## 🧪 Testing Authentication

### Test Customer Flow

1. Go to signup page
2. Select **Customer** tab
3. Enter email and password
4. Check email for verification link
5. Click verification link
6. Log in via **Customer** tab
7. ✅ Should succeed

### Test Seller Flow

1. Go to signup page
2. Select **Seller** tab
3. Enter email and password
4. See "Pending Approval" message
5. Try to log in → ❌ Should fail with "pending approval" error
6. Approve seller in database:
   ```sql
   SELECT approve_seller('seller_user_id');
   ```
7. Log in via **Seller** tab
8. ✅ Should succeed

### Test Admin Flow

1. Create admin user via SQL (see above)
2. Log in via **Admin** tab
3. ✅ Should succeed
4. Try to log in via Customer tab → ❌ Should fail with "wrong role" error

### Test Cross-Role Prevention

1. Log in as customer
2. Try to access seller features → ❌ Should be blocked
3. Log out
4. Try to log in as seller via customer tab → ❌ Should fail

---

## 📊 Database Schema

### profiles Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | References auth.users(id) |
| email | TEXT | User email |
| role | user_role | customer, seller, or admin |
| seller_status | seller_status | pending, approved, rejected (sellers only) |
| created_at | TIMESTAMPTZ | Account creation time |
| updated_at | TIMESTAMPTZ | Last update time |

### role_audit_log Table

Tracks all role changes for security auditing.

### admin_audit_log Table

Tracks all admin actions for compliance.

---

## 🔧 Troubleshooting

### "Profile not found" error

- Check that the database trigger is working:
  ```sql
  SELECT * FROM public.profiles WHERE email = 'test@example.com';
  ```
- If no profile exists, the trigger may have failed
- Manually create profile or check trigger function

### Seller cannot log in after approval

- Verify seller_status:
  ```sql
  SELECT id, email, role, seller_status 
  FROM public.profiles 
  WHERE email = 'seller@example.com';
  ```
- Should show `seller_status = 'approved'`
- If not, run: `SELECT approve_seller('user_id');`

### RLS policies blocking access

- Check if RLS is enabled:
  ```sql
  SELECT tablename, rowsecurity 
  FROM pg_tables 
  WHERE schemaname = 'public';
  ```
- View policies:
  ```sql
  SELECT * FROM pg_policies WHERE tablename = 'profiles';
  ```

### Environment variables not loading

- Ensure `.env` file exists (not `.env.example`)
- Restart dev server after changing `.env`
- Check that variables start with `VITE_` prefix

---

## 📚 API Reference

### Authentication Functions

```typescript
// Customer signup
await signUpCustomer(email, password);

// Customer login
await signInCustomer(email, password);

// Seller signup
await signUpSeller(email, password);

// Seller login
await signInSeller(email, password);

// Admin login
await signInAdmin(email, password);

// Get current user
const authUser = await getCurrentAuthUser();

// Sign out
await signOut();
```

### Role Guard Functions

```typescript
// Check roles
isCustomer(profile);
isSeller(profile);
isAdmin(profile);
isApprovedSeller(profile);

// Route guards
guardCustomerRoute(profile);
guardSellerRoute(profile);
guardAdminRoute(profile);
```

---

## 🚀 Next Steps

1. **Update App.tsx**: Integrate auth state management
2. **Add Protected Routes**: Use role guards to protect pages
3. **Configure Email Templates**: Customize Supabase email templates
4. **Enable MFA**: Optional for sellers and admins
5. **Deploy**: Set environment variables in production

---

## 📞 Support

For issues or questions:
1. Check Supabase logs in dashboard
2. Review SQL migration files
3. Check browser console for errors
4. Verify environment variables are set correctly

---

## 🔒 Security Best Practices

✅ **DO**:
- Always use RLS policies
- Create admins manually via SQL only
- Enable email verification
- Use strong passwords
- Enable MFA for admins
- Regularly review audit logs

❌ **DON'T**:
- Expose service role key in frontend
- Trust frontend role checks alone
- Allow self-admin assignment
- Skip email verification
- Use weak passwords
- Ignore security warnings

---

**Last Updated**: February 2026
**Version**: 1.0.0
