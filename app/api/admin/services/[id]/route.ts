import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import connectDB from "@/lib/mongodb";
import Service from "@/models/Service";
import { serviceSchema } from "@/lib/validations/admin";
import { slugify } from "@/lib/slug";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const { id } = await context.params;
    await connectDB();

    const service = await Service.findById(id).lean();
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ data: service });
  } catch (err) {
    console.error("[API Admin Service GET]", err);
    return NextResponse.json(
      { error: "Failed to fetch service" },
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
    const data = serviceSchema.parse(body);

    const slug = data.slug || slugify(data.title);
    const imageUrl = data.imageUrl || undefined;

    await connectDB();

    const duplicate = await Service.findOne({ slug, _id: { $ne: id } });
    if (duplicate) {
      return NextResponse.json(
        { error: "A service with this slug already exists" },
        { status: 400 }
      );
    }

    const service = await Service.findByIdAndUpdate(
      id,
      { ...data, slug, imageUrl },
      { new: true, runValidators: true }
    ).lean();

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ data: service });
  } catch (err) {
    console.error("[API Admin Service PUT]", err);
    return NextResponse.json(
      { error: "Invalid service data" },
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

    const service = await Service.findByIdAndDelete(id);
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[API Admin Service DELETE]", err);
    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 }
    );
  }
}
