import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { handleApiError, AuthenticationError, ValidationError } from '@/lib/errors'
import { moderationGate } from '@/lib/moderation-gate'
import { calculateAge, isValidAge } from '@/lib/security'

// New schema with pillarResponses (30 individual questions)
const pillarResponseSchema = z.object({
  questionId: z.string(),
  pillar: z.enum(['SPIRITUAL', 'MENTAL', 'PHYSICAL', 'FINANCIAL', 'APPEARANCE', 'INTIMACY']),
  value: z.number().min(1).max(5),
})

// Legacy schema for backwards compatibility
const legacyPillarScoreSchema = z.object({
  pillar: z.enum(['SPIRITUAL', 'MENTAL', 'PHYSICAL', 'FINANCIAL', 'APPEARANCE', 'INTIMACY']),
  selfScore: z.number().min(1).max(10),
})

const profileCompleteSchema = z.object({
  dateOfBirth: z.string().refine((val) => {
    const date = new Date(val)
    return !isNaN(date.getTime()) && isValidAge(date, 18)
  }, 'You must be 18 or older'),
  gender: z.enum(['MALE', 'FEMALE']),
  seekingGender: z.enum(['MALE', 'FEMALE']),
  country: z.string().max(100).optional(),
  city: z.string().min(1, 'City is required').max(100),
  state: z.string().min(1, 'State is required').max(100),
  bio: z.string().max(1000).optional(),
  relationshipGoal: z.enum(['MARRIAGE', 'SERIOUS_DATING', 'DISCERNING']),
  // Optional — pillar responses saved here for backward compatibility;
  // new flow saves them via /api/assessment after profile setup
  pillarResponses: z.array(pillarResponseSchema).optional(),
  pillarScores: z.array(legacyPillarScoreSchema).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new AuthenticationError()
    }

    const body = await req.json()
    const data = profileCompleteSchema.parse(body)

    // AI moderation check on bio if provided
    if (data.bio) {
      const mod = await moderationGate(data.bio, 'bio')
      if (mod.blocked) throw new ValidationError(mod.reason)
    }

    // Find existing profile
    const existingProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    })

    if (!existingProfile) {
      throw new ValidationError('Profile not found. Please register first.')
    }

    // Update profile and save responses in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update basic profile info
      const profile = await tx.profile.update({
        where: { userId: session.user.id },
        data: {
          dateOfBirth: new Date(data.dateOfBirth),
          gender: data.gender,
          seekingGender: data.seekingGender,
          city: data.city,
          state: data.state,
          country: data.country || 'USA',
          bio: data.bio || null,
          relationshipGoal: data.relationshipGoal,
          isComplete: true,
          completedAt: new Date(),
        },
      })

      // Handle new pillarResponses format (preferred)
      if (data.pillarResponses?.length) {
        for (const response of data.pillarResponses) {
          await tx.pillarResponse.upsert({
            where: {
              profileId_questionId: {
                profileId: profile.id,
                questionId: response.questionId,
              },
            },
            update: {
              value: response.value,
              pillar: response.pillar,
            },
            create: {
              profileId: profile.id,
              questionId: response.questionId,
              pillar: response.pillar,
              value: response.value,
            },
          })
        }

        // Calculate and store pillar scores (average of question values)
        const pillarAverages: Record<string, { total: number; count: number }> = {}
        for (const response of data.pillarResponses) {
          if (!pillarAverages[response.pillar]) {
            pillarAverages[response.pillar] = { total: 0, count: 0 }
          }
          pillarAverages[response.pillar].total += response.value
          pillarAverages[response.pillar].count += 1
        }

        for (const [pillar, { total, count }] of Object.entries(pillarAverages)) {
          // Convert 1-5 scale to 1-10 scale for backwards compatibility
          const avgScore = Math.round((total / count) * 2)
          await tx.pillarScore.upsert({
            where: {
              profileId_pillar: {
                profileId: profile.id,
                pillar: pillar as any,
              },
            },
            update: {
              selfScore: avgScore,
            },
            create: {
              profileId: profile.id,
              pillar: pillar as any,
              selfScore: avgScore,
            },
          })
        }
      }
      // Handle legacy pillarScores format
      else if (data.pillarScores?.length) {
        for (const score of data.pillarScores) {
          await tx.pillarScore.upsert({
            where: {
              profileId_pillar: {
                profileId: profile.id,
                pillar: score.pillar,
              },
            },
            update: {
              selfScore: score.selfScore,
            },
            create: {
              profileId: profile.id,
              pillar: score.pillar,
              selfScore: score.selfScore,
            },
          })
        }
      }

      return profile
    })

    return NextResponse.json({
      success: true,
      message: 'Profile completed successfully',
      profile: {
        id: result.id,
        isComplete: result.isComplete,
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}
