import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { generateCompanyEmailHtml } from "@/lib/email/companyTemplate";
import { generateCustomerEmailHtml } from "@/lib/email/customerTemplate";
import type { ContactFormData } from "@/lib/email/types";

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);
resend.domains.create({
  name: "geokits.com",
  customReturnPath: "contact@geokits.com",
});

// Form data type now imported from shared types

export async function POST(request: NextRequest) {
  try {
    const data: ContactFormData = await request.json();

    // Validate required environment variables
    if (!process.env.RESEND_API_KEY) {
      console.error("❌ RESEND_API_KEY is not set in environment variables");
      return NextResponse.json(
        { message: "Server configuration error: Missing API key" },
        { status: 500 }
      );
    }

    console.log("📧 Attempting to send emails...");
    console.log("📝 Form data received:", {
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      service: data.serviceInterest,
    });

    // Email to company
    const companyEmailHtml = generateCompanyEmailHtml(data);

    // Email to customer (confirmation)
    const customerEmailHtml = generateCustomerEmailHtml(data);

    // Send email to company using Resend

    // Validate environment variables
    if (!process.env.COMPANY_EMAIL) {
      console.error("❌ COMPANY_EMAIL is not set in environment variables");
      return NextResponse.json(
        { message: "Server configuration error: Missing company email" },
        { status: 500 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("❌ RESEND_API_KEY is not set in environment variables");
      return NextResponse.json(
        { message: "Server configuration error: Missing API key" },
        { status: 500 }
      );
    }

    if (!process.env.COMPANY_PERSONNEL_EMAIL) {
      console.error(
        "❌ COMPANY_PERSONNEL_EMAIL is not set in environment variables"
      );
      return NextResponse.json(
        { message: "Server configuration error: Missing company email" },
        { status: 500 }
      );
    }

    const from = `Geokits Contact Form <${process.env.COMPANY_EMAIL}>`;

    console.log("📤 Sending email to company...");
    const companyEmailResult = await resend.emails.send({
      from: from, // Use verified domain
      to: [process.env.COMPANY_PERSONNEL_EMAIL!],
      subject: `New Contact Form Submission - ${data.serviceInterest}`,
      html: companyEmailHtml,
      replyTo: data.email,
    });
    console.log("✅ Company email result:", companyEmailResult);

    // Send confirmation email to customer using Resend
    console.log("📤 Sending confirmation email to customer...");
    let customerEmailResult = null;
    try {
      customerEmailResult = await resend.emails.send({
        from: from,
        to: [data.email],
        subject: "Thank you for contacting Geokits - We'll be in touch soon!",
        html: customerEmailHtml,
      });
      console.log("✅ Customer email result:", customerEmailResult);
    } catch (customerEmailError) {
      console.error(
        "⚠️ Customer email failed (but company email succeeded):",
        customerEmailError
      );
      // Don't fail the entire request if customer email fails
    }

    console.log("🎉 Company email sent successfully!");
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
    console.error("❌ Error sending email:", error);

    // Log more detailed error information
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    // Check if it's a Resend API error
    if (error && typeof error === "object" && "message" in error) {
      console.error("API Error details:", error);
    }

    return NextResponse.json(
      {
        message: "Failed to send email",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
