import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import connectDB from "@/lib/mongodb";
import ContactSubmission from "@/models/ContactSubmission";
import BlogPost from "@/models/BlogPost";
import Service from "@/models/Service";
import Testimonial from "@/models/Testimonial";

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
    await connectDB();

    const [
      messagesCount,
      blogCount,
      servicesCount,
      testimonialsCount,
      unreadCount,
      recentSubmissions,
    ] = await Promise.all([
      ContactSubmission.countDocuments(),
      BlogPost.countDocuments(),
      Service.countDocuments(),
      Testimonial.countDocuments(),
      ContactSubmission.countDocuments({ read: false }),
      ContactSubmission.find({
        createdAt: { $gte: getLast7Days()[0].start },
      })
        .select("createdAt")
        .lean(),
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
