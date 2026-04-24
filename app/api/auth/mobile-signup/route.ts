import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import {
  hashPassword,
  emailSchema,
  passwordSchema,
  nameSchema,
  generateInviteCode,
} from '@/lib/security'
import { handleApiError, ConflictError, ValidationError } from '@/lib/errors'
import { checkRateLimit } from '@/lib/rate-limit-memory'

const mobileSignupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: nameSchema,
  lastName: nameSchema,
  hasReadBook: z.boolean(),
  understandsFramework: z.boolean(),
  agreesToGuidelines: z.boolean(),
  agreesToTerms: z.boolean(),
  supabaseUserId: z.string().uuid(),
  inviteCode: z.string().optional(),
})

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (checkRateLimit(ip, 'mobile-signup').limited) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const body = await req.json()
    const data = mobileSignupSchema.parse(body)

    if (
      !data.hasReadBook ||
      !data.understandsFramework ||
      !data.agreesToGuidelines ||
      !data.agreesToTerms
    ) {
      throw new ValidationError('You must accept all agreements to create an account.')
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      throw new ConflictError('An account with this email already exists')
    }

    let inviterId: string | null = null
    if (data.inviteCode) {
      const invite = await prisma.inviteCode.findFirst({
        where: {
          code: data.inviteCode.toUpperCase(),
          isActive: true,
          OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
      })

      if (!invite) {
        throw new ValidationError('Invalid or expired invite code')
      }

      if (invite.maxUses !== null && invite.usageCount >= invite.maxUses) {
        throw new ValidationError('Invite code has reached maximum uses')
      }

      inviterId = invite.ownerId
    }

    const passwordHash = await hashPassword(data.password)

    const user = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const newUser = await tx.user.create({
        data: {
          email: data.email,
          passwordHash,
          invitedById: inviterId,
          profile: {
            create: {
              firstName: data.firstName,
              lastName: data.lastName,
              dateOfBirth: new Date('2000-01-01'), // Placeholder — set during onboarding
              gender: 'MALE',                      // Placeholder — set during onboarding
              seekingGender: 'FEMALE',             // Placeholder — set during onboarding
              city: '',                            // Placeholder — set during onboarding
              state: '',                           // Placeholder — set during onboarding
              hasReadBook: data.hasReadBook,
              understandsFramework: data.understandsFramework,
              agreesToGuidelines: data.agreesToGuidelines,
              agreesToTerms: data.agreesToTerms,
              supabaseUserId: data.supabaseUserId,
            },
          },
        },
        include: { profile: true },
      })

      await tx.inviteCode.create({
        data: {
          code: generateInviteCode(),
          ownerId: newUser.id,
        },
      })

      if (data.inviteCode) {
        await tx.inviteCode.update({
          where: { code: data.inviteCode.toUpperCase() },
          data: { usageCount: { increment: 1 } },
        })
      }

      return newUser
    })

    return NextResponse.json(
      {
        userId: user.id,
        profileId: user.profile!.id,
        firstName: user.profile!.firstName,
        email: user.email,
      },
      { status: 201 }
    )
  } catch (error) {
    return handleApiError(error)
  }
}
