import Stripe from 'stripe'

// Lazy singleton — throws at call time, not at module load time,
// so missing env vars don't crash the build.
let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not set')
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-03-31.basil',
    })
  }
  return _stripe
}

export const PRICE_IDS: Record<'TIER_1' | 'TIER_2', string> = {
  TIER_1: process.env.STRIPE_PRICE_TIER1_ID ?? '',
  TIER_2: process.env.STRIPE_PRICE_TIER2_ID ?? '',
}

export function tierFromPriceId(priceId: string): 'TIER_1' | 'TIER_2' | null {
  if (priceId === PRICE_IDS.TIER_1) return 'TIER_1'
  if (priceId === PRICE_IDS.TIER_2) return 'TIER_2'
  return null
}
