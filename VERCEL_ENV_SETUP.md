# Vercel Environment Variables Setup Guide

This guide will help you configure the required environment variables for your CityPulse app deployment on Vercel.

## 🚀 Quick Setup (3 minutes)

### Step 1: Access Vercel Environment Variables

1. Go to your project on Vercel: https://vercel.com/dashboard
2. Click on your project name
3. Go to **Settings** → **Environment Variables**

### Step 2: Add Required Variables

Add the following environment variables one by one:

---

## 🔴 CRITICAL Variables (Required for App to Work)

### 1. JWT_SECRET

**Purpose:** Secure authentication token generation

**How to generate:**
```bash
# On Mac/Linux:
openssl rand -base64 32

# On Windows (PowerShell):
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Alternative - use any random 32+ character string
```

**In Vercel:**
- Name: `JWT_SECRET`
- Value: (paste the generated secret)
- Environment: Check all (Production, Preview, Development)
- Click **Save**

---

### 2. NEXT_PUBLIC_APP_URL

**Purpose:** Your application's public URL

**Value format:**
```
https://your-project-name.vercel.app
```

**In Vercel:**
- Name: `NEXT_PUBLIC_APP_URL`
- Value: `https://your-project-name.vercel.app` (replace with your actual Vercel URL)
- Environment: Check all (Production, Preview, Development)
- Click **Save**

**Note:** You can find your Vercel URL in the project dashboard or after your first deployment.

---

## 🟡 RECOMMENDED Variables (For Data Persistence)

Without these, your app will use in-memory storage and **all data will be lost on restart**.

### 3. NEXT_PUBLIC_SUPABASE_URL

**Purpose:** Database connection for persistent data storage

**How to get:**
1. Sign up at https://supabase.com (free tier available)
2. Create a new project
3. Wait for the project to be provisioned (~2 minutes)
4. Go to **Settings** → **API**
5. Copy the **Project URL**

**In Vercel:**
- Name: `NEXT_PUBLIC_SUPABASE_URL`
- Value: (paste your Supabase project URL)
- Environment: Check all
- Click **Save**

---

### 4. NEXT_PUBLIC_SUPABASE_ANON_KEY

**Purpose:** Public API key for Supabase

**How to get:**
1. In your Supabase project dashboard
2. Go to **Settings** → **API**
3. Copy the **anon/public** key (starts with `eyJ...`)

**In Vercel:**
- Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Value: (paste your Supabase anon key)
- Environment: Check all
- Click **Save**

---

## ⚪ OPTIONAL Variables (Enhanced Features)

These are optional but enable additional functionality:

### 5. GEMINI_API_KEY (Optional)

**Purpose:** AI-powered issue categorization

**How to get:**
1. Go to https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click **Create API Key**

**In Vercel:**
- Name: `GEMINI_API_KEY`
- Value: (your Gemini API key)
- Environment: Check all
- Click **Save**

---

### 6. NEXT_PUBLIC_MAPTILER_API_KEY (Optional)

**Purpose:** Interactive maps with better styling

**How to get:**
1. Sign up at https://www.maptiler.com/ (free tier: 100k requests/month)
2. Go to **Account** → **Keys**
3. Copy your API key

**In Vercel:**
- Name: `NEXT_PUBLIC_MAPTILER_API_KEY`
- Value: (your MapTiler API key)
- Environment: Check all
- Click **Save**

---

### 7-9. Twilio Variables (Optional)

**Purpose:** SMS notifications for issue updates

**How to get:**
1. Sign up at https://www.twilio.com/ (free trial available)
2. Go to **Console Dashboard**
3. Copy your **Account SID** and **Auth Token**
4. Get a phone number from **Phone Numbers** → **Manage** → **Buy a number**

**In Vercel:**

**7. TWILIO_ACCOUNT_SID**
- Name: `TWILIO_ACCOUNT_SID`
- Value: (your Twilio Account SID)
- Environment: Check all
- Click **Save**

**8. TWILIO_AUTH_TOKEN**
- Name: `TWILIO_AUTH_TOKEN`
- Value: (your Twilio Auth Token)
- Environment: Check all
- Click **Save**

**9. TWILIO_PHONE_NUMBER**
- Name: `TWILIO_PHONE_NUMBER`
- Value: `+1234567890` (your Twilio phone number with country code)
- Environment: Check all
- Click **Save**

---

### 10. RESEND_API_KEY (Optional)

**Purpose:** Email notifications

**How to get:**
1. Sign up at https://resend.com/ (free tier: 100 emails/day)
2. Go to **API Keys**
3. Create a new API key

**In Vercel:**
- Name: `RESEND_API_KEY`
- Value: (your Resend API key)
- Environment: Check all
- Click **Save**

---

## 📋 Complete Environment Variables Checklist

Copy this checklist and check off each variable as you add it:

```
CRITICAL (Required):
[ ] JWT_SECRET
[ ] NEXT_PUBLIC_APP_URL

RECOMMENDED (Data Persistence):
[ ] NEXT_PUBLIC_SUPABASE_URL
[ ] NEXT_PUBLIC_SUPABASE_ANON_KEY

OPTIONAL (Enhanced Features):
[ ] GEMINI_API_KEY
[ ] NEXT_PUBLIC_MAPTILER_API_KEY
[ ] RESEND_API_KEY
[ ] TWILIO_ACCOUNT_SID
[ ] TWILIO_AUTH_TOKEN
[ ] TWILIO_PHONE_NUMBER
```

---

## 🔄 After Adding Variables

1. **Redeploy your application:**
   - Go to **Deployments** tab
   - Click on the latest deployment
   - Click **Redeploy**
   - Or push a new commit to trigger a deployment

2. **Verify the deployment:**
   - Check the build logs for "✅ Environment verification passed!"
   - Open your app URL
   - Test authentication and issue reporting

---

## 🐛 Troubleshooting

### Build still failing?

**Issue:** "Environment verification failed"
**Solution:** Make sure you've added at least `JWT_SECRET` and `NEXT_PUBLIC_APP_URL`

### App deployed but data not persisting?

**Issue:** Data disappears after restart
**Solution:** Add Supabase variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

### Can't find my Vercel URL?

**Solution:** 
1. It's shown in the Vercel dashboard under your project
2. Format: `https://your-project-name.vercel.app`
3. You can also use a custom domain if you've configured one

### JWT_SECRET not working?

**Issue:** Authentication failing
**Solution:** Make sure the secret is at least 32 characters long

---

## 🎯 Minimum Setup for Testing

If you just want to test the deployment quickly:

```bash
# Generate JWT secret
JWT_SECRET=$(openssl rand -base64 32)

# Add to Vercel:
JWT_SECRET=<generated_value>
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

This will allow the app to deploy and function with in-memory storage (data will be lost on restart).

---

## 🔐 Security Best Practices

1. **Never commit secrets to Git:** Always use environment variables
2. **Different secrets per environment:** Use different JWT secrets for production/preview
3. **Rotate secrets regularly:** Especially JWT_SECRET and API keys
4. **Limit API key permissions:** Use read-only keys when possible
5. **Monitor usage:** Check your API key usage dashboards regularly

---

## 📚 Additional Resources

- [Vercel Environment Variables Docs](https://vercel.com/docs/projects/environment-variables)
- [Supabase Quick Start](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Next.js Environment Variables](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables)

---

## 💬 Need Help?

If you're stuck:
1. Check the build logs in Vercel for specific errors
2. Review this guide again
3. Make sure all required variables are set correctly
4. Try redeploying after adding/updating variables

---

**Ready to deploy? Let's go! 🚀**