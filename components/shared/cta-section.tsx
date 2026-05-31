"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, defaultViewport } from "@/lib/animations";
import { Button } from "@/components/ui/button";

interface CtaSectionProps {
  headline?: string;
  subheadline?: string;
  buttonText?: string;
  buttonHref?: string;
  backgroundImage?: string;
}

export function CtaSection({
  headline = "Ready to scale your business?",
  subheadline = "Let's build your next success.",
  buttonText = "Book Consultation",
  buttonHref = "/contact",
  backgroundImage = "/pictures/cta-reception.png",
}: CtaSectionProps) {
  return (
    <section className="relative section-padding overflow-hidden">
      <div className="container-wide">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={fadeUp}
          className="relative rounded-3xl overflow-hidden min-h-[400px] md:min-h-[480px] flex items-center justify-center"
        >
          <Image
            src={backgroundImage}
            alt="TIJARA office reception"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1280px"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/60" />
          <div className="absolute inset-0 bg-hero-glow" />

          <div className="relative z-10 text-center px-6 py-16 md:py-24 max-w-2xl mx-auto">
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-tijara-green to-transparent mx-auto mb-8" />
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-4">
              {headline}
            </h2>
            <p className="text-tijara-gray-light text-lg mb-8 tracking-wide uppercase text-sm md:text-base">
              {subheadline}
            </p>
            <Button asChild size="lg" className="text-base px-10">
              <Link href={buttonHref}>{buttonText}</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
