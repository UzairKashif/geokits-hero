// app/layout.tsx
import "./globals.css"   // <-- this must come first
import LenisProvider from "@/components/LenisProvider"
import AnimatedIntro from "@/components/AnimatedIntro"
import FloatingContactButton from "@/components/FloatingContactButton"
import ConditionalHeader from "@/components/ConditionalHeader"

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
