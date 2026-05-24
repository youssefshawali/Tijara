"use client";

import { motion } from "framer-motion";
import { fadeUp, defaultViewport } from "@/lib/animations";
import { SectionHeader } from "@/components/shared/section-header";

const testimonials = [
  {
    quote:
      "TIJARA transformed our go-to-market strategy. Within six months, we saw a 40% increase in qualified leads and clearer brand positioning.",
    author: "Sarah M.",
    role: "CEO, Tech Startup",
  },
  {
    quote:
      "Their operational consulting helped us scale from 10 to 50 employees without losing efficiency. Truly a strategic partner.",
    author: "Ahmed K.",
    role: "Founder, E-commerce Brand",
  },
  {
    quote:
      "The branding work TIJARA delivered elevated our entire market presence. We now command premium pricing with confidence.",
    author: "Layla R.",
    role: "Director, Professional Services",
  },
];

export function TestimonialsSection() {
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
              key={item.author}
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
