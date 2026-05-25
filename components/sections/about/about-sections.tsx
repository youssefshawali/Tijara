"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, slideInLeft, slideInRight, defaultViewport } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { milestones } from "@/data/content";
import type { PublicTeamMember } from "@/lib/services/public-content";

export function AboutHeroSection() {
  return (
    <section className="relative min-h-[60vh] flex items-center overflow-hidden">
      <Image
        src="/pictures/about-conference.jpeg"
        alt="TIJARA conference room"
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/50" />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="relative z-10 container-wide section-padding pt-32"
      >
        <span className="inline-block mb-4 text-sm font-medium tracking-widest uppercase text-tijara-green">
          About TIJARA
        </span>
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-white max-w-3xl leading-tight">
          Premium business growth partner for ambitious companies.
        </h1>
        <p className="mt-6 text-lg text-tijara-gray max-w-2xl">
          We exist to help businesses scale with strategy, clarity, and
          conviction—turning ambition into measurable, sustainable growth.
        </p>
      </motion.div>
    </section>
  );
}

export function MissionVisionSection() {
  const items = [
    {
      title: "Our Mission",
      content:
        "To empower ambitious businesses with the strategy, systems, and support they need to scale sustainably—delivering clarity in complexity and results that compound over time.",
    },
    {
      title: "Our Vision",
      content:
        "To be the most trusted business development partner in the region—a firm known for transforming companies through strategic excellence, operational rigor, and unwavering commitment to client success.",
    },
    {
      title: "Growth Philosophy",
      content:
        "We believe growth is intentional, not accidental. Every sustainable business is built on clear positioning, disciplined execution, and systems that scale. We partner with leaders who share that conviction.",
    },
  ];

  return (
    <section className="section-padding">
      <div className="container-wide">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={fadeUp}
          className="grid md:grid-cols-3 gap-8"
        >
          {items.map((item) => (
            <div
              key={item.title}
              className="p-8 rounded-2xl glass-card hover:border-tijara-green/20 transition-all duration-300"
            >
              <h2 className="font-serif text-2xl font-semibold text-white mb-4">
                {item.title}
              </h2>
              <p className="text-tijara-gray leading-relaxed">{item.content}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export function StorySection() {
  return (
    <section className="section-padding bg-tijara-charcoal/50">
      <div className="container-wide">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          <motion.div variants={slideInLeft}>
            <span className="inline-block mb-4 text-sm font-medium tracking-widest uppercase text-tijara-green">
              Our Story
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-white mb-6">
              Built on strategy. Driven by results.
            </h2>
            <motion.div className="space-y-4 text-tijara-gray leading-relaxed">
              <p>
                TIJARA was founded by consultants who saw a gap in the market:
                businesses needed more than generic advice—they needed a partner
                who could think strategically and execute alongside them.
              </p>
              <p>
                Today, we work with startups, SMEs, and established companies
                across industries, helping them navigate growth challenges with
                frameworks proven in real markets. From Cairo to the broader
                MENA region, our clients trust us to deliver clarity when it
                matters most.
              </p>
              <p>
                We don&apos;t believe in one-size-fits-all solutions. Every
                engagement begins with deep discovery and ends with scalable
                systems your team can own long after our work together.
              </p>
            </motion.div>
          </motion.div>

          <motion.div variants={slideInRight} className="relative aspect-[4/3] rounded-2xl overflow-hidden">
            <Image
              src="/pictures/hero-office.jpeg"
              alt="TIJARA office"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export function MilestonesSection() {
  return (
    <section className="section-padding">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        variants={fadeUp}
        className="container-wide"
      >
        <div className="text-center mb-16">
          <span className="inline-block mb-4 text-sm font-medium tracking-widest uppercase text-tijara-green">
            Our Journey
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-white">
            Milestones that define us
          </h2>
        </div>

        <motion.div className="relative max-w-3xl mx-auto">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-tijara-green/20 md:-translate-x-px" />
          {milestones.map((milestone, i) => (
            <motion.div
              key={milestone.year}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={defaultViewport}
              transition={{ delay: i * 0.1 }}
              className={`relative flex items-start gap-8 mb-12 ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              <motion.div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-tijara-green -translate-x-1/2 mt-2 ring-4 ring-tijara-black" />
              <div className={`ml-12 md:ml-0 md:w-1/2 ${i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                <span className="text-tijara-green font-semibold text-sm">
                  {milestone.year}
                </span>
                <h3 className="font-serif text-xl font-semibold text-white mt-1 mb-2">
                  {milestone.title}
                </h3>
                <p className="text-sm text-tijara-gray">{milestone.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

type TeamSectionProps = {
  members: PublicTeamMember[];
};

export function TeamSection({ members }: TeamSectionProps) {
  if (members.length === 0) {
    return null;
  }

  return (
    <section className="section-padding bg-tijara-charcoal/50">
      <div className="container-wide text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={fadeUp}
        >
          <span className="inline-block mb-4 text-sm font-medium tracking-widest uppercase text-tijara-green">
            Our Team
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-white mb-4">
            Expert consultants. Dedicated partners.
          </h2>
          <p className="text-tijara-gray max-w-2xl mx-auto mb-10">
            Our team brings together strategists, marketers, and operators with
            deep industry experience.
          </p>
          <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-6">
            {members.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={defaultViewport}
                transition={{ delay: i * 0.08 }}
                className="w-[calc(50%-12px)] min-w-[140px] max-w-[200px] shrink-0 text-center sm:w-[200px]"
              >
                <div className="relative aspect-square overflow-hidden rounded-2xl glass-card">
                  <Image
                    src={member.imageUrl}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <p className="mt-3 font-medium text-white text-sm">{member.name}</p>
                {member.role ? (
                  <p className="text-tijara-gray text-xs mt-0.5">{member.role}</p>
                ) : null}
              </motion.div>
            ))}
          </div>
          <Button asChild className="mt-10">
            <Link href="/contact">Work With Us</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
