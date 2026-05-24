"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="admin-root flex min-h-screen bg-background text-foreground">
      <aside className="hidden w-64 shrink-0 lg:block">
        <AdminSidebar />
      </aside>

      <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
        <DialogContent
          className={cn(
            "fixed left-0 top-0 z-50 h-full w-72 max-w-[85vw] translate-x-0 translate-y-0 gap-0 border-r p-0 shadow-xl",
            "data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
            "sm:rounded-none"
          )}
        >
          <DialogTitle className="sr-only">Navigation menu</DialogTitle>
          <AdminSidebar onNavigate={() => setMobileOpen(false)} />
        </DialogContent>
      </Dialog>

      <div className="flex min-h-screen flex-1 flex-col">
        <AdminHeader onMenuClick={() => setMobileOpen(true)} />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-y-auto p-4 lg:p-6"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
