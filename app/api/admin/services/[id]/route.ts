import { NextResponse } from "next/server";
import { and, eq, ne } from "drizzle-orm";
import { requireAdminSession } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { services } from "@/lib/db/schema";
import { serviceSchema } from "@/lib/validations/admin";
import { slugify } from "@/lib/slug";
import { withMongoId } from "@/lib/serialize";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const { id } = await context.params;
    const [service] = await db
      .select()
      .from(services)
      .where(eq(services.id, id))
      .limit(1);

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ data: withMongoId(service) });
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

    const [duplicate] = await db
      .select({ id: services.id })
      .from(services)
      .where(and(eq(services.slug, slug), ne(services.id, id)))
      .limit(1);

    if (duplicate) {
      return NextResponse.json(
        { error: "A service with this slug already exists" },
        { status: 400 }
      );
    }

    const [service] = await db
      .update(services)
      .set({
        title: data.title,
        slug,
        shortDescription: data.shortDescription,
        description: data.description,
        benefits: data.benefits,
        process: data.process,
        icon: data.icon,
        imageUrl: data.imageUrl || null,
        published: data.published,
        sortOrder: data.sortOrder,
        updatedAt: new Date(),
      })
      .where(eq(services.id, id))
      .returning();

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ data: withMongoId(service) });
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
    const [service] = await db
      .delete(services)
      .where(eq(services.id, id))
      .returning();

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
