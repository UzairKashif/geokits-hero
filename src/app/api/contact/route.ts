import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import {
  generateCompanyEmailHtml,
  generateCompanyEmailHtmlAlt,
} from "@/lib/email/companyTemplate";
import {
  generateCustomerEmailHtml,
  generateCustomerEmailHtmlAlt,
} from "@/lib/email/customerTemplate";
import type { ContactFormData } from "@/lib/email/types";

// Cloudflare Turnstile verification function
async function verifyTurnstile(token: string): Promise<{ success: boolean }> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  
  if (!secretKey) {
    return { success: false };
  }

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        secret: secretKey,
        response: token,
      }),
    });

    const data = await response.json();
    
    return {
      success: data.success === true,
    };
  } catch (error) {
    return { success: false };
  }
}

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);
resend.domains.create({
  name: "geokits.com",
  customReturnPath: "contact@geokits.com",
});

// Form data type now imported from shared types

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { turnstileToken, ...data } = body as ContactFormData & { turnstileToken?: string };

    // Verify Turnstile token
    if (!turnstileToken) {
      return NextResponse.json(
        { message: "Security verification failed. Please try again." },
        { status: 400 }
      );
    }

    const turnstileResult = await verifyTurnstile(turnstileToken);
    if (!turnstileResult.success) {
      return NextResponse.json(
        { message: "Security verification failed. Please try again." },
        { status: 400 }
      );
    }

    // Validate required environment variables
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { message: "Server configuration error: Missing API key" },
        { status: 500 }
      );
    }

    // Email to company
    const companyEmailHtml = generateCompanyEmailHtmlAlt(data);

    // Email to customer (confirmation)
    const customerEmailHtml = generateCustomerEmailHtmlAlt(data);

    // Send email to company using Resend

    // Validate environment variables
    if (!process.env.COMPANY_EMAIL) {
      return NextResponse.json(
        { message: "Server configuration error: Missing company email" },
        { status: 500 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { message: "Server configuration error: Missing API key" },
        { status: 500 }
      );
    }

    if (!process.env.COMPANY_PERSONNEL_EMAIL) {
      return NextResponse.json(
        { message: "Server configuration error: Missing company email" },
        { status: 500 }
      );
    }

    const from = `Geokits Contact Form <${process.env.COMPANY_EMAIL}>`;

    const companyEmailResult = await resend.emails.send({
      from: from,
      to: [process.env.COMPANY_PERSONNEL_EMAIL!],
      subject: `New Contact Form Submission - ${data.serviceInterest}`,
      html: companyEmailHtml,
      replyTo: data.email,
    });

    // Send confirmation email to customer using Resend
    let customerEmailResult = null;
    try {
      customerEmailResult = await resend.emails.send({
        from: from,
        to: [data.email],
        subject: "Thank you for contacting Geokits - We'll be in touch soon!",
        html: customerEmailHtml,
      });
    } catch (customerEmailError) {
      // Don't fail the entire request if customer email fails
    }

    return NextResponse.json(
      {
        message: "Email sent successfully",
        companyEmailId: companyEmailResult.data?.id,
        customerEmailId: customerEmailResult?.data?.id || "failed",
        note: customerEmailResult
          ? "Both emails sent"
          : "Company email sent, customer email failed",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to send email",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
