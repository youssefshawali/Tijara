import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import connectDB from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";
import { testimonialSchema } from "@/lib/validations/admin";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const { id } = await context.params;
    await connectDB();

    const testimonial = await Testimonial.findById(id).lean();
    if (!testimonial) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: testimonial });
  } catch (err) {
    console.error("[API Admin Testimonial GET]", err);
    return NextResponse.json(
      { error: "Failed to fetch testimonial" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, context: RouteContext) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const { id } = await context.params;
    const body = await request.json();
    const data = testimonialSchema.parse(body);
    const imageUrl = data.imageUrl || undefined;

    await connectDB();

    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      { ...data, imageUrl },
      { new: true, runValidators: true }
    ).lean();

    if (!testimonial) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: testimonial });
  } catch (err) {
    console.error("[API Admin Testimonial PUT]", err);
    return NextResponse.json(
      { error: "Invalid testimonial data" },
      { status: 400 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const { id } = await context.params;
    await connectDB();

    const testimonial = await Testimonial.findByIdAndDelete(id);
    if (!testimonial) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[API Admin Testimonial DELETE]", err);
    return NextResponse.json(
      { error: "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}
