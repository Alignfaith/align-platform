'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/lib/ThemeContext'

import { useSession, signOut } from 'next-auth/react'

export default function Header() {
    const { data: session, status } = useSession()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { theme, toggleTheme } = useTheme()

    const closeMenu = () => setIsMenuOpen(false)

    const baseLinks = [
        { href: '/', label: 'Home' },
        { href: '/pricing', label: 'Pricing' },
    ]

    const authLinks = session ? [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/matches', label: 'Discovery' },
        { href: '/messages', label: 'Messages' },
    ] : [
        { href: '/about', label: 'About' },
        { href: '/framework', label: 'The Framework' },
    ]

    const navLinks = [...baseLinks, ...authLinks]

    return (
        <header className="header">
            <div className="container">
                {/* Utility Bar */}
                <div className="header__utility">
                    <button
                        className="header__theme-toggle"
                        onClick={toggleTheme}
                        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                    >
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    <div className="header__auth desktop-only">
                        {session ? (
                            <>
                                <Link href="/profile/edit" className="header__auth-link">Profile</Link>
                                <button onClick={() => signOut()} className="btn btn--outline-primary btn--sm">Sign Out</button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="header__auth-link">Sign In</Link>
                                <Link href="/register" className="btn btn--primary btn--sm">Get Started</Link>
                            </>
                        )}
                    </div>

                    <button
                        className="header__menu-toggle mobile-only"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                        aria-expanded={isMenuOpen}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Centered Logo */}
                <Link href="/" className="header__logo" onClick={closeMenu}>
                    <Image
                        src="/images/logo.png"
                        alt="Align"
                        width={100}
                        height={130}
                        priority
                    />
                    <span className="header__brand">ALIGN</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="header__nav desktop-only">
                    {navLinks.map(link => (
                        <Link key={link.href} href={link.href} className="header__nav-link">
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Mobile Menu Overlay */}
                <div className={`header__mobile-menu ${isMenuOpen ? 'is-open' : ''}`}>
                    <nav className="header__mobile-nav">
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="header__mobile-link"
                                onClick={closeMenu}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="header__mobile-auth">
                            {session ? (
                                <>
                                    <Link href="/profile/edit" className="btn btn--secondary" onClick={closeMenu}>
                                        Profile
                                    </Link>
                                    <button onClick={() => signOut()} className="btn btn--outline-primary" style={{ width: '100%', marginTop: 'var(--space-2)' }}>
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" className="btn btn--secondary" onClick={closeMenu}>
                                        Sign In
                                    </Link>
                                    <Link href="/register" className="btn btn--primary" onClick={closeMenu}>
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    )
}
