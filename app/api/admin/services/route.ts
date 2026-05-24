import { NextResponse } from "next/server";
import { asc, desc, eq } from "drizzle-orm";
import { requireAdminSession } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { services } from "@/lib/db/schema";
import { serviceSchema } from "@/lib/validations/admin";
import { slugify } from "@/lib/slug";
import { createId } from "@/lib/id";
import { withMongoId, withMongoIds } from "@/lib/serialize";

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const rows = await db
      .select()
      .from(services)
      .orderBy(asc(services.sortOrder), desc(services.createdAt));

    return NextResponse.json({ data: withMongoIds(rows) });
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

    const [existing] = await db
      .select({ id: services.id })
      .from(services)
      .where(eq(services.slug, slug))
      .limit(1);

    if (existing) {
      return NextResponse.json(
        { error: "A service with this slug already exists" },
        { status: 400 }
      );
    }

    const [service] = await db
      .insert(services)
      .values({
        id: createId(),
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
      })
      .returning();

    return NextResponse.json({ data: withMongoId(service) }, { status: 201 });
  } catch (err) {
    console.error("[API Admin Services POST]", err);
    return NextResponse.json(
      { error: "Invalid service data" },
      { status: 400 }
    );
  }
}
