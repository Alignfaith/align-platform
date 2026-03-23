export type PillarType = 'SPIRITUAL' | 'MENTAL' | 'PHYSICAL' | 'FINANCIAL' | 'APPEARANCE' | 'INTIMACY';

export interface PillarMetadata {
    id: PillarType;
    name: string;
    description: string;
    reflectionPrompt: string;
    milestones: string[];
}

export const PILLARS_METADATA: Record<PillarType, PillarMetadata> = {
    SPIRITUAL: {
        id: 'SPIRITUAL',
        name: 'Spiritual Fitness',
        description: 'Your faith foundation and relationship with God.',
        reflectionPrompt: 'How has your prayer life or study of the Word been this week?',
        milestones: [
            'Daily quiet time established',
            'Actively serving in a local church',
            'Consistent prayer life',
        ]
    },
    MENTAL: {
        id: 'MENTAL',
        name: 'Mental Fitness',
        description: 'Emotional intelligence and clarity of thought.',
        reflectionPrompt: 'What was your biggest emotional hurdle this week and how did you handle it?',
        milestones: [
            'Emotional triggers identified',
            'Boundaries established with family/friends',
            'Growth mindset actively practiced',
        ]
    },
    PHYSICAL: {
        id: 'PHYSICAL',
        name: 'Physical Fitness',
        description: 'Body stewardship, health, and discipline.',
        reflectionPrompt: 'How did you honor your body through movement and nutrition this week?',
        milestones: [
            'Consistent exercise routine',
            'Disciplined sleep schedule',
            'Healthy eating habits',
        ]
    },
    FINANCIAL: {
        id: 'FINANCIAL',
        name: 'Financial Fitness',
        description: 'Stewardship of resources and financial wisdom.',
        reflectionPrompt: 'Did you follow your budget this week? Any wins in stewardship?',
        milestones: [
            'Budget created and followed',
            'Debt reduction plan in place',
            'Generosity (tithing) practiced',
        ]
    },
    APPEARANCE: {
        id: 'APPEARANCE',
        name: 'Appearance Fitness',
        description: 'Presenting yourself with dignity and intention.',
        reflectionPrompt: 'How are you presenting yourself to the world with dignity today?',
        milestones: [
            'Wardrobe reflects character and dignity',
            'Grooming habits established',
            'Confident self-presentation',
        ]
    },
    INTIMACY: {
        id: 'INTIMACY',
        name: 'Intimacy Fitness',
        description: 'Healthy boundaries and relational readiness.',
        reflectionPrompt: 'How have you practiced healthy boundaries or purity in your thoughts/actions?',
        milestones: [
            'Purity boundaries defined',
            'Relational baggage addressed',
            'Communication skills refined',
        ]
    }
};
