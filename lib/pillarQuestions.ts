// Align Faith - Six Pillars Configuration
// Source of Truth: /SOURCE_OF_TRUTH.md
// Each pillar has 5 questions, each question has 5 options (1 = strongest alignment)

export type PillarType = 'SPIRITUAL' | 'MENTAL' | 'PHYSICAL' | 'FINANCIAL' | 'APPEARANCE' | 'INTIMACY';

export interface PillarOption {
    value: number; // 1-5 (1 = strongest)
    label: string;
}

export interface PillarQuestion {
    id: string;
    title: string;
    options: PillarOption[];
}

export interface PillarConfig {
    id: PillarType;
    name: string;
    weight: number; // Percentage weight for matching
    description: string;
    questions: PillarQuestion[];
}

// Pillar weights for matching algorithm (must total 100)
export const PILLAR_WEIGHTS: Record<PillarType, number> = {
    SPIRITUAL: 30,
    MENTAL: 20,
    INTIMACY: 20,
    FINANCIAL: 15,
    PHYSICAL: 10,
    APPEARANCE: 5,
};

// Hard stop pillars - large mismatches here disqualify regardless of overall score
export const HARD_STOP_QUESTIONS = [
    'spiritual_faith_centrality',
    'spiritual_faith_in_relationships',
    'intimacy_pace',
    'mental_accountability',
];

