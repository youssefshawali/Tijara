import { NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validations/contact";
import { rateLimit } from "@/lib/rate-limit";
import connectDB from "@/lib/mongodb";
import ContactSubmission from "@/models/ContactSubmission";

/**
 * POST /api/contact
 * Validates, rate-limits, and persists contact form submissions.
 */
export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "anonymous";

    const { success } = rateLimit(`contact:${ip}`, 5, 60_000);
    if (!success) {
      return NextResponse.json(
        { success: false, message: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const data = contactFormSchema.parse(body);

    await connectDB();
    const submission = await ContactSubmission.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company || undefined,
      businessType: data.businessType,
      message: data.message,
      read: false,
    });

    return NextResponse.json({
      success: true,
      message:
        "Thank you for reaching out. Our team will respond within one business day.",
      id: submission._id.toString(),
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[API Contact]", error);
    }
    return NextResponse.json(
      { success: false, message: "Invalid form data" },
      { status: 400 }
    );
  }
}
