# 🚀 Local Development Setup Guide

Complete guide to run the CityPulse app locally with full database access and admin panel functionality.

---

## ✅ Prerequisites

- Node.js 20.x or higher
- npm or yarn
- Git
- A code editor (VS Code recommended)

---

## 📦 Quick Setup (5 Minutes)

### Step 1: Clone the Repository

```bash
git clone https://github.com/VibhavBilgoji/nit_goa_hackathon1.git
cd nit_goa_hackathon1
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Environment Variables Setup

The `.env.local` file has already been created with all necessary credentials!

**Verify it exists:**
```bash
# Windows
dir .env.local

# Mac/Linux
ls -la .env.local
```

**What's included in `.env.local`:**
- ✅ JWT_SECRET - Authentication token generation
- ✅ Database credentials (Supabase)
- ✅ Admin IDs
- ✅ Gemini API (AI categorization)
- ✅ Cloudinary (image uploads)
- ✅ Resend API (email notifications)

### Step 4: Start the Development Server

```bash
npm run dev
```

The app will start at: **http://localhost:3000**

---

## 🎯 Accessing the Admin Panel

### Option 1: Direct URL (Fastest)
Simply navigate to:
```
http://localhost:3000/admin
```

### Option 2: Through Login Page
1. Go to: http://localhost:3000/login
2. Click **"Admin Login"** button (shield icon)
3. Click **"Login as Administrator"**
4. Instantly redirected to admin dashboard

**No credentials needed!** Authentication is bypassed for easy development.

---

## 📊 Admin Panel Features

Once you're in the admin panel, you can:

### 1. **View Dashboard** (`/admin`)
- Real-time statistics
- Total users, issues, resolution rates
- Quick action buttons

### 2. **Manage Issues** (`/admin/issues`)
- View all reported issues from database
- Update issue statuses
- Assign priorities
- Filter by status, category, ward

### 3. **User Management** (`/admin/users`)
- View all registered users
- Manage user roles
- User activity tracking

### 4. **Analytics** (`/admin/analytics`)
- Ward-wise analytics
- Performance metrics
- Charts and reports

### 5. **Audit Logs** (`/admin/audit-logs`)
- System activity logs
- User action history
- Security events

### 6. **Ward Management** (`/admin/wards`)
- Configure wards and districts
- Location boundaries
- Geographic data

---

## 🗄️ Database Access

### Automatic Connection
The app automatically connects to Supabase database using credentials in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://ipuzfhvmcegamqmogase.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

### What You Get:
- ✅ Real-time data from production database
- ✅ Full CRUD operations on issues
- ✅ User management capabilities
- ✅ Analytics and reports
- ✅ Image uploads to Cloudinary
- ✅ AI-powered categorization

### Database Tables:
- `users` - User accounts and profiles
- `issues` - Reported civic issues
- `wards` - Geographic boundaries
- `audit_logs` - Activity tracking
- `notifications` - User notifications

---

## 🔧 How the Bypass Works

### Authentication Bypass
When you access the admin panel:

1. **Auto-login is triggered** - Fake admin credentials are created
2. **localStorage is populated** - User data and token stored
3. **API calls work seamlessly** - Backend receives valid-looking token
4. **Full database access** - All admin operations functional

### What's Set in localStorage:
```javascript
citypulse_user: {
  id: "admin-bypass-001",
  email: "admin@ourstreet.local",
  name: "Administrator",
  role: "admin"
}

citypulse_auth_token: [base64 encoded token]
```

---

## 🧪 Testing the Setup

### 1. Test Database Connection
```bash
# Access admin dashboard
http://localhost:3000/admin

# Check if stats are loading (not showing zeros)
```

### 2. Test Issue Management
```bash
# Go to issues page
http://localhost:3000/admin/issues

# You should see actual issues from database
# Try updating an issue status
```

### 3. Test User Management
```bash
# Go to users page
http://localhost:3000/admin/users

# View all registered users
```

### 4. Report a New Issue
```bash
# As a citizen
http://localhost:3000/dashboard

