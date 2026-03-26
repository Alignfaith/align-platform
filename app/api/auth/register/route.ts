import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { hashPassword, emailSchema, passwordSchema, nameSchema, generateInviteCode } from '@/lib/security'
import { handleApiError, ConflictError, ValidationError } from '@/lib/errors'

const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: nameSchema,
  lastName: nameSchema,
  reflections: z
    .array(z.string().min(50, 'Each reflection must be at least 50 characters'))
    .length(3, 'Exactly 3 reflections required'),
  hasReadBook: z.boolean(),
  understandsFramework: z.boolean(),
  agreesToGuidelines: z.boolean(),
  agreesToTerms: z.boolean(),
  inviteCode: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = registerSchema.parse(body)

    // Check required agreements
    if (!data.agreesToGuidelines || !data.agreesToTerms) {
      throw new ValidationError('You must agree to the guidelines and terms')
    }

    // Check if email exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      throw new ConflictError('Email already registered')
    }

    // Validate invite code if provided
    let inviterId: string | null = null
    if (data.inviteCode) {
      const invite = await prisma.inviteCode.findFirst({
        where: {
          code: data.inviteCode.toUpperCase(),
          isActive: true,
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } },
          ],
        },
      })

      if (!invite) {
        throw new ValidationError('Invalid or expired invite code')
      }

      // Check max uses
      if (invite.maxUses !== null && invite.usageCount >= invite.maxUses) {
        throw new ValidationError('Invite code has reached maximum uses')
      }

      inviterId = invite.ownerId
    }

    // Hash password
    const passwordHash = await hashPassword(data.password)

    // Create user with profile in a transaction
    const user = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Create user
      const newUser = await tx.user.create({
        data: {
          email: data.email,
          passwordHash,
          invitedById: inviterId,
          profile: {
            create: {
              firstName: data.firstName,
              lastName: data.lastName,
              dateOfBirth: new Date('2000-01-01'), // Placeholder - set in profile setup
              gender: 'MALE', // Placeholder - set in profile setup
              seekingGender: 'FEMALE', // Placeholder - set in profile setup
              city: '', // Set in profile setup
              state: '', // Set in profile setup
              hasReadBook: data.hasReadBook,
              understandsFramework: data.understandsFramework,
              agreesToGuidelines: data.agreesToGuidelines,
              agreesToTerms: data.agreesToTerms,
              reflections: {
                createMany: {
                  data: data.reflections.map((answer, index) => ({
                    questionId: index + 1,
                    answer,
                  })),
                },
              },
            },
          },
        },
        include: { profile: true },
      })

      // Generate invite code for new user
      await tx.inviteCode.create({
        data: {
          code: generateInviteCode(),
          ownerId: newUser.id,
        },
      })

      // Update invite usage if used
      if (data.inviteCode) {
        await tx.inviteCode.update({
          where: { code: data.inviteCode.toUpperCase() },
          data: { usageCount: { increment: 1 } },
        })
      }

      return newUser
    })

    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      userId: user.id,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
