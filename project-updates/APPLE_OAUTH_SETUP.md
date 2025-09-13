# 🍎 Apple Sign-In Setup for Upflyover

## Prerequisites
1. Apple Developer Account (Required)
2. App ID configured with Sign In with Apple capability
3. Service ID for web authentication

## Step 1: Apple Developer Console Setup

### 1.1 Create App ID
1. Go to [Apple Developer Console](https://developer.apple.com/account/)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Click **Identifiers** → **App IDs** → **+**
4. Create new App ID:
   - **Description:** Upflyover Platform
   - **Bundle ID:** `com.upflyover.platform`
   - **Capabilities:** Enable "Sign In with Apple"

### 1.2 Create Service ID
1. Go to **Identifiers** → **Services IDs** → **+**
2. Create new Service ID:
   - **Description:** Upflyover Web Service
   - **Identifier:** `com.upflyover.web`
   - **Primary App ID:** Select the App ID created above

### 1.3 Configure Service ID
1. Select your Service ID and click **Configure**
2. Enable **Sign In with Apple**
3. Add domains and return URLs:
   - **Domains:** `upflyover.vercel.app`, `localhost`
   - **Return URLs:** 
     - `https://upflyover.vercel.app/signup/individual`
     - `http://localhost:3000/signup/individual`

### 1.4 Create Private Key
1. Go to **Keys** → **+**
2. Create new key:
   - **Key Name:** Upflyover Apple Sign In Key
   - **Services:** Enable "Sign In with Apple"
   - **Primary App ID:** Select your App ID
3. **Download the .p8 file** (keep it secure!)
4. Note the **Key ID** (10-character string)

## Step 2: Environment Variables

### Add to Vercel Dashboard
Go to: https://vercel.com/dashboard → Select "upflyover" project → Settings → Environment Variables

Add these variables:

```
REACT_APP_APPLE_CLIENT_ID=com.upflyover.web
REACT_APP_APPLE_TEAM_ID=YOUR_TEAM_ID
REACT_APP_APPLE_KEY_ID=YOUR_KEY_ID
```

### Add to Railway (Backend)
Go to Railway dashboard → upflyover project → Variables

Add these variables:

```
APPLE_CLIENT_ID=com.upflyover.web
APPLE_TEAM_ID=YOUR_TEAM_ID
APPLE_KEY_ID=YOUR_KEY_ID
APPLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----
YOUR_PRIVATE_KEY_CONTENT_HERE
-----END PRIVATE KEY-----
```

## Step 3: Local Development

### Frontend (.env)
```
REACT_APP_APPLE_CLIENT_ID=com.upflyover.web
REACT_APP_APPLE_TEAM_ID=YOUR_TEAM_ID
REACT_APP_APPLE_KEY_ID=YOUR_KEY_ID
```

### Backend (.env)
```
APPLE_CLIENT_ID=com.upflyover.web
APPLE_TEAM_ID=YOUR_TEAM_ID
APPLE_KEY_ID=YOUR_KEY_ID
APPLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
YOUR_PRIVATE_KEY_CONTENT_HERE
-----END PRIVATE KEY-----"
```

## Step 4: Testing

### Local Testing
1. Start both frontend and backend
2. Visit: http://localhost:3000/signup/individual
3. Click "Continue with Apple"
4. Should redirect to Apple Sign-In

### Production Testing
1. Visit: https://upflyover.vercel.app/signup/individual
2. Click "Continue with Apple"
3. Complete Apple authentication
4. Should redirect back to your app

## Step 5: Verification

### Test Flow:
1. **New User:** Apple Sign-In → Account creation → User type selection
2. **Existing User:** Apple Sign-In → Automatic login → Dashboard
3. **Error Handling:** Fallback to email signup if Apple fails

## Important Notes

### Security
- Keep your private key (.p8 file) secure
- Never commit private keys to version control
- Use environment variables for all sensitive data

### Domain Verification
- Apple requires domain verification for production
- Add Apple's verification file to your domain root
- Verify domains in Apple Developer Console

### User Experience
- Apple Sign-In works on Safari, Chrome, Firefox
- Mobile Safari has the best experience
- Fallback to email signup if Apple fails

## Troubleshooting

### Common Issues:
1. **Invalid Client ID:** Check Service ID configuration
2. **Domain Not Verified:** Verify domains in Apple Console
3. **Private Key Error:** Check key format and permissions
4. **Redirect URI Mismatch:** Ensure URLs match exactly

### Debug Mode:
- Enable console logging in browser
- Check network requests for Apple API calls
- Verify JWT token structure

## Status After Setup:
- ✅ Apple Sign-In: Fully functional
- ✅ New Users: Account creation flow
- ✅ Existing Users: Automatic login
- ✅ Error Handling: Graceful fallbacks
- ✅ Mobile Support: Optimized experience

---
*Setup Guide for Apple Sign-In Integration*
*Updated: Current Date*