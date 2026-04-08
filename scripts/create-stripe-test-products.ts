/**
 * Creates Stripe test mode products and prices for AlignFaith.
 * Run with: STRIPE_SECRET_KEY=sk_test_... npx tsx scripts/create-stripe-test-products.ts
 *
 * Output: the price IDs to put in .env.test.local
 */

import Stripe from 'stripe'

const key = process.env.STRIPE_SECRET_KEY
if (!key) {
  console.error('Usage: STRIPE_SECRET_KEY=sk_test_... npx tsx scripts/create-stripe-test-products.ts')
  process.exit(1)
}
if (!key.startsWith('sk_test_')) {
  console.error('ERROR: Key must be a test mode key (sk_test_...). Got:', key.substring(0, 12) + '...')
  process.exit(1)
}

const stripe = new Stripe(key, { apiVersion: '2025-03-31.basil' })

async function main() {
  console.log('Creating Stripe test mode products and prices...\n')

  // Tier 1 — $29.99/month
  const product1 = await stripe.products.create({
    name: 'AlignFaith Tier 1 Membership',
    description: 'Member Access — view profiles, connect, message after mutual interest',
    metadata: { tier: 'TIER_1' },
  })
  const price1 = await stripe.prices.create({
    product: product1.id,
    unit_amount: 2999,
    currency: 'usd',
    recurring: { interval: 'month' },
    metadata: { tier: 'TIER_1' },
  })
  console.log('✓ Tier 1 product:', product1.id)
  console.log('  Price ID:', price1.id, '($29.99/month)\n')

  // Tier 2 — $39.99/month
  const product2 = await stripe.products.create({
    name: 'AlignFaith Tier 2 Membership',
    description: 'Full Access — priority placement, advanced filters, events, group sessions',
    metadata: { tier: 'TIER_2' },
  })
  const price2 = await stripe.prices.create({
    product: product2.id,
    unit_amount: 3999,
    currency: 'usd',
    recurring: { interval: 'month' },
    metadata: { tier: 'TIER_2' },
  })
  console.log('✓ Tier 2 product:', product2.id)
  console.log('  Price ID:', price2.id, '($39.99/month)\n')

  console.log('─────────────────────────────────────────────')
  console.log('Add these to .env.test.local:\n')
  console.log(`STRIPE_PRICE_TIER1_ID="${price1.id}"`)
  console.log(`STRIPE_PRICE_TIER2_ID="${price2.id}"`)
  console.log('─────────────────────────────────────────────')
}

main().catch((e) => { console.error(e.message); process.exit(1) })
