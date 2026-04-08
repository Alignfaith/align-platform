import { NextRequest, NextResponse } from 'next/server'
import { getStripe, tierFromPriceId } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('[webhook] STRIPE_WEBHOOK_SECRET not configured')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('[webhook] Signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.mode !== 'subscription') break
        const subscriptionId = session.subscription as string
        const userId = session.client_reference_id || session.metadata?.userId
        if (!userId) { console.error('[webhook] No userId in checkout session'); break }

        const sub = await getStripe().subscriptions.retrieve(subscriptionId)
        await handleSubscriptionChange(userId, sub)
        break
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        const userId = sub.metadata?.userId
        if (!userId) {
          // Look up by customerId
          const user = await prisma.user.findUnique({
            where: { stripeCustomerId: sub.customer as string },
            select: { id: true },
          })
          if (!user) { console.error('[webhook] No user found for customer', sub.customer); break }
          await handleSubscriptionChange(user.id, sub)
        } else {
          await handleSubscriptionChange(userId, sub)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        const customerId = sub.customer as string
        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId },
          select: { id: true },
        })
        if (!user) { console.error('[webhook] No user found for customer', customerId); break }

        await prisma.$transaction([
          prisma.user.update({
            where: { id: user.id },
            data: { tier: 'FREE', tierExpiresAt: null },
          }),
          prisma.subscription.deleteMany({
            where: { userId: user.id },
          }),
        ])
        console.log('[webhook] Subscription canceled, user downgraded to FREE:', user.id)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string
        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId },
          select: { id: true },
        })
        if (!user) break
        await prisma.subscription.updateMany({
          where: { userId: user.id },
          data: { status: 'past_due' },
        })
        console.log('[webhook] Payment failed for user:', user.id)
        break
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice
        console.log('[webhook] Invoice paid:', invoice.id, 'customer:', invoice.customer, 'amount:', invoice.amount_paid)
        break
      }

      default:
        console.log('[webhook] Unhandled event type:', event.type)
    }
  } catch (err) {
    console.error('[webhook] Handler error:', err)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

async function handleSubscriptionChange(userId: string, sub: Stripe.Subscription) {
  const priceId = sub.items.data[0]?.price?.id
  const tier = priceId ? tierFromPriceId(priceId) : null

  if (!tier) {
    console.error('[webhook] Unknown price ID:', priceId)
    return
  }

  const periodEnd = new Date((sub.items.data[0]?.current_period_end ?? 0) * 1000)

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        tier,
        tierExpiresAt: periodEnd,
        stripeCustomerId: sub.customer as string,
      },
    }),
    prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        stripeSubscriptionId: sub.id,
        stripeCustomerId: sub.customer as string,
        stripePriceId: priceId!,
        status: sub.status,
        tier,
        cancelAtPeriodEnd: sub.cancel_at_period_end,
        currentPeriodEnd: periodEnd,
      },
      update: {
        stripeSubscriptionId: sub.id,
        stripePriceId: priceId!,
        status: sub.status,
        tier,
        cancelAtPeriodEnd: sub.cancel_at_period_end,
        currentPeriodEnd: periodEnd,
      },
    }),
  ])

  console.log(`[webhook] User ${userId} → ${tier} (${sub.status}), renews ${periodEnd.toISOString()}`)
}
