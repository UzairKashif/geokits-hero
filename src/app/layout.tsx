// app/layout.tsx
import "./globals.css"   // <-- this must come first
import LenisProvider from "@/components/LenisProvider"
import AnimatedIntro from "@/components/AnimatedIntro"
import FloatingContactButton from "@/components/FloatingContactButton"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* Use arbitrary values for your dark background and white text */}
      <body className="bg-white text-black antialiased scrollbar-hide">
        <AnimatedIntro />
        <LenisProvider>
          {children}
        </LenisProvider>
        <FloatingContactButton />
      </body>
    </html>
  )
}
