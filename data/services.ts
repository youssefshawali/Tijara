import type { Service } from "@/types";

export const services: Service[] = [
  {
    id: "business-development",
    title: "Business Development",
    shortDescription:
      "Identify opportunities, build partnerships, and unlock new revenue channels for sustainable expansion.",
    description:
      "We partner with leadership teams to map market opportunities, design partnership strategies, and build the commercial infrastructure your business needs to grow with confidence.",
    benefits: [
      "New market entry strategies",
      "Partnership and alliance development",
      "Revenue channel optimization",
      "Competitive positioning analysis",
    ],
    process: [
      "Market and opportunity assessment",
      "Partnership strategy design",
      "Pipeline development and execution",
      "Performance tracking and iteration",
    ],
    icon: "TrendingUp",
  },
  {
    id: "growth-strategy",
    title: "Growth Strategy",
    shortDescription:
      "Data-informed roadmaps that align vision, resources, and market reality for measurable scale.",
    description:
      "Our growth strategists translate ambition into actionable plans—balancing short-term wins with long-term positioning so your company scales without losing focus.",
    benefits: [
      "Scalable growth roadmaps",
      "KPI frameworks and dashboards",
      "Resource allocation planning",
      "Risk-adjusted expansion models",
    ],
    process: [
      "Business audit and baseline metrics",
      "Growth hypothesis development",
      "90-day execution sprints",
      "Quarterly strategy reviews",
    ],
    icon: "Target",
  },
  {
    id: "branding",
    title: "Branding",
    shortDescription:
      "Craft a distinctive identity that resonates with your audience and commands premium positioning.",
    description:
      "From brand architecture to visual identity systems, we help you articulate who you are, why you matter, and how you stand apart in crowded markets.",
    benefits: [
      "Brand positioning and messaging",
      "Visual identity direction",
      "Brand voice and guidelines",
      "Market perception audits",
    ],
    process: [
      "Brand discovery workshops",
      "Positioning framework development",
      "Identity system creation",
      "Launch and rollout support",
    ],
    icon: "Palette",
  },
  {
    id: "marketing",
    title: "Marketing Consulting",
    shortDescription:
      "Integrated campaigns and channel strategies that attract, engage, and convert your ideal customers.",
    description:
      "We design marketing engines that work—combining content, digital, and demand generation into cohesive systems that drive qualified leads and brand authority.",
    benefits: [
      "Go-to-market planning",
      "Content and campaign strategy",
      "Channel mix optimization",
      "Marketing ROI measurement",
    ],
    process: [
      "Audience and funnel analysis",
      "Channel strategy design",
      "Campaign execution support",
      "Analytics and optimization",
    ],
    icon: "Megaphone",
  },
  {
    id: "sales",
    title: "Sales Optimization",
    shortDescription:
      "Refine your sales process, team structure, and conversion systems to close more deals, faster.",
    description:
      "We analyze your entire sales funnel—from lead qualification to closing—and implement frameworks that increase win rates and shorten sales cycles.",
    benefits: [
      "Sales process redesign",
      "CRM and pipeline optimization",
      "Team training and playbooks",
      "Conversion rate improvement",
    ],
    process: [
      "Sales funnel audit",
      "Process and playbook development",
      "Team enablement sessions",
      "Ongoing performance coaching",
    ],
    icon: "BarChart3",
  },
  {
    id: "operations",
    title: "Operations Consulting",
    shortDescription:
      "Streamline workflows, reduce friction, and build operational excellence that supports rapid growth.",
    description:
      "Growth breaks without strong operations. We help you design systems, processes, and team structures that scale efficiently as demand increases.",
    benefits: [
      "Process mapping and optimization",
      "Team structure and hiring plans",
      "Tool and system integration",
      "Cost efficiency analysis",
    ],
    process: [
      "Operational health assessment",
      "Workflow redesign",
      "Implementation support",
      "Continuous improvement cycles",
    ],
    icon: "Settings",
  },
  {
    id: "positioning",
    title: "Market Positioning",
    shortDescription:
      "Define where you win in the market and communicate that advantage with clarity and conviction.",
    description:
      "Positioning is the foundation of premium growth. We help you articulate your unique value, target the right segments, and own a defensible space in your category.",
    benefits: [
      "Category and competitor mapping",
      "Value proposition refinement",
      "Messaging hierarchy development",
      "Sales enablement alignment",
    ],
    process: [
      "Market landscape analysis",
      "Positioning workshop",
      "Message architecture",
      "Go-to-market alignment",
    ],
    icon: "Compass",
  },
  {
    id: "scaling",
    title: "Business Scaling",
    shortDescription:
      "Prepare your organization, systems, and culture for the next stage of exponential growth.",
    description:
      "Scaling is more than revenue—it requires the right people, processes, and capital strategy. We guide founders through each growth phase with proven frameworks.",
    benefits: [
      "Scaling readiness assessments",
      "Organizational design",
      "Fundraising preparation support",
      "Leadership development",
    ],
    process: [
      "Growth stage diagnosis",
      "Scaling roadmap creation",
      "Execution partnership",
      "Investor and board readiness",
    ],
    icon: "Rocket",
  },
];

export const homeServices = services.slice(0, 6);
