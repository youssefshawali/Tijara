"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, slideInLeft, slideInRight, defaultViewport } from "@/lib/animations";
import { Button } from "@/components/ui/button";

export function AboutPreviewSection() {
  return (
    <section className="section-padding relative overflow-hidden">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        variants={fadeUp}
        className="container-wide"
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
        >
          <motion.div variants={slideInLeft}>
            <span className="inline-block mb-4 text-sm font-medium tracking-widest uppercase text-tijara-green">
              About TIJARA
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-tight mb-6">
              Turning ideas into profitable businesses.
            </h2>
            <p className="text-tijara-gray text-base md:text-lg leading-relaxed mb-6">
              At TIJARA, we partner with founders and leadership teams who refuse
              to settle for incremental growth. We combine strategic clarity with
              hands-on execution to help you scale sustainably—building the
              systems, positioning, and momentum your business needs to thrive.
            </p>
            <p className="text-tijara-gray text-base leading-relaxed mb-8">
              Your growth starts here.
            </p>
            <Button asChild variant="outline">
              <Link href="/about">Learn About Us</Link>
            </Button>
          </motion.div>

          <motion.div variants={slideInRight} className="relative">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden"
            >
              <Image
                src="/pictures/about-conference.png"
                alt="TIJARA strategy conference room"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <motion.div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </motion.div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 border border-tijara-green/20 rounded-2xl -z-10" />
            <motion.div
              className="absolute -top-4 -right-4 w-24 h-24 bg-tijara-green/10 rounded-full blur-2xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
