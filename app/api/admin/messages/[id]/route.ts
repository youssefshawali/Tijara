import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { requireAdminSession } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { contactSubmissions } from "@/lib/db/schema";
import { withMongoId } from "@/lib/serialize";

const patchSchema = z.object({
  read: z.boolean(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const { id } = await context.params;
    const [message] = await db
      .select()
      .from(contactSubmissions)
      .where(eq(contactSubmissions.id, id))
      .limit(1);

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ data: withMongoId(message) });
  } catch (err) {
    console.error("[API Admin Message GET]", err);
    return NextResponse.json(
      { error: "Failed to fetch message" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const { id } = await context.params;
    const body = await request.json();
    const data = patchSchema.parse(body);

    const [message] = await db
      .update(contactSubmissions)
      .set({ read: data.read, updatedAt: new Date() })
      .where(eq(contactSubmissions.id, id))
      .returning();

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ data: withMongoId(message) });
  } catch (err) {
    console.error("[API Admin Message PATCH]", err);
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const { id } = await context.params;
    const [message] = await db
      .delete(contactSubmissions)
      .where(eq(contactSubmissions.id, id))
      .returning();

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[API Admin Message DELETE]", err);
    return NextResponse.json(
      { error: "Failed to delete message" },
      { status: 500 }
    );
  }
}
