// app/layout.tsx
import "./globals.css"   // <-- this must come first

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* Use arbitrary values for your dark background and white text */}
      <body className="bg-[#04110E] text-white antialiased">
        {children}
      </body>
    </html>
  )
}
