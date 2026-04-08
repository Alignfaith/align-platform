'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

const MatchingInquiryModal = dynamic(() => import('./MatchingInquiryModal'), { ssr: false })

interface Props {
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}

export default function MatchingInquiryButton({ className, style, children }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={className}
        style={style}
      >
        {children ?? 'Inquire About Matching Service'}
      </button>
      {open && <MatchingInquiryModal onClose={() => setOpen(false)} />}
    </>
  )
}
