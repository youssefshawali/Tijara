import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import connectDB from "@/lib/mongodb";
import MediaFile from "@/models/MediaFile";
import {
  uploadToCloudinary,
  isCloudinaryConfigured,
} from "@/lib/cloudinary";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

export async function POST(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      { error: "Cloudinary is not configured" },
      { status: 503 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF, SVG" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5 MB" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const folder = (formData.get("folder") as string) || "tijara";

    const upload = await uploadToCloudinary(buffer, folder);

    await connectDB();

    const mediaFile = await MediaFile.create({
      filename: file.name,
      url: upload.url,
      publicId: upload.publicId,
      format: upload.format,
      bytes: upload.bytes,
      width: upload.width,
      height: upload.height,
      folder,
    });

    return NextResponse.json({ data: mediaFile }, { status: 201 });
  } catch (err) {
    console.error("[API Admin Media Upload]", err);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
