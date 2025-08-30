'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/Header'

export default function ConditionalHeader() {
  const pathname = usePathname()
  
  // Don't show header on contact page
  if (pathname === '/contact') {
    return null
  }
  
  return <Header />
}
