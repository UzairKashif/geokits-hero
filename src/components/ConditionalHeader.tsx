'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/Header'

export default function ConditionalHeader() {
  const pathname = usePathname()
  
  // Don't show header on contact page or secure portal routes
  if (!pathname) return null

  if (pathname === '/contact' || pathname.startsWith('/data-portal')) {
    return null
  }
  
  return <Header />
}
