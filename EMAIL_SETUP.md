# Email Setup Guide

## Email Configuration

The application uses Supabase Auth for sending emails. Emails are sent automatically when users sign up or request password resets.

### Setup Required
1. **Configure SMTP in Supabase Dashboard:**
   - Go to your Supabase project → Authentication → Providers → Email
   - Configure SMTP settings with your email provider (Gmail, SendGrid, etc.)
   - Ensure "Confirm email" is enabled
   - **Important**: Without SMTP configuration, no emails will be sent!

2. **Custom Email Templates:**
   - In Supabase dashboard → Authentication → Email Templates
   - Update subjects to include "Guinea E-Visa" branding
   - Example subjects:
     - "Guinea E-Visa - Confirm your email"
     - "Guinea E-Visa - Reset your password"
   - Customize email content as needed

### Current Implementation
- ✅ User registration: Supabase sends confirmation emails automatically
- ✅ Password reset: Supabase sends recovery emails automatically
- ⚠️ **CRITICAL**: Redirect URLs must be configured in Supabase dashboard for production

### Production Setup Required
1. **CRITICAL: Configure Site URL and Redirect URLs in Supabase**
   - Go to: **Supabase Dashboard → Your Project → Authentication → URL Configuration**
   - **Set Site URL to**: `https://hci-sable-six.vercel.app`
   - **Add these EXACT URLs to "Redirect URLs"**:
     - `https://hci-sable-six.vercel.app/auth/confirm`
     - `https://hci-sable-six.vercel.app/auth/update-password`
   - **VERY IMPORTANT**: If Site URL is still `http://localhost:3000`, change it to production URL!

2. **Check Email Templates**
   - Go to: **Authentication → Email Templates**
   - Make sure password reset and confirmation emails don't have hardcoded localhost URLs
   - The templates should use dynamic URLs based on your Site URL setting

3. **Verify SMTP is configured** in Authentication → Providers → Email

### Email Flow
1. User signs up → Supabase creates user with `email_confirm: false` → Sends confirmation email
2. User requests password reset → API generates recovery link → Supabase sends reset email
3. Emails contain links that redirect to the appropriate auth pages