import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY)

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

    // Validate required environment variables
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY is not set in environment variables')
      return NextResponse.json(
        { message: 'Server configuration error: Missing API key' },
        { status: 500 }
      )
    }

    console.log('📧 Attempting to send emails...')
    console.log('📝 Form data received:', {
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      service: data.serviceInterest
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
            please don't hesitate to call us at <strong style="color: #10b981;">(+44 7446284191</strong>.
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
            G 9/4, Islamabad, Pakistan | contact@geokits.com | (+44 7446284191
          </p>
        </div>
      </div>
    `

    // Send email to company using Resend
    console.log('📤 Sending email to company...')
    const companyEmailResult = await resend.emails.send({
      from: 'Geokits Contact Form <onboarding@resend.dev>', // Use verified domain
      to: [process.env.COMPANY_EMAIL || 'arslantar360@gmail.com'],
      subject: `New Contact Form Submission - ${data.serviceInterest}`,
      html: companyEmailHtml,
      replyTo: data.email,
    })
    console.log('✅ Company email result:', companyEmailResult)

    // Send confirmation email to customer using Resend
    console.log('📤 Sending confirmation email to customer...')
    let customerEmailResult = null;
    try {
      customerEmailResult = await resend.emails.send({
        from: 'Geokits <onboarding@resend.dev>',
        to: [data.email],
        subject: 'Thank you for contacting Geokits - We\'ll be in touch soon!',
        html: customerEmailHtml,
      })
      console.log('✅ Customer email result:', customerEmailResult)
    } catch (customerEmailError) {
      console.error('⚠️ Customer email failed (but company email succeeded):', customerEmailError)
      // Don't fail the entire request if customer email fails
    }

    console.log('🎉 Company email sent successfully!')
    return NextResponse.json(
      { 
        message: 'Email sent successfully',
        companyEmailId: companyEmailResult.data?.id,
        customerEmailId: customerEmailResult?.data?.id || 'failed',
        note: customerEmailResult ? 'Both emails sent' : 'Company email sent, customer email failed'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ Error sending email:', error)
    
    // Log more detailed error information
    if (error instanceof Error) {
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    
    // Check if it's a Resend API error
    if (error && typeof error === 'object' && 'message' in error) {
      console.error('API Error details:', error)
    }
    
    return NextResponse.json(
      { 
        message: 'Failed to send email',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
