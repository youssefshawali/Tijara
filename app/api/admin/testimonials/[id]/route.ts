import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { requireAdminSession } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { testimonials } from "@/lib/db/schema";
import { testimonialSchema } from "@/lib/validations/admin";
import { withMongoId } from "@/lib/serialize";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const { id } = await context.params;
    const [row] = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.id, id))
      .limit(1);

    if (!row) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }

    return NextResponse.json({ data: withMongoId(row) });
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

    const [row] = await db
      .update(testimonials)
      .set({
        clientName: data.clientName,
        position: data.position,
        company: data.company,
        quote: data.quote,
        imageUrl: data.imageUrl || null,
        rating: data.rating,
        published: data.published,
        sortOrder: data.sortOrder,
        updatedAt: new Date(),
      })
      .where(eq(testimonials.id, id))
      .returning();

    if (!row) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }

    return NextResponse.json({ data: withMongoId(row) });
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
    const [row] = await db
      .delete(testimonials)
      .where(eq(testimonials.id, id))
      .returning();

    if (!row) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
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
