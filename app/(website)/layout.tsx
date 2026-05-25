import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { MouseGlow } from "@/components/layout/mouse-glow";
import { GradientBackground } from "@/components/layout/gradient-background";
import { Analytics } from "@/components/layout/analytics";
import {
  getMergedSiteConfig,
  getPublishedServices,
} from "@/lib/services/public-content";

export const dynamic = "force-dynamic";

export default async function WebsiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [config, services] = await Promise.all([
    getMergedSiteConfig(),
    getPublishedServices(),
  ]);

  const footerServiceLinks = services.map((service) => ({
    href: `/services#${service.id}`,
    label: service.title,
  }));

  return (
    <div className="dark bg-tijara-black text-white min-h-screen">
      <ScrollProgress />
      <MouseGlow />
      <GradientBackground />
      <Navbar />
      <main>{children}</main>
      <Footer config={config} serviceLinks={footerServiceLinks} />
      <Analytics />
    </div>
  );
}
