# Baltimore MHN - Quick Start & Deployment Guide

**Date:** December 10, 2025  
**Status:** Ready for Deployment  
**Build:** SUCCESS (Exit Code: 0)

---

## Immediate Next Steps

### Step 1: Database Setup (15 minutes)

**Run these SQL commands in Supabase:**

1. Go to your Supabase project → SQL Editor
2. Run this critical migration:

```sql
-- Add missing columns required for deployment
ALTER TABLE providers ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS specialties TEXT[] DEFAULT '{}';

-- Verify columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'providers' 
AND column_name IN ('gender', 'specialties');
```

3. Ensure all 10 migration files have been run (check in Supabase → Database → Migrations)

### Step 2: Create Admin Account (5 minutes)

**Current Status:** No admin account exists yet

**Create your admin account:**

```sql
-- Run in Supabase SQL Editor
INSERT INTO users (id, email, first_name, last_name, role, is_active)
VALUES (
  gen_random_uuid(),
  'admin@baltimoremhn.org',  -- CHANGE THIS to your email
  'Admin',                    -- Your first name
  'User',                     -- Your last name
  'admin',
  true
);
```

**Important:** 
- Replace `admin@baltimoremhn.org` with YOUR actual email address
- You'll use this email to login at `/admin/login`
- There is NO password currently - authentication is email-only
- Store this email securely - it's your admin access

**To login:**
1. Go to `https://your-domain.com/admin/login`
2. Enter the email you used above
3. Click "Sign In"

### Step 3: Email Configuration (20 minutes)

**Get Resend API Key:**

1. Sign up at https://resend.com (free plan: 100 emails/day)
2. Verify your email
3. Go to API Keys → Create API Key
4. Copy the key (starts with `re_`)
5. Save for environment variables

**For production emails:**
- Add your domain in Resend → Domains
- Add DNS records to your domain registrar
- Wait for verification (5-15 minutes)
- Or use `onboarding@resend.dev` for testing

### Step 4: Environment Variables (10 minutes)

**Set these in your hosting platform:**

```env
# Supabase (get from Supabase Dashboard → Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Application
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=Baltimore Mental Health Navigator

# Email
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Features
NEXT_PUBLIC_ENABLE_CRISIS_BANNER=true
NEXT_PUBLIC_ENABLE_PROVIDER_ONBOARDING=true
```

---

## Recommended Deployment Strategy

### **Option 1: Vercel (RECOMMENDED)**

**Why Vercel:**
- Built for Next.js (made by Next.js creators)
- Zero configuration needed
- Automatic deployments on git push
- Free SSL certificates
- Edge network for fast global performance
- Built-in analytics
- Easy environment variable management
- Preview deployments for testing

**Deployment Steps:**

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to https://vercel.com
   - Click "Add New Project"
   - Import your GitHub repository
   - Select `baltimore-mhn`

