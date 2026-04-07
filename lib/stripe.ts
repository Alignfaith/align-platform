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

export function getPriceId(plan: 'TIER_1' | 'TIER_2'): string {
  const id = plan === 'TIER_1'
    ? process.env.STRIPE_PRICE_TIER1_ID
    : process.env.STRIPE_PRICE_TIER2_ID
  if (!id) throw new Error(`${plan === 'TIER_1' ? 'STRIPE_PRICE_TIER1_ID' : 'STRIPE_PRICE_TIER2_ID'} is not set`)
  return id
}

export function tierFromPriceId(priceId: string): 'TIER_1' | 'TIER_2' | null {
  if (priceId === process.env.STRIPE_PRICE_TIER1_ID) return 'TIER_1'
  if (priceId === process.env.STRIPE_PRICE_TIER2_ID) return 'TIER_2'
  return null
}
