import { createMetadata } from "@/lib/metadata";
import {
  AboutHeroSection,
  MissionVisionSection,
  StorySection,
  MilestonesSection,
  TeamSection,
} from "@/components/sections/about/about-sections";
import { CtaSection } from "@/components/shared/cta-section";
import { getPublishedTeamMembers } from "@/lib/services/public-content";

export const metadata = createMetadata({
  title: "About",
  description:
    "Learn about TIJARA's mission, vision, and growth philosophy. Premium business development partner for ambitious companies.",
  path: "/about",
  image: "/pictures/about-conference.jpeg",
});

export default async function AboutPage() {
  const team = await getPublishedTeamMembers();

  return (
    <>
      <AboutHeroSection />
      <MissionVisionSection />
      <StorySection />
      <MilestonesSection />
      <TeamSection members={team} />
      <CtaSection />
    </>
  );
}
