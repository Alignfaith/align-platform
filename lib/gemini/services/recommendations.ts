/**
 * Growth Recommendations Service
 * AI-powered personalized recommendations for personal development
 */

import { generateJSON, modelConfigs, isGeminiAvailable } from '../client'
import {
  GrowthRecommendation,
  RecommendationContext,
  UserProfileData,
  Pillar,
  GeminiAPIResponse,
} from '../types'

/**
 * Generate personalized growth recommendations
 */
export async function getGrowthRecommendations(
  context: RecommendationContext
): Promise<GeminiAPIResponse<GrowthRecommendation[]>> {
  const startTime = Date.now()

  if (!isGeminiAvailable()) {
    return {
      success: false,
      error: 'AI service not available - please configure GEMINI_API_KEY',
    }
  }

  const prompt = buildRecommendationsPrompt(context)

  try {
    const result = await generateJSON<{ recommendations: GrowthRecommendation[] }>(
      prompt,
      modelConfigs.recommendations
    )

    if (!result || !result.recommendations) {
      return {
        success: false,
        error: 'Failed to generate recommendations',
      }
    }

    const validatedResult = validateRecommendations(result.recommendations)

    return {
      success: true,
      data: validatedResult,
      metadata: {
        modelUsed: 'gemini-2.0-flash-exp',
        tokensUsed: 0,
        processingTime: Date.now() - startTime,
      },
    }
  } catch (error) {
    console.error('Recommendations error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Build the recommendations prompt
 */
function buildRecommendationsPrompt(context: RecommendationContext): string {
  const { userProfile, recentActivity, preferences } = context

  // Identify weakest pillars
  const pillarEntries = Object.entries(userProfile.pillars) as [Pillar, number][]
  const sortedPillars = pillarEntries.sort((a, b) => a[1] - b[1])
  const weakestPillars = sortedPillars.slice(0, 3)

  return `You are a personal development coach for Align, a Christian dating platform focused on the Six Pillars framework for relationship readiness.

Analyze this user's profile and provide personalized growth recommendations:

USER PROFILE (${userProfile.firstName}):
Pillar Scores (1-10 scale):
- Spiritual: ${userProfile.pillars.SPIRITUAL}
- Mental: ${userProfile.pillars.MENTAL}
- Physical: ${userProfile.pillars.PHYSICAL}
- Financial: ${userProfile.pillars.FINANCIAL}
- Appearance: ${userProfile.pillars.APPEARANCE}
- Intimacy: ${userProfile.pillars.INTIMACY}

Weakest Areas: ${weakestPillars.map(([pillar, score]) => `${pillar} (${score}/10)`).join(', ')}

${userProfile.reflections.length > 0 ? `Their Reflections: ${userProfile.reflections.join(' | ')}` : ''}

${recentActivity && recentActivity.length > 0 ? `Recent Activity:
${recentActivity.slice(0, 5).map(a => `- ${a.pillar}: ${a.action}`).join('\n')}` : ''}

${preferences?.focusAreas ? `User's Focus Preferences: ${preferences.focusAreas.join(', ')}` : ''}
${preferences?.learningStyle ? `Learning Style: ${preferences.learningStyle}` : ''}
${preferences?.timeCommitment ? `Time Commitment: ${preferences.timeCommitment}` : ''}

Generate 3-4 personalized growth recommendations focusing on their weakest pillars.

Return a JSON object with this exact structure:
{
  "recommendations": [
    {
      "pillar": "<SPIRITUAL|MENTAL|PHYSICAL|FINANCIAL|APPEARANCE|INTIMACY>",
      "action": "<specific, actionable recommendation>",
      "reason": "<why this is important for them>",
      "resources": ["<optional resource suggestions>"],
      "priority": "<high|medium|low>"
    }
  ]
}

Guidelines:
- Focus on the weakest pillars first
- Make recommendations specific and actionable
- Include faith-based elements where appropriate
- Consider their learning style and time commitment if provided
- Provide practical steps, not vague advice
- Each action should be achievable within a week or two`
}

/**
 * Validate and normalize recommendations
 */
function validateRecommendations(recommendations: GrowthRecommendation[]): GrowthRecommendation[] {
  const validPillars: Pillar[] = ['SPIRITUAL', 'MENTAL', 'PHYSICAL', 'FINANCIAL', 'APPEARANCE', 'INTIMACY']
  const validPriorities = ['high', 'medium', 'low']

  return recommendations
    .filter(rec => rec && typeof rec === 'object')
    .map(rec => ({
      pillar: validPillars.includes(rec.pillar) ? rec.pillar : 'SPIRITUAL',
      action: typeof rec.action === 'string' ? rec.action : 'Set a personal growth goal',
      reason: typeof rec.reason === 'string' ? rec.reason : 'Growth in this area supports overall development',
      resources: Array.isArray(rec.resources) ? rec.resources : [],
      priority: validPriorities.includes(rec.priority) ? rec.priority as 'high' | 'medium' | 'low' : 'medium',
    }))
    .slice(0, 5)
}

/**
 * Get recommendations for a specific pillar
 */
export async function getPillarRecommendation(
  profile: UserProfileData,
  pillar: Pillar
): Promise<GeminiAPIResponse<GrowthRecommendation>> {
  const startTime = Date.now()

  if (!isGeminiAvailable()) {
    return {
      success: false,
      error: 'AI service not available',
    }
  }

  const pillarDescriptions: Record<Pillar, string> = {
    SPIRITUAL: 'faith, prayer life, spiritual disciplines, and relationship with God',
    MENTAL: 'emotional intelligence, mindset, communication skills, and mental health',
    PHYSICAL: 'fitness, nutrition, sleep, and physical health stewardship',
    FINANCIAL: 'budgeting, saving, generosity, and financial wisdom',
    APPEARANCE: 'personal presentation, grooming, style, and self-confidence',
    INTIMACY: 'healthy boundaries, emotional connection, and relationship preparation',
  }

  const prompt = `You are a personal development coach. Provide ONE specific, actionable recommendation for improving ${pillar} fitness.

User's current ${pillar} score: ${profile.pillars[pillar]}/10

${pillar} encompasses: ${pillarDescriptions[pillar]}

Return a JSON object:
{
  "pillar": "${pillar}",
  "action": "<specific actionable step>",
  "reason": "<why this matters>",
  "resources": ["<1-2 optional resources>"],
  "priority": "high"
}`

  try {
    const result = await generateJSON<GrowthRecommendation>(prompt, modelConfigs.recommendations)

    if (!result) {
      return {
        success: false,
        error: 'Failed to generate recommendation',
      }
    }

    return {
      success: true,
      data: {
        pillar,
        action: result.action || 'Set a specific goal in this area',
        reason: result.reason || 'Growth supports relationship readiness',
        resources: result.resources || [],
        priority: result.priority || 'medium',
      },
      metadata: {
        modelUsed: 'gemini-2.0-flash-exp',
        tokensUsed: 0,
        processingTime: Date.now() - startTime,
      },
    }
  } catch (error) {
    console.error('Pillar recommendation error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Identify user's weakest pillars
 */
export function identifyWeakestPillars(profile: UserProfileData, count: number = 2): Pillar[] {
  const pillarEntries = Object.entries(profile.pillars) as [Pillar, number][]
  return pillarEntries
    .sort((a, b) => a[1] - b[1])
    .slice(0, count)
    .map(([pillar]) => pillar)
}

/**
 * Calculate overall growth score
 */
export function calculateGrowthScore(profile: UserProfileData): number {
  const scores = Object.values(profile.pillars)
  const avg = scores.reduce((sum, score) => sum + score, 0) / scores.length
  return Math.round(avg * 10) // Convert 1-10 scale to percentage
}
