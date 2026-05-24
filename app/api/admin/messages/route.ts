import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { contactSubmissions } from "@/lib/db/schema";
import { and, count, desc, eq, ilike, or } from "drizzle-orm";
import { withMongoIds } from "@/lib/serialize";

export async function GET(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10))
    );
    const search = searchParams.get("search")?.trim() ?? "";
    const status = searchParams.get("status") ?? "all";

    const conditions = [];
    if (status === "read") conditions.push(eq(contactSubmissions.read, true));
    if (status === "unread") conditions.push(eq(contactSubmissions.read, false));
    if (search) {
      conditions.push(
        or(
          ilike(contactSubmissions.name, `%${search}%`),
          ilike(contactSubmissions.email, `%${search}%`),
          ilike(contactSubmissions.message, `%${search}%`),
          ilike(contactSubmissions.company, `%${search}%`)
        )
      );
    }

    const where = conditions.length ? and(...conditions) : undefined;
    const skip = (page - 1) * limit;

    const [messages, [{ total }]] = await Promise.all([
      db
        .select()
        .from(contactSubmissions)
        .where(where)
        .orderBy(desc(contactSubmissions.createdAt))
        .limit(limit)
        .offset(skip),
      db.select({ total: count() }).from(contactSubmissions).where(where),
    ]);

    return NextResponse.json({
      data: withMongoIds(messages),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("[API Admin Messages]", err);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
