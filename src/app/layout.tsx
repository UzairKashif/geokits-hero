// app/layout.tsx
import "./globals.css"   // <-- this must come first
import LenisProvider from "@/components/LenisProvider"
import AnimatedIntro from "@/components/AnimatedIntro"
import FloatingContactButton from "@/components/FloatingContactButton"
import ConditionalHeader from "@/components/ConditionalHeader"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Geokits - Advanced GIS Solutions & Infrastructure Monitoring',
    template: '%s | Geokits'
  },
  description: 'Transform your infrastructure monitoring with cutting-edge GIS solutions. We provide advanced geospatial technology, spatial data analysis, and custom mapping solutions for organizations worldwide.',
  keywords: ['GIS', 'Geographic Information Systems', 'Infrastructure Monitoring', 'Spatial Data Analysis', 'Mapping Solutions', 'Geospatial Technology', 'Data Analytics', 'Remote Sensing'],
  authors: [{ name: 'Geokits Team' }],
  creator: 'Geokits',
  publisher: 'Geokits',
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://geokits.com',
    siteName: 'Geokits',
    title: 'Geokits - Advanced GIS Solutions & Infrastructure Monitoring',
    description: 'Transform your infrastructure monitoring with cutting-edge GIS solutions. We provide advanced geospatial technology, spatial data analysis, and custom mapping solutions.',
    images: [
      {
        url: 'https://geokits.com/img/GEOKITSWHITE.png',
        width: 1200,
        height: 630,
        alt: 'Geokits - Advanced GIS Solutions',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: ' - Advanced GIS Solutions & Infrastructure Monitoring',
    description: 'Transform your infrastructure monitoring with cutting-edge GIS solutions. Advanced geospatial technology and custom mapping solutions.',
    images: ['https://geokits.com/img/GEOKITSWHITE.png'],
  },
  verification: {
    google: 'JdOwVYxO3hL6PSjQ5q1KFseVQZHLupI_tH_H5FaAkvw', // Replace with the actual code from Google Search Console HTML tag method
  },
  alternates: {
    canonical: 'https://geokits.com',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Geokits",
              "url": "https://geokits.com",
              "logo": "https://geokits.com/img/GEOKITSWHITE.png",
              "description": "Advanced GIS solutions and infrastructure monitoring services",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+44-744-628-4191", 
                "contactType": "Customer Service",
                "email": "contact@geokits.com"
              },
              "sameAs": [
                "https://linkedin.com/company/geokits", 
                "https://www.instagram.com/geokits_/"
              ]
            })
          }}
        />
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
