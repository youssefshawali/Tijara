import type { Metadata, Viewport } from "next";
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
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen">{children}</body>
    </html>
  );
}
