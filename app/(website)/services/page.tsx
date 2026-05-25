import { createMetadata } from "@/lib/metadata";
import {
  ServicesHeroSection,
  ServicesDetailSection,
} from "@/components/sections/services/services-sections";
import { CtaSection } from "@/components/shared/cta-section";
import { getPublishedServices } from "@/lib/services/public-content";

export const metadata = createMetadata({
  title: "Services",
  description:
    "Explore TIJARA's business development, growth strategy, branding, marketing, sales, and operations consulting services.",
  path: "/services",
});

export default async function ServicesPage() {
  const services = await getPublishedServices();

  return (
    <>
      <ServicesHeroSection />
      <ServicesDetailSection services={services} />
      <CtaSection />
    </>
  );
}
