// app/layout.tsx
import "./globals.css"   // <-- this must come first
import LenisProvider from "@/components/LenisProvider"
import AnimatedIntro from "@/components/AnimatedIntro"
import FloatingContactButton from "@/components/FloatingContactButton"
import ConditionalHeader from "@/components/ConditionalHeader"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'GeoKits - Advanced GIS Solutions & Infrastructure Monitoring',
    template: '%s | GeoKits'
  },
  description: 'Transform your infrastructure monitoring with cutting-edge GIS solutions. We provide advanced geospatial technology, spatial data analysis, and custom mapping solutions for organizations worldwide.',
  keywords: ['GIS', 'Geographic Information Systems', 'Infrastructure Monitoring', 'Spatial Data Analysis', 'Mapping Solutions', 'Geospatial Technology', 'Data Analytics', 'Remote Sensing'],
  authors: [{ name: 'GeoKits Team' }],
  creator: 'GeoKits',
  publisher: 'GeoKits',
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
    siteName: 'GeoKits',
    title: 'GeoKits - Advanced GIS Solutions & Infrastructure Monitoring',
    description: 'Transform your infrastructure monitoring with cutting-edge GIS solutions. We provide advanced geospatial technology, spatial data analysis, and custom mapping solutions.',
    images: [
      {
        url: 'https://geokits.com/img/GEOKITSWHITE.png',
        width: 1200,
        height: 630,
        alt: 'GeoKits - Advanced GIS Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GeoKits - Advanced GIS Solutions & Infrastructure Monitoring',
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
        {/* Only preload critical above-the-fold images */}
        <link rel="preload" as="image" href="/projects/disastermgmt.PNG" />
        
        {/* Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "GeoKits",
              "url": "https://geokits.com",
              "logo": "https://geokits.com/img/GEOKITSWHITE.png",
              "description": "Advanced GIS solutions and infrastructure monitoring services",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+1-XXX-XXX-XXXX", // Replace with actual phone
                "contactType": "Customer Service",
                "email": "contact@geokits.com"
              },
              "sameAs": [
                "https://linkedin.com/company/geokits", // Add your actual social links
                "https://twitter.com/geokits"
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
