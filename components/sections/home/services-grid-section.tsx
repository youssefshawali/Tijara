"use client";

import { motion } from "framer-motion";
import { staggerContainer, defaultViewport } from "@/lib/animations";
import { SectionHeader } from "@/components/shared/section-header";
import { ServiceCard } from "@/components/shared/service-card";
import { homeServices } from "@/data/services";

export function ServicesGridSection() {
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {homeServices.map((service) => (
            <ServiceCard
              key={service.id}
              title={service.title}
              description={service.shortDescription}
              icon={service.icon}
              href={`/services#${service.id}`}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
