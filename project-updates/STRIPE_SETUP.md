# 💳 Stripe Payment Integration Setup for Upflyover

## Overview
Complete Stripe integration for subscription-based payments with Professional ($99/month) and Enterprise ($299/month) plans.

## Features Implemented
- ✅ Subscription checkout with 14-day free trial
- ✅ Payment success/failure handling
- ✅ Subscription status management
- ✅ Billing portal integration
- ✅ Webhook handling for real-time updates
- ✅ Plan limits enforcement
- ✅ Cancel subscription functionality

## Step 1: Stripe Dashboard Setup

### 1.1 Create Stripe Account
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Create account or login
3. Complete business verification

### 1.2 Create Products and Prices
1. Go to **Products** → **Add Product**
2. Create two products:

**Professional Plan:**
- Name: `Upflyover Professional`
- Description: `Professional plan with 3 team users and advanced features`
- Pricing: `$99.00 USD` recurring monthly
- Copy the **Price ID** (starts with `price_`)

**Enterprise Plan:**
- Name: `Upflyover Enterprise`
- Description: `Enterprise plan with 10 team users and premium features`
- Pricing: `$299.00 USD` recurring monthly
- Copy the **Price ID** (starts with `price_`)

### 1.3 Configure Webhooks
1. Go to **Developers** → **Webhooks** → **Add endpoint**
2. Endpoint URL: `https://your-backend-url.railway.app/api/payments/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy the **Webhook Secret** (starts with `whsec_`)

## Step 2: Environment Variables

### Backend (.env)
Add to Railway environment variables:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
STRIPE_PROFESSIONAL_PRICE_ID=price_your_professional_price_id
STRIPE_ENTERPRISE_PRICE_ID=price_your_enterprise_price_id

# Frontend URL for redirects
FRONTEND_URL=https://upflyover.vercel.app
```

### Frontend (.env)
Add to Vercel environment variables:

```env
# Stripe Configuration
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

## Step 3: Database Schema Updates

The payment system adds these fields to user records:

```javascript
// Company/Individual Schema additions
{
  stripeCustomerId: String,        // Stripe customer ID
  subscriptionId: String,          // Active subscription ID
  subscriptionPlan: String,        // 'starter', 'professional', 'enterprise'
  subscriptionStatus: String,      // 'active', 'trialing', 'canceled', etc.
  monthlyLimit: Number            // For individuals: 4 (free), 20 (pro), -1 (unlimited)
}
```

## Step 4: Testing

### Test Cards (Stripe Test Mode)
- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **3D Secure:** `4000 0025 0000 3155`

### Test Flow
1. Visit: `https://upflyover.vercel.app/pricing`
2. Click "Start Free Trial" on Professional plan
3. Login/signup if needed
4. Complete checkout with test card
5. Verify redirect to success page
6. Check subscription status in dashboard

## Step 5: Webhook Testing

### Local Testing (ngrok)
```bash
# Install ngrok
npm install -g ngrok

# Expose local backend
ngrok http 3000

# Update webhook URL in Stripe Dashboard
https://your-ngrok-url.ngrok.io/api/payments/webhook
```

### Production Testing
1. Deploy backend to Railway
2. Update webhook URL: `https://your-app.railway.app/api/payments/webhook`
3. Test complete payment flow

## Step 6: Go Live

### Switch to Live Mode
1. In Stripe Dashboard, toggle to **Live mode**
2. Create new products/prices in live mode
3. Update environment variables with live keys
4. Update webhook endpoint to live URL
5. Test with real payment methods

### Live Environment Variables
```env
# Live Stripe Keys (replace test keys)
STRIPE_SECRET_KEY=sk_live_your_live_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_live_webhook_secret
STRIPE_PROFESSIONAL_PRICE_ID=price_live_professional_id
STRIPE_ENTERPRISE_PRICE_ID=price_live_enterprise_id
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
```

## Features Overview

### Payment Flow
1. **Plan Selection** → User clicks upgrade button
2. **Authentication** → Login required for paid plans
3. **Checkout** → Stripe Checkout with 14-day trial
4. **Payment** → Secure payment processing
5. **Webhook** → Real-time subscription activation
6. **Success** → Redirect to success page
7. **Dashboard** → Updated limits and features

### Subscription Management
- **View Status** → Current plan and billing info
- **Billing Portal** → Stripe-hosted billing management
- **Cancel Subscription** → Cancel at period end
- **Upgrade/Downgrade** → Change plans anytime

### Plan Limits
- **Starter (Free):** 4 requirements/month
- **Professional:** 20 requirements/month + 3 team users
- **Enterprise:** Unlimited requirements + 10 team users

## Security Features
- ✅ Webhook signature verification
- ✅ Secure API key management
- ✅ PCI compliance through Stripe
- ✅ No card data stored locally
- ✅ HTTPS-only payment processing

## Monitoring & Analytics
- **Stripe Dashboard:** Payment analytics
- **Webhook Logs:** Real-time event monitoring
- **Subscription Metrics:** MRR, churn, growth
- **Failed Payments:** Automatic retry logic

## Support Integration
- **Payment Issues:** Direct Stripe support
- **Billing Questions:** Automated billing portal
- **Plan Changes:** Self-service upgrades
- **Refunds:** Stripe refund API

---

## Status: ✅ READY FOR PRODUCTION

**Next Steps:**
1. Add Stripe keys to environment variables
2. Create products in Stripe Dashboard
3. Configure webhook endpoint
4. Test payment flow
5. Deploy to production

**Estimated Setup Time:** 30 minutes
**Go-Live Ready:** Yes, with proper Stripe account verification

---
*Stripe Payment Integration for Upflyover B2B Platform*
*Updated: Current Date*