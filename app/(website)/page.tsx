import { HeroSection } from "@/components/sections/home/hero-section";
import { AboutPreviewSection } from "@/components/sections/home/about-preview-section";
import { ServicesGridSection } from "@/components/sections/home/services-grid-section";
import { WhyChooseUsSection } from "@/components/sections/home/why-choose-us-section";
import { ProcessTimelineSection } from "@/components/sections/home/process-timeline-section";
import { TestimonialsSection } from "@/components/sections/home/testimonials-section";
import { CtaSection } from "@/components/shared/cta-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutPreviewSection />
      <ServicesGridSection />
      <WhyChooseUsSection />
      <ProcessTimelineSection />
      <TestimonialsSection />
      <CtaSection />
    </>
  );
}
