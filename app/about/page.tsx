import { createMetadata } from "@/lib/metadata";
import {
  AboutHeroSection,
  MissionVisionSection,
  StorySection,
  MilestonesSection,
  TeamPlaceholderSection,
} from "@/components/sections/about/about-sections";
import { CtaSection } from "@/components/shared/cta-section";

export const metadata = createMetadata({
  title: "About",
  description:
    "Learn about TIJARA's mission, vision, and growth philosophy. Premium business development partner for ambitious companies.",
  path: "/about",
  image: "/pictures/about-conference.jpeg",
});

export default function AboutPage() {
  return (
    <>
      <AboutHeroSection />
      <MissionVisionSection />
      <StorySection />
      <MilestonesSection />
      <TeamPlaceholderSection />
      <CtaSection />
    </>
  );
}
