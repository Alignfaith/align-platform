import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin'
import { handleApiError } from '@/lib/errors'
import { z } from 'zod'

export async function GET() {
  try {
    await requireAdmin()

    const [freeCt, tier1Ct, tier2Ct] = await Promise.all([
      prisma.user.count({ where: { tier: 'FREE' } }),
      prisma.user.count({ where: { tier: 'TIER_1' } }),
      prisma.user.count({ where: { tier: 'TIER_2' } }),
    ])

    // Read tier config from SystemConfig (or defaults)
    const configs = await prisma.systemConfig.findMany({
      where: { key: { startsWith: 'tier_' } },
    })

    const configMap: Record<string, string> = {}
    configs.forEach((c) => {
      configMap[c.key] = c.value
    })

    const tiers = [
      {
        id: 'FREE',
        name: 'Free',
        userCount: freeCt,
        price: configMap['tier_free_price'] || '0',
        features: configMap['tier_free_features'] || 'Create account, complete onboarding, complete required reflections, access Six Pillars privately, understand the framework',
      },
      {
        id: 'TIER_1',
        name: 'Tier 1',
        userCount: tier1Ct,
        price: configMap['tier_1_price'] || '29.99',
        features: configMap['tier_1_features'] || 'Everything in Free, view other members, limited daily connection requests, messaging after mutual interest, weekly pillar prompts & challenges, private pillar engagement, FREE copy of Relationship Fitness book',
      },
      {
        id: 'TIER_2',
        name: 'Tier 2',
        userCount: tier2Ct,
        price: configMap['tier_2_price'] || '39.99',
        features: configMap['tier_2_features'] || 'Everything in Tier 1, priority placement, advanced pillar alignment filters, higher daily connection limits, enhanced messaging features, group teachings & live sessions, access to events, priority support, FREE copy of Relationship Fitness book',
      },
    ]

    return NextResponse.json(tiers)
  } catch (error) {
    return handleApiError(error)
  }
}

const updateSchema = z.object({
  tierId: z.string(),
  price: z.string().optional(),
  features: z.string().optional(),
})

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireAdmin()
    const body = await req.json()
    const { tierId, price, features } = updateSchema.parse(body)

    const prefix = tierId === 'FREE' ? 'tier_free' : tierId === 'TIER_1' ? 'tier_1' : 'tier_2'

    if (price !== undefined) {
      await prisma.systemConfig.upsert({
        where: { key: `${prefix}_price` },
        create: { key: `${prefix}_price`, value: price, updatedBy: session.user.id },
        update: { value: price, updatedBy: session.user.id },
      })
    }

    if (features !== undefined) {
      await prisma.systemConfig.upsert({
        where: { key: `${prefix}_features` },
        create: { key: `${prefix}_features`, value: features, updatedBy: session.user.id },
        update: { value: features, updatedBy: session.user.id },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}
