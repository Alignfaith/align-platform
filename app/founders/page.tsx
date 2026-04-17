import type { Metadata } from 'next'
import FounderPage from '../founder/page'

export const metadata: Metadata = {
    title: 'Become a Founding Member | ALIGN',
    description: 'Apply to become a Founding Member of ALIGN. Get 3 months free access, a copy of Relationship Fitness by Thomas Marks, and help launch the first biblical relationship platform.',
    alternates: { canonical: 'https://app.alignfaith.com/founders' },
    openGraph: {
        title: 'Become a Founding Member | ALIGN',
        description: 'Limited spots available. Join ALIGN as a Founding Member — free access, Relationship Fitness by Thomas Marks, and priority entry into the first faith-based Christian dating platform.',
        url: 'https://app.alignfaith.com/founders',
        images: [{ url: '/icon.png', width: 192, height: 192, alt: 'ALIGN Founding Members' }],
    },
    twitter: {
        card: 'summary',
        title: 'Become a Founding Member | ALIGN',
        description: 'Limited spots. Apply to become an ALIGN Founding Member — free access, the Relationship Fitness book, and first entry into the Christian singles platform.',
    },
}

export default function FoundersPage() {
    return <FounderPage />
}
