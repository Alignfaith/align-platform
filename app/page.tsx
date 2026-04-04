import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import HowItWorks from '@/components/HowItWorks'
import SixPillars from '@/components/SixPillars'
import CTASection from '@/components/CTASection'

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
