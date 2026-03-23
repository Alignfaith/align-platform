'use client'

import { useParams } from 'next/navigation'
import CmsPageEditor from '@/components/admin/CmsPageEditor'

export default function EditCmsPage() {
  const params = useParams()
  const pageId = params.id as string

  return <CmsPageEditor pageId={pageId} />
}
