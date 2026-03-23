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
    title: 'Align | Find Meaningful Connection',
    description: 'A Christian-based dating platform where preparation comes before connection. Built on the Six Pillars framework for relationship readiness.',
    keywords: ['Christian dating', 'faith-based dating', 'relationship platform', 'intentional relationships', 'meaningful connection'],
    authors: [{ name: 'Thomas Marks' }],
    openGraph: {
        title: 'Align | Find Meaningful Connection',
        description: 'A Christian-based dating platform where preparation comes before connection.',
        type: 'website',
        locale: 'en_US',
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
