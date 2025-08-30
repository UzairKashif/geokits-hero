import { ContactFormData } from "./types";

export function generateCustomerEmailHtml(data: ContactFormData): string {
  return `
   <div
  class="geokits-email-root"
  style="
    font-family: 'Satoshi', Arial, sans-serif;
    max-width: 460px;
    margin: 0 auto;
    padding: 40px 20px;
    color: #021400;
    background-color: #ffffff;
  "
>
  <!-- Logo block -->
  <div style="text-align: center; margin-bottom: 20px">
    <!-- Light mode logo -->
    <img
      src="https://res.cloudinary.com/dlgaiba4h/image/upload/v1756465935/GEOKITS_logo_color_corrected_r2v38g.png"
      alt="Geokits Logo"
      class="logo-light"
      style="
        max-width: 320px;
        width: 100%;
        height: auto;
        display: block;
        margin: 0 auto;
      "
    />
    <!-- Dark mode logo -->
    <img
      src="https://res.cloudinary.com/dlgaiba4h/image/upload/v1756468551/GEOKITS_logo_color_corrected_WHITE_mcchb0.png"
      alt="Geokits Logo"
      class="logo-dark"
      style="
        max-width: 320px;
        width: 100%;
        height: auto;
        display: none;
        margin: 0 auto;
      "
    />
  </div>

  <!-- Greeting -->
  <p
    class="text-content"
    style="
      color: #021400;
      margin: 0 0 18px 0;
      font-size: 17px;
      font-family: 'Satoshi', Arial, sans-serif;
    "
  >
    Dear ${data.firstName},
  </p>

  <!-- Intro -->
  <p
    class="text-content"
    style="
      color: #021400;
      margin: 0 0 28px 0;
      font-size: 15px;
      line-height: 1.8;
      opacity: 0.9;
      font-family: 'Satoshi', Arial, sans-serif;
    "
  >
    Thank you for submitting your inquiry through our contact form regarding
    <em
      class="text-content-emphasis"
      style="
        color: #021400;
        font-weight: 500;
        font-family: 'Satoshi', Arial, sans-serif;
      "
    >
      ${data.serviceInterest}
    </em>
    services.
  </p>

  <!-- Content box -->
  <div
    class="geokits-content-box"
    style="
      background-color: #f8fdf8;
      padding: 32px;
      margin: 32px 0;
      border-radius: 8px;
      border: 1px solid #e8f5e8;
    "
  >
    <p
      class="text-content"
      style="
        color: #021400;
        margin: 0;
        font-size: 15px;
        line-height: 1.6;
        font-style: italic;
      "
    >
      ${data.projectDescription}
    </p>
  </div>

  <!-- Follow-up -->
  <p
    class="text-content"
    style="
      color: #021400;
      margin: 0 0 28px 0;
      font-size: 15px;
      line-height: 1.8;
      opacity: 0.9;
      font-family: 'Satoshi', Arial, sans-serif;
    "
  >
    Our support team has received your query details and will conduct a thorough
    review. You can expect a personalized response from us within 24-48 hours.
  </p>

  <!-- Signature -->
  <p
    class="text-content"
    style="
      color: #021400;
      margin: 40px 0 8px 0;
      font-size: 15px;
      font-family: 'Satoshi', Arial, sans-serif;
    "
  >
    Best regards,
  </p>
  <p
    class="text-content-bold"
    style="
      color: #021400;
      margin: 0 0 28px 0;
      font-size: 15px;
      font-weight: 600;
      font-family: 'Satoshi', Arial, sans-serif;
    "
  >
    Geokits
  </p>

  <!-- Footer -->
  <div
    style="
      text-align: center;
      border-top: 1px solid #021400;

      padding-top: 20px;
    "
    class="footer-border"
  >
    <p
      class="text-content-footer"
      style="
        color: #021400;
        margin: 0;
        font-size: 13px;
        line-height: 1.5;
        font-family: 'Satoshi', Arial, sans-serif;
      "
    >
      contact@geokits.com • (+44 7446284191)<br />
      483 Green Lanes, London, England, N13 4BS
    </p>
  </div>
</div>

<!-- Dark mode CSS -->
<style>
  @media (prefers-color-scheme: dark) {
    .geokits-email-root {
      background-color: #181f2a !important;
      color: #f8fdf8 !important;
    }
    .geokits-content-box {
      background-color: #232b39 !important;
      border-color: #334155 !important;
    }
    .text-content,
    .text-content-emphasis,
    .text-content-bold,
    .text-content-footer {
      color: #f8fdf8 !important;
    }
    .footer-border {
      border-top-color: #f8fdf8 !important;
    }
    .logo-light {
      display: none !important;
    }
    .logo-dark {
      display: block !important;
    }
  }
</style>

    `;
}

