# Google OAuth Setup Guide

## Steps to Enable Google OAuth for Individual Signup

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API

### 2. Create OAuth 2.0 Credentials
1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client IDs**
3. Choose **Web application**
4. Add authorized origins:
   - `http://localhost:3000` (for development)
   - `https://upflyover.vercel.app` (for production)
5. Copy the **Client ID**

### 3. Update Environment Variables

#### Frontend (.env)
```bash
REACT_APP_GOOGLE_CLIENT_ID=your-actual-google-client-id-here
REACT_APP_API_URL=https://upflyover-production.up.railway.app/api
```

#### Backend (.env)
```bash
GOOGLE_CLIENT_ID=your-actual-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

### 4. Deploy Changes
1. Commit and push changes to GitHub
2. Vercel will auto-deploy frontend
3. Railway will auto-deploy backend
4. Add environment variables in Vercel dashboard

### 5. Test Google OAuth
1. Visit https://upflyover.vercel.app/signup/individual
2. Click "Continue with Google"
3. Complete Google authentication
4. User should be redirected to user type selection

## Current Status
- ✅ Google OAuth library installed
- ✅ Frontend integration complete
- ✅ Backend endpoint updated
- ⏳ Google Client ID configuration needed
- ⏳ Environment variables setup needed

## Fallback
Until Google OAuth is configured, users can:
- Use email signup with OTP verification
- Apple OAuth (when implemented)
- Regular email/password registration