# Report a new issue
# Check if it appears in admin panel
```

---

## 📝 Environment Variables Reference

### Critical (Already Set)
```env
JWT_SECRET=ubjtiIbMpfUHHERmwO0ltDO1VAlX8bYlMtqpnc09guVgm2c5B39lhIbRosgaGuFn+pCHqOUFm7hLwn+u4wzFXg==
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Database (Already Set)
```env
NEXT_PUBLIC_SUPABASE_URL=https://ipuzfhvmcegamqmogase.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Admin Configuration (Already Set)
```env
ADMIN_IDS=ADMIN_A1B2C3,AUTH_D4E5F6
```

### Optional Services (Already Set)
```env
GEMINI_API_KEY=AIzaSyDuJd2qad4u38nh81icRcMm4lkGnJqoyEk
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=355968566138313
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=OurStreets
RESEND_API_KEY=re_iU3L7akX_BjjMAzp8mNT9eSP3cuPU1u6n
```

---

## 🐛 Troubleshooting

### Issue: Stats showing zeros
**Solution:**
- Check console for API errors
- Verify `.env.local` file exists
- Restart dev server: `Ctrl+C` then `npm run dev`

### Issue: Can't see issues in admin panel
**Solution:**
- Database might be empty
- Try reporting an issue first as a citizen
- Check Supabase dashboard for data

### Issue: Images not uploading
**Solution:**
- Cloudinary credentials are set
- Check network tab for upload errors
- Verify CORS settings

### Issue: Environment variables not loading
**Solution:**
```bash
# Stop the server (Ctrl+C)
# Verify .env.local exists
cat .env.local

# Restart server
npm run dev
```

### Issue: Port 3000 already in use
**Solution:**
```bash
# Kill the process
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

---

## 🔍 Useful Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Verify environment variables
npm run verify-env

# Generate environment variables interactively
npm run generate-env
```

---

## 📊 Database Management

### Access Supabase Dashboard
1. Go to: https://supabase.com
2. Login with your credentials
3. Select project: `ipuzfhvmcegamqmogase`

### View Tables
- Click **Table Editor** in sidebar
- Browse all tables and data
- Edit data directly if needed

### Run SQL Queries
- Click **SQL Editor** in sidebar
- Write custom queries
- Export data as CSV

---

## 🎨 Development Workflow

### Making Changes

1. **Edit files** - Changes hot-reload automatically
2. **Check browser** - See updates in real-time
3. **Check console** - Monitor for errors
4. **Test features** - Verify functionality

### Common Development Tasks

#### Add a New Admin Feature:
1. Create component in `components/admin/`
2. Add page in `app/admin/[feature]/page.tsx`
3. Add API route in `app/api/admin/[feature]/route.ts`
4. Update navigation links

#### Modify Database Schema:
1. Go to Supabase dashboard
2. Table Editor → Create/Modify table
3. Update TypeScript types in your code
4. Update API endpoints

---

## 🚀 Next Steps

After setup, you can:

1. **Explore Admin Features** - Try all admin panel capabilities
2. **Report Issues** - Test the citizen side of the app
3. **Modify Code** - Make changes and see them live
4. **Test APIs** - Use browser DevTools to inspect network calls
5. **Deploy Changes** - Push to GitHub → Auto-deploy to Vercel

---

## 📚 Additional Resources

- **Admin Bypass Documentation:** `ADMIN_AUTH_BYPASS.md`
- **Admin Access Guide:** `ADMIN_ACCESS_GUIDE.md`
- **Vercel Setup:** `VERCEL_ENV_SETUP.md`
- **Quick Fix Guide:** `QUICK_FIX_VERCEL.md`

---

## 🎉 You're All Set!

Your local development environment is fully configured with:

✅ Database connection (Supabase)
✅ Admin panel access (no login needed)
✅ AI categorization (Gemini API)
✅ Image uploads (Cloudinary)
✅ Email notifications (Resend)
✅ Hot reload for instant feedback

**Start developing:**
```bash
npm run dev
```

**Access admin panel:**
```
http://localhost:3000/admin
```

**Happy coding! 🚀**

---

*Last updated: January 2025*