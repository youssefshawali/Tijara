import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import AdminUser from "@/models/AdminUser";
import Service from "@/models/Service";
import BlogPost from "@/models/BlogPost";
import Testimonial from "@/models/Testimonial";
import SiteSettings from "@/models/SiteSettings";
import ContactSubmission from "@/models/ContactSubmission";
import { services as staticServices } from "@/data/services";

async function seed() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required");
  }

  await connectDB();
  console.log("Connected to MongoDB");

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@tijara.dev";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin@123456";

  const existingAdmin = await AdminUser.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const hashed = await bcrypt.hash(adminPassword, 12);
    await AdminUser.create({
      name: "TIJARA Admin",
      email: adminEmail,
      password: hashed,
      role: "admin",
    });
    console.log(`Admin user created: ${adminEmail}`);
  } else {
    console.log("Admin user already exists");
  }

  const settingsCount = await SiteSettings.countDocuments();
  if (settingsCount === 0) {
    await SiteSettings.create({
      companyName: "TIJARA",
      tagline: "Premium business growth partner for ambitious companies.",
      description:
        "TIJARA is a business development and growth consulting firm helping companies scale through strategy, positioning, branding, marketing, and operations.",
      email: "hello@tijara.dev",
      phone: "+20 100 000 0000",
      whatsapp: "https://wa.me/201000000000",
      instagram: "https://instagram.com/Tijaraeg",
      instagramHandle: "@Tijaraeg",
      address: "Cairo, Egypt",
      seoTitle: "TIJARA — Business Development & Growth Consulting",
      seoDescription:
        "Premium business development and growth consulting for ambitious companies.",
      homepageHeroTitle: "Scale with strategy. Grow with conviction.",
      homepageHeroSubtitle:
        "TIJARA partners with ambitious companies to unlock sustainable growth through strategy, branding, and operational excellence.",
    });
    console.log("Site settings seeded");
  }

  const serviceCount = await Service.countDocuments();
  if (serviceCount === 0) {
    await Service.insertMany(
      staticServices.map((service, index) => ({
        title: service.title,
        slug: service.id,
        shortDescription: service.shortDescription,
        description: service.description,
        benefits: service.benefits,
        process: service.process,
        icon: service.icon,
        published: true,
        sortOrder: index,
      }))
    );
    console.log(`Seeded ${staticServices.length} services`);
  }

  const testimonialCount = await Testimonial.countDocuments();
  if (testimonialCount === 0) {
    await Testimonial.insertMany([
      {
        clientName: "Sarah M.",
        position: "CEO",
        company: "Tech Startup",
        quote:
          "TIJARA transformed our go-to-market strategy. Within six months, we saw a 40% increase in qualified leads and clearer brand positioning.",
        rating: 5,
        published: true,
        sortOrder: 0,
      },
      {
        clientName: "Ahmed K.",
        position: "Founder",
        company: "E-commerce Brand",
        quote:
          "Their operational consulting helped us scale from 10 to 50 employees without losing efficiency. Truly a strategic partner.",
        rating: 5,
        published: true,
        sortOrder: 1,
      },
      {
        clientName: "Layla R.",
        position: "Director",
        company: "Professional Services",
        quote:
          "The branding work TIJARA delivered elevated our entire market presence. We now command premium pricing with confidence.",
        rating: 5,
        published: true,
        sortOrder: 2,
      },
    ]);
    console.log("Testimonials seeded");
  }

  const blogCount = await BlogPost.countDocuments();
  if (blogCount === 0) {
    await BlogPost.create({
      title: "How to Scale Your Business with Intentional Growth",
      slug: "intentional-growth-strategy",
      content:
        "Growth is rarely accidental. The most successful companies build scalable systems, clear positioning, and disciplined execution.\n\nAt TIJARA, we help leaders translate ambition into measurable outcomes through structured discovery, strategic planning, and operational support.",
      excerpt: "Why intentional growth beats reactive expansion every time.",
      category: "Strategy",
      tags: ["growth", "strategy", "scaling"],
      seoTitle: "Intentional Growth Strategy | TIJARA",
      seoDescription: "Learn how intentional growth strategies help businesses scale sustainably.",
      status: "published",
      publishedAt: new Date(),
    });
    console.log("Sample blog post seeded");
  }

  const messageCount = await ContactSubmission.countDocuments();
  if (messageCount === 0) {
    await ContactSubmission.insertMany([
      {
        name: "John Doe",
        email: "john@example.com",
        phone: "+201000000001",
        company: "Acme Corp",
        businessType: "SME",
        message: "We are looking for help with our growth strategy for the MENA market.",
        read: false,
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "+201000000002",
        company: "StartupXYZ",
        businessType: "Startup",
        message: "Interested in branding and market positioning services.",
        read: true,
      },
    ]);
    console.log("Sample contact submissions seeded");
  }

  console.log("\nSeed complete!");
  console.log(`Login at /admin/login with ${adminEmail} / ${adminPassword}`);
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
