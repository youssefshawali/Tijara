"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { SessionProvider } from "@/components/providers/session-provider";
import { AdminBodyClass } from "@/components/admin/admin-body-class";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <AdminBodyClass />
        {children}
        <Toaster richColors position="top-right" />
      </ThemeProvider>
    </SessionProvider>
  );
}
