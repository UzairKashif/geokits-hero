'use client'

import React from 'react'
import { useNavigationCleanup } from '../hooks/useNavigationCleanup'

interface SafeNavigationLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

export default function SafeNavigationLink({ href, children, className }: SafeNavigationLinkProps) {
  const cleanupAndNavigate = useNavigationCleanup()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    cleanupAndNavigate(href)
  }

  return (
    <div onClick={handleClick} className={className} style={{ cursor: 'pointer' }}>
      {children}
    </div>
  )
}
