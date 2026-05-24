"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface StatCardItem {
  label: string;
  value: number | string;
  icon: LucideIcon;
  trend?: string;
  accent?: "default" | "warning" | "success";
}

interface StatsCardsProps {
  items: StatCardItem[];
  className?: string;
}

const accentStyles = {
  default: "bg-primary/10 text-primary",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
};

export function StatsCards({ items, className }: StatsCardsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={cn("grid gap-4 sm:grid-cols-2 xl:grid-cols-4", className)}
    >
      {items.map((item, index) => {
        const Icon = item.icon;
        const accent = item.accent ?? "default";

        return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.05 }}
          >
            <Card className="border-border/60 shadow-sm transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                    accentStyles[accent]
                  )}
                >
                  <Icon className="h-5 w-5" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="text-2xl font-semibold tabular-nums text-foreground">
                    {item.value}
                  </p>
                  {item.trend && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {item.trend}
                    </p>
                  )}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
