'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/framework', label: 'Framework' },
  { href: '/book', label: 'Book' },
]

const APP_URL = 'https://app.alignfaith.com'

export default function MarketingNav() {
  const [open, setOpen] = useState(false)

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      height: '64px',
      backgroundColor: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #E5E7EB',
      display: 'flex',
      alignItems: 'center',
    }}>
      <div style={{
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <Image src="/images/logo.png" alt="Align" width={32} height={32} style={{ borderRadius: '6px' }} />
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            fontSize: '1.1rem',
            color: '#111827',
            letterSpacing: '-0.01em',
          }}>Align</span>
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="marketing-desktop-nav">
          {links.map(l => (
            <Link key={l.href} href={l.href} style={{
              color: '#6B7280',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 500,
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = '#111827')}
              onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}
            >
              {l.label}
            </Link>
          ))}
          <a
            href={`${APP_URL}/register`}
            style={{
              backgroundColor: '#c0182a',
              color: '#fff',
              padding: '8px 20px',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#a01524')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#c0182a')}
          >
            Join Free
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          style={{ background: 'none', border: 'none', color: '#374151', cursor: 'pointer', padding: '4px', display: 'none' }}
          className="marketing-hamburger"
          aria-label="Toggle menu"
        >
          {open ? (
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{
          position: 'absolute',
          top: '64px',
          left: 0,
          right: 0,
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #E5E7EB',
          padding: '16px 24px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}>
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} style={{
              color: '#374151',
              textDecoration: 'none',
              fontSize: '1rem',
              fontWeight: 500,
              padding: '12px 0',
              borderBottom: '1px solid #F3F4F6',
            }}>
              {l.label}
            </Link>
          ))}
          <a
            href={`${APP_URL}/register`}
            style={{
              backgroundColor: '#c0182a',
              color: '#fff',
              padding: '12px 20px',
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontWeight: 600,
              textDecoration: 'none',
              textAlign: 'center',
              marginTop: '12px',
            }}
          >
            Join Free
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .marketing-desktop-nav { display: none !important; }
          .marketing-hamburger { display: block !important; }
        }
      `}</style>
    </header>
  )
}