export const PILLAR_CONFIGS: PillarConfig[] = [
    // ==================== SPIRITUAL FITNESS ====================
    {
        id: 'SPIRITUAL',
        name: 'Spiritual Fitness',
        weight: 30,
        description: 'How your faith shows up in your daily life, decisions, and relationships. This is about belief, practice, community, and direction, not perfection.',
        questions: [
            {
                id: 'spiritual_faith_centrality',
                title: 'My Christian faith is best described as:',
                options: [
                    { value: 1, label: 'Central to my identity and daily decisions' },
                    { value: 2, label: 'Very important and regularly influences my choices' },
                    { value: 3, label: 'Important but not consistently guiding my decisions' },
                    { value: 4, label: 'Meaningful but still developing' },
                    { value: 5, label: 'Something I am still exploring' },
                ],
            },
            {
                id: 'spiritual_practice',
                title: 'My current spiritual practices are best described as:',
                options: [
                    { value: 1, label: 'Consistent prayer, Scripture, and discipleship' },
                    { value: 2, label: 'Regular prayer and Scripture with some structure' },
                    { value: 3, label: 'Inconsistent but intentional spiritual habits' },
                    { value: 4, label: 'Occasional prayer or Scripture' },
                    { value: 5, label: 'Not currently practicing spiritual disciplines' },
                ],
            },
            {
                id: 'spiritual_community',
                title: 'My faith is lived out in community primarily by how I engage with church and others:',
                options: [
                    { value: 1, label: 'Attend services and serve most weeks' },
                    { value: 2, label: 'Attend services regularly and serve occasionally' },
                    { value: 3, label: 'Attend services regularly but do not currently serve' },
                    { value: 4, label: 'Attend services occasionally' },
                    { value: 5, label: 'Not currently attending services' },
                ],
            },
            {
                id: 'spiritual_faith_in_relationships',
                title: 'My approach to faith within relationships is best described as:',
                options: [
                    { value: 1, label: 'Faith is a non-negotiable foundation' },
                    { value: 2, label: 'Faith is very important and openly shared' },
                    { value: 3, label: 'Faith matters but is not always central' },
                    { value: 4, label: 'Faith is personal and rarely discussed' },
                    { value: 5, label: 'Faith is not a significant factor' },
                ],
            },
            {
                id: 'spiritual_direction',
                title: 'Right now, my spiritual journey is best described as:',
                options: [
                    { value: 1, label: 'Deepening and intentionally growing' },
                    { value: 2, label: 'Stable and well established' },
                    { value: 3, label: 'Growing but inconsistent' },
                    { value: 4, label: 'Rebuilding after life changes' },
                    { value: 5, label: 'Early in my faith journey' },
                ],
            },
        ],
    },

    // ==================== MENTAL FITNESS ====================
    {
        id: 'MENTAL',
        name: 'Mental Fitness',
        weight: 20,
        description: 'How you think, respond, take responsibility, and handle life\'s pressures. This is about perspective, humility, and self-control, not diagnoses.',
        questions: [
            {
                id: 'mental_perspective',
                title: 'My overall perspective on life is best described as:',
                options: [
                    { value: 1, label: 'I know my life is not about me, and I live that out' },
                    { value: 2, label: 'I generally live with humility and perspective' },
                    { value: 3, label: 'I understand this but struggle to live it' },
                    { value: 4, label: 'I default to self-focused thinking under pressure' },
                    { value: 5, label: 'I mostly view life through my own needs' },
                ],
            },
            {
                id: 'mental_emotional_response',
                title: 'My approach to emotional responses is best described as:',
                options: [
                    { value: 1, label: 'I consistently think before I act' },
                    { value: 2, label: 'I usually pause and respond thoughtfully' },
                    { value: 3, label: 'Inconsistent but improving' },
                    { value: 4, label: 'I often react before thinking' },
                    { value: 5, label: 'I frequently react emotionally' },
                ],
            },
            {
                id: 'mental_accountability',
                title: 'My approach to responsibility is best described as:',
                options: [
                    { value: 1, label: 'I take ownership quickly without excuses' },
                    { value: 2, label: 'I usually take responsibility' },
                    { value: 3, label: 'I recognize my part but it takes time' },
                    { value: 4, label: 'I struggle with ownership when uncomfortable' },
                    { value: 5, label: 'I often deflect responsibility' },
                ],
            },
            {
                id: 'mental_conflict',
                title: 'My approach to conflict is best described as:',
                options: [
                    { value: 1, label: 'Calm, clear, and respectful' },
                    { value: 2, label: 'Generally healthy communication' },
                    { value: 3, label: 'Learning to handle conflict better' },
                    { value: 4, label: 'Defensive or avoidant' },
                    { value: 5, label: 'Escalates emotionally' },
                ],
            },
            {
                id: 'mental_direction',
                title: 'Right now, my mental and emotional direction is best described as:',
                options: [
                    { value: 1, label: 'Grounded and continuing to grow' },
                    { value: 2, label: 'Stable and well managed' },
                    { value: 3, label: 'Improving but inconsistent' },
                    { value: 4, label: 'Rebuilding after challenges' },
                    { value: 5, label: 'Early in developing emotional maturity' },
                ],
            },
        ],
    },

    // ==================== INTIMACY FITNESS ====================
    {
        id: 'INTIMACY',
        name: 'Intimacy Fitness',
        weight: 20,
        description: 'How you approach closeness, boundaries, trust, and emotional connection. This is about intention and maturity, not sexual experience or speed.',
        questions: [
            {
                id: 'intimacy_meaning',
                title: 'To me, intimacy is best described as:',
                options: [
                    { value: 1, label: 'Deep connection tied to commitment' },
                    { value: 2, label: 'Meaningful and intentional connection' },
                    { value: 3, label: 'Important but still being defined' },
                    { value: 4, label: 'Mostly about closeness and chemistry' },
                    { value: 5, label: 'Mostly physical or casual' },
                ],
            },
            {
                id: 'intimacy_emotional_closeness',
                title: 'When it comes to emotional closeness, I:',
                options: [
                    { value: 1, label: 'Build trust slowly and intentionally' },
                    { value: 2, label: 'Value trust and emotional safety' },
                    { value: 3, label: 'Am learning how to build closeness' },
                    { value: 4, label: 'Open up too quickly or too slowly' },
                    { value: 5, label: 'Struggle with emotional closeness' },
                ],
            },
            {
                id: 'intimacy_boundaries',
                title: 'My approach to physical boundaries is best described as:',
                options: [
                    { value: 1, label: 'Clear, consistent, and important' },
                    { value: 2, label: 'Clear but flexible' },
                    { value: 3, label: 'Still developing' },
                    { value: 4, label: 'Situational or inconsistent' },
                    { value: 5, label: 'Not a priority' },
                ],
            },
            {
                id: 'intimacy_pace',
                title: 'My preferred pace toward intimacy is:',
                options: [
                    { value: 1, label: 'Slow and intentional' },
                    { value: 2, label: 'Thoughtful and measured' },
                    { value: 3, label: 'Unsure and learning' },
                    { value: 4, label: 'Faster than ideal at times' },
                    { value: 5, label: 'Driven mostly by attraction' },
                ],
            },
            {
                id: 'intimacy_direction',
                title: 'Right now, my intimacy journey is best described as:',
                options: [
                    { value: 1, label: 'Healthy and aligned' },
                    { value: 2, label: 'Stable and managed well' },
                    { value: 3, label: 'Improving with awareness' },
                    { value: 4, label: 'Rebuilding after past experiences' },
                    { value: 5, label: 'Early in developing healthy intimacy' },
                ],
            },
        ],
    },

    // ==================== FINANCIAL FITNESS ====================
    {
        id: 'FINANCIAL',
        name: 'Financial Fitness',
        weight: 15,
        description: 'How you manage money, responsibility, and stability in your life. This is about stewardship and habits, not income or net worth.',
        questions: [
            {
                id: 'financial_stability',
                title: 'My current financial stability is best described as:',
                options: [
                    { value: 1, label: 'Bills are paid and I save money monthly' },
                    { value: 2, label: 'Bills are paid with a little left over' },
                    { value: 3, label: 'Bills are paid but money is tight' },
                    { value: 4, label: 'Bills are sometimes difficult to keep up with' },
                    { value: 5, label: 'Bills are often difficult to keep up with' },
                ],
            },
            {
                id: 'financial_discipline',
                title: 'My approach to budgeting and spending is best described as:',
                options: [
                    { value: 1, label: 'Highly disciplined with clear systems' },
                    { value: 2, label: 'Mostly disciplined with occasional lapses' },
                    { value: 3, label: 'Inconsistent but improving' },
                    { value: 4, label: 'Reactive with little structure' },
                    { value: 5, label: 'Avoiding budgeting or structure' },
                ],
            },
            {
                id: 'financial_debt',
                title: 'My relationship with debt is best described as:',
                options: [
                    { value: 1, label: 'No consumer debt and obligations are well managed' },
                    { value: 2, label: 'Some debt but fully planned' },
                    { value: 3, label: 'Moderate debt with an active plan' },
                    { value: 4, label: 'Heavy debt causing stress' },
                    { value: 5, label: 'Debt feels overwhelming' },
                ],
            },
            {
                id: 'financial_mindset',
                title: 'My mindset toward money and responsibility is best described as:',
                options: [
                    { value: 1, label: 'Long-term focused and intentional' },
                    { value: 2, label: 'Responsible with balanced priorities' },
                    { value: 3, label: 'Mixed mindset with progress and setbacks' },
                    { value: 4, label: 'Short-term focused due to pressure' },
                    { value: 5, label: 'Anxious or avoidant' },
                ],
            },
            {
                id: 'financial_direction',
                title: 'Right now, my financial journey is best described as:',
                options: [
                    { value: 1, label: 'Growing and strengthening intentionally' },
                    { value: 2, label: 'Stable and well established' },
                    { value: 3, label: 'Improving but inconsistent' },
                    { value: 4, label: 'Rebuilding after setbacks' },
                    { value: 5, label: 'Early in learning financial skills' },
                ],
            },
        ],
    },

    // ==================== PHYSICAL FITNESS ====================
    {
        id: 'PHYSICAL',
        name: 'Physical Fitness',
        weight: 10,
        description: 'How you care for your body through movement, health, and daily habits. This is about consistency and effort, not appearance or athleticism.',
        questions: [
            {
                id: 'physical_activity',
                title: 'My current level of physical activity is best described as:',
                options: [
                    { value: 1, label: 'I live to work out and train consistently' },
                    { value: 2, label: 'I work out to live and stay healthy' },
                    { value: 3, label: 'I exercise occasionally' },
                    { value: 4, label: 'I am active but not intentional' },
                    { value: 5, label: 'I rarely engage in physical activity' },
                ],
            },
            {
                id: 'physical_health_care',
                title: 'My approach to caring for my health is best described as:',
                options: [
                    { value: 1, label: 'Very intentional about health and recovery' },
                    { value: 2, label: 'Generally intentional' },
                    { value: 3, label: 'Aware but inconsistent' },
                    { value: 4, label: 'Mostly reactive' },
                    { value: 5, label: 'Not currently focused on health' },
                ],
            },
            {
                id: 'physical_nutrition',
                title: 'My eating habits are best described as:',
                options: [
                    { value: 1, label: 'I eat a very clean and healthy diet' },
                    { value: 2, label: 'I eat a very healthy diet, but it could be cleaner' },
                    { value: 3, label: 'I generally eat healthy but lack consistency' },
                    { value: 4, label: 'I often choose convenience' },
                    { value: 5, label: 'I do not pay much attention to what I eat' },
                ],
            },
            {
                id: 'physical_consistency',
                title: 'My consistency with health and fitness habits is best described as:',
                options: [
                    { value: 1, label: 'I am consistent all the time' },
                    { value: 2, label: 'I am consistent most of the time' },
                    { value: 3, label: 'I go through consistent and inconsistent phases' },
                    { value: 4, label: 'I am inconsistent most of the time' },
                    { value: 5, label: 'I am rarely consistent' },
                ],
            },
            {
                id: 'physical_direction',
                title: 'Right now, my physical fitness journey is best described as:',
                options: [
                    { value: 1, label: 'Strong and intentionally improving' },
                    { value: 2, label: 'Stable and maintained' },
                    { value: 3, label: 'Improving but inconsistent' },
                    { value: 4, label: 'Rebuilding after injury or life changes' },
                    { value: 5, label: 'Early in getting started' },
                ],
            },
        ],
    },

    // ==================== APPEARANCE FITNESS ====================
    {
        id: 'APPEARANCE',
        name: 'Appearance Fitness',
        weight: 5,
        description: 'How you present yourself and the effort you put into showing up well. This is about self-respect and awareness, not fashion or vanity.',
        questions: [
            {
                id: 'appearance_dress',
                title: 'My approach to how I dress is best described as:',
                options: [
                    { value: 1, label: 'I always take pride in how I\'m dressed and aim to dress one level above what\'s expected' },
                    { value: 2, label: 'I always dress well and appropriately' },
                    { value: 3, label: 'I am aware but inconsistent' },
                    { value: 4, label: 'I dress mostly for comfort' },
                    { value: 5, label: 'I give little thought to how I dress' },
                ],
            },
            {
                id: 'appearance_grooming',
                title: 'My daily grooming and hygiene are best described as:',
                options: [
                    { value: 1, label: 'Consistently clean, well groomed, and intentional' },
                    { value: 2, label: 'Consistently clean and well groomed' },
                    { value: 3, label: 'Clean but inconsistent with grooming' },
                    { value: 4, label: 'Basic hygiene with minimal effort' },
                    { value: 5, label: 'Struggle with consistency' },
                ],
            },
            {
                id: 'appearance_effort',
                title: 'The effort I put into my appearance is best described as:',
                options: [
                    { value: 1, label: 'I put effort into how I look because it matters to me' },
                    { value: 2, label: 'I usually put effort into how I look' },
                    { value: 3, label: 'I put effort in when it matters' },
                    { value: 4, label: 'I don\'t put much effort into how I look' },
                    { value: 5, label: 'I don\'t really think about my appearance' },
                ],
            },
            {
                id: 'appearance_consistency',
                title: 'How consistent I am with my appearance is best described as:',
                options: [
                    { value: 1, label: 'Consistent all the time' },
                    { value: 2, label: 'Consistent most of the time' },
                    { value: 3, label: 'On and off' },
                    { value: 4, label: 'Inconsistent most of the time' },
                    { value: 5, label: 'Rarely consistent' },
                ],
            },
            {
                id: 'appearance_direction',
                title: 'Right now, my appearance is best described as:',
                options: [
                    { value: 1, label: 'I consistently maintain a high standard' },
                    { value: 2, label: 'I maintain a good standard' },
                    { value: 3, label: 'I am improving' },
                    { value: 4, label: 'Inconsistent but working on it' },
                    { value: 5, label: 'Not currently focused on this area' },
                ],
            },
        ],
    },
];

// Helper to get pillar config by ID
export const getPillarConfig = (pillarId: PillarType): PillarConfig | undefined => {
    return PILLAR_CONFIGS.find(p => p.id === pillarId);
};

// Helper to get all question IDs
export const getAllQuestionIds = (): string[] => {
    return PILLAR_CONFIGS.flatMap(p => p.questions.map(q => q.id));
};

// User instruction shown during onboarding
export const ASSESSMENT_INSTRUCTION = "Choose the option that best describes where you are today, not where you want to be.";
