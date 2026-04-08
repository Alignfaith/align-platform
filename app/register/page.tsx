import type { Metadata } from 'next'
import RegisterClient from './RegisterClient'

export const metadata: Metadata = {
  title: 'Join ALIGN — Faith-Centered Relationships',
  description:
    'ALIGN is currently available by invitation only. Request access and start your journey with the Six Pillars of Relationship Fitness.',
  openGraph: {
    title: 'Join ALIGN — Faith-Centered Relationships',
    description: 'Preparation comes before connection. Request an invitation to ALIGN.',
    url: 'https://app.alignfaith.com/register',
  },
}

export default function RegisterPage() {
  return <RegisterClient />
}
