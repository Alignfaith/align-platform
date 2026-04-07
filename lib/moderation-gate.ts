/**
 * Moderation gate — reads ai_moderation_enabled feature flag and,
 * if on, runs content through the Gemini moderation service.
 *
 * Returns { blocked: false } when:
 *   - flag is off
 *   - GEMINI_API_KEY not configured (fails open)
 *   - AI service errors (fails open)
 *
 * Returns { blocked: true, reason } when content fails moderation.
 */

import { prisma } from '@/lib/prisma'
import { isContentApproved } from '@/lib/gemini/services/moderation'
import { ContentType } from '@/lib/gemini/types'

let flagCache: { value: boolean; fetchedAt: number } | null = null
const FLAG_TTL_MS = 60_000 // re-read flag at most once per minute

async function isModerationEnabled(): Promise<boolean> {
  const now = Date.now()
  if (flagCache && now - flagCache.fetchedAt < FLAG_TTL_MS) {
    return flagCache.value
  }
  try {
    const flag = await prisma.featureFlag.findUnique({
      where: { key: 'ai_moderation_enabled' },
      select: { value: true },
    })
    const value = flag?.value ?? false
    flagCache = { value, fetchedAt: now }
    return value
  } catch {
    return false // fail open if DB read fails
  }
}

export async function moderationGate(
  content: string,
  contentType: ContentType
): Promise<{ blocked: false } | { blocked: true; reason: string }> {
  const enabled = await isModerationEnabled()
  if (!enabled) return { blocked: false }

  const trimmed = content?.trim()
  if (!trimmed) return { blocked: false }

  try {
    const approved = await isContentApproved(trimmed, contentType)
    if (!approved) {
      return {
        blocked: true,
        reason: 'Your content was flagged by our moderation system. Please revise it to align with community guidelines.',
      }
    }
  } catch {
    // Fail open — never block submission due to an AI service error
    return { blocked: false }
  }

  return { blocked: false }
}
