export type PillarKey = 'SPIRITUAL' | 'FINANCIAL' | 'PHYSICAL' | 'MENTAL' | 'APPEARANCE' | 'INTIMACY'

export interface Option {
    value: number
    label: string
}

export interface Question {
    id: string
    pillar: PillarKey
    text: string
    options: Option[]
}

export interface PillarDef {
    key: PillarKey
    name: string
    description: string
    weight: number
    questions: Question[]
}

const opts = (labels: [string, string, string, string, string]): Option[] =>
    labels.map((label, i) => ({ value: i + 1, label }))

export const PILLARS: PillarDef[] = [
    {
        key: 'SPIRITUAL',
        name: 'Spiritual Fitness',
        description: 'Belief, practice, community, and direction',
        weight: 30,
        questions: [
            {
                id: 'spiritual_faith_centrality',
                pillar: 'SPIRITUAL',
                text: 'My Christian faith is best described as:',
                options: opts([
                    'Central to my identity and daily decisions',
                    'Very important and regularly influences my choices',
                    'Important but not consistently guiding my decisions',
                    'Meaningful but still developing',
                    'Something I am still exploring',
                ]),
            },
            {
                id: 'spiritual_practice',
                pillar: 'SPIRITUAL',
                text: 'My current spiritual practices are best described as:',
                options: opts([
                    'Consistent prayer, Scripture, and discipleship',
                    'Regular prayer and Scripture with some structure',
                    'Inconsistent but intentional spiritual habits',
                    'Occasional prayer or Scripture',
                    'Not currently practicing spiritual disciplines',
                ]),
            },
            {
                id: 'spiritual_community',
                pillar: 'SPIRITUAL',
                text: 'My faith is lived out in community primarily by how I engage with church and others:',
                options: opts([
                    'Attend services and serve most weeks',
                    'Attend services regularly and serve occasionally',
                    'Attend services regularly but do not currently serve',
                    'Attend services occasionally',
                    'Not currently attending services',
                ]),
            },
            {
                id: 'spiritual_faith_in_relationships',
                pillar: 'SPIRITUAL',
                text: 'My approach to faith within relationships is best described as:',
                options: opts([
                    'Faith is a non-negotiable foundation',
                    'Faith is very important and openly shared',
                    'Faith matters but is not always central',
                    'Faith is personal and rarely discussed',
                    'Faith is not a significant factor',
                ]),
            },
            {
                id: 'spiritual_direction',
                pillar: 'SPIRITUAL',
                text: 'Right now, my spiritual journey is best described as:',
                options: opts([
                    'Deepening and intentionally growing',
                    'Stable and well established',
                    'Growing but inconsistent',
                    'Rebuilding after life changes',
                    'Early in my faith journey',
                ]),
            },
            {
                id: 'spiritual_friends_faith',
                pillar: 'SPIRITUAL',
                text: 'My closest friends would describe my faith as:',
                options: opts([
                    'Deeply rooted. It shows in everything I do',
                    'Active and growing. I am consistent and intentional',
                    'Present but inconsistent. I have room to grow',
                    'Developing. I am still finding my foundation',
                    'Not a current priority in my life',
                ]),
            },
        ],
    },
    {
        key: 'FINANCIAL',
        name: 'Financial Fitness',
        description: 'Stewardship and habits, not income level',
        weight: 15,
        questions: [
            {
                id: 'financial_stability',
                pillar: 'FINANCIAL',
                text: 'My current financial stability is best described as:',
                options: opts([
                    'Bills are paid and I save money monthly',
                    'Bills are paid with a little left over',
                    'Bills are paid but money is tight',
                    'Bills are sometimes difficult to keep up with',
                    'Bills are often difficult to keep up with',
                ]),
            },
            {
                id: 'financial_discipline',
                pillar: 'FINANCIAL',
                text: 'My approach to budgeting and spending is best described as:',
                options: opts([
                    'Highly disciplined with clear systems',
                    'Mostly disciplined with occasional lapses',
                    'Inconsistent but improving',
                    'Reactive with little structure',
                    'Avoiding budgeting or structure',
                ]),
            },
            {
                id: 'financial_debt',
                pillar: 'FINANCIAL',
                text: 'My relationship with debt is best described as:',
                options: opts([
                    'No consumer debt and obligations are well managed',
                    'Some debt but fully planned',
                    'Moderate debt with an active plan',
                    'Heavy debt causing stress',
                    'Debt feels overwhelming',
                ]),
            },
            {
                id: 'financial_mindset',
                pillar: 'FINANCIAL',
                text: 'My mindset toward money and responsibility is best described as:',
                options: opts([
                    'Long-term focused and intentional',
                    'Responsible with balanced priorities',
                    'Mixed mindset with progress and setbacks',
                    'Short-term focused due to pressure',
                    'Anxious or avoidant',
                ]),
            },
            {
                id: 'financial_direction',
                pillar: 'FINANCIAL',
                text: 'Right now, my financial journey is best described as:',
                options: opts([
                    'Growing and strengthening intentionally',
                    'Stable and well established',
                    'Improving but inconsistent',
                    'Rebuilding after setbacks',
                    'Early in learning financial skills',
                ]),
            },
            {
                id: 'financial_friends_money',
                pillar: 'FINANCIAL',
                text: 'My closest friends would describe how I handle money as:',
                options: opts([
                    'Responsible and intentional. I have a plan',
                    'Generally disciplined. I make mostly good decisions',
                    'Getting better. I am more aware than I used to be',
                    'Inconsistent. I struggle with financial discipline',
                    'A work in progress. This is an area I need to develop',
                ]),
            },
        ],
    },
    {
        key: 'PHYSICAL',
        name: 'Physical Fitness',
        description: 'Consistency and effort, not appearance',
        weight: 10,
        questions: [
            {
                id: 'physical_activity',
                pillar: 'PHYSICAL',
                text: 'My current level of physical activity is best described as:',
                options: opts([
                    'I live to work out and train consistently',
                    'I work out to live and stay healthy',
                    'I exercise occasionally',
                    'I am active but not intentional',
                    'I rarely engage in physical activity',
                ]),
            },
            {
                id: 'physical_health_care',
                pillar: 'PHYSICAL',
                text: 'My approach to caring for my health is best described as:',
                options: opts([
                    'Very intentional about health and recovery',
                    'Generally intentional',
                    'Aware but inconsistent',
                    'Mostly reactive',
                    'Not currently focused on health',
                ]),
            },
            {
                id: 'physical_nutrition',
                pillar: 'PHYSICAL',
                text: 'My eating habits are best described as:',
                options: opts([
                    'I eat a very clean and healthy diet',
                    'I eat a very healthy diet, but it could be cleaner',
                    'I generally eat healthy but lack consistency',
                    'I often choose convenience',
                    'I do not pay much attention to what I eat',
                ]),
            },
            {
                id: 'physical_consistency',
                pillar: 'PHYSICAL',
                text: 'My consistency with health and fitness habits is best described as:',
                options: opts([
                    'I am consistent all the time',
                    'I am consistent most of the time',
                    'I go through consistent and inconsistent phases',
                    'I am inconsistent most of the time',
                    'I am rarely consistent',
                ]),
            },
            {
                id: 'physical_direction',
                pillar: 'PHYSICAL',
                text: 'Right now, my physical fitness journey is best described as:',
                options: opts([
                    'Strong and intentionally improving',
                    'Stable and maintained',
                    'Improving but inconsistent',
                    'Rebuilding after injury or life changes',
                    'Early in getting started',
                ]),
            },
            {
                id: 'physical_friends_fitness',
                pillar: 'PHYSICAL',
                text: 'My closest friends would describe my current physical fitness as:',
                options: opts([
                    'Disciplined and consistent. I take it seriously',
                    'Active and intentional. I make it a priority',
                    'Somewhat active. I could be more consistent',
                    'Inconsistent. I go through phases',
                    'Not a current focus in my life',
                ]),
            },
        ],
    },
    {
        key: 'MENTAL',
        name: 'Mental Fitness',
        description: 'Perspective, humility, and self-control',
        weight: 20,
        questions: [
            {
                id: 'mental_perspective',
                pillar: 'MENTAL',
                text: 'My overall perspective on life is best described as:',
                options: opts([
                    'I know my life is not about me, and I live that out',
                    'I generally live with humility and perspective',
                    'I understand this but struggle to live it',
                    'I default to self-focused thinking under pressure',
                    'I mostly view life through my own needs',
                ]),
            },
            {
                id: 'mental_emotional_response',
                pillar: 'MENTAL',
                text: 'My approach to emotional responses is best described as:',
                options: opts([
                    'I consistently think before I act',
                    'I usually pause and respond thoughtfully',
                    'Inconsistent but improving',
                    'I often react before thinking',
                    'I frequently react emotionally',
                ]),
            },
            {
                id: 'mental_accountability',
                pillar: 'MENTAL',
                text: 'My approach to responsibility is best described as:',
                options: opts([
                    'I take ownership quickly without excuses',
                    'I usually take responsibility',
                    'I recognize my part but it takes time',
                    'I struggle with ownership when uncomfortable',
                    'I often deflect responsibility',
                ]),
            },
            {
                id: 'mental_conflict',
                pillar: 'MENTAL',
                text: 'My approach to conflict is best described as:',
                options: opts([
                    'Calm, clear, and respectful',
                    'Generally healthy communication',
                    'Learning to handle conflict better',
                    'Defensive or avoidant',
                    'Escalates emotionally',
                ]),
            },
            {
                id: 'mental_direction',
                pillar: 'MENTAL',
                text: 'Right now, my mental and emotional direction is best described as:',
                options: opts([
                    'Grounded and continuing to grow',
                    'Stable and well managed',
                    'Improving but inconsistent',
                    'Rebuilding after challenges',
                    'Early in developing emotional maturity',
                ]),
            },
            {
                id: 'mental_friends_emotional_maturity',
                pillar: 'MENTAL',
                text: 'My closest friends would describe my emotional maturity as:',
                options: opts([
                    'Grounded and self-aware. I handle hard things well',
                    'Mostly mature. I manage well with occasional struggles',
                    'Growing. I am better than I used to be',
                    'Inconsistent. I am still working through some things',
                    'A work in progress. This is an area I need to develop',
                ]),
            },
        ],
    },
    {
        key: 'APPEARANCE',
        name: 'Appearance Fitness',
        description: 'Self-respect and awareness, not vanity',
        weight: 5,
        questions: [
            {
                id: 'appearance_dress',
                pillar: 'APPEARANCE',
                text: 'My approach to how I dress is best described as:',
                options: opts([
                    'I always take pride in how I\'m dressed and aim to dress one level above what\'s expected',
                    'I always dress well and appropriately',
                    'I am aware but inconsistent',
                    'I dress mostly for comfort',
                    'I give little thought to how I dress',
                ]),
            },
            {
                id: 'appearance_grooming',
                pillar: 'APPEARANCE',
                text: 'My daily grooming and hygiene are best described as:',
                options: opts([
                    'Consistently clean, well groomed, and intentional',
                    'Consistently clean and well groomed',
                    'Clean but inconsistent with grooming',
                    'Basic hygiene with minimal effort',
                    'Struggle with consistency',
                ]),
            },
            {
                id: 'appearance_effort',
                pillar: 'APPEARANCE',
                text: 'The effort I put into my appearance is best described as:',
                options: opts([
                    'I put effort into how I look because it matters to me',
                    'I usually put effort into how I look',
                    'I put effort in when it matters',
                    'I don\'t put much effort into how I look',
                    'I don\'t really think about my appearance',
                ]),
            },
            {
                id: 'appearance_consistency',
                pillar: 'APPEARANCE',
                text: 'How consistent I am with my appearance is best described as:',
                options: opts([
                    'Consistent all the time',
                    'Consistent most of the time',
                    'On and off',
                    'Inconsistent most of the time',
                    'Rarely consistent',
                ]),
            },
            {
                id: 'appearance_direction',
                pillar: 'APPEARANCE',
                text: 'Right now, my appearance is best described as:',
                options: opts([
                    'I consistently maintain a high standard',
                    'I maintain a good standard',
                    'I am improving',
                    'Inconsistent but working on it',
                    'Not currently focused on this area',
                ]),
            },
            {
                id: 'appearance_friends_presentation',
                pillar: 'APPEARANCE',
                text: 'My closest friends would describe how I present and carry myself as:',
                options: opts([
                    'Polished and intentional. I always show up well',
                    'Put together. I take pride in how I present myself',
                    'Casual but clean. I am aware but relaxed',
                    'Comfortable focused. I prioritize comfort',
                    'Inconsistent. It depends on the day',
                ]),
            },
        ],
    },
    {
        key: 'INTIMACY',
        name: 'Intimacy Fitness',
        description: 'Closeness, boundaries, trust, and emotional connection',
        weight: 20,
        questions: [
            {
                id: 'intimacy_meaning',
                pillar: 'INTIMACY',
                text: 'To me, intimacy is best described as:',
                options: opts([
                    'Deep connection tied to commitment',
                    'Meaningful and intentional connection',
                    'Important but still being defined',
                    'Mostly about closeness and chemistry',
                    'Mostly physical or casual',
                ]),
            },
            {
                id: 'intimacy_emotional_closeness',
                pillar: 'INTIMACY',
                text: 'When it comes to emotional closeness, I:',
                options: opts([
                    'Build trust slowly and intentionally',
                    'Value trust and emotional safety',
                    'Am learning how to build closeness',
                    'Open up too quickly or too slowly',
                    'Struggle with emotional closeness',
                ]),
            },
            {
                id: 'intimacy_boundaries',
                pillar: 'INTIMACY',
                text: 'My approach to physical boundaries is best described as:',
                options: opts([
                    'Clear, consistent, and important',
                    'Clear but flexible',
                    'Still developing',
                    'Situational or inconsistent',
                    'Not a priority',
                ]),
            },
            {
                id: 'intimacy_pace',
                pillar: 'INTIMACY',
                text: 'My preferred pace toward intimacy is:',
                options: opts([
                    'Slow and intentional',
                    'Thoughtful and measured',
                    'Unsure and learning',
                    'Faster than ideal at times',
                    'Driven mostly by attraction',
                ]),
            },
            {
                id: 'intimacy_direction',
                pillar: 'INTIMACY',
                text: 'Right now, my intimacy journey is best described as:',
                options: opts([
                    'Healthy and aligned',
                    'Stable and managed well',
                    'Improving with awareness',
                    'Rebuilding after past experiences',
                    'Early in developing healthy intimacy',
                ]),
            },
            {
                id: 'intimacy_friends_boundaries',
                pillar: 'INTIMACY',
                text: 'My closest friends would describe my approach to relationships and boundaries as:',
                options: opts([
                    'Intentional and mature. I move with purpose and clarity',
                    'Thoughtful. I value emotional safety and trust',
                    'Still developing. I am learning what healthy looks like',
                    'Inconsistent. I have patterns I am working through',
                    'A work in progress. This is an area I need to grow in',
                ]),
            },
        ],
    },
]

export const ALL_QUESTIONS: Question[] = PILLARS.flatMap((p) => p.questions)

/** Convert raw 1–5 value to 0–100 display score (1=100, 5=0) */
export function toDisplayScore(value: number): number {
    return Math.round(((5 - value) / 4) * 100)
}

/** Average display score for a set of responses */
export function pillarDisplayScore(responses: { value: number }[]): number {
    if (!responses.length) return 0
    const avg = responses.reduce((s, r) => s + r.value, 0) / responses.length
    return toDisplayScore(avg)
}