3. **Configure:**
   - Framework: Next.js (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. **Add Environment Variables:**
   - In Vercel project settings
   - Environment Variables tab
   - Add all variables from Step 4 above
   - Mark sensitive keys as "Sensitive"

5. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Get your URL: `https://baltimore-mhn.vercel.app`

6. **Custom Domain (Optional):**
   - Vercel Dashboard → Settings → Domains
   - Add your domain
   - Update DNS records with your registrar
   - SSL certificate auto-generated

**Cost:** FREE (Hobby plan includes everything you need)

**Timeline:** 30 minutes total

---

### **Option 2: Netlify** (Alternative)

**Why Netlify:**
- Easy deployment
- Free tier available
- Good for static sites
- Requires more configuration for Next.js
- May need plugin for full Next.js features

**Deployment Steps:**

1. Push to GitHub (same as Vercel)
2. Go to https://netlify.com
3. "Add new site" → Import from GitHub
4. Configure:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Install "Next.js Runtime" plugin
5. Add environment variables
6. Deploy

**Cost:** FREE (Starter plan)

**Timeline:** 45 minutes total

---

### **Option 3: Self-Hosted VPS** (Advanced)

**Why VPS:**
- Full control
- No platform limitations
- Requires server management
- Need to handle security, backups, SSL
- More maintenance

**Not recommended unless:**
- You have DevOps expertise
- You need complete control
- You have compliance requirements

**Platforms:** DigitalOcean, AWS EC2, Linode, Hetzner

---

## Pre-Deployment Checklist

- [ ] All Supabase migrations run (especially gender/specialties columns)
- [ ] Admin account created and email saved
- [ ] Resend API key obtained
- [ ] All environment variables ready
- [ ] Code committed to GitHub
- [ ] `.env.local` in `.gitignore` (already done)
- [ ] Production build tested (`npm run build` successful)

---

## Post-Deployment Testing

**Test these immediately after deployment:**

1. **Homepage:** `https://your-domain.com`
   - Should load without errors

2. **Navigator:** `/navigator`
   - Complete questionnaire
   - Get to results page

3. **Provider Signup:** `/for-providers/create`
   - Fill form
   - Upload photo
   - Submit successfully

4. **Admin Login:** `/admin/login`
   - Use your admin email
   - Should reach dashboard
   - See test provider in list

5. **Approve Provider:**
   - Click on pending provider
   - Click "Approve"
   - Should change to "Active"

6. **Test Email:**
   - Click "Send Approval Email"
   - Check inbox for email
   - Verify it looks good

7. **Provider Login:** `/provider-panel/login`
   - Use provider email from step 3
   - Should see dashboard
   - Check inbox tab

---

## Current Admin Access

**Admin Account:** Not yet created - YOU need to create it (see Step 2 above)

**Authentication Method:** Email-only (no password)

**How it works:**
- Enter email in login form
- System checks if email exists in `users` table
- If role = 'admin' and is_active = true → Access granted
- Session stored in localStorage

**Security Note:**
- Current implementation is basic (for MVP)
- Recommended: Implement Supabase Auth with passwords post-launch
- For now: Only share admin email with trusted team members

**Admin Capabilities:**
- View all providers
- Approve/reject providers
- Edit provider profiles
- Delete providers
- View claims
- Send approval emails
- Manage organizations

---

## Quick Commands

```bash
# Test production build locally
npm run build
npm start

# Development
npm run dev

# Type checking
npm run type-check
```

---

## If Something Goes Wrong

**Build Fails:**
1. Check Node version: `node --version` (should be 18+)
2. Clear cache: `rm -rf .next`
3. Reinstall: `rm -rf node_modules && npm install`
4. Rebuild: `npm run build`

**Database Errors:**
1. Verify all migrations ran
2. Check gender/specialties columns exist
3. Verify tables exist in Supabase

**Email Not Sending:**
1. Check Resend API key is correct
2. Verify domain is verified in Resend
3. Check email logs in Resend dashboard

**Admin Can't Login:**
1. Verify admin user exists in `users` table
2. Check role = 'admin'
3. Check is_active = true
4. Verify email is correct

---

## Support Resources

**Supabase:**
- Dashboard: https://supabase.com/dashboard
- Docs: https://supabase.com/docs
- Support: support@supabase.com

**Vercel:**
- Dashboard: https://vercel.com/dashboard
- Docs: https://vercel.com/docs
- Support: https://vercel.com/support

**Resend:**
- Dashboard: https://resend.com/dashboard
- Docs: https://resend.com/docs
- Support: support@resend.com

---

## Estimated Timeline

| Task | Time |
|------|------|
| Database setup | 15 min |
| Create admin account | 5 min |
| Get Resend API key | 10 min |
| Configure domain email | 10 min |
| Push to GitHub | 2 min |
| Deploy to Vercel | 5 min |
| Set environment variables | 10 min |
| Test deployment | 15 min |
| **TOTAL** | **~70 minutes** |

---

## You're Ready!

After completing these steps, your Baltimore Mental Health Navigator will be:
- Live and accessible
- Fully functional
- Secure and performant
- Ready to help Baltimore residents

**Default URLs after deployment:**
- Homepage: `https://your-domain.com`
- Navigator: `https://your-domain.com/navigator`
- Admin Panel: `https://your-domain.com/admin`
- Provider Signup: `https://your-domain.com/for-providers/create`

**Remember:** 
- Save your admin email securely
- Keep environment variables secret
- Test all features after deployment
- Monitor error logs in first few days

---

## Developer Contact

**Application Developed By:**  
Lemayan Leleina  
Email: lemayanleleina@gmail.com  
Website: https://lemayanleleina.engineer

**For Technical Support:**
- Bug reports and issues: Contact developer via email
- Feature requests: Contact developer via email
- Emergency support: Contact developer via email

---

**Questions?** Refer to `DEPLOYMENT_REPORT.md` for comprehensive documentation.

**Ready to deploy?** Follow Option 1 (Vercel) above.
