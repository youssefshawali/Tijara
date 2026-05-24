import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import connectDB from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";
import { blogPostSchema } from "@/lib/validations/admin";
import { slugify } from "@/lib/slug";

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    await connectDB();
    const posts = await BlogPost.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ data: posts });
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
    const featuredImage = data.featuredImage || undefined;

    await connectDB();

    const existing = await BlogPost.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { error: "A blog post with this slug already exists" },
        { status: 400 }
      );
    }

    const post = await BlogPost.create({
      ...data,
      slug,
      featuredImage,
      publishedAt: data.status === "published" ? new Date() : undefined,
    });

    return NextResponse.json({ data: post }, { status: 201 });
  } catch (err) {
    console.error("[API Admin Blog POST]", err);
    return NextResponse.json(
      { error: "Invalid blog post data" },
      { status: 400 }
    );
  }
}
