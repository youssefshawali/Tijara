import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { MouseGlow } from "@/components/layout/mouse-glow";
import { GradientBackground } from "@/components/layout/gradient-background";
import { Analytics } from "@/components/layout/analytics";

export default function WebsiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="dark bg-tijara-black text-white min-h-screen">
      <ScrollProgress />
      <MouseGlow />
      <GradientBackground />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <Analytics />
    </div>
  );
}
