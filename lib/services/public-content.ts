import { unstable_noStore as noStore } from "next/cache";
import { eq, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { services, testimonials, siteSettings, teamMembers } from "@/lib/db/schema";
import { siteConfig, type SiteConfig } from "@/lib/site-config";
import type { Service } from "@/types";

const SETTINGS_ID = "default";

function mapPublishedService(row: {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  benefits: string[];
  process: string[];
  icon: string;
  imageUrl: string | null;
}): Service {
  return {
    id: row.slug,
    title: row.title,
    shortDescription: row.shortDescription,
    description: row.description,
    benefits: row.benefits,
    process: row.process,
    icon: row.icon,
    imageUrl: row.imageUrl ?? undefined,
  };
}

export async function getPublishedServices(): Promise<Service[]> {
  noStore();

  try {
    const rows = await db
      .select()
      .from(services)
      .where(eq(services.published, true))
      .orderBy(asc(services.sortOrder));

    return rows.map(mapPublishedService);
  } catch (err) {
    console.error("[getPublishedServices]", err);
    return [];
  }
}

export type PublicTestimonial = {
  id: string;
  quote: string;
  author: string;
  role: string;
  imageUrl?: string | null;
  rating: number;
};

export type PublicTeamMember = {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
};

export async function getPublishedTeamMembers(): Promise<PublicTeamMember[]> {
  noStore();

  try {
    const rows = await db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.published, true))
      .orderBy(asc(teamMembers.sortOrder));

    return rows
      .filter((m) => m.name.trim() && m.imageUrl)
      .map((m) => ({
        id: m.id,
        name: m.name.trim(),
        role: m.role.trim(),
        imageUrl: m.imageUrl!,
      }));
  } catch {
    return [];
  }
}

export async function getPublishedTestimonials(): Promise<PublicTestimonial[]> {
  noStore();

  try {
    const items = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.published, true))
      .orderBy(asc(testimonials.sortOrder));

    return items.map((t) => ({
      id: t.id,
      quote: t.quote,
      author: t.clientName,
      role: `${t.position}, ${t.company}`,
      imageUrl: t.imageUrl,
      rating: t.rating,
    }));
  } catch {
    return [];
  }
}

export async function getPublicSiteSettings() {
  noStore();

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
