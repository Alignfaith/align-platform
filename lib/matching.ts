// Align Faith - Matching Algorithm
// Source of Truth: /SOURCE_OF_TRUTH.md

import { PILLAR_WEIGHTS, HARD_STOP_QUESTIONS, PILLAR_CONFIGS, PillarType } from './pillarQuestions';
import { prisma } from '@/lib/prisma';

export interface UserAnswers {
    [questionId: string]: number; // 1-5 value
}

export interface MatchResult {
    overallScore: number; // 0-100
    pillarScores: Record<PillarType, number>;
    isHardStop: boolean;
    hardStopReasons: string[];
    alignmentTier: 'excellent' | 'strong' | 'moderate' | 'low' | 'incompatible';
}

export interface MatchingConfig {
    weights: Record<PillarType, number>;
    hardStopQuestions: string[];
    thresholds: {
        excellent: number;
        strong: number;
        moderate: number;
        low: number;
    };
}

// Default config (matches current hardcoded values)
const DEFAULT_CONFIG: MatchingConfig = {
    weights: { ...PILLAR_WEIGHTS },
    hardStopQuestions: [...HARD_STOP_QUESTIONS],
    thresholds: {
        excellent: 85,
        strong: 70,
        moderate: 50,
        low: 30,
    },
};

/**
 * Load matching config from SystemConfig DB, falling back to hardcoded defaults.
 * Config keys: matching_pillar_weights, matching_hard_stops, matching_thresholds
 */
export async function loadMatchingConfig(): Promise<MatchingConfig> {
    try {
        const configs = await prisma.systemConfig.findMany({
            where: {
                key: {
                    in: ['matching_pillar_weights', 'matching_hard_stops', 'matching_thresholds'],
                },
            },
        });

        const configMap = new Map(configs.map(c => [c.key, c.value]));

        const weights = configMap.has('matching_pillar_weights')
            ? JSON.parse(configMap.get('matching_pillar_weights')!) as Record<PillarType, number>
            : DEFAULT_CONFIG.weights;

        const hardStopQuestions = configMap.has('matching_hard_stops')
            ? JSON.parse(configMap.get('matching_hard_stops')!) as string[]
            : DEFAULT_CONFIG.hardStopQuestions;

        const thresholds = configMap.has('matching_thresholds')
            ? JSON.parse(configMap.get('matching_thresholds')!) as MatchingConfig['thresholds']
            : DEFAULT_CONFIG.thresholds;

        return { weights, hardStopQuestions, thresholds };
    } catch {
        // DB unavailable or query failed -- use defaults
        return DEFAULT_CONFIG;
    }
}

// Calculate distance between two answers (0 = same, 4 = max difference)
const calculateDistance = (answer1: number, answer2: number): number => {
    return Math.abs(answer1 - answer2);
};

// Convert distance to score (0-100 scale, higher = more aligned)
const distanceToScore = (distance: number): number => {
    // Distance 0 = 100, Distance 1 = 75, Distance 2 = 50, Distance 3 = 25, Distance 4 = 0
    return Math.max(0, 100 - (distance * 25));
};

// Check for hard stop conditions
const checkHardStops = (user1: UserAnswers, user2: UserAnswers, hardStopQuestions: string[]): string[] => {
    const reasons: string[] = [];

    for (const questionId of hardStopQuestions) {
        const answer1 = user1[questionId];
        const answer2 = user2[questionId];

        if (answer1 !== undefined && answer2 !== undefined) {
            const distance = calculateDistance(answer1, answer2);

            // Hard stop if one user is at 1 (strongest) and other is at 5 (weakest)
            if ((answer1 === 1 && answer2 === 5) || (answer1 === 5 && answer2 === 1)) {
                reasons.push(questionId);
            }

            // Also hard stop if distance is 4 (max) on critical questions
            if (distance === 4) {
                if (!reasons.includes(questionId)) {
                    reasons.push(questionId);
                }
            }
        }
    }

    return reasons;
};

