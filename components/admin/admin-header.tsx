"use client";

import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { Menu, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminHeaderProps {
  onMenuClick: () => void;
  className?: string;
}

export function AdminHeader({ onMenuClick, className }: AdminHeaderProps) {
  const { data: session } = useSession();
  const { theme, setTheme, resolvedTheme } = useTheme();

  const greetingName = session?.user?.name ?? session?.user?.email ?? "Admin";

  return (
    <header
      className={cn(
        "flex h-16 shrink-0 items-center justify-between border-b border-border bg-card/80 px-4 backdrop-blur-sm lg:px-6",
        className
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex items-center gap-3"
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="lg:hidden text-foreground hover:bg-muted"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <motion.div className="hidden sm:block">
          <p className="text-sm text-muted-foreground">Welcome back,</p>
          <p className="text-sm font-semibold text-foreground">{greetingName}</p>
        </motion.div>
      </motion.div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-foreground hover:bg-muted"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          {theme === "dark" || resolvedTheme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
      </div>
    </header>
  );
}
