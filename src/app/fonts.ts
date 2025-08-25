import { Plus_Jakarta_Sans } from 'next/font/google'
import localFont from 'next/font/local'

// Optimize Google Fonts loading with proper fallbacks
export const plusJakartaSans = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap', // Immediate font swap for better performance
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
  preload: true,
})

// Optimize local Satoshi font with proper loading strategy
export const satoshi = localFont({
  src: [
    {
      path: '../../public/lib/fonts/Satoshi-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/lib/fonts/Satoshi-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/lib/fonts/Satoshi-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/lib/fonts/Satoshi-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
  preload: true,
})

// Create CSS variable classes for use in components
export const fontClassNames = {
  plusJakarta: plusJakartaSans.className,
  satoshi: satoshi.className,
}
