import { NextResponse } from "next/server";
import { asc, desc } from "drizzle-orm";
import { requireAdminSession } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { testimonials } from "@/lib/db/schema";
import { testimonialSchema } from "@/lib/validations/admin";
import { createId } from "@/lib/id";
import { withMongoId, withMongoIds } from "@/lib/serialize";

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const rows = await db
      .select()
      .from(testimonials)
      .orderBy(asc(testimonials.sortOrder), desc(testimonials.createdAt));

    return NextResponse.json({ data: withMongoIds(rows) });
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

    const [testimonial] = await db
      .insert(testimonials)
      .values({
        id: createId(),
        clientName: data.clientName,
        position: data.position,
        company: data.company,
        quote: data.quote,
        imageUrl: data.imageUrl || null,
        rating: data.rating,
        published: data.published,
        sortOrder: data.sortOrder,
      })
      .returning();

    return NextResponse.json({ data: withMongoId(testimonial) }, { status: 201 });
  } catch (err) {
    console.error("[API Admin Testimonials POST]", err);
    return NextResponse.json(
      { error: "Invalid testimonial data" },
      { status: 400 }
    );
  }
}
