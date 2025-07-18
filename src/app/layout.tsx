// app/layout.tsx
import "./globals.css"   // <-- this must come first
import LenisProvider from "@/components/LenisProvider"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* Use arbitrary values for your dark background and white text */}
      <body className="bg-[#04110E] text-white antialiased">
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  )
}
