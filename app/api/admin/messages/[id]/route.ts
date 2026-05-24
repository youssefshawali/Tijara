import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/admin-auth";
import connectDB from "@/lib/mongodb";
import ContactSubmission from "@/models/ContactSubmission";

const patchSchema = z.object({
  read: z.boolean(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const { id } = await context.params;
    await connectDB();

    const message = await ContactSubmission.findById(id).lean();
    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ data: message });
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

    await connectDB();

    const message = await ContactSubmission.findByIdAndUpdate(
      id,
      { read: data.read },
      { new: true }
    ).lean();

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ data: message });
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
    await connectDB();

    const message = await ContactSubmission.findByIdAndDelete(id);
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
