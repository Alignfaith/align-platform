'use client'

import Image from 'next/image'

interface LogoProps {
    className?: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
    showText?: boolean
}

export default function Logo({ className = '', size = 'md', showText = true }: LogoProps) {
    // Logo aspect ratio ~0.8:1 (width:height)
    const sizes = {
        sm: { width: 40, height: 52, fontSize: '1.25rem' },
        md: { width: 56, height: 72, fontSize: '1.75rem' },
        lg: { width: 72, height: 94, fontSize: '2.25rem' },
        xl: { width: 96, height: 124, fontSize: '3rem' },
    }

    const { width, height, fontSize } = sizes[size]

    return (
        <div className={`logo ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Logo Image */}
            <Image
                src="/images/logo.png"
                alt="Align Logo"
                width={width}
                height={height}
                className="logo__icon"
                priority
                style={{
                    objectFit: 'contain',
                    borderRadius: '6px',
                }}
            />

            {/* Logo Text - BOLD */}
            {showText && (
                <span
                    className="logo__text"
                    style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize,
                        fontWeight: 800,
                        letterSpacing: '-0.02em',
                        textTransform: 'uppercase',
                        background: 'linear-gradient(135deg, var(--color-text-primary) 0%, var(--color-text-secondary) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}
                >
                    Align
                </span>
            )}
        </div>
    )
}
