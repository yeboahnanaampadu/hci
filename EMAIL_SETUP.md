# Email Setup Guide

## Email Configuration

The application uses Supabase Auth for sending emails. Emails are sent automatically when users sign up or request password resets.

### Setup Required
1. **Configure SMTP in Supabase Dashboard:**
   - Go to your Supabase project → Authentication → Providers → Email
   - Configure SMTP settings with your email provider
   - Ensure "Confirm email" is enabled

2. **Custom Email Templates (Optional):**
   - In Supabase dashboard, you can customize email templates
   - Update the subject and content to include "Guinea E-Visa" branding
   - Example subject: "Guinea E-Visa - Confirm your email"

### Current Implementation
- ✅ User registration: Supabase sends confirmation emails automatically
- ✅ Password reset: Supabase sends recovery emails automatically
- ✅ Custom redirect URLs configured for proper user flow

### Email Flow
1. User signs up → Supabase creates user with `email_confirm: false` → Sends confirmation email
2. User requests password reset → API generates recovery link → Supabase sends reset email
3. Emails contain links that redirect to the appropriate auth pages