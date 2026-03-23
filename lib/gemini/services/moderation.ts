/**
 * Content Moderation Service
 * AI-powered moderation for messages, bios, and reflections
 */

import { generateJSON, modelConfigs, isGeminiAvailable } from '../client'
import {
  ModerationResult,
  ModerationRequest,
  ModerationFlag,
  ContentType,
  GeminiAPIResponse,
} from '../types'

/**
 * Moderate content for appropriateness
 */
export async function moderateContent(
  request: ModerationRequest
): Promise<GeminiAPIResponse<ModerationResult>> {
  const startTime = Date.now()

  if (!isGeminiAvailable()) {
    return {
      success: false,
      error: 'AI service not available - please configure GEMINI_API_KEY',
    }
  }

  // Quick pre-checks for obvious issues
  const quickCheck = performQuickChecks(request.content)
  if (quickCheck.shouldReject) {
    return {
      success: true,
      data: {
        approved: false,
        flags: quickCheck.flags,
        severity: 'high',
        suggestions: ['Please revise your content to align with community guidelines.'],
      },
      metadata: {
        modelUsed: 'quick-check',
        tokensUsed: 0,
        processingTime: Date.now() - startTime,
      },
    }
  }

  const prompt = buildModerationPrompt(request.content, request.contentType)

  try {
    const result = await generateJSON<ModerationResult>(prompt, modelConfigs.moderation)

    if (!result) {
      // Default to approved if AI fails (fail open for moderation)
      return {
        success: true,
        data: {
          approved: true,
          flags: [],
          severity: 'none',
        },
        metadata: {
          modelUsed: 'fallback',
          tokensUsed: 0,
          processingTime: Date.now() - startTime,
        },
      }
    }

    const validatedResult = validateModerationResult(result)

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
    console.error('Moderation error:', error)
    // Fail open for moderation errors
    return {
      success: true,
      data: {
        approved: true,
        flags: [],
        severity: 'none',
      },
      metadata: {
        modelUsed: 'error-fallback',
        tokensUsed: 0,
        processingTime: Date.now() - startTime,
      },
    }
  }
}

/**
 * Build the moderation prompt
 */
function buildModerationPrompt(content: string, contentType: ContentType): string {
  const contextMap: Record<ContentType, string> = {
    message: 'a direct message between users',
    bio: 'a user profile biography',
    reflection: 'a personal reflection response during registration',
    comment: 'a comment on shared content',
  }

  return `You are a content moderator for Align, a Christian dating platform focused on personal growth and faith-based relationships.

Review the following ${contextMap[contentType]} for appropriateness:

CONTENT:
"${content}"

Check for:
1. Inappropriate or explicit language
2. Suggestive or sexually explicit content
3. Spam or promotional content
4. Authenticity concerns (copy-pasted generic text, AI-generated fake content)
5. Harassment, hate speech, or discriminatory language
6. Contact information sharing attempts (phone numbers, social media handles, external links)
7. Disrespectful or un-Christian behavior

Return a JSON object with this exact structure:
{
  "approved": <boolean - true if content is acceptable>,
  "flags": [
    {
      "type": "<inappropriate|suggestive|spam|authenticity|harassment|other>",
      "description": "<brief description of the issue>",
      "confidence": <number 0-1 indicating confidence in this flag>
    }
  ],
  "suggestions": [<array of helpful suggestions if content needs revision>],
  "severity": "<none|low|medium|high>"
}

Guidelines:
- Be permissive of genuine expressions of faith, personal struggles, and growth
- Allow discussion of relationships, dating, and marriage in appropriate context
- Flag anything that would make users uncomfortable or violates Christian values
- Consider the platform's focus on preparation, growth, and intentional relationships`
}

/**
 * Quick pre-checks for obvious content issues
 */
function performQuickChecks(content: string): { shouldReject: boolean; flags: ModerationFlag[] } {
  const flags: ModerationFlag[] = []
  const lowerContent = content.toLowerCase()

  // Obvious spam patterns
  const spamPatterns = [
    /https?:\/\//i,
    /www\./i,
    /\.com|\.net|\.org/i,
    /telegram|whatsapp|instagram|snapchat/i,
    /\+\d{10,}/,
    /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/,
  ]

  for (const pattern of spamPatterns) {
    if (pattern.test(content)) {
      flags.push({
        type: 'spam',
        description: 'Contains external links or contact information',
        confidence: 0.9,
      })
    }
  }

  // Obvious explicit content
  const explicitPatterns = [
    /\b(sex|nude|naked|hookup|fwb)\b/i,
  ]

  for (const pattern of explicitPatterns) {
    if (pattern.test(lowerContent)) {
      flags.push({
        type: 'suggestive',
        description: 'Contains potentially explicit terms',
        confidence: 0.8,
      })
    }
  }

  return {
    shouldReject: flags.some(f => f.confidence > 0.85),
    flags,
  }
}

/**
 * Validate and normalize the moderation result
 */
function validateModerationResult(result: ModerationResult): ModerationResult {
  return {
    approved: Boolean(result.approved),
    flags: Array.isArray(result.flags) ? result.flags.map(flag => ({
      type: flag.type || 'other',
      description: flag.description || 'Unknown issue',
      confidence: typeof flag.confidence === 'number' ? Math.min(1, Math.max(0, flag.confidence)) : 0.5,
    })) : [],
    suggestions: Array.isArray(result.suggestions) ? result.suggestions : [],
    severity: ['none', 'low', 'medium', 'high'].includes(result.severity) ? result.severity : 'none',
  }
}

/**
 * Batch moderate multiple pieces of content
 */
export async function batchModerate(
  requests: ModerationRequest[]
): Promise<GeminiAPIResponse<ModerationResult>[]> {
  // Process in parallel with a concurrency limit
  const results: GeminiAPIResponse<ModerationResult>[] = []

  for (const request of requests) {
    const result = await moderateContent(request)
    results.push(result)
  }

  return results
}

/**
 * Check if content passes moderation (convenience function)
 */
export async function isContentApproved(
  content: string,
  contentType: ContentType
): Promise<boolean> {
  const result = await moderateContent({ content, contentType })
  return result.success && result.data?.approved === true
}
