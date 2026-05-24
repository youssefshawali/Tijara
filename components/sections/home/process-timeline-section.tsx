"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer, staggerItem, defaultViewport } from "@/lib/animations";
import { SectionHeader } from "@/components/shared/section-header";
import { processSteps } from "@/data/content";

export function ProcessTimelineSection() {
  return (
    <section className="section-padding bg-tijara-charcoal/50 overflow-hidden">
      <div className="container-wide">
        <SectionHeader
          label="Our Process"
          title="From discovery to scale"
          description="A proven four-phase approach that transforms insight into sustained growth."
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainer}
          className="relative"
        >
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-tijara-green/40 to-transparent" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.step}
                variants={staggerItem}
                className="relative text-center lg:text-left"
              >
                <div className="flex flex-col items-center lg:items-start">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative z-10 w-16 h-16 rounded-full glass-card flex items-center justify-center mb-6 border-tijara-green/20 group hover:border-tijara-green/50 hover:shadow-glow-sm transition-all duration-300"
                  >
                    <span className="font-serif text-xl font-bold text-tijara-green">
                      {String(step.step).padStart(2, "0")}
                    </span>
                  </motion.div>

                  {index < processSteps.length - 1 && (
                    <div className="lg:hidden w-px h-8 bg-tijara-green/30 my-2" />
                  )}

                  <h3 className="font-serif text-xl font-semibold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-tijara-gray leading-relaxed max-w-xs mx-auto lg:mx-0">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
