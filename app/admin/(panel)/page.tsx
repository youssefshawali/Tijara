"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Briefcase,
  FileText,
  Mail,
  MessageSquare,
  Plus,
  Star,
} from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { StatsCards } from "@/components/admin/stats-cards";
import { ActivityChart } from "@/components/admin/activity-chart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface StatsResponse {
  counts: {
    messages: number;
    blog: number;
    services: number;
    testimonials: number;
    unreadMessages: number;
  };
  chartData: { date: string; count: number }[];
}

interface MessageRow {
  _id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [statsRes, messagesRes] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/admin/messages?limit=5"),
        ]);

        if (!statsRes.ok) throw new Error("Failed to load stats");
        const statsJson = await statsRes.json();
        setStats(statsJson);

        if (messagesRes.ok) {
          const messagesJson = await messagesRes.json();
          setMessages(messagesJson.data ?? []);
        }
      } catch {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  const statItems = stats
    ? [
        {
          label: "Total Messages",
          value: stats.counts.messages,
          icon: Mail,
          trend: `${stats.counts.unreadMessages} unread`,
          accent: stats.counts.unreadMessages > 0 ? ("warning" as const) : ("default" as const),
        },
        {
          label: "Blog Posts",
          value: stats.counts.blog,
          icon: FileText,
        },
        {
          label: "Services",
          value: stats.counts.services,
          icon: Briefcase,
        },
        {
          label: "Testimonials",
          value: stats.counts.testimonials,
          icon: Star,
        },
      ]
    : [];

  const quickActions = [
    { href: "/admin/messages", label: "View Messages", icon: MessageSquare },
    { href: "/admin/blog", label: "New Blog Post", icon: Plus },
    { href: "/admin/services", label: "Manage Services", icon: Briefcase },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Overview of your TIJARA website activity"
      />

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : (
        stats && <StatsCards items={statItems} />
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {loading ? (
            <Skeleton className="h-[360px] rounded-xl" />
          ) : (
            stats && <ActivityChart data={stats.chartData} />
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
        >
          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.href}
                    variant="outline"
                    className="w-full justify-start gap-2 border-border text-foreground hover:bg-muted"
                    asChild
                  >
                    <Link href={action.href}>
                      <Icon className="h-4 w-4 text-primary" />
                      {action.label}
                    </Link>
                  </Button>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold">Recent Messages</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/messages">View all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-lg" />
              ))}
            </div>
          ) : messages.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No messages yet
            </p>
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start justify-between gap-4 rounded-lg border border-border/60 p-4 transition-colors hover:bg-muted/30"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{msg.name}</p>
                      {!msg.read && <Badge variant="warning">New</Badge>}
                    </div>
                    <p className="truncate text-sm text-muted-foreground">{msg.email}</p>
                    <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                      {msg.message}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
