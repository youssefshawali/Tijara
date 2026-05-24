/**
 * CMS integration placeholder.
 * Replace data imports with CMS fetch calls when ready.
 *
 * Supported options: Contentful, Sanity, Strapi, etc.
 */

export interface CMSConfig {
  provider: "contentful" | "sanity" | "strapi" | "local";
  apiUrl?: string;
  apiKey?: string;
}

export const cmsConfig: CMSConfig = {
  provider: "local",
};

export async function getPageContent<T>(slug: string): Promise<T | null> {
  // Future: fetch from CMS
  // return apiClient<T>(`/cms/pages/${slug}`);
  void slug;
  return null;
}

export async function getServices<T>(): Promise<T[]> {
  // Future: fetch from CMS
  return [];
}
