# 🍎 Apple Sign-In Setup - Step by Step Guide

## Current Status: You're in Apple Developer Portal ✅

Since you have access to the Apple Developer portal, let's set up Apple Sign-In for Upflyover:

## Step 1: Create App ID (Do This Now)

1. **In your current Apple Developer portal:**
   - Click **"Certificates, Identifiers & Profiles"**
   - Select **"Identifiers"** → **"App IDs"** → **"+"**

2. **Create new App ID:**
   ```
   Description: Upflyover Platform
   Bundle ID: com.upflyover.platform
   Platform: iOS, macOS (select both)
   ```

3. **Enable Capabilities:**
   - ✅ Check **"Sign In with Apple"**
   - Click **"Continue"** → **"Register"**

## Step 2: Create Service ID (For Web)

1. **Go to Identifiers → Services IDs → "+"**

2. **Create Service ID:**
   ```
   Description: Upflyover Web Service
   Identifier: com.upflyover.web
   ```

3. **Configure Sign In with Apple:**
   - Select your new Service ID
   - Click **"Configure"** next to "Sign In with Apple"
   - **Primary App ID:** Select "com.upflyover.platform"
   
4. **Add Domains and Return URLs:**
   ```
   Domains:
   - upflyover.vercel.app
   - localhost
   
   Return URLs:
   - https://upflyover.vercel.app/signup/individual
   - http://localhost:3000/signup/individual
   ```

## Step 3: Create Private Key

1. **Go to Keys → "+"**

2. **Create Key:**
   ```
   Key Name: Upflyover Apple Sign In Key
   Services: ✅ Sign In with Apple
   Primary App ID: com.upflyover.platform
   ```

3. **Download & Save:**
   - Click **"Continue"** → **"Register"**
   - **Download the .p8 file** (IMPORTANT: Save this securely!)
   - **Note the Key ID** (10-character string)

## Step 4: Get Your Team ID

1. **In Apple Developer portal:**
   - Look at the top right corner
   - Your **Team ID** is displayed (10-character string)
   - Copy this value

## Step 5: Environment Variables Setup

### For Vercel (Frontend):
```
REACT_APP_APPLE_CLIENT_ID=com.upflyover.web
REACT_APP_APPLE_TEAM_ID=YOUR_TEAM_ID_HERE
REACT_APP_APPLE_KEY_ID=YOUR_KEY_ID_HERE
```

### For Railway (Backend):
```
APPLE_CLIENT_ID=com.upflyover.web
APPLE_TEAM_ID=YOUR_TEAM_ID_HERE
APPLE_KEY_ID=YOUR_KEY_ID_HERE
APPLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----
[CONTENT OF YOUR .p8 FILE]
-----END PRIVATE KEY-----
```

## Step 6: Test Apple Sign-In

After setup:
1. Visit: https://upflyover.vercel.app/signup/individual
2. Click **"Continue with Apple"**
3. Should work with your Apple ID!

## Quick Setup Checklist:

- [ ] App ID created with Sign In with Apple
- [ ] Service ID created and configured
- [ ] Private key generated and downloaded
- [ ] Team ID copied
- [ ] Environment variables added to Vercel
- [ ] Environment variables added to Railway
- [ ] Test Apple Sign-In on production

## Need Help?

If you encounter any issues:
1. Check domain verification in Apple Console
2. Verify all URLs match exactly
3. Ensure private key format is correct
4. Test on Safari first (best compatibility)

## Security Notes:

- 🔒 Keep your .p8 file secure
- 🔒 Never commit private keys to GitHub
- 🔒 Use environment variables only
- 🔒 Test thoroughly before going live

---

**Ready to activate Apple Sign-In for 50,000+ potential users!** 🚀