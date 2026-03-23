/**
 * Profile Compatibility Analysis Service
 * Analyzes compatibility between two user profiles based on the Six Pillars framework
 */

import { generateJSON, modelConfigs, isGeminiAvailable } from '../client'
import {
  CompatibilityResult,
  CompatibilityRequest,
  UserProfileData,
  GeminiAPIResponse,
} from '../types'

/**
 * Analyzes compatibility between two user profiles
 */
export async function analyzeCompatibility(
  request: CompatibilityRequest
): Promise<GeminiAPIResponse<CompatibilityResult>> {
  const startTime = Date.now()

  if (!isGeminiAvailable()) {
    return {
      success: false,
      error: 'AI service not available - please configure GEMINI_API_KEY',
    }
  }

  const prompt = buildCompatibilityPrompt(request.userProfile, request.targetProfile)

  try {
    const result = await generateJSON<CompatibilityResult>(prompt, modelConfigs.compatibility)

    if (!result) {
      return {
        success: false,
        error: 'Failed to generate compatibility analysis',
      }
    }

    // Validate and normalize the result
    const validatedResult = validateCompatibilityResult(result)

    return {
      success: true,
      data: validatedResult,
      metadata: {
        modelUsed: 'gemini-2.0-flash-exp',
        tokensUsed: 0, // Would need to extract from response
        processingTime: Date.now() - startTime,
      },
    }
  } catch (error) {
    console.error('Compatibility analysis error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Build the prompt for compatibility analysis
 */
function buildCompatibilityPrompt(
  profile1: UserProfileData,
  profile2: UserProfileData
): string {
  return `You are an expert relationship counselor analyzing compatibility between two individuals on a Christian dating platform called Align. The platform uses the "Six Pillars" framework for personal development and relationship readiness.

The Six Pillars are:
1. SPIRITUAL - Faith, prayer life, spiritual maturity
2. MENTAL - Emotional intelligence, communication, mindset
3. PHYSICAL - Health, fitness, physical stewardship
4. FINANCIAL - Money management, generosity, financial wisdom
5. APPEARANCE - Self-presentation, personal care, confidence
6. INTIMACY - Healthy boundaries, emotional connection preparation

Analyze the compatibility between these two profiles:

PROFILE 1 (${profile1.firstName}):
- Pillar Scores (1-10 scale):
  * Spiritual: ${profile1.pillars.SPIRITUAL}
  * Mental: ${profile1.pillars.MENTAL}
  * Physical: ${profile1.pillars.PHYSICAL}
  * Financial: ${profile1.pillars.FINANCIAL}
  * Appearance: ${profile1.pillars.APPEARANCE}
  * Intimacy: ${profile1.pillars.INTIMACY}
${profile1.reflections.length > 0 ? `- Reflections: ${profile1.reflections.join(' | ')}` : ''}
${profile1.bio ? `- Bio: ${profile1.bio}` : ''}

PROFILE 2 (${profile2.firstName}):
- Pillar Scores (1-10 scale):
  * Spiritual: ${profile2.pillars.SPIRITUAL}
  * Mental: ${profile2.pillars.MENTAL}
  * Physical: ${profile2.pillars.PHYSICAL}
  * Financial: ${profile2.pillars.FINANCIAL}
  * Appearance: ${profile2.pillars.APPEARANCE}
  * Intimacy: ${profile2.pillars.INTIMACY}
${profile2.reflections.length > 0 ? `- Reflections: ${profile2.reflections.join(' | ')}` : ''}
${profile2.bio ? `- Bio: ${profile2.bio}` : ''}

Analyze their compatibility and return a JSON object with this exact structure:
{
  "score": <number 0-100 representing overall compatibility>,
  "pillarsAlignment": {
    "SPIRITUAL": <number 0-100>,
    "MENTAL": <number 0-100>,
    "PHYSICAL": <number 0-100>,
    "FINANCIAL": <number 0-100>,
    "APPEARANCE": <number 0-100>,
    "INTIMACY": <number 0-100>
  },
  "insights": [<3-5 strings describing key compatibility points>],
  "growthAreas": [<2-4 strings describing areas where they could grow together>],
  "strengths": [<2-4 strings describing complementary strengths>]
}

Focus on:
- Value alignment, especially in faith and life priorities
- Complementary strengths where one person is strong where the other needs growth
- Shared growth potential and mutual support opportunities
- Realistic assessment based on the pillar scores and reflections`
}

/**
 * Validate and normalize the compatibility result
 */
function validateCompatibilityResult(result: CompatibilityResult): CompatibilityResult {
  return {
    score: Math.min(100, Math.max(0, Math.round(result.score))),
    pillarsAlignment: {
      SPIRITUAL: normalizeScore(result.pillarsAlignment?.SPIRITUAL),
      MENTAL: normalizeScore(result.pillarsAlignment?.MENTAL),
      PHYSICAL: normalizeScore(result.pillarsAlignment?.PHYSICAL),
      FINANCIAL: normalizeScore(result.pillarsAlignment?.FINANCIAL),
      APPEARANCE: normalizeScore(result.pillarsAlignment?.APPEARANCE),
      INTIMACY: normalizeScore(result.pillarsAlignment?.INTIMACY),
    },
    insights: Array.isArray(result.insights) ? result.insights.slice(0, 5) : [],
    growthAreas: Array.isArray(result.growthAreas) ? result.growthAreas.slice(0, 4) : [],
    strengths: Array.isArray(result.strengths) ? result.strengths.slice(0, 4) : [],
  }
}

/**
 * Normalize a score to 0-100 range
 */
function normalizeScore(score: number | undefined): number {
  if (score === undefined || isNaN(score)) return 50
  return Math.min(100, Math.max(0, Math.round(score)))
}

/**
 * Quick compatibility check (lighter weight than full analysis)
 */
export async function quickCompatibilityCheck(
  profile1: UserProfileData,
  profile2: UserProfileData
): Promise<number> {
  // Calculate a basic compatibility score based on pillar score differences
  const pillars = ['SPIRITUAL', 'MENTAL', 'PHYSICAL', 'FINANCIAL', 'APPEARANCE', 'INTIMACY'] as const

  let totalDiff = 0
  for (const pillar of pillars) {
    const diff = Math.abs(profile1.pillars[pillar] - profile2.pillars[pillar])
    totalDiff += diff
  }

  // Average difference across 6 pillars, max diff per pillar is 10
  // Convert to 0-100 score where lower difference = higher compatibility
  const avgDiff = totalDiff / 6
  const score = Math.round(100 - (avgDiff * 10))

  return Math.min(100, Math.max(0, score))
}
