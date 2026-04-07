// lib/matching.ts
const PILLAR_WEIGHTS: Record<string, number> = {
  SPIRITUAL:  0.30,
  MENTAL:     0.20,
  INTIMACY:   0.20,
  FINANCIAL:  0.15,
  PHYSICAL:   0.10,
  APPEARANCE: 0.05,
}

const THRESHOLDS = [
  { min: 85, label: 'Excellent' },
  { min: 70, label: 'Strong' },
  { min: 50, label: 'Moderate' },
  { min: 30, label: 'Low' },
  { min: 0,  label: 'No Match' },
]

const HARD_STOP_QUESTIONS = [
  { questionId: 'spiritual_faith_centrality', maxDistance: 3, label: 'Faith Centrality' },
  { questionId: 'spiritual_faith_in_relationships', maxDistance: 3, label: 'Faith in Relationships' },
  { questionId: 'intimacy_pace', maxDistance: 3, label: 'Intimacy Pace' },
  { questionId: 'mental_accountability', maxDistance: 3, label: 'Accountability' },
]

export type PillarAnswers = Record<string, number>

export type PillarBreakdown = Record<string, {
  pillarScore: number
  contribution: number
  weight: number
  questionCount: number
}>

export type MatchResult = {
  score: number | null
  tier: string | null
  hardStopTriggered: boolean
  hardStopReason: string | null
  pillarBreakdown: PillarBreakdown | null
}

export function calculateMatch(answersA: PillarAnswers, answersB: PillarAnswers): MatchResult {
  for (const hs of HARD_STOP_QUESTIONS) {
    const a = answersA[hs.questionId]
    const b = answersB[hs.questionId]
    if (a == null || b == null) continue
    if (Math.abs(a - b) > hs.maxDistance) {
      return { score: null, tier: 'Disqualified', hardStopTriggered: true, hardStopReason: hs.label, pillarBreakdown: null }
    }
  }

  const pillarGroups: Record<string, { a: number; b: number }[]> = {}
  for (const questionId of Object.keys(answersA)) {
    const b = answersB[questionId]
    if (b == null) continue
    const pillar = derivePillar(questionId)
    if (!pillar) continue
    if (!pillarGroups[pillar]) pillarGroups[pillar] = []
    pillarGroups[pillar].push({ a: answersA[questionId], b })
  }

  const pillarBreakdown: PillarBreakdown = {}
  let totalScore = 0

  for (const [pillar, questions] of Object.entries(pillarGroups)) {
    const weight = PILLAR_WEIGHTS[pillar]
    if (!weight) continue
    const pillarScore = questions.reduce((sum, { a, b }) => sum + (1 - Math.abs(a - b) / 4) * 100, 0) / questions.length
    const contribution = pillarScore * weight
    totalScore += contribution
    pillarBreakdown[pillar] = { pillarScore: Math.round(pillarScore), contribution: Math.round(contribution * 10) / 10, weight, questionCount: questions.length }
  }

  const score = Math.round(totalScore)
  return { score, tier: getTier(score), hardStopTriggered: false, hardStopReason: null, pillarBreakdown }
}

function getTier(score: number): string {
  for (const t of THRESHOLDS) { if (score >= t.min) return t.label }
  return 'No Match'
}

function derivePillar(questionId: string): string | null {
  if (questionId.startsWith('spiritual'))  return 'SPIRITUAL'
  if (questionId.startsWith('mental'))     return 'MENTAL'
  if (questionId.startsWith('intimacy'))   return 'INTIMACY'
  if (questionId.startsWith('financial'))  return 'FINANCIAL'
  if (questionId.startsWith('physical'))   return 'PHYSICAL'
  if (questionId.startsWith('appearance')) return 'APPEARANCE'
  return null
}

export function rankMatches(myAnswers: PillarAnswers, candidates: { profileId: string; answers: PillarAnswers }[]) {
  return candidates
    .map(({ profileId, answers }) => ({ profileId, ...calculateMatch(myAnswers, answers) }))
    .sort((a, b) => {
      if (a.hardStopTriggered && !b.hardStopTriggered) return 1
      if (!a.hardStopTriggered && b.hardStopTriggered) return -1
      return (b.score ?? 0) - (a.score ?? 0)
    })
}

export async function loadMatchingConfig() {
  const { prisma } = await import('@/lib/prisma')
  const configs = await prisma.systemConfig.findMany({
    where: { key: { in: ['matching_pillar_weights', 'matching_hard_stops', 'matching_thresholds'] } },
  })
  const map = Object.fromEntries(configs.map((c) => [c.key, JSON.parse(c.value)]))
  const defaultWeights: Record<string, number> = {
    SPIRITUAL: 30, MENTAL: 20, INTIMACY: 20, FINANCIAL: 15, PHYSICAL: 10, APPEARANCE: 5,
  }
  return {
    weights: map['matching_pillar_weights'] ?? defaultWeights,
    hardStopQuestions: map['matching_hard_stops'] ?? HARD_STOP_QUESTIONS.map((h) => h.questionId),
    thresholds: map['matching_thresholds'] ?? { excellent: 85, strong: 70, moderate: 50, low: 30 },
  }
}
