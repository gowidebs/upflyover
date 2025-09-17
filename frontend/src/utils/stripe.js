import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe (disabled if no key provided)
const stripePromise = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY ? 
  loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY) : 
  Promise.resolve(null);

// Create checkout session
export const createCheckoutSession = async (plan, token) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/payments/create-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ plan })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create checkout session');
    }

    return data;
  } catch (error) {
    console.error('Checkout session error:', error);
    throw error;
  }
};

// Get subscription status
export const getSubscriptionStatus = async (token) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/payments/subscription`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get subscription status');
    }

    return data;
  } catch (error) {
    console.error('Subscription status error:', error);
    throw error;
  }
};

// Cancel subscription
export const cancelSubscription = async (token) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/payments/cancel-subscription`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to cancel subscription');
    }

    return data;
  } catch (error) {
    console.error('Cancel subscription error:', error);
    throw error;
  }
};

// Create billing portal session
export const createBillingPortalSession = async (token) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/payments/billing-portal`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create billing portal session');
    }

    return data;
  } catch (error) {
    console.error('Billing portal error:', error);
    throw error;
  }
};

// Redirect to Stripe Checkout
export const redirectToCheckout = async (checkoutUrl) => {
  window.location.href = checkoutUrl;
};

export default stripePromise;