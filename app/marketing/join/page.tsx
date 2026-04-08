import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Join Align',
  description: 'Create your free Align account and begin the Six Pillars assessment.',
}

export default function JoinPage() {
  redirect('https://app.alignfaith.com/register')
}
