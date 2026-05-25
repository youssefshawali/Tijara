"use client";

import { motion } from "framer-motion";
import { staggerContainer, defaultViewport } from "@/lib/animations";
import { SectionHeader } from "@/components/shared/section-header";
import { ServiceCard } from "@/components/shared/service-card";
import type { Service } from "@/types";

type ServicesGridSectionProps = {
  services: Service[];
};

export function ServicesGridSection({ services }: ServicesGridSectionProps) {
  if (services.length === 0) {
    return null;
  }

  return (
    <section className="section-padding bg-tijara-charcoal/50">
      <div className="container-wide">
        <SectionHeader
          label="What We Do"
          title="Strategic services for ambitious growth"
          description="Comprehensive consulting across every dimension of business development—from first strategy to full-scale execution."
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainer}
          className="mx-auto flex max-w-6xl flex-wrap justify-center gap-6"
        >
          {services.map((service) => (
            <div
              key={service.id}
              className="w-full max-w-[340px] flex-[1_1_280px] sm:max-w-[320px]"
            >
              <ServiceCard
                title={service.title}
                description={service.shortDescription}
                icon={service.icon}
                href={`/services#${service.id}`}
                className="h-full"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
