import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import connectDB from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";
import { blogPostSchema } from "@/lib/validations/admin";
import { slugify } from "@/lib/slug";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const { id } = await context.params;
    await connectDB();

    const post = await BlogPost.findById(id).lean();
    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    return NextResponse.json({ data: post });
  } catch (err) {
    console.error("[API Admin Blog GET]", err);
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
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
    const data = blogPostSchema.parse(body);

    const slug = data.slug || slugify(data.title);
    const featuredImage = data.featuredImage || undefined;

    await connectDB();

    const duplicate = await BlogPost.findOne({ slug, _id: { $ne: id } });
    if (duplicate) {
      return NextResponse.json(
        { error: "A blog post with this slug already exists" },
        { status: 400 }
      );
    }

    const existing = await BlogPost.findById(id).lean();
    if (!existing) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    const update: Record<string, unknown> = {
      ...data,
      slug,
      featuredImage,
    };

    if (data.status === "published" && !existing.publishedAt) {
      update.publishedAt = new Date();
    }

    const post = await BlogPost.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).lean();

    return NextResponse.json({ data: post });
  } catch (err) {
    console.error("[API Admin Blog PUT]", err);
    return NextResponse.json(
      { error: "Invalid blog post data" },
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

    const post = await BlogPost.findByIdAndDelete(id);
    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[API Admin Blog DELETE]", err);
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}
