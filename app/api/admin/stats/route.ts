import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import {
  contactSubmissions,
  blogPosts,
  services,
  testimonials,
} from "@/lib/db/schema";
import { count, eq, gte } from "drizzle-orm";

function getLast7Days(): { date: string; start: Date; end: Date }[] {
  const days: { date: string; start: Date; end: Date }[] = [];
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - i);

    const end = new Date(start);
    end.setHours(23, 59, 59, 999);

    days.push({
      date: start.toISOString().split("T")[0],
      start,
      end,
    });
  }

  return days;
}

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const weekStart = getLast7Days()[0].start;

    const [
      [{ messagesCount }],
      [{ blogCount }],
      [{ servicesCount }],
      [{ testimonialsCount }],
      [{ unreadCount }],
      recentSubmissions,
    ] = await Promise.all([
      db.select({ messagesCount: count() }).from(contactSubmissions),
      db.select({ blogCount: count() }).from(blogPosts),
      db.select({ servicesCount: count() }).from(services),
      db.select({ testimonialsCount: count() }).from(testimonials),
      db
        .select({ unreadCount: count() })
        .from(contactSubmissions)
        .where(eq(contactSubmissions.read, false)),
      db
        .select({ createdAt: contactSubmissions.createdAt })
        .from(contactSubmissions)
        .where(gte(contactSubmissions.createdAt, weekStart)),
    ]);

    const days = getLast7Days();
    const chartData = days.map(({ date, start, end }) => ({
      date,
      count: recentSubmissions.filter(
        (s) => s.createdAt >= start && s.createdAt <= end
      ).length,
    }));

    return NextResponse.json({
      counts: {
        messages: messagesCount,
        blog: blogCount,
        services: servicesCount,
        testimonials: testimonialsCount,
        unreadMessages: unreadCount,
      },
      chartData,
    });
  } catch (err) {
    console.error("[API Admin Stats]", err);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
