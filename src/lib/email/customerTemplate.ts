import { ContactFormData } from "./types";

export function generateCustomerEmailHtml(data: ContactFormData): string {
  return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #1e293b; color: #ffffff;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #10b981; margin: 0; font-size: 24px;">Thank You for Contacting Geokits</h1>
          <div style="height: 2px; background: linear-gradient(to right, #10b981, #059669); margin: 10px auto; width: 100px;"></div>
        </div>
        
        <div style="background-color: #334155; padding: 25px; border-radius: 12px; margin-bottom: 20px;">
          <p style="color: #ffffff; margin: 0 0 15px 0; font-size: 16px;">Dear ${data.firstName},</p>
          <p style="color: #94a3b8; line-height: 1.6; margin: 0 0 15px 0;">
            Thank you for reaching out to us regarding <strong style="color: #10b981;">${data.serviceInterest}</strong>. 
            We have received your inquiry and our team will review your requirements carefully.
          </p>
          <p style="color: #94a3b8; line-height: 1.6; margin: 0;">
            We typically respond to all inquiries within 24 hours. If you have any urgent questions, 
            please don't hesitate to call us at <strong style="color: #10b981;">(+44) 7446284191</strong>.
          </p>
        </div>

        <div style="background-color: #334155; padding: 25px; border-radius: 12px; margin-bottom: 20px;">
          <h2 style="color: #10b981; margin-top: 0; font-size: 18px;">Your Submission Summary</h2>
          <p style="color: #94a3b8; margin: 0 0 10px 0;"><strong>Service Interest:</strong> ${data.serviceInterest}</p>
          <p style="color: #94a3b8; margin: 0 0 10px 0;"><strong>Project Description:</strong></p>
          <p style="color: #ffffff; background-color: #1e293b; padding: 15px; border-radius: 8px; margin: 0; line-height: 1.6;">
            ${data.projectDescription}
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #64748b; margin: 0 0 10px 0; font-size: 14px;">
            Best regards,<br>
            <strong style="color: #10b981;">The Geokits Team</strong>
          </p>
          <p style="color: #64748b; font-size: 12px; margin: 0;">
            I10, Plot No, 94, 3 Street 7, I-10/3 sector, Islamabad, 44800 | contact@geokits.com | (+44 7446284191
          </p>
        </div>
      </div>
    `;
}
