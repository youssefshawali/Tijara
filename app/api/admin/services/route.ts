import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import connectDB from "@/lib/mongodb";
import Service from "@/models/Service";
import { serviceSchema } from "@/lib/validations/admin";
import { slugify } from "@/lib/slug";

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    await connectDB();
    const services = await Service.find()
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({ data: services });
  } catch (err) {
    console.error("[API Admin Services GET]", err);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const body = await request.json();
    const data = serviceSchema.parse(body);

    const slug = data.slug || slugify(data.title);
    const imageUrl = data.imageUrl || undefined;

    await connectDB();

    const existing = await Service.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { error: "A service with this slug already exists" },
        { status: 400 }
      );
    }

    const service = await Service.create({
      ...data,
      slug,
      imageUrl,
    });

    return NextResponse.json({ data: service }, { status: 201 });
  } catch (err) {
    console.error("[API Admin Services POST]", err);
    return NextResponse.json(
      { error: "Invalid service data" },
      { status: 400 }
    );
  }
}
