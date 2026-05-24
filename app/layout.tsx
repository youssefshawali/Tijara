import type { Metadata, Viewport } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { MouseGlow } from "@/components/layout/mouse-glow";
import { GradientBackground } from "@/components/layout/gradient-background";
import { Analytics } from "@/components/layout/analytics";
import { createMetadata } from "@/lib/metadata";
import "@/styles/globals.css";

export const metadata: Metadata = createMetadata();

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased bg-tijara-black text-white min-h-screen">
        <ScrollProgress />
        <MouseGlow />
        <GradientBackground />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
