import type { Metadata } from 'next'
import AlignmentStoriesClient from './AlignmentStoriesClient'

export const metadata: Metadata = {
    title: 'Alignment Stories | Real Faith-Based Relationship Journeys',
    description: 'Read real stories from ALIGN members — Christian singles who grew through the Six Pillars framework and found God-centered love and meaningful biblical connection.',
    alternates: { canonical: 'https://app.alignfaith.com/alignment-stories' },
    openGraph: {
        title: 'Alignment Stories | Real Faith-Based Relationship Journeys',
        description: 'Real testimonials from Christian singles on ALIGN. Members share how faith-centered preparation through the Six Pillars transformed their relationships and lives.',
        url: 'https://app.alignfaith.com/alignment-stories',
        images: [{ url: '/icon.png', width: 192, height: 192, alt: 'ALIGN — Alignment Stories' }],
    },
    twitter: {
        card: 'summary',
        title: 'Alignment Stories | ALIGN',
        description: 'Real stories from Christian singles who grew through the Six Pillars of Relationship Fitness and found meaningful, God-centered connection.',
    },
}

export default function AlignmentStoriesPage() {
    return <AlignmentStoriesClient />
}
