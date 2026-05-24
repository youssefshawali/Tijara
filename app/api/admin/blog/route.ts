import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { requireAdminSession } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { blogPostSchema } from "@/lib/validations/admin";
import { slugify } from "@/lib/slug";
import { createId } from "@/lib/id";
import { withMongoId, withMongoIds } from "@/lib/serialize";

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const posts = await db
      .select()
      .from(blogPosts)
      .orderBy(desc(blogPosts.createdAt));

    return NextResponse.json({ data: withMongoIds(posts) });
  } catch (err) {
    console.error("[API Admin Blog GET]", err);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const body = await request.json();
    const data = blogPostSchema.parse(body);
    const slug = data.slug || slugify(data.title);

    const [existing] = await db
      .select({ id: blogPosts.id })
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug))
      .limit(1);

    if (existing) {
      return NextResponse.json(
        { error: "A blog post with this slug already exists" },
        { status: 400 }
      );
    }

    const [post] = await db
      .insert(blogPosts)
      .values({
        id: createId(),
        title: data.title,
        slug,
        content: data.content,
        excerpt: data.excerpt || null,
        featuredImage: data.featuredImage || null,
        category: data.category,
        tags: data.tags,
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
        status: data.status,
        publishedAt: data.status === "published" ? new Date() : null,
      })
      .returning();

    return NextResponse.json({ data: withMongoId(post) }, { status: 201 });
  } catch (err) {
    console.error("[API Admin Blog POST]", err);
    return NextResponse.json(
      { error: "Invalid blog post data" },
      { status: 400 }
    );
  }
}
