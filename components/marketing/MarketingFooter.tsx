import Link from 'next/link'
import Image from 'next/image'

const APP_URL = 'https://app.alignfaith.com'

export default function MarketingFooter() {
  return (
    <footer style={{
      backgroundColor: '#0A0A0B',
      borderTop: '1px solid rgba(255,255,255,0.07)',
      padding: '64px 24px 32px',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '48px',
          marginBottom: '48px',
        }}>
          {/* Brand */}
          <div>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '16px' }}>
              <Image src="/images/logo.png" alt="Align" width={28} height={28} style={{ borderRadius: '5px' }} />
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', color: '#FAFAFA' }}>Align</span>
            </Link>
            <p style={{ color: '#71717A', fontSize: '0.875rem', lineHeight: 1.7, maxWidth: '240px' }}>
              A faith-centered platform for Christians who are serious about preparing for lasting love.
            </p>
          </div>

          {/* Site links */}
          <div>
            <p style={{ color: '#FAFAFA', fontWeight: 600, fontSize: '0.875rem', marginBottom: '16px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Pages</p>
            {[
              { href: '/', label: 'Home' },
              { href: '/about', label: 'About' },
              { href: '/framework', label: 'The Framework' },
              { href: '/book', label: 'The Book' },
            ].map(l => (
              <Link key={l.href} href={l.href} style={{ display: 'block', color: '#71717A', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '10px' }}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Platform */}
          <div>
            <p style={{ color: '#FAFAFA', fontWeight: 600, fontSize: '0.875rem', marginBottom: '16px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Platform</p>
            {[
              { href: `${APP_URL}/register`, label: 'Join Free' },
              { href: `${APP_URL}/login`, label: 'Sign In' },
              { href: `${APP_URL}/pricing`, label: 'Membership' },
              { href: `${APP_URL}/alignment-stories`, label: 'Stories' },
            ].map(l => (
              <a key={l.href} href={l.href} style={{ display: 'block', color: '#71717A', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '10px' }}>
                {l.label}
              </a>
            ))}
          </div>

          {/* Legal */}
          <div>
            <p style={{ color: '#FAFAFA', fontWeight: 600, fontSize: '0.875rem', marginBottom: '16px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Legal</p>
            {[
              { href: `${APP_URL}/terms`, label: 'Terms of Service' },
              { href: `${APP_URL}/privacy`, label: 'Privacy Policy' },
              { href: `${APP_URL}/guidelines`, label: 'Community Guidelines' },
            ].map(l => (
              <a key={l.href} href={l.href} style={{ display: 'block', color: '#71717A', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '10px' }}>
                {l.label}
              </a>
            ))}
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <p style={{ color: '#52525B', fontSize: '0.8rem' }}>
            © {new Date().getFullYear()} Align. All rights reserved.
          </p>
          <p style={{ color: '#52525B', fontSize: '0.8rem' }}>
            Built on faith. Grounded in preparation.
          </p>
        </div>
      </div>
    </footer>
  )
}
