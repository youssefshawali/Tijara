import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const serviceSchema = z.object({
  title: z.string().min(2).max(120),
  slug: z.string().min(2).max(120),
  shortDescription: z.string().min(10).max(300),
  description: z.string().min(20).max(5000),
  benefits: z.array(z.string()).default([]),
  process: z.array(z.string()).default([]),
  icon: z.string().default("Briefcase"),
  imageUrl: z.string().url().optional().or(z.literal("")),
  published: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const blogPostSchema = z.object({
  title: z.string().min(2).max(200),
  slug: z.string().min(2).max(200),
  content: z.string().min(20),
  excerpt: z.string().max(500).optional(),
  featuredImage: z.string().url().optional().or(z.literal("")),
  category: z.string().min(1).max(80),
  tags: z.array(z.string()).default([]),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
  status: z.enum(["draft", "published"]).default("draft"),
});

export const testimonialSchema = z.object({
  clientName: z.string().min(2).max(100),
  position: z.string().min(2).max(100),
  company: z.string().min(2).max(100),
  quote: z.string().min(10).max(2000),
  imageUrl: z.string().url().optional().or(z.literal("")),
  rating: z.number().min(1).max(5).default(5),
  published: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const teamMemberSchema = z.object({
  id: z.string().optional(),
  name: z.string().max(100).default(""),
  role: z.string().max(150).default(""),
  imageUrl: z.string().url().optional().or(z.literal("")),
  publicId: z.string().optional().or(z.literal("")),
  published: z.boolean().default(true),
  sortOrder: z.number().int().min(0).max(3),
});

export const teamMembersSaveSchema = z.object({
  members: z.array(teamMemberSchema).max(4),
});

export const siteSettingsSchema = z.object({
  companyName: z.string().min(1).max(100),
  tagline: z.string().min(1).max(200),
  description: z.string().min(1).max(500),
  email: z.string().email(),
  phone: z.string().min(8).max(30),
  whatsapp: z.string().url(),
  instagram: z.string().url(),
  instagramHandle: z.string().min(1).max(50),
  address: z.string().min(1).max(200),
  logoUrl: z.string().url().optional().or(z.literal("")),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
  homepageHeroTitle: z.string().max(200).optional(),
  homepageHeroSubtitle: z.string().max(400).optional(),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type ServiceFormValues = z.infer<typeof serviceSchema>;
export type BlogPostFormValues = z.infer<typeof blogPostSchema>;
export type TestimonialFormValues = z.infer<typeof testimonialSchema>;
export type SiteSettingsFormValues = z.infer<typeof siteSettingsSchema>;
export type TeamMemberFormValues = z.infer<typeof teamMemberSchema>;
