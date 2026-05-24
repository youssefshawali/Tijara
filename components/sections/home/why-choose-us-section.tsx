"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { staggerContainer, staggerItem, defaultViewport } from "@/lib/animations";
import { SectionHeader } from "@/components/shared/section-header";
import { whyChooseUs } from "@/data/content";

function AnimatedCounter({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export function WhyChooseUsSection() {
  return (
    <section className="section-padding relative">
      <div className="absolute inset-0 bg-hero-glow opacity-30 pointer-events-none" aria-hidden />
      <motion.div className="container-wide relative">
        <SectionHeader
          label="Why TIJARA"
          title="Your premium growth partner"
          description="We don't just advise—we partner. Every engagement is built on deep understanding, proven frameworks, and a relentless focus on measurable outcomes."
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {whyChooseUs.map((stat) => (
            <motion.div
              key={stat.label}
              variants={staggerItem}
              className="group relative p-8 rounded-2xl glass-card text-center hover:border-tijara-green/30 hover:shadow-glow-sm transition-all duration-500"
            >
              <motion.div className="font-serif text-4xl md:text-5xl font-bold text-tijara-green mb-2">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </motion.div>
              <h3 className="text-lg font-semibold text-white mb-3">
                {stat.label}
              </h3>
              <p className="text-sm text-tijara-gray leading-relaxed">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
