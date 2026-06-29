# Quick Start: Setting Up Supabase

## 🚨 You're seeing this error:
```
Missing Supabase environment variables
```

This is expected! You need to set up your Supabase project first.

---

## ⚡ Quick Setup (5 minutes)

### Step 1: Create Supabase Project (2 min)

1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"New Project"**
3. Sign in with GitHub (or create account)
4. Create a new project:
   - **Name**: `ornamis` (or any name you like)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
   - Click **"Create new project"**
5. Wait ~2 minutes for project to initialize

### Step 2: Get Your Credentials (1 min)

1. In your Supabase dashboard, go to **Settings** (⚙️ icon on left sidebar)
2. Click **API** in the settings menu
3. You'll see two values:
   - **Project URL** (looks like: `https://abcdefgh.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

### Step 3: Update .env File (1 min)

1. Open `.env` file in your project root
2. Replace these lines:
   ```bash
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
   
   With your actual values:
   ```bash
   VITE_SUPABASE_URL=https://abcdefgh.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Save the file**

### Step 4: Restart Dev Server (30 sec)

1. Stop the current dev server (Ctrl+C in terminal)
2. Start it again:
   ```bash
   npm run dev
   ```

The error should be gone! ✅

---

## 📋 Next: Run Database Migrations

After the app loads, you'll need to set up the database:

1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Run each migration file in order (copy/paste and click "Run"):
   - `supabase/migrations/001_create_profiles_table.sql`
   - `supabase/migrations/002_enable_rls_profiles.sql`
   - `supabase/migrations/003_auth_triggers.sql`
   - `supabase/migrations/004_admin_setup.sql` (skip this for now)
   - `supabase/migrations/005_customer_rls.sql`
   - `supabase/migrations/006_seller_rls.sql`
   - `supabase/migrations/007_admin_rls.sql`
   - `supabase/migrations/008_otp_security.sql` (optional)

4. Enable email confirmations:
   - Go to **Authentication > Settings**
   - Toggle **"Enable email confirmations"** ON

---

## ✅ You're Done!

Now you can:
- Sign up as a customer
- Sign up as a seller (will need admin approval)
- Test the authentication system

See `AUTHENTICATION_SETUP.md` for detailed documentation.

---

## 🆘 Troubleshooting

**Error still showing after updating .env?**
- Make sure you saved the `.env` file
- Restart the dev server (Ctrl+C, then `npm run dev`)
- Check that values don't have quotes around them
- Make sure there are no extra spaces

**Can't find Supabase dashboard?**
- Go to [app.supabase.com](https://app.supabase.com)
- Your projects will be listed there

**Need help?**
- Check `AUTHENTICATION_SETUP.md` for full guide
- Supabase docs: [supabase.com/docs](https://supabase.com/docs)
