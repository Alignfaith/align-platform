import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getStripe, PRICE_IDS } from '@/lib/stripe'

const BASE_URL = process.env.NEXTAUTH_URL || 'https://rootedalign.fly.dev'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { plan } = await req.json() as { plan: 'TIER_1' | 'TIER_2' }
    const priceId = PRICE_IDS[plan]
    if (!priceId) {
      return NextResponse.json({ error: `Invalid plan or STRIPE_PRICE_${plan}_ID not configured` }, { status: 400 })
    }

    const stripe = getStripe()
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, email: true, stripeCustomerId: true },
    })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // Get or create Stripe customer
    let customerId = user.stripeCustomerId
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: user.id },
      })
      customerId = customer.id
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      })
    }

    // Check for existing active subscription — send to portal instead
    const existing = await prisma.subscription.findUnique({
      where: { userId: user.id },
    })
    if (existing && existing.status === 'active') {
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${BASE_URL}/dashboard`,
      })
      return NextResponse.json({ url: portalSession.url })
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${BASE_URL}/dashboard?subscription=success`,
      cancel_url: `${BASE_URL}/pricing`,
      client_reference_id: user.id,
      metadata: { userId: user.id, plan },
      subscription_data: {
        metadata: { userId: user.id, plan },
      },
      allow_promotion_codes: true,
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('[stripe/checkout]', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
