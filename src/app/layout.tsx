// app/layout.tsx
import "./globals.css"   // <-- this must come first
import LenisProvider from "@/components/LenisProvider"
import AnimatedIntro from "@/components/AnimatedIntro"
import FloatingContactButton from "@/components/FloatingContactButton"
import ConditionalHeader from "@/components/ConditionalHeader"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Geokits | Strategic GIS & AI Solutions',
    template: `%s | Geokits`,
  },
  description: 'Geokits provides cutting-edge GIS consulting, AI-driven automation, and advanced data analytics to solve complex challenges and deliver innovative solutions.',
  metadataBase: new URL('https://geokits.com'),
  openGraph: {
    title: 'Geokits | Strategic GIS & AI Solutions',
    description: 'Geokits provides cutting-edge GIS consulting, AI-driven automation, and advanced data analytics to solve complex challenges and deliver innovative solutions.',
    url: 'https://geokits.com',
    siteName: 'Geokits',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Only preload critical above-the-fold images */}
        <link rel="preload" as="image" href="/projects/disastermgmt.PNG" />
      </head>
      {/* Use arbitrary values for your dark background and white text */}
      <body className="bg-white text-black antialiased scrollbar-hide">
        <AnimatedIntro />
        <ConditionalHeader />
        <LenisProvider>
          {children}
        </LenisProvider>
        <FloatingContactButton />
      </body>
    </html>
  )
}
