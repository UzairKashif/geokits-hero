// app/layout.tsx
import "./globals.css"   // <-- this must come first
import LenisProvider from "@/components/LenisProvider"
import AnimatedIntro from "@/components/AnimatedIntro"
import FloatingContactButton from "@/components/FloatingContactButton"
import PerformanceMonitor from "@/components/PerformanceMonitor"
import type { Metadata, Viewport } from 'next'

// Essential metadata for mobile performance
export const metadata: Metadata = {
  title: 'Geokits - Advanced GIS Solutions',
  description: 'Experience the world through geospatial intelligence and innovative system design.',
  keywords: 'GIS, geospatial, mapping, spatial intelligence, infrastructure monitoring',
  authors: [{ name: 'Geokits' }],
  creator: 'Geokits',
  publisher: 'Geokits',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  // Preload critical resources
  other: {
    'preload': '/eng-trans-black.png',
  }
}

// Critical viewport configuration for mobile
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  userScalable: true,
  viewportFit: 'cover',
  // Disable automatic zooming on input focus (Android issue)
  interactiveWidget: 'resizes-content',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Preload critical resources for faster loading */}
        <link
          rel="preload"
          href="/eng-trans-black.png"
          as="image"
          type="image/png"
        />
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//api.mapbox.com" />
        <link rel="preconnect" href="https://api.mapbox.com" crossOrigin="anonymous" />
        {/* Optimize for touch devices */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="mobile-web-app-capable" content="yes" />
        {/* Prevent automatic translation which can cause layout shifts */}
        <meta name="google" content="notranslate" />
      </head>
      {/* Use arbitrary values for your dark background and white text */}
      <body className="bg-white text-black antialiased scrollbar-hide">
        <PerformanceMonitor />
        <AnimatedIntro />
        <LenisProvider>
          {children}
        </LenisProvider>
        <FloatingContactButton />
      </body>
    </html>
  )
}
