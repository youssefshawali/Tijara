import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import connectDB from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";
import { siteSettingsSchema } from "@/lib/validations/admin";
import { siteConfig } from "@/lib/site-config";

function getDefaultSettings() {
  return {
    companyName: siteConfig.name,
    tagline: siteConfig.tagline,
    description: siteConfig.description,
    email: siteConfig.email,
    phone: siteConfig.phone,
    whatsapp: siteConfig.whatsapp,
    instagram: siteConfig.instagram,
    instagramHandle: siteConfig.instagramHandle,
    address: siteConfig.address,
  };
}

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    await connectDB();

    let settings = await SiteSettings.findOne();

    if (!settings) {
      settings = await SiteSettings.create(getDefaultSettings());
    }

    return NextResponse.json({ data: settings.toObject() });
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
    const logoUrl = data.logoUrl || undefined;

    await connectDB();

    let settings = await SiteSettings.findOne();

    if (!settings) {
      settings = await SiteSettings.create({
        ...getDefaultSettings(),
        ...data,
        logoUrl,
      });
    } else {
      Object.assign(settings, { ...data, logoUrl });
      await settings.save();
    }

    return NextResponse.json({ data: settings.toObject() });
  } catch (err) {
    console.error("[API Admin Settings PUT]", err);
    return NextResponse.json(
      { error: "Invalid settings data" },
      { status: 400 }
    );
  }
}
