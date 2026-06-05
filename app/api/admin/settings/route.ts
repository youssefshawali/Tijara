import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { requireAdminSession } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { siteSettingsSchema } from "@/lib/validations/admin";
import { siteConfig } from "@/lib/site-config";
import { withMongoId } from "@/lib/serialize";

const SETTINGS_ID = "default";

function getDefaultSettings() {
  return {
    id: SETTINGS_ID,
    companyName: siteConfig.name,
    tagline: siteConfig.tagline,
    description: siteConfig.description,
    email: siteConfig.email,
    phone: siteConfig.phone,
    whatsapp: siteConfig.whatsapp,
    instagram: siteConfig.instagram,
    instagramHandle: siteConfig.instagramHandle,
    tiktok: siteConfig.tiktok,
    linkedin: siteConfig.linkedin,
    address: siteConfig.address,
  };
}

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    let [settings] = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.id, SETTINGS_ID))
      .limit(1);

    if (!settings) {
      [settings] = await db
        .insert(siteSettings)
        .values(getDefaultSettings())
        .returning();
    }

    return NextResponse.json({ data: withMongoId(settings) });
  } catch (err) {
    console.error("[API Admin Settings GET]", err);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const body = await request.json();
    const data = siteSettingsSchema.parse(body);

    let [settings] = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.id, SETTINGS_ID))
      .limit(1);

    if (!settings) {
      [settings] = await db
        .insert(siteSettings)
        .values({
          ...getDefaultSettings(),
          ...data,
          logoUrl: data.logoUrl || null,
        })
        .returning();
    } else {
      [settings] = await db
        .update(siteSettings)
        .set({
          companyName: data.companyName,
          tagline: data.tagline,
          description: data.description,
          email: data.email,
          phone: data.phone || "",
          whatsapp: data.whatsapp || "",
          instagram: data.instagram,
          instagramHandle: data.instagramHandle,
          tiktok: data.tiktok || "",
          linkedin: data.linkedin || "",
          address: data.address,
          logoUrl: data.logoUrl || null,
          seoTitle: data.seoTitle || null,
          seoDescription: data.seoDescription || null,
          homepageHeroTitle: data.homepageHeroTitle || null,
          homepageHeroSubtitle: data.homepageHeroSubtitle || null,
          updatedAt: new Date(),
        })
        .where(eq(siteSettings.id, SETTINGS_ID))
        .returning();
    }

    return NextResponse.json({ data: withMongoId(settings) });
  } catch (err) {
    console.error("[API Admin Settings PUT]", err);
    return NextResponse.json(
      { error: "Invalid settings data" },
      { status: 400 }
    );
  }
}
