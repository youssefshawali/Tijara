import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import connectDB from "@/lib/mongodb";
import MediaFile from "@/models/MediaFile";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    await connectDB();
    const files = await MediaFile.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({ data: files });
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

    await connectDB();

    const file = await MediaFile.findById(id);
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

    await MediaFile.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[API Admin Media DELETE]", err);
    return NextResponse.json(
      { error: "Failed to delete media file" },
      { status: 500 }
    );
  }
}
