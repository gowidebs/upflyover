# 🚀 Vercel Environment Variables Setup

## Add to Vercel Dashboard

Go to: https://vercel.com/dashboard → Select "upflyover" project → Settings → Environment Variables

### Google OAuth Variables:

**Name:** `REACT_APP_GOOGLE_CLIENT_ID`
**Value:** `331107608932-dl32pf04p71pnlpt982hdhdv9n99rk0e.apps.googleusercontent.com`
**Environments:** ✅ Production ✅ Preview ✅ Development

### Apple Sign-In Variables (Optional):

**Name:** `REACT_APP_APPLE_CLIENT_ID`
**Value:** `com.upflyover.web` (Your Apple Service ID)
**Environments:** ✅ Production ✅ Preview ✅ Development

**Name:** `REACT_APP_APPLE_TEAM_ID`
**Value:** `YOUR_APPLE_TEAM_ID`
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
- Apple Sign-In: READY (requires Apple Developer setup)
- Individual Signup: Complete with OAuth integrations
- User Experience: Seamless authentication with multiple providers

## Apple Sign-In Setup:
For Apple Sign-In, see: `APPLE_OAUTH_SETUP.md` for detailed configuration steps.

**Note:** Apple Sign-In requires an Apple Developer Account and additional setup steps.