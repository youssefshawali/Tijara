import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

interface PageMetadataOptions {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
}

export function createMetadata({
  title,
  description = siteConfig.description,
  path = "",
  image = "/pictures/hero-office.png",
}: PageMetadataOptions = {}): Metadata {
  const pageTitle = title
    ? `${title} | ${siteConfig.name}`
    : `${siteConfig.name} — Business Development & Growth Consulting`;
  const url = `${siteConfig.url}${path}`;

  return {
    title: pageTitle,
    description,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: pageTitle,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
    },
    keywords: [
      "business development",
      "growth consulting",
      "startup scaling",
      "business strategy",
      "branding",
      "marketing consulting",
      "TIJARA",
      "tijara.dev",
    ],
  };
}
