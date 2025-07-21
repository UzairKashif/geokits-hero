'use client'

export default function Fonts() {
  return (
    <style jsx global>{`
      /* Satoshi Font Family */
      
      @font-face {
        font-family: 'Satoshi';
        src: url('/lib/fonts/Satoshi-Variable.woff2') format('woff2'),
             url('/lib/fonts/Satoshi-Variable.woff') format('woff'),
             url('/lib/fonts/Satoshi-Variable.ttf') format('truetype');
        font-weight: 300 900;
        font-style: normal;
        font-display: swap;
      }

      @font-face {
        font-family: 'Satoshi';
        src: url('/lib/fonts/Satoshi-VariableItalic.woff2') format('woff2'),
             url('/lib/fonts/Satoshi-VariableItalic.woff') format('woff'),
             url('/lib/fonts/Satoshi-VariableItalic.ttf') format('truetype');
        font-weight: 300 900;
        font-style: italic;
        font-display: swap;
      }

      /* Individual Weight Fallbacks */
      
      @font-face {
        font-family: 'Satoshi';
        src: url('/lib/fonts/Satoshi-Light.woff2') format('woff2'),
             url('/lib/fonts/Satoshi-Light.woff') format('woff'),
             url('/lib/fonts/Satoshi-Light.ttf') format('truetype');
        font-weight: 300;
        font-style: normal;
        font-display: swap;
      }

      @font-face {
        font-family: 'Satoshi';
        src: url('/lib/fonts/Satoshi-LightItalic.woff2') format('woff2'),
             url('/lib/fonts/Satoshi-LightItalic.woff') format('woff'),
             url('/lib/fonts/Satoshi-LightItalic.ttf') format('truetype');
        font-weight: 300;
        font-style: italic;
        font-display: swap;
      }

      @font-face {
        font-family: 'Satoshi';
        src: url('/lib/fonts/Satoshi-Regular.woff2') format('woff2'),
             url('/lib/fonts/Satoshi-Regular.woff') format('woff'),
             url('/lib/fonts/Satoshi-Regular.ttf') format('truetype');
        font-weight: 400;
        font-style: normal;
        font-display: swap;
      }

      @font-face {
        font-family: 'Satoshi';
        src: url('/lib/fonts/Satoshi-Italic.woff2') format('woff2'),
             url('/lib/fonts/Satoshi-Italic.woff') format('woff'),
             url('/lib/fonts/Satoshi-Italic.ttf') format('truetype');
        font-weight: 400;
        font-style: italic;
        font-display: swap;
      }

      @font-face {
        font-family: 'Satoshi';
        src: url('/lib/fonts/Satoshi-Medium.woff2') format('woff2'),
             url('/lib/fonts/Satoshi-Medium.woff') format('woff'),
             url('/lib/fonts/Satoshi-Medium.ttf') format('truetype');
        font-weight: 500;
        font-style: normal;
        font-display: swap;
      }

      @font-face {
        font-family: 'Satoshi';
        src: url('/lib/fonts/Satoshi-MediumItalic.woff2') format('woff2'),
             url('/lib/fonts/Satoshi-MediumItalic.woff') format('woff'),
             url('/lib/fonts/Satoshi-MediumItalic.ttf') format('truetype');
        font-weight: 500;
        font-style: italic;
        font-display: swap;
      }

      @font-face {
        font-family: 'Satoshi';
        src: url('/lib/fonts/Satoshi-Bold.woff2') format('woff2'),
             url('/lib/fonts/Satoshi-Bold.woff') format('woff'),
             url('/lib/fonts/Satoshi-Bold.ttf') format('truetype');
        font-weight: 700;
        font-style: normal;
        font-display: swap;
      }

      @font-face {
        font-family: 'Satoshi';
        src: url('/lib/fonts/Satoshi-BoldItalic.woff2') format('woff2'),
             url('/lib/fonts/Satoshi-BoldItalic.woff') format('woff'),
             url('/lib/fonts/Satoshi-BoldItalic.ttf') format('truetype');
        font-weight: 700;
        font-style: italic;
        font-display: swap;
      }

      @font-face {
        font-family: 'Satoshi';
        src: url('/lib/fonts/Satoshi-Black.woff2') format('woff2'),
             url('/lib/fonts/Satoshi-Black.woff') format('woff'),
             url('/lib/fonts/Satoshi-Black.ttf') format('truetype');
        font-weight: 900;
        font-style: normal;
        font-display: swap;
      }

      @font-face {
        font-family: 'Satoshi';
        src: url('/lib/fonts/Satoshi-BlackItalic.woff2') format('woff2'),
             url('/lib/fonts/Satoshi-BlackItalic.woff') format('woff'),
             url('/lib/fonts/Satoshi-BlackItalic.ttf') format('truetype');
        font-weight: 900;
        font-style: italic;
        font-display: swap;
      }

      /* Apply Satoshi as default font */
      html {
        font-family: 'Satoshi', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      }

      /* Font weight utilities */
      .font-satoshi-light { font-family: 'Satoshi', sans-serif; font-weight: 300; }
      .font-satoshi-regular { font-family: 'Satoshi', sans-serif; font-weight: 400; }
      .font-satoshi-medium { font-family: 'Satoshi', sans-serif; font-weight: 500; }
      .font-satoshi-bold { font-family: 'Satoshi', sans-serif; font-weight: 700; }
      .font-satoshi-black { font-family: 'Satoshi', sans-serif; font-weight: 900; }
    `}</style>
  )
}
