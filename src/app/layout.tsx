// app/layout.tsx
import "./globals.css"   // <-- this must come first
import LenisProvider from "@/components/LenisProvider"
import AnimatedIntro from "@/components/AnimatedIntro"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* Use arbitrary values for your dark background and white text */}
      <body className="bg-[#343434] text-white antialiased scrollbar-hide">
        <AnimatedIntro />
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  )
}
