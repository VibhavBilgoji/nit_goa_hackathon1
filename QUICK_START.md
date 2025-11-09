# 🚀 Quick Start - Local Development

## ⚡ Super Fast Setup (2 Commands)

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

**That's it!** The `.env.local` file is already configured with all credentials.

---

## 🎯 Access Points

### Admin Panel (Instant Access)
```
http://localhost:3000/admin
```
**No login required!** Just open the URL.

### Login Page (Alternative)
```
http://localhost:3000/login
```
Click "Admin Login" → "Login as Administrator" → Done!

### Home Page
```
http://localhost:3000
```

---

## ✅ What's Pre-Configured

- ✅ **Database (Supabase)** - Real production data
- ✅ **Authentication** - Bypassed for easy access
- ✅ **Admin Panel** - Full CRUD operations
- ✅ **AI Categorization** - Gemini API
- ✅ **Image Uploads** - Cloudinary
- ✅ **Email Notifications** - Resend API

---

## 📊 Admin Features Available

1. **Dashboard** → `/admin` - Statistics & overview
2. **Issues** → `/admin/issues` - Manage all issues
3. **Users** → `/admin/users` - User management
4. **Analytics** → `/admin/analytics` - Reports & charts
5. **Audit Logs** → `/admin/audit-logs` - Activity tracking
6. **Wards** → `/admin/wards` - Location management

---

## 🐛 Quick Troubleshooting

**Server won't start?**
```bash
npm install
npm run dev
```

**Port 3000 in use?**
```bash
npm run dev -- -p 3001
```

**Environment variables not loading?**
- Verify `.env.local` exists
- Restart server (Ctrl+C, then `npm run dev`)

**Stats showing zeros?**
- Check browser console for errors
- Database might need initialization
- Report a test issue first

---

## 🔄 Development Workflow

1. **Make changes** → Files auto-reload
2. **Check browser** → See updates instantly
3. **Test features** → Full database access
4. **Push to GitHub** → Auto-deploys to Vercel

---

## 📚 Need More Info?

- **Complete Setup Guide:** `LOCAL_SETUP_GUIDE.md`
- **Admin Documentation:** `ADMIN_ACCESS_GUIDE.md`
- **Auth Bypass Details:** `ADMIN_AUTH_BYPASS.md`

---

## 🎉 You're Ready!

```bash
npm run dev
```

Then visit: **http://localhost:3000/admin**

**Happy coding! 🚀**