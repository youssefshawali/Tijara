export const siteConfig = {
  name: "TIJARA",
  tagline: "Premium business growth partner for ambitious companies.",
  description:
    "TIJARA is a business development and growth consulting firm helping companies scale through strategy, positioning, branding, marketing, and operations.",
  url: "https://tijara.dev",
  domain: "tijara.dev",
  email: "youssefshawali@gmail.com",
  phone: "+20 100 000 0000",
  whatsapp: "https://wa.me/201000000000",
  instagram: "https://instagram.com/Tijaraeg",
  instagramHandle: "@Tijaraeg",
  address: "Cairo, Egypt",
  locale: "en_US",
} as const;

export type SiteConfig = {
  name: string;
  tagline: string;
  description: string;
  url: string;
  domain: string;
  email: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  instagramHandle: string;
  address: string;
  locale: string;
};

export type PublicContactInfo = Pick<
  SiteConfig,
  "email" | "phone" | "address" | "whatsapp" | "instagram"
>;
