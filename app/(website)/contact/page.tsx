import { createMetadata } from "@/lib/metadata";
import { getMergedSiteConfig } from "@/lib/services/public-content";
import {
  ContactHeroSection,
  ContactFormSection,
  NewsletterPlaceholder,
} from "@/components/sections/contact/contact-sections";

export const metadata = createMetadata({
  title: "Contact",
  description:
    "Get in touch with TIJARA. Book a consultation for business development, strategy, and growth consulting.",
  path: "/contact",
  image: "/pictures/cta-reception.png",
});

export default async function ContactPage() {
  const config = await getMergedSiteConfig();

  return (
    <>
      <ContactHeroSection />
      <ContactFormSection
        contactInfo={{
          email: config.email,
          phone: config.phone,
          address: config.address,
          whatsapp: config.whatsapp,
          instagram: config.instagram,
        }}
      />
      <NewsletterPlaceholder />
    </>
  );
}
