import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, Inter } from 'next/font/google'
import SessionProvider from '@/components/auth/SessionProvider'
import { ThemeProvider } from '@/lib/ThemeContext'
import './globals.css'

const plusJakarta = Plus_Jakarta_Sans({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-heading',
    weight: ['400', '500', '600', '700', '800'],
})

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-body',
})

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
}

export const metadata: Metadata = {
    metadataBase: new URL('https://app.alignfaith.com'),
    title: {
        default: 'ALIGN | Find Meaningful Connection',
        template: '%s | ALIGN',
    },
    description: 'A Christian dating platform where preparation comes before connection. Built on the Six Pillars framework for relationship readiness.',
    keywords: [
        'Christian dating',
        'Christian singles',
        'faith-based relationships',
        'biblical relationships',
        'relationship preparation',
        'God-centered love',
        'Six Pillars',
        'Relationship Fitness',
        'Thomas Marks',
        'intentional relationships',
        'Christian dating app',
    ],
    authors: [{ name: 'Thomas Marks' }],
    creator: 'Thomas Marks',
    publisher: 'ALIGN',
    icons: {
        icon: [
            { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
            { url: '/favicon.png', sizes: 'any', type: 'image/png' },
            { url: '/icon.png', sizes: '192x192', type: 'image/png' },
        ],
        apple: { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    },
    openGraph: {
        title: 'ALIGN | Find Meaningful Connection',
        description: 'A Christian dating platform where preparation comes before connection. Built on the Six Pillars framework for relationship readiness.',
        type: 'website',
        locale: 'en_US',
        url: 'https://app.alignfaith.com',
        siteName: 'ALIGN',
        images: [
            {
                url: '/icon.png',
                width: 192,
                height: 192,
                alt: 'ALIGN — Faith-Based Relationships',
            },
        ],
    },
    twitter: {
        card: 'summary',
        title: 'ALIGN | Find Meaningful Connection',
        description: 'A Christian dating platform where preparation comes before connection. Built on the Six Pillars framework for relationship readiness.',
        images: ['/icon.png'],
        creator: '@alignfaith',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-snippet': -1,
            'max-image-preview': 'large',
            'max-video-preview': -1,
        },
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={`${plusJakarta.variable} ${inter.variable}`} suppressHydrationWarning>
            <body>
                <ThemeProvider>
                    <SessionProvider>
                        {children}
                    </SessionProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
