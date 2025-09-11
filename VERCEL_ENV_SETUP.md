# 🚀 Vercel Environment Variables Setup

## Add to Vercel Dashboard

Go to: https://vercel.com/dashboard → Select "upflyover" project → Settings → Environment Variables

### Add This Variable:

**Name:** `REACT_APP_GOOGLE_CLIENT_ID`
**Value:** `331107608932-dl32pf04p71pnlpt982hdhdv9n99rk0e.apps.googleusercontent.com`
**Environments:** ✅ Production ✅ Preview ✅ Development

### After Adding:
1. Click "Save"
2. Redeploy the project (or it will auto-deploy on next push)
3. Google OAuth will be live at: https://upflyover.vercel.app/signup/individual

## Test Locally Right Now:
```bash
cd frontend
npm start
# Visit: http://localhost:3000/signup/individual
# Google OAuth button should work!
```

## ✅ Status After Setup:
- Google OAuth: FULLY FUNCTIONAL
- Individual Signup: Complete with Google integration
- User Experience: Seamless Google authentication