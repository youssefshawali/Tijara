import type { NavLink } from "@/types";

export const navLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export const footerLinks = {
  company: [
    { href: "/about", label: "About Us" },
    { href: "/services", label: "Services" },
    { href: "/contact", label: "Contact" },
  ],
  services: [
    { href: "/services#business-development", label: "Business Development" },
    { href: "/services#growth-strategy", label: "Growth Strategy" },
    { href: "/services#branding", label: "Branding" },
    { href: "/services#marketing", label: "Marketing" },
  ],
};
