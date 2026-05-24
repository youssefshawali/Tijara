import { NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validations/contact";

/**
 * POST /api/contact
 * Ready for backend integration — validates and processes contact submissions.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = contactFormSchema.parse(body);

    // Future: persist to database, send email notification, CRM integration
    if (process.env.NODE_ENV === "development") {
      console.log("[API Contact]", data);
    }

    return NextResponse.json({
      success: true,
      message:
        "Thank you for reaching out. Our team will respond within one business day.",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Invalid form data" },
      { status: 400 }
    );
  }
}
