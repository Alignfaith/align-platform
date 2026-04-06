import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SixPillars from '@/components/SixPillars'
import Link from 'next/link'
import { BookOpen, Heart, Users, Shield, ArrowRight } from 'lucide-react'

export default function AboutPage() {
    return (
        <>
            <Header />
            <main style={{ paddingTop: 'var(--header-height)' }}>
                {/* Hero */}
                <section className="section section--primary">
                    <div className="container">
                        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                            <h1 style={{ marginBottom: 'var(--space-4)' }}>About Align</h1>
                            <p simport Header from '@/components/Header'
import Footer from '@/components/Footer'
import SixPillars from '@/components/SixPillars'
import Link from 'next/link'
import { BookOpen, Sun, Shield, Heart } from 'lucide-react'

export default function AboutPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');

        .about-hero {
          background: linear-gradient(160deg, #c0182a 0%, #8b0e1d 100%);
          padding: 80px 40px;
          text-align: center;
        }
        .about-eyebrow {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.6);
          margin-bottom: 20px;
        }
        .about-hero h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(36px, 6vw, 56px);
          font-weight: 700;
          color: #fff;
          line-height: 1.15;
          margin-bottom: 16px;
        }
        .about-hero h1 em { font-style: italic; color: rgba(255,255,255,0.82); }
        .about-hero-sub {
          font-size: 17px;
          color: rgba(255,255,255,0.7);
          font-weight: 300;
          max-width: 460px;
          margin: 0 auto;
        }
        .about-what {
          padding: 80px 40px;
          max-width: 860px;
          margin: 0 auto;
        }
        .about-label {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #c0182a;
          margin-bottom: 14px;
          display: block;
        }
        .about-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(26px, 4vw, 36px);
          font-weight: 700;
          line-height: 1.2;
          color: #1a1512;
          margin-bottom: 20px;
        }
        .about-body {
          font-size: 16px;
          color: #4a3f35;
          line-height: 1.8;
          max-width: 560px;
        }
        .about-do-list { margin-top: 48px; }
        .about-do-item {
          display: flex;
          align-items: flex-start;
          gap: 24px;
          padding: 28px 0;
          border-bottom: 1px solid #e8e2d8;
        }
        .about-do-item:first-child { border-top: 1px solid #e8e2d8; }
        .about-do-icon {
          width: 40px; height: 40px;
          border-radius: 50%;
          background: #fdf0f1;
          border: 1px solid #f0c8cc;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .about-do-title {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          font-weight: 700;
          color: #1a1512;
          margin-bottom: 6px;
        }
        .about-do-body { font-size: 15px; color: #5c5047; line-height: 1.7; }
        .about-divider { width: 100%; height: 1px; background: #e8e2d8; }
        .about-pillars-wrap {
          padding: 80px 40px;
          max-width: 860px;
          margin: 0 auto;
        }
        .about-quote {
          background: #f5f0e8;
          padding: 72px 40px;
          text-align: center;
          border-top: 1px solid #e8e2d8;
          border-bottom: 1px solid #e8e2d8;
        }
        .about-quote-icon { display: flex; justify-content: center; margin-bottom: 28px; }
        .about-quote-text {
          font-family: 'Playfair Display', serif;
          font-size: clamp(18px, 2.8vw, 23px);
          font-style: italic;
          color: #2a1f18;
          max-width: 620px;
          margin: 0 auto 24px;
          line-height: 1.75;
        }
        .about-quote-attr {
          font-size: 12px;
          color: #9a8878;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }
        .about-cta {
          background: #c0182a;
          padding: 72px 40px;
          text-align: center;
        }
        .about-cta-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 700;
          color: #fff;
          margin-bottom: 14px;
        }
        .about-cta-sub {
          font-size: 16px;
          color: rgba(255,255,255,0.72);
          margin-bottom: 36px;
          font-weight: 300;
        }
        .about-cta-btn {
          display: inline-block;
          background: #fff;
          color: #c0182a;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.06em;
          padding: 14px 36px;
          border-radius: 100px;
          text-decoration: none;
        }
      `}</style>

      <Header />

      <main style={{ paddingTop: 'var(--header-height)' }}>

        {/* Hero */}
        <div className="about-hero">
          <p className="about-eyebrow">About Align</p>
          <h1>We prepare you<br />to <em>love well.</em></h1>
          <p className="about-hero-sub">A platform built entirely around your growth in faith, character, and readiness.</p>
        </div>

        {/* What We Do */}
        <div className="about-what">
          <span className="about-label">What we do</span>
          <h2 className="about-title">Everything here is<br />built for your growth.</h2>
          <p className="about-body">Align is a Christian-based relationship platform where every feature, every interaction, and every prompt exists for one reason: to help you become the person a healthy relationship requires.</p>

          <div className="about-do-list">
            <div className="about-do-item">
              <div className="about-do-icon"><Sun size={18} color="#c0182a" /></div>
              <div>
                <p className="about-do-title">We grow you through the Six Pillars</p>
                <p className="about-do-body">All interaction on Align is organized around six areas of personal development. You grow intentionally, not by accident.</p>
              </div>
            </div>
            <div className="about-do-item">
              <div className="about-do-icon"><Shield size={18} color="#c0182a" /></div>
              <div>
                <p className="about-do-title">We prioritize preparation over presentation</p>
                <p className="about-do-body">Alignment matters more than appearance. Intention leads the way. We guide you to know yourself before you connect with others.</p>
              </div>
            </div>
            <div className="about-do-item">
              <div className="about-do-icon"><Heart size={18} color="#c0182a" /></div>
              <div>
                <p className="about-do-title">We build intention-first connection</p>
                <p className="about-do-body">When you're ready to connect, you meet people whose growth journey aligns with yours. Shared values and mutual readiness are the foundation.</p>
              </div>
            </div>
            <div className="about-do-item">
              <div className="about-do-icon"><BookOpen size={18} color="#c0182a" /></div>
              <div>
                <p className="about-do-title">We root everything in the Framework</p>
                <p className="about-do-body">Align is built on <em>Relationship Fitness</em> by Thomas Marks, a proven framework for developing the spiritual maturity and character that love requires.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="about-divider" />

        {/* Six Pillars — reuses your existing component */}
        <div className="about-pillars-wrap">
          <span className="about-label">The Six Pillars</span>
          <h2 className="about-title">Your personal growth<br />framework.</h2>
          <p className="about-body">Each pillar is an area of your life you'll develop intentionally, not as a checklist, but as a way of becoming.</p>
          <SixPillars />
        </div>

        {/* Quote */}
        <div className="about-quote">
          <div className="about-quote-icon">
            <BookOpen size={40} color="#c0182a" strokeWidth={1.5} />
          </div>
          <p className="about-quote-text">Most relationships do not fall apart because of a lack of love. They fall apart because people enter them unprepared for the weight, responsibility, and spiritual maturity that love requires.</p>
          <p className="about-quote-attr">Thomas Marks &mdash; Relationship Fitness</p>
        </div>

        {/* CTA */}
        <div className="about-cta">
          <h2 className="about-cta-title">Preparation comes<br />before connection.</h2>
          <p className="about-cta-sub">Start growing today. The right relationship begins with becoming the right person.</p>
          <Link className="about-cta-btn" href="/get-started">Begin Your Journey</Link>
        </div>

      </main>

      <Footer />
    </>
  )
}