export function generateCustomerEmailHtmlAlt(data: ContactFormData): string {
  return `<div
  class="geokits-email-root"
  style="
    font-family: 'Satoshi', Arial, sans-serif;
    max-width: 460px;
    margin: 0 auto;
    padding: 40px 20px;
    color: #021400;
    background-color: #ffffff;
  "
>
  <div style="text-align: center; margin-bottom: 20px">
      <img
      src="https://res.cloudinary.com/dlgaiba4h/image/upload/v1756470061/cropped_vqizwr.png"
      alt="Geokits Logo"
      class="logo-dark"
      style="
        max-width: 320px;
        width: 100%;
        height: auto;
        display: none;
        margin: 0 auto;
      "
    />
    <img
      src="https://res.cloudinary.com/dlgaiba4h/image/upload/v1756470061/cropped_vqizwr.png"
      alt="Geokits Logo"
      class="logo-light"
      style="
        max-width: 320px;
        width: 100%;
        height: auto;
        display: block;
        margin: 0 auto;
      "
    />

  </div>

  <p
    class="text-content"
    style="
      color: #021400;
      margin: 0 0 18px 0;
      font-size: 17px;
      font-family: 'Satoshi', Arial, sans-serif;
    "
  >
    Dear ${data.firstName},
  </p>

  <p
    class="text-content"
    style="
      color: #021400;
      margin: 0 0 28px 0;
      font-size: 15px;
      line-height: 1.8;
      opacity: 0.9;
      font-family: 'Satoshi', Arial, sans-serif;
    "
  >
    Thank you for submitting your inquiry through our contact form regarding
    <em
      class="text-content-emphasis"
      style="
        color: #021400;
        font-weight: 500;
        font-family: 'Satoshi', Arial, sans-serif;
      "
    >
      ${data.serviceInterest}
    </em>
    services.
  </p>

  <div
    class="geokits-content-box"
    style="
      background-color: #f8fdf8;
      padding: 32px;
      margin: 32px 0;
      border-radius: 8px;
      border: 1px solid #e8f5e8;
    "
  >
    <p
      class="text-content"
      style="
        color: #021400;
        margin: 0;
        font-size: 15px;
        line-height: 1.6;
        font-style: italic;
      "
    >
      ${data.projectDescription}
    </p>
  </div>

  <p
    class="text-content"
    style="
      color: #021400;
      margin: 0 0 28px 0;
      font-size: 15px;
      line-height: 1.8;
      opacity: 0.9;
      font-family: 'Satoshi', Arial, sans-serif;
    "
  >
    Our support team has received your query details and will conduct a thorough
    review. You can expect a personalized response from us within 24-48 hours.
  </p>

  <p
    class="text-content"
    style="
      color: #021400;
      margin: 40px 0 8px 0;
      font-size: 15px;
      font-family: 'Satoshi', Arial, sans-serif;
    "
  >
    Best regards,
  </p>
  <p
    class="text-content-bold"
    style="
      color: #021400;
      margin: 0 0 28px 0;
      font-size: 15px;
      font-weight: 600;
      font-family: 'Satoshi', Arial, sans-serif;
    "
  >
    Geokits
  </p>

  <div
    style="
      text-align: center;
      border-top: 1px solid #021400;

      padding-top: 20px;
    "
    class="footer-border"
  >
    <p
      class="text-content-footer"
      style="
        color: #021400;
        margin: 0;
        font-size: 13px;
        line-height: 1.5;
        font-family: 'Satoshi', Arial, sans-serif;
      "
    >
      contact@geokits.com • (+44 7446284191)<br />
      483 Green Lanes, London, England, N13 4BS
    </p>
  </div>
</div>

<style>
  :root,
  html,
  body {
    background-color: #ffffff; /* Default background */
  }

  @media (prefers-color-scheme: dark) {
    .geokits-email-root {
      background-color: #181f2a !important;
      color: #f8fdf8 !important;
    }
    .geokits-content-box {
      background-color: #232b39 !important;
      border-color: #334155 !important;
    }
    .text-content,
    .text-content-emphasis,
    .text-content-bold,
    .text-content-footer {
      color: #f8fdf8 !important;
    }
    .footer-border {
      border-top-color: #f8fdf8 !important;
    }
    .logo-light {
      display: none !important;
    }
    .logo-dark {
      display: block !important;
    }
  }

  /* Outlook-specific dark mode support */
  [data-ogsc] .logo-light {
    display: none !important;
  }
  [data-ogsc] .logo-dark {
    display: block !important;
  }
  [data-ogsc] .geokits-email-root {
    background-color: #181f2a !important;
    color: #f8fdf8 !important;
  }
  [data-ogsc] .geokits-content-box {
    background-color: #232b39 !important;
    border-color: #334155 !important;
  }
  [data-ogsc] .text-content,
  [data-ogsc] .text-content-emphasis,
  [data-ogsc] .text-content-bold,
  [data-ogsc] .text-content-footer {
    color: #f8fdf8 !important;
  }
  [data-ogsc] .footer-border {
    border-top-color: #f8fdf8 !important;
  }
</style>`;
}
