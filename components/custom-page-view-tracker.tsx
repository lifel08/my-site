// components/custom-page-view-tracker.tsx
'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export default function CustomPageViewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Für den ersten Aufruf externer Referrer, danach interne vorige URL
  const previousUrlRef = useRef('')

  useEffect(() => {
    previousUrlRef.current = document.referrer || ''
  }, [])

  useEffect(() => {
    if (!pathname) return

    const query = searchParams.toString()
    const pagePath = query ? `${pathname}?${query}` : pathname
    const currentUrl = window.location.href

    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      event: 'custom_page_view',
      page_path: pagePath,          // z.B. /web-analytics
      page_location: currentUrl,    // volle aktuelle URL
      page_referrer: previousUrlRef.current || '',
    })

    // Für den nächsten SPA-Wechsel die aktuelle URL als Referrer merken
    previousUrlRef.current = currentUrl
  }, [pathname, searchParams])

  return null
}