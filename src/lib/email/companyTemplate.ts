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

export function generateCompanyEmailHtmlAlt(data: ContactFormData): string {
  return `
    <div style="font-family: 'Times New Roman', serif; max-width: 460px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff; color: #021400;">
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="color: #021400; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: 3px; text-transform: uppercase;">Geokits</h1>
        <div style="width: 60px; height: 2px; background-color: #021400; margin: 16px auto;"></div>
        <p style="color: #021400; margin: 16px 0 0 0; font-size: 16px; font-weight: 500; opacity: 0.8;">New Contact Form Submission</p>
      </div>
      
      <div style="margin-bottom: 32px;">
        <h2 style="color: #021400; margin: 0 0 20px 0; font-size: 18px; font-weight: bold; text-align: center;">Contact Information</h2>
        
        <div style="margin-bottom: 24px;">
          <p style="color: #021400; margin: 0 0 8px 0; font-size: 15px;"><strong>Name:</strong> ${
            data.firstName
          } ${data.lastName}</p>
          <p style="color: #021400; margin: 0 0 8px 0; font-size: 15px;"><strong>Email:</strong> ${
            data.email
          }</p>
          <p style="color: #021400; margin: 0 0 8px 0; font-size: 15px;"><strong>Phone:</strong> ${
            data.phone || "Not provided"
          }</p>
          <p style="color: #021400; margin: 0 0 8px 0; font-size: 15px;"><strong>Company:</strong> ${
            data.company || "Not provided"
          }</p>
          <p style="color: #021400; margin: 0 0 8px 0; font-size: 15px;"><strong>Job Title:</strong> ${
            data.jobTitle || "Not provided"
          }</p>
        </div>
      </div>

      <div style="margin-bottom: 32px;">
        <h2 style="color: #021400; margin: 0 0 20px 0; font-size: 18px; font-weight: bold; text-align: center;">Project Details</h2>
        
        <div style="margin-bottom: 24px;">
          <p style="color: #021400; margin: 0 0 8px 0; font-size: 15px;"><strong>Service Interest:</strong> ${
            data.serviceInterest
          }</p>
          <p style="color: #021400; margin: 0 0 8px 0; font-size: 15px;"><strong>Budget:</strong> ${
            data.budget || "Not specified"
          }</p>
        </div>

        <div style="border: 1px solid #021400; padding: 20px; margin: 20px 0; background-color: #fafffe;">
          <p style="color: #021400; margin: 0; font-size: 14px; line-height: 1.7; font-style: italic; text-align: center;">
            "${data.projectDescription}"
          </p>
        </div>
      </div>

      <div style="margin-bottom: 32px;">
        <h2 style="color: #021400; margin: 0 0 20px 0; font-size: 18px; font-weight: bold; text-align: center;">Additional Information</h2>
        
        <div style="margin-bottom: 24px;">
          <p style="color: #021400; margin: 0 0 8px 0; font-size: 15px;"><strong>How they heard about us:</strong> ${
            data.hearAbout || "Not specified"
          }</p>
          <p style="color: #021400; margin: 0 0 8px 0; font-size: 15px;"><strong>Newsletter subscription:</strong> ${
            data.subscribe ? "Yes, wants updates" : "No"
          }</p>
        </div>
      </div>
      
      <div style="text-align: center; border-top: 1px solid #021400; opacity: 0.4; padding-top: 20px;">
        <p style="color: #021400; opacity: 0.7; margin: 0; font-size: 13px; line-height: 1.5;">
          Submitted via Contact Form<br>
          ${new Date().toLocaleString()}
        </p>
      </div>
    </div>
  `;
}
