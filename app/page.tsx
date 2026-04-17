import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import HowItWorks from '@/components/HowItWorks'
import SixPillars from '@/components/SixPillars'
import CTASection from '@/components/CTASection'

export const metadata: Metadata = {
    title: 'ALIGN | Find Meaningful Connection for Christian Singles',
    description: 'ALIGN is a Christian dating platform where preparation comes before connection. Grow through the Six Pillars of Relationship Fitness and find God-centered love — built by Thomas Marks.',
    alternates: { canonical: 'https://app.alignfaith.com' },
    openGraph: {
        title: 'ALIGN | Find Meaningful Connection for Christian Singles',
        description: 'Prepare for meaningful, God-centered love. ALIGN guides Christian singles through the Six Pillars of Relationship Fitness before making a connection.',
        url: 'https://app.alignfaith.com',
        images: [{ url: '/icon.png', width: 192, height: 192, alt: 'ALIGN — Faith-Based Relationships' }],
    },
    twitter: {
        card: 'summary',
        title: 'ALIGN | Find Meaningful Connection for Christian Singles',
        description: 'Prepare for meaningful, God-centered love. ALIGN guides Christian singles through the Six Pillars of Relationship Fitness.',
    },
}

export default function Home() {
    return (
        <>
            <Header />
            <main>
                <Hero />
                <HowItWorks />
                <SixPillars />
                <CTASection />
            </main>
            <Footer />
        </>
    )
}
