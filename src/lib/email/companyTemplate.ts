import { ContactFormData } from "./types";

export function generateCompanyEmailHtml(data: ContactFormData): string {
  return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #1e293b; color: #ffffff;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #10b981; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
          <div style="height: 2px; background: linear-gradient(to right, #10b981, #059669); margin: 10px auto; width: 100px;"></div>
        </div>
        
        <div style="background-color: #334155; padding: 25px; border-radius: 12px; margin-bottom: 20px;">
          <h2 style="color: #10b981; margin-top: 0; font-size: 18px;">Contact Information</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; font-weight: bold; width: 130px;">Name:</td>
              <td style="padding: 8px 0; color: #ffffff;">${data.firstName} ${
    data.lastName
  }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; font-weight: bold;">Email:</td>
              <td style="padding: 8px 0; color: #ffffff;">${data.email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; font-weight: bold;">Phone:</td>
              <td style="padding: 8px 0; color: #ffffff;">${
                data.phone || "Not provided"
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; font-weight: bold;">Company:</td>
              <td style="padding: 8px 0; color: #ffffff;">${
                data.company || "Not provided"
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; font-weight: bold;">Job Title:</td>
              <td style="padding: 8px 0; color: #ffffff;">${
                data.jobTitle || "Not provided"
              }</td>
            </tr>
          </table>
        </div>

        <div style="background-color: #334155; padding: 25px; border-radius: 12px; margin-bottom: 20px;">
          <h2 style="color: #10b981; margin-top: 0; font-size: 18px;">Project Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; font-weight: bold; width: 130px;">Service Interest:</td>
              <td style="padding: 8px 0; color: #ffffff;">${
                data.serviceInterest
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; font-weight: bold;">Budget:</td>
              <td style="padding: 8px 0; color: #ffffff;">${
                data.budget || "Not specified"
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; font-weight: bold; vertical-align: top;">Description:</td>
              <td style="padding: 8px 0; color: #ffffff; line-height: 1.6;">${
                data.projectDescription
              }</td>
            </tr>
          </table>
        </div>

        <div style="background-color: #334155; padding: 25px; border-radius: 12px;">
          <h2 style="color: #10b981; margin-top: 0; font-size: 18px;">Additional Information</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; font-weight: bold; width: 130px;">Heard About Us:</td>
              <td style="padding: 8px 0; color: #ffffff;">${
                data.hearAbout || "Not specified"
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; font-weight: bold;">Newsletter:</td>
              <td style="padding: 8px 0; color: #ffffff;">${
                data.subscribe ? "Yes, wants updates" : "No"
              }</td>
            </tr>
          </table>
        </div>

        <div style="margin-top: 30px; text-align: center; color: #64748b; font-size: 14px;">
          <p>This message was sent from the Geokits contact form</p>
        </div>
      </div>
    `;
}
