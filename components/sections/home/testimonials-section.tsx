"use client";

import { motion } from "framer-motion";
import { fadeUp, defaultViewport } from "@/lib/animations";
import { SectionHeader } from "@/components/shared/section-header";
import type { PublicTestimonial } from "@/lib/services/public-content";

type TestimonialsSectionProps = {
  testimonials: PublicTestimonial[];
};

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="section-padding">
      <div className="container-wide">
        <SectionHeader
          label="Client Stories"
          title="Trusted by growth-minded leaders"
          description="Real results from companies that chose to aim higher."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, i) => (
            <motion.blockquote
              key={item.id}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              variants={fadeUp}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-2xl glass-card hover:border-tijara-green/20 transition-all duration-300"
            >
              <p className="text-tijara-gray-light text-sm leading-relaxed mb-6 italic">
                &ldquo;{item.quote}&rdquo;
              </p>
              <footer>
                <cite className="not-italic">
                  <span className="block text-white font-medium text-sm">
                    {item.author}
                  </span>
                  <span className="block text-tijara-gray text-xs mt-1">
                    {item.role}
                  </span>
                </cite>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
