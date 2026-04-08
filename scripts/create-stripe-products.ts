/**
 * One-time script to create Stripe products + prices.
 * Run with: STRIPE_SECRET_KEY=sk_live_... npx tsx scripts/create-stripe-products.ts
 */

import Stripe from 'stripe'

const key = process.env.STRIPE_SECRET_KEY
if (!key) {
  console.error('STRIPE_SECRET_KEY is required')
  process.exit(1)
}

const stripe = new Stripe(key, { apiVersion: '2023-10-16' })

const products = [
  { name: 'Basic Membership', amount: 9900,   description: 'One-time Basic Membership to Align Faith' },
  { name: '5 Matches',        amount: 199500, description: '5 curated match introductions' },
  { name: '10 Matches',       amount: 299000, description: '10 curated match introductions' },
]

async function run() {
  console.log('Creating Stripe products...\n')
  for (const p of products) {
    const product = await stripe.products.create({ name: p.name, description: p.description })
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: p.amount,
      currency: 'usd',
      billing_scheme: 'per_unit',
    })
    console.log(`✓ ${p.name}`)
    console.log(`  Product ID: ${product.id}`)
    console.log(`  Price ID:   ${price.id}`)
    console.log(`  Amount:     $${(p.amount / 100).toFixed(2)} one-time\n`)
  }
  console.log('Done. Copy the Price IDs above into your Vercel environment variables.')
}

run().catch(e => { console.error(e); process.exit(1) })
