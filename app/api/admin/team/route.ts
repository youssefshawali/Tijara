import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { requireAdminSession } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { teamMembers } from "@/lib/db/schema";
import { TEAM_SLOT_COUNT } from "@/lib/team";
import { teamMembersSaveSchema } from "@/lib/validations/admin";
import { createId } from "@/lib/id";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { withMongoIds } from "@/lib/serialize";

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const rows = await db
      .select()
      .from(teamMembers)
      .orderBy(asc(teamMembers.sortOrder));

    return NextResponse.json({ data: withMongoIds(rows) });
  } catch (err) {
    console.error("[API Admin Team GET]", err);
    return NextResponse.json(
      { error: "Failed to fetch team members" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const body = await request.json();
    const { members } = teamMembersSaveSchema.parse(body);

    const existing = await db.select().from(teamMembers);
    const bySlot = new Map(existing.map((row) => [row.sortOrder, row]));

    for (let slot = 0; slot < TEAM_SLOT_COUNT; slot++) {
      const incoming = members.find((m) => m.sortOrder === slot);
      const current = bySlot.get(slot);

      if (!incoming) {
        if (current) {
          if (current.publicId) {
            try {
              await deleteFromCloudinary(current.publicId);
            } catch (cloudinaryErr) {
              console.error("[API Admin Team PUT clear slot]", cloudinaryErr);
            }
          }
          await db.delete(teamMembers).where(eq(teamMembers.id, current.id));
        }
        continue;
      }

      const name = incoming.name.trim();
      const role = incoming.role.trim();
      const imageUrl = incoming.imageUrl?.trim() || null;
      const publicId = incoming.publicId?.trim() || null;
      const isEmpty = !name && !role && !imageUrl;

      if (isEmpty) {
        if (current) {
          if (current.publicId) {
            try {
              await deleteFromCloudinary(current.publicId);
            } catch (cloudinaryErr) {
              console.error("[API Admin Team PUT empty slot]", cloudinaryErr);
            }
          }
          await db.delete(teamMembers).where(eq(teamMembers.id, current.id));
        }
        continue;
      }

      if (current) {
        const imageChanged =
          imageUrl && current.publicId && publicId && current.publicId !== publicId;

        if (imageChanged && current.publicId) {
          try {
            await deleteFromCloudinary(current.publicId);
          } catch (cloudinaryErr) {
            console.error("[API Admin Team PUT replace image]", cloudinaryErr);
          }
        }

        await db
          .update(teamMembers)
          .set({
            name,
            role,
            imageUrl,
            publicId: publicId ?? current.publicId,
            published: incoming.published,
            sortOrder: slot,
            updatedAt: new Date(),
          })
          .where(eq(teamMembers.id, current.id));
      } else {
        await db.insert(teamMembers).values({
          id: incoming.id ?? createId(),
          name,
          role,
          imageUrl,
          publicId,
          published: incoming.published,
          sortOrder: slot,
        });
      }
    }

    const rows = await db
      .select()
      .from(teamMembers)
      .orderBy(asc(teamMembers.sortOrder));

    return NextResponse.json({ data: withMongoIds(rows) });
  } catch (err) {
    console.error("[API Admin Team PUT]", err);
    return NextResponse.json(
      { error: "Invalid team data" },
      { status: 400 }
    );
  }
}
