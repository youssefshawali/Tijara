import type { ProcessStep, Stat, Milestone } from "@/types";

export const whyChooseUs: Stat[] = [
  {
    label: "Strategic Thinking",
    value: 100,
    suffix: "%",
    description:
      "Every recommendation is grounded in market data, competitive insight, and your unique business context.",
  },
  {
    label: "Market Experience",
    value: 15,
    suffix: "+",
    description:
      "Years of combined expertise across industries, from early-stage startups to established enterprises.",
  },
  {
    label: "Growth Focused",
    value: 3,
    suffix: "x",
    description:
      "Average revenue acceleration for clients who complete our full growth engagement program.",
  },
  {
    label: "Scalable Solutions",
    value: 50,
    suffix: "+",
    description:
      "Businesses supported with frameworks designed to grow with you—not hold you back.",
  },
];

export const processSteps: ProcessStep[] = [
  {
    step: 1,
    title: "Discover",
    description:
      "We immerse ourselves in your business—understanding goals, challenges, market position, and untapped potential.",
  },
  {
    step: 2,
    title: "Strategize",
    description:
      "Together we design a tailored growth roadmap with clear priorities, timelines, and measurable outcomes.",
  },
  {
    step: 3,
    title: "Execute",
    description:
      "Our team partners with yours to implement strategies, refine tactics, and maintain momentum through every phase.",
  },
  {
    step: 4,
    title: "Scale",
    description:
      "We optimize systems, expand what works, and prepare your organization for sustainable, long-term growth.",
  },
];

export const milestones: Milestone[] = [
  {
    year: "2020",
    title: "Foundation",
    description:
      "TIJARA was founded with a mission to help ambitious businesses grow with strategy, not guesswork.",
  },
  {
    year: "2021",
    title: "Regional Expansion",
    description:
      "Expanded consulting services across the MENA region, partnering with startups and SMEs.",
  },
  {
    year: "2023",
    title: "Full-Service Growth",
    description:
      "Launched integrated offerings spanning strategy, branding, marketing, sales, and operations.",
  },
  {
    year: "2025",
    title: "TIJARA Today",
    description:
      "Serving as a trusted growth partner for companies ready to scale with clarity and confidence.",
  },
];

export const businessTypes = [
  "Startup",
  "SME",
  "Enterprise",
  "E-commerce",
  "Agency",
  "Other",
] as const;
