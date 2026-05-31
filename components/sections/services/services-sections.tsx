"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Target,
  Palette,
  Megaphone,
  BarChart3,
  Settings,
  Compass,
  Rocket,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { fadeUp, defaultViewport } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import type { Service } from "@/types";

const iconMap: Record<string, LucideIcon> = {
  TrendingUp,
  Target,
  Palette,
  Megaphone,
  BarChart3,
  Settings,
  Compass,
  Rocket,
};

export function ServicesHeroSection() {
  return (
    <section className="relative min-h-[50vh] flex items-center overflow-hidden">
      <Image
        src="/pictures/hero-office.png"
        alt="TIJARA services"
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/70 to-tijara-black" />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="relative z-10 container-wide section-padding pt-32 text-center"
      >
        <span className="inline-block mb-4 text-sm font-medium tracking-widest uppercase text-tijara-green">
          Our Services
        </span>
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-white max-w-3xl mx-auto">
          Comprehensive growth solutions
        </h1>
        <p className="mt-6 text-lg text-tijara-gray max-w-2xl mx-auto">
          From strategy to execution, we deliver the expertise your business
          needs at every stage of growth.
        </p>
      </motion.div>
    </section>
  );
}

type ServicesDetailSectionProps = {
  services: Service[];
};

export function ServicesDetailSection({ services }: ServicesDetailSectionProps) {
  if (services.length === 0) {
    return (
      <section className="section-padding">
        <div className="container-wide text-center text-tijara-gray">
          <p>No services are published yet. Check back soon.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding">
      <div className="container-wide space-y-24">
        {services.map((service, index) => {
          const Icon = iconMap[service.icon] ?? TrendingUp;
          const isEven = index % 2 === 0;

          return (
            <motion.article
              key={service.id}
              id={service.id}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              variants={fadeUp}
              className="scroll-mt-28"
            >
              <div
                className={`grid lg:grid-cols-2 gap-12 items-start ${
                  isEven ? "" : "lg:direction-rtl"
                }`}
              >
                <div className={isEven ? "" : "lg:order-2"}>
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-tijara-green/10 text-tijara-green mb-6">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h2 className="font-serif text-3xl md:text-4xl font-semibold text-white mb-4">
                    {service.title}
                  </h2>
                  <p className="text-tijara-gray leading-relaxed mb-8">
                    {service.description}
                  </p>
                  <Button asChild>
                    <Link href="/contact">Get Started</Link>
                  </Button>
                </div>

                <div className={`space-y-8 ${isEven ? "" : "lg:order-1"}`}>
                  <div className="p-6 rounded-2xl glass-card">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-tijara-green mb-4">
                      Key Benefits
                    </h3>
                    <ul className="space-y-3">
                      {service.benefits.map((benefit) => (
                        <li
                          key={benefit}
                          className="flex items-start gap-3 text-sm text-tijara-gray-light"
                        >
                          <CheckCircle2 className="w-4 h-4 text-tijara-green shrink-0 mt-0.5" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-6 rounded-2xl glass-card">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-tijara-green mb-4">
                      Our Process
                    </h3>
                    <ol className="space-y-3">
                      {service.process.map((step, i) => (
                        <li
                          key={step}
                          className="flex items-start gap-3 text-sm text-tijara-gray-light"
                        >
                          <span className="font-serif text-tijara-green font-bold shrink-0">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>

              {index < services.length - 1 && (
                <motion.div className="mt-24 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              )}
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
