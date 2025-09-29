
# Guinea E‑Visa – Next.js + Supabase

A production‑ready starter for an e‑visa portal for the Republic of Guinea.

## Quickstart

```bash
# 1) Install deps
npm i

# 2) Copy env and fill your Supabase keys + site URL
cp .env.local.example .env.local

# 3) Run the dev server
npm run dev
```

### Supabase setup

1. Create a new Supabase project and configure SMTP in **Authentication → Providers → Email**. Ensure *Confirm email* is **enabled** so unconfirmed users cannot sign in.
2. **Customize email templates** with "Guinea E-Visa" branding:
   - Go to Authentication → Email Templates
   - Update subjects to include "Guinea E-Visa" (e.g., "Guinea E-Visa - Confirm your email")
   - Customize email content as needed
3. In the SQL editor, paste and run the contents of `supabase/schema.sql`.
4. Set **Auth Redirect URLs** to include:
    - `http://localhost:3000/auth/confirm`
    - `http://localhost:3000/auth/update-password`
    - Your production URLs as well.
5. Create a Storage bucket (optional) named `documents` for file uploads later, and set RLS policies.

### App routes

- `/` — Landing page (matches your design)
- `/status` — Public status checker
- `/auth/sign-up` — Sign‑up (sends confirmation email)
- `/auth/confirm` — Handles email confirmation magic link
- `/auth/sign-in` — Sign‑in (blocked until email confirmed)
- `/auth/forgot-password` — Sends password reset email
- `/auth/update-password` — Resets the password
- `/dashboard` — Authenticated user home
- `/dashboard/start` — Start a new application

### Notes
- Authentication is powered by Supabase; we use the `@supabase/ssr` helpers for App Router.
- RLS policies restrict all data to the owning user (via `auth.uid()`).
- The RPC `create_application` inserts application + initial applicant + status history and generates a reference number like `GN‑EVISA‑2025‑0001`.
