# Email Setup Guide

## Issue: Emails Not Being Sent

The application uses Resend for sending emails. If emails are not being sent, it's likely due to domain verification requirements.

### Problem
Resend accounts in testing mode can only send emails to the account owner's verified email address. To send to other recipients, you must verify a domain.

### Solution
1. Go to [resend.com/domains](https://resend.com/domains)
2. Add and verify your domain (e.g., guinea-evisa.com)
3. Update `.env.local`:
   ```
   EMAIL_FROM=noreply@yourdomain.com
   ```
4. Replace `yourdomain.com` with your verified domain

### Testing
For local development, you can temporarily modify the email routes to send to your own email address, or upgrade your Resend plan for more testing emails.

### Current Status
- ✅ Resend API key configured
- ✅ Email sending code implemented with retry logic
- ✅ Testing mode workaround: emails sent to owner (yeboahnanaampadu@gmail.com)
- ❌ Domain verification needed for production emails

### Testing Mode Behavior
Until domain verification is complete, all emails are sent to the account owner's email address with details about the intended recipient. This allows testing without domain verification.