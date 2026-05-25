import { HeroSection } from "@/components/sections/home/hero-section";
import { AboutPreviewSection } from "@/components/sections/home/about-preview-section";
import { ServicesGridSection } from "@/components/sections/home/services-grid-section";
import { WhyChooseUsSection } from "@/components/sections/home/why-choose-us-section";
import { ProcessTimelineSection } from "@/components/sections/home/process-timeline-section";
import { TestimonialsSection } from "@/components/sections/home/testimonials-section";
import { CtaSection } from "@/components/shared/cta-section";
import { HOME_SERVICES_MAX } from "@/lib/content-limits";
import {
  getPublishedServices,
  getPublishedTestimonials,
} from "@/lib/services/public-content";

export default async function HomePage() {
  const [services, testimonials] = await Promise.all([
    getPublishedServices(),
    getPublishedTestimonials(),
  ]);

  const homeServices = services.slice(0, HOME_SERVICES_MAX);

  return (
    <>
      <HeroSection />
      <AboutPreviewSection />
      <ServicesGridSection services={homeServices} />
      <WhyChooseUsSection />
      <ProcessTimelineSection />
      <TestimonialsSection testimonials={testimonials} />
      <CtaSection />
    </>
  );
}
