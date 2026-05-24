"use client";

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
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { staggerItem } from "@/lib/animations";
import { cn } from "@/lib/utils";

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

interface ServiceCardProps {
  title: string;
  description: string;
  icon: string;
  href?: string;
  className?: string;
}

export function ServiceCard({
  title,
  description,
  icon,
  href = "/services",
  className,
}: ServiceCardProps) {
  const Icon = iconMap[icon] ?? TrendingUp;

  return (
    <motion.div variants={staggerItem}>
      <Link href={href} className="block h-full group">
        <div
          className={cn(
            "relative h-full p-6 md:p-8 rounded-2xl glass-card transition-all duration-500",
            "hover:border-tijara-green/30 hover:shadow-glow-sm hover:-translate-y-1",
            className
          )}
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-tijara-green/0 to-tijara-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative">
            <div className="mb-5 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-tijara-green/10 text-tijara-green group-hover:bg-tijara-green/20 group-hover:shadow-glow-sm transition-all duration-300">
              <Icon className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-white mb-3 group-hover:text-tijara-green-light transition-colors">
              {title}
            </h3>
            <p className="text-sm text-tijara-gray leading-relaxed mb-4">
              {description}
            </p>
            <span className="inline-flex items-center gap-1 text-sm text-tijara-green opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Learn more
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
