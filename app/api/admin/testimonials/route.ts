import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import connectDB from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";
import { testimonialSchema } from "@/lib/validations/admin";

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    await connectDB();
    const testimonials = await Testimonial.find()
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({ data: testimonials });
  } catch (err) {
    console.error("[API Admin Testimonials GET]", err);
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const body = await request.json();
    const data = testimonialSchema.parse(body);
    const imageUrl = data.imageUrl || undefined;

    await connectDB();

    const testimonial = await Testimonial.create({
      ...data,
      imageUrl,
    });

    return NextResponse.json({ data: testimonial }, { status: 201 });
  } catch (err) {
    console.error("[API Admin Testimonials POST]", err);
    return NextResponse.json(
      { error: "Invalid testimonial data" },
      { status: 400 }
    );
  }
}
