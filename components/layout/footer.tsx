import Link from "next/link";
import { TijaraLogo } from "@/components/shared/tijara-logo";
import { LinkedInIcon, TikTokIcon } from "@/components/shared/social-icons";
import { Instagram, Mail, MapPin, Phone } from "lucide-react";
import { footerLinks } from "@/data/navigation";
import type { SiteConfig } from "@/lib/site-config";
import type { NavLink } from "@/types";

type FooterProps = {
  config: SiteConfig;
  serviceLinks: NavLink[];
};

export function Footer({ config, serviceLinks }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-tijara-charcoal">
      <div className="container-wide section-padding pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <TijaraLogo className="h-10" />
            </Link>
            <p className="text-sm text-tijara-gray leading-relaxed max-w-xs">
              {config.tagline}
            </p>
            <div className="flex flex-col gap-3 mt-6">
              <a
                href={config.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-tijara-gray hover:text-tijara-green-light transition-colors"
                aria-label={`Follow ${config.name} on Instagram`}
              >
                <Instagram className="w-5 h-5" />
                {config.instagramHandle}
              </a>
              {config.tiktok ? (
                <a
                  href={config.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-tijara-gray hover:text-tijara-green-light transition-colors"
                  aria-label={`Follow ${config.name} on TikTok`}
                >
                  <TikTokIcon className="w-5 h-5" />
                  TikTok
                </a>
              ) : null}
              {config.linkedin ? (
                <a
                  href={config.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-tijara-gray hover:text-tijara-green-light transition-colors"
                  aria-label={`Follow ${config.name} on LinkedIn`}
                >
                  <LinkedInIcon className="w-5 h-5" />
                  LinkedIn
                </a>
              ) : null}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-tijara-gray hover:text-tijara-green-light transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Services
            </h3>
            <ul className="space-y-3">
              {serviceLinks.length > 0 ? (
                serviceLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-tijara-gray hover:text-tijara-green-light transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))
              ) : (
                <li>
                  <Link
                    href="/services"
                    className="text-sm text-tijara-gray hover:text-tijara-green-light transition-colors"
                  >
                    View all services
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contact
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href={`mailto:${config.email}`}
                  className="flex items-start gap-3 text-sm text-tijara-gray hover:text-tijara-green-light transition-colors"
                >
                  <Mail className="w-4 h-4 mt-0.5 shrink-0" />
                  {config.email}
                </a>
              </li>
              {config.phone.trim() ? (
                <li>
                  <a
                    href={`tel:${config.phone.replace(/\s/g, "")}`}
                    className="flex items-start gap-3 text-sm text-tijara-gray hover:text-tijara-green-light transition-colors"
                  >
                    <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                    {config.phone}
                  </a>
                </li>
              ) : null}
              <li className="flex items-start gap-3 text-sm text-tijara-gray">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                {config.address}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-tijara-gray">
            © {year} {config.name}. All rights reserved.
          </p>
          <p className="text-xs text-tijara-gray">
            <a
              href={config.url}
              className="hover:text-tijara-green-light transition-colors"
            >
              {config.domain}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
