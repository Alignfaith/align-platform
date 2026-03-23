import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Heart } from 'lucide-react'

export default function CTASection() {
    return (
        <section className="cta-section">
            {/* Background image */}
            <div className="cta-section__background">
                <Image
                    src="https://images.unsplash.com/photo-1494774157365-9e04c6720e47?w=1920&q=80"
                    alt="Couple walking together at sunset"
                    fill
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                />
                <div className="cta-section__overlay" />
            </div>

            <div className="container">
                <div className="cta-section__content">
                    <div className="cta-section__badge">
                        <Heart size={14} />
                        <span>Start Your Story</span>
                    </div>

                    <h2 className="cta-section__title">
                        Ready to Be <span className="cta-section__title-accent">Align</span>?
                    </h2>

                    <p className="cta-section__description">
                        Healthy love is not something you stumble into. It is something you prepare for
                        with intention and faith. If you are ready to break cycles, strengthen your foundation,
                        and step into the version of yourself God has called you to be—this is your path.
                    </p>

                    <div className="cta-section__actions">
                        <Link href="/register" className="btn btn--primary btn--lg">
                            Begin Your Journey
                            <ArrowRight size={20} />
                        </Link>
                        <Link href="/book" className="btn btn--glass btn--lg">
                            Get the Book
                        </Link>
                    </div>

                    <p className="cta-section__book-quote">
                        "Relationship Fitness: Preparing yourself for the love you desire" by Thomas Marks
                    </p>
                </div>
            </div>
        </section>
    )
}
