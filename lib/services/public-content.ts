import { eq, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { services, testimonials, siteSettings } from "@/lib/db/schema";
import { services as staticServices } from "@/data/services";
import { siteConfig, type SiteConfig } from "@/lib/site-config";

const SETTINGS_ID = "default";

export async function getPublishedServices() {
  try {
    const rows = await db
      .select()
      .from(services)
      .where(eq(services.published, true))
      .orderBy(asc(services.sortOrder));

    if (rows.length === 0) return staticServices;

    return rows.map((s) => ({
      id: s.slug,
      title: s.title,
      shortDescription: s.shortDescription,
      description: s.description,
      benefits: s.benefits,
      process: s.process,
      icon: s.icon,
      imageUrl: s.imageUrl ?? undefined,
    }));
  } catch {
    return staticServices;
  }
}

export async function getPublishedTestimonials() {
  try {
    const items = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.published, true))
      .orderBy(asc(testimonials.sortOrder));

    if (items.length === 0) return null;

    return items.map((t) => ({
      quote: t.quote,
      author: t.clientName,
      role: `${t.position}, ${t.company}`,
      imageUrl: t.imageUrl,
      rating: t.rating,
    }));
  } catch {
    return null;
  }
}

export async function getPublicSiteSettings() {
  try {
    const [settings] = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.id, SETTINGS_ID))
      .limit(1);
    if (!settings) return null;
    return {
      tagline: settings.tagline,
      description: settings.description,
      email: settings.email,
      phone: settings.phone,
      whatsapp: settings.whatsapp,
      instagram: settings.instagram,
      instagramHandle: settings.instagramHandle,
      address: settings.address,
      logoUrl: settings.logoUrl,
      companyName: settings.companyName,
    };
  } catch {
    return null;
  }
}

export async function getMergedSiteConfig(): Promise<SiteConfig> {
  const settings = await getPublicSiteSettings();
  if (!settings) return { ...siteConfig };
  return {
    ...siteConfig,
    name: settings.companyName ?? siteConfig.name,
    tagline: settings.tagline,
    description: settings.description,
    email: settings.email,
    phone: settings.phone,
    whatsapp: settings.whatsapp,
    instagram: settings.instagram,
    instagramHandle: settings.instagramHandle,
    address: settings.address,
  };
}
