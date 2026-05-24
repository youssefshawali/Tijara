import { createMetadata } from "@/lib/metadata";
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
  image: "/pictures/cta-reception.jpeg",
});

export default function ContactPage() {
  return (
    <>
      <ContactHeroSection />
      <ContactFormSection />
      <NewsletterPlaceholder />
    </>
  );
}
