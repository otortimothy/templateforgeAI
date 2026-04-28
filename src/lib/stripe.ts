import Stripe from 'stripe';

// Lazy initialization — only throws when actually used, not at import time.
// This prevents build failures when STRIPE_SECRET_KEY isn't configured yet.
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set in environment variables.');
  }
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return _stripe;
}

/** Credit packs — sync these with your Stripe product/price IDs */
export const CREDIT_PACKS = [
  {
    id: 'starter',
    name: 'Starter',
    credits: 10,
    price: 9,
    stripePriceId: process.env.STRIPE_PRICE_STARTER || '',
  },
  {
    id: 'pro',
    name: 'Pro',
    credits: 50,
    price: 29,
    stripePriceId: process.env.STRIPE_PRICE_PRO || '',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    credits: 200,
    price: 79,
    stripePriceId: process.env.STRIPE_PRICE_ENTERPRISE || '',
  },
] as const;

export type CreditPackId = (typeof CREDIT_PACKS)[number]['id'];
