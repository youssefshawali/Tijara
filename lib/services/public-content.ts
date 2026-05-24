import connectDB from "@/lib/mongodb";
import Service from "@/models/Service";
import Testimonial from "@/models/Testimonial";
import SiteSettings from "@/models/SiteSettings";
import { services as staticServices } from "@/data/services";
import { siteConfig } from "@/lib/site-config";

export async function getPublishedServices() {
  try {
    await connectDB();
    const services = await Service.find({ published: true })
      .sort({ sortOrder: 1 })
      .lean();
    if (services.length === 0) return staticServices;
    return services.map((s) => ({
      id: s.slug,
      title: s.title,
      shortDescription: s.shortDescription,
      description: s.description,
      benefits: s.benefits,
      process: s.process,
      icon: s.icon,
      imageUrl: s.imageUrl,
    }));
  } catch {
    return staticServices;
  }
}

export async function getPublishedTestimonials() {
  try {
    await connectDB();
    const items = await Testimonial.find({ published: true })
      .sort({ sortOrder: 1 })
      .lean();
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
    await connectDB();
    const settings = await SiteSettings.findOne().lean();
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

export async function getMergedSiteConfig() {
  const settings = await getPublicSiteSettings();
  if (!settings) return siteConfig;
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
