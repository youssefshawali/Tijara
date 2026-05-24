import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { requireAdminSession } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { mediaFiles } from "@/lib/db/schema";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { withMongoIds } from "@/lib/serialize";

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const files = await db
      .select()
      .from(mediaFiles)
      .orderBy(desc(mediaFiles.createdAt));

    return NextResponse.json({ data: withMongoIds(files) });
  } catch (err) {
    console.error("[API Admin Media GET]", err);
    return NextResponse.json(
      { error: "Failed to fetch media files" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Media file id is required" },
        { status: 400 }
      );
    }

    const [file] = await db
      .select()
      .from(mediaFiles)
      .where(eq(mediaFiles.id, id))
      .limit(1);

    if (!file) {
      return NextResponse.json(
        { error: "Media file not found" },
        { status: 404 }
      );
    }

    try {
      await deleteFromCloudinary(file.publicId);
    } catch (cloudinaryErr) {
      console.error("[API Admin Media DELETE Cloudinary]", cloudinaryErr);
    }

    await db.delete(mediaFiles).where(eq(mediaFiles.id, id));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[API Admin Media DELETE]", err);
    return NextResponse.json(
      { error: "Failed to delete media file" },
      { status: 500 }
    );
  }
}
