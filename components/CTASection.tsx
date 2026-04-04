import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function CTASection() {
    return (
        <section style={{
            background: 'var(--gradient-brand)',
            padding: 'var(--space-24) 0',
        }}>
            <div className="container">
                <div style={{
                    textAlign: 'center',
                    maxWidth: '640px',
                    margin: '0 auto',
                }}>
                    <h2 style={{
                        fontSize: 'clamp(1.875rem, 4vw, 3rem)',
                        fontWeight: 'var(--font-extrabold)',
                        color: '#ffffff',
                        marginBottom: 'var(--space-6)',
                        lineHeight: 1.2,
                    }}>
                        Ready to Prepare for the Love You Deserve?
                    </h2>
                    <p style={{
                        fontSize: 'var(--text-lg)',
                        color: 'rgba(255, 255, 255, 0.85)',
                        marginBottom: 'var(--space-10)',
                        lineHeight: 'var(--leading-relaxed)',
                    }}>
                        Healthy love is not something you stumble into. It is something you prepare for
                        with intention and faith.
                    </p>
                    <Link href="/register" className="btn btn--white btn--lg">
                        Get Started
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    )
}
