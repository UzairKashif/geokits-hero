import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Define the interface for the form data
interface ContactFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  jobTitle: string
  serviceInterest: string
  projectDescription: string
  budget: string
  hearAbout: string
  subscribe: boolean
}

export async function POST(request: NextRequest) {
  try {
    const data: ContactFormData = await request.json()

    // Create a transporter using SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // Email to company
    const companyEmailHtml = `
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
              <td style="padding: 8px 0; color: #ffffff;">${data.firstName} ${data.lastName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; font-weight: bold;">Email:</td>
              <td style="padding: 8px 0; color: #ffffff;">${data.email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; font-weight: bold;">Phone:</td>
              <td style="padding: 8px 0; color: #ffffff;">${data.phone || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; font-weight: bold;">Company:</td>
              <td style="padding: 8px 0; color: #ffffff;">${data.company || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; font-weight: bold;">Job Title:</td>
              <td style="padding: 8px 0; color: #ffffff;">${data.jobTitle || 'Not provided'}</td>
            </tr>
          </table>
        </div>

        <div style="background-color: #334155; padding: 25px; border-radius: 12px; margin-bottom: 20px;">
          <h2 style="color: #10b981; margin-top: 0; font-size: 18px;">Project Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; font-weight: bold; width: 130px;">Service Interest:</td>
              <td style="padding: 8px 0; color: #ffffff;">${data.serviceInterest}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; font-weight: bold;">Budget:</td>
              <td style="padding: 8px 0; color: #ffffff;">${data.budget || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; font-weight: bold; vertical-align: top;">Description:</td>
              <td style="padding: 8px 0; color: #ffffff; line-height: 1.6;">${data.projectDescription}</td>
            </tr>
          </table>
        </div>

        <div style="background-color: #334155; padding: 25px; border-radius: 12px;">
          <h2 style="color: #10b981; margin-top: 0; font-size: 18px;">Additional Information</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; font-weight: bold; width: 130px;">Heard About Us:</td>
              <td style="padding: 8px 0; color: #ffffff;">${data.hearAbout || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; font-weight: bold;">Newsletter:</td>
              <td style="padding: 8px 0; color: #ffffff;">${data.subscribe ? 'Yes, wants updates' : 'No'}</td>
            </tr>
          </table>
        </div>

        <div style="margin-top: 30px; text-align: center; color: #64748b; font-size: 14px;">
          <p>This message was sent from the Geokits contact form</p>
        </div>
      </div>
    `

    // Email to customer (confirmation)
    const customerEmailHtml = `
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
            please don't hesitate to call us at <strong style="color: #10b981;">(+92) 303 7239083</strong>.
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
            G 9/4, Islamabad, Pakistan | contact@geokits.co | (+92) 303 7239083
          </p>
        </div>
      </div>
    `

    // Send email to company
    await transporter.sendMail({
      from: `"Geokits Contact Form" <${process.env.SMTP_USER}>`,
      to: process.env.COMPANY_EMAIL || 'contact@geokits.co',
      subject: `New Contact Form Submission - ${data.serviceInterest}`,
      html: companyEmailHtml,
      replyTo: data.email,
    })

    // Send confirmation email to customer
    await transporter.sendMail({
      from: `"Geokits" <${process.env.SMTP_USER}>`,
      to: data.email,
      subject: 'Thank you for contacting Geokits - We\'ll be in touch soon!',
      html: customerEmailHtml,
    })

    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { message: 'Failed to send email' },
      { status: 500 }
    )
  }
}