// Calculate pillar score (average of all questions in pillar)
const calculatePillarScore = (
    pillarId: PillarType,
    user1: UserAnswers,
    user2: UserAnswers
): number => {
    const pillarConfig = PILLAR_CONFIGS.find(p => p.id === pillarId);
    if (!pillarConfig) return 0;
    
    let totalScore = 0;
    let answeredQuestions = 0;
    
    for (const question of pillarConfig.questions) {
        const answer1 = user1[question.id];
        const answer2 = user2[question.id];
        
        if (answer1 !== undefined && answer2 !== undefined) {
            const distance = calculateDistance(answer1, answer2);
            totalScore += distanceToScore(distance);
            answeredQuestions++;
        }
    }
    
    if (answeredQuestions === 0) return 0;
    return totalScore / answeredQuestions;
};

// Determine alignment tier from overall score
const getAlignmentTier = (
    score: number,
    isHardStop: boolean,
    thresholds: MatchingConfig['thresholds'] = DEFAULT_CONFIG.thresholds
): MatchResult['alignmentTier'] => {
    if (isHardStop) return 'incompatible';
    if (score >= thresholds.excellent) return 'excellent';
    if (score >= thresholds.strong) return 'strong';
    if (score >= thresholds.moderate) return 'moderate';
    if (score >= thresholds.low) return 'low';
    return 'incompatible';
};

// Main matching function (synchronous, uses provided or default config)
export const calculateMatch = (
    user1: UserAnswers,
    user2: UserAnswers,
    config: MatchingConfig = DEFAULT_CONFIG
): MatchResult => {
    // Check for hard stops first
    const hardStopReasons = checkHardStops(user1, user2, config.hardStopQuestions);
    const isHardStop = hardStopReasons.length > 0;

    // Calculate score for each pillar
    const pillarScores: Record<PillarType, number> = {
        SPIRITUAL: calculatePillarScore('SPIRITUAL', user1, user2),
        MENTAL: calculatePillarScore('MENTAL', user1, user2),
        INTIMACY: calculatePillarScore('INTIMACY', user1, user2),
        FINANCIAL: calculatePillarScore('FINANCIAL', user1, user2),
        PHYSICAL: calculatePillarScore('PHYSICAL', user1, user2),
        APPEARANCE: calculatePillarScore('APPEARANCE', user1, user2),
    };

    // Calculate weighted overall score using config weights
    let overallScore = 0;
    for (const [pillar, weight] of Object.entries(config.weights)) {
        const pillarScore = pillarScores[pillar as PillarType];
        overallScore += (pillarScore * weight) / 100;
    }

    // Determine alignment tier
    const alignmentTier = getAlignmentTier(overallScore, isHardStop, config.thresholds);

    return {
        overallScore: Math.round(overallScore),
        pillarScores,
        isHardStop,
        hardStopReasons,
        alignmentTier,
    };
};

/**
 * Async version that loads config from DB before calculating.
 * Use this in API routes where DB access is available.
 */
export const calculateMatchWithConfig = async (
    user1: UserAnswers,
    user2: UserAnswers
): Promise<MatchResult> => {
    const config = await loadMatchingConfig();
    return calculateMatch(user1, user2, config);
};

// Generate alignment summary for user display (no math shown)
export const getAlignmentSummary = (result: MatchResult): string => {
    switch (result.alignmentTier) {
        case 'excellent':
            return 'You share strong alignment across all six pillars. This is a highly compatible match worth exploring.';
        case 'strong':
            return 'You share solid alignment in the areas that matter most. A few differences add balance to potential relationship dynamics.';
        case 'moderate':
            return 'You share some common ground, with notable differences in key areas. Worth a conversation to understand each other better.';
        case 'low':
            return 'You have significant differences in important areas. Consider whether these align with your long-term goals.';
        case 'incompatible':
            return 'Based on your responses, there are foundational differences that may be difficult to navigate in a relationship.';
        default:
            return '';
    }
};

// Get pillar-specific insight for display
export const getPillarInsight = (pillarId: PillarType, score: number): string => {
    const pillarConfig = PILLAR_CONFIGS.find(p => p.id === pillarId);
    if (!pillarConfig) return '';
    
    if (score >= 85) {
        return `Strong alignment in ${pillarConfig.name.toLowerCase()}`;
    } else if (score >= 70) {
        return `Good alignment in ${pillarConfig.name.toLowerCase()}`;
    } else if (score >= 50) {
        return `Some differences in ${pillarConfig.name.toLowerCase()}`;
    } else {
        return `Notable differences in ${pillarConfig.name.toLowerCase()}`;
    }
};
