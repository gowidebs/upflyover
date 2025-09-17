const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Stripe Price IDs (create these in Stripe Dashboard)
const PRICE_IDS = {
  professional: process.env.STRIPE_PROFESSIONAL_PRICE_ID || 'price_professional_monthly',
  enterprise: process.env.STRIPE_ENTERPRISE_PRICE_ID || 'price_enterprise_monthly'
};

// Create customer
const createCustomer = async (email, name, metadata = {}) => {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata
    });
    return { success: true, customer };
  } catch (error) {
    console.error('Stripe create customer error:', error);
    return { success: false, error: error.message };
  }
};

// Create checkout session
const createCheckoutSession = async (priceId, customerId, successUrl, cancelUrl, metadata = {}) => {
  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata,
      subscription_data: {
        trial_period_days: 14, // 14-day free trial
        metadata
      }
    });
    return { success: true, session };
  } catch (error) {
    console.error('Stripe checkout session error:', error);
    return { success: false, error: error.message };
  }
};

// Get subscription details
const getSubscription = async (subscriptionId) => {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return { success: true, subscription };
  } catch (error) {
    console.error('Stripe get subscription error:', error);
    return { success: false, error: error.message };
  }
};

// Cancel subscription
const cancelSubscription = async (subscriptionId) => {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true
    });
    return { success: true, subscription };
  } catch (error) {
    console.error('Stripe cancel subscription error:', error);
    return { success: false, error: error.message };
  }
};

// Create billing portal session
const createBillingPortalSession = async (customerId, returnUrl) => {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
    return { success: true, session };
  } catch (error) {
    console.error('Stripe billing portal error:', error);
    return { success: false, error: error.message };
  }
};

// Verify webhook signature
const verifyWebhookSignature = (payload, signature, endpointSecret) => {
  try {
    const event = stripe.webhooks.constructEvent(payload, signature, endpointSecret);
    return { success: true, event };
  } catch (error) {
    console.error('Stripe webhook verification error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  stripe,
  PRICE_IDS,
  createCustomer,
  createCheckoutSession,
  getSubscription,
  cancelSubscription,
  createBillingPortalSession,
  verifyWebhookSignature
};