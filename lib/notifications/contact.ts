import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { sendEmail } from "@/lib/email";
import { siteConfig } from "@/lib/site-config";
import type { ContactFormValues } from "@/lib/validations/contact";

const SETTINGS_ID = "default";

async function getNotificationEmail() {
  if (process.env.CONTACT_NOTIFICATION_EMAIL) {
    return process.env.CONTACT_NOTIFICATION_EMAIL;
  }

  try {
    const [settings] = await db
      .select({ email: siteSettings.email })
      .from(siteSettings)
      .where(eq(siteSettings.id, SETTINGS_ID))
      .limit(1);

    if (settings?.email) return settings.email;
  } catch {
    // Fall back to static config if DB is unavailable
  }

  return siteConfig.email;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendContactNotification(
  data: ContactFormValues & { company: string }
) {
  const to = await getNotificationEmail();
  const companyLine = data.company ? `\nCompany: ${data.company}` : "";
  const companyHtml = data.company
    ? `<tr><td style="padding:8px 0;color:#666;">Company</td><td style="padding:8px 0;">${escapeHtml(data.company)}</td></tr>`
    : "";

  const text = [
    "New contact form submission on tijara.dev",
    "",
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    companyLine,
    `Business type: ${data.businessType}`,
    "",
    "Message:",
    data.message,
  ]
    .filter(Boolean)
    .join("\n");

  const html = [
    '<div style="font-family:sans-serif;max-width:560px;color:#111;">',
    "<h2 style=\"margin:0 0 16px;\">New contact form submission</h2>",
    '<table style="width:100%;border-collapse:collapse;">',
    `<tr><td style="padding:8px 0;color:#666;">Name</td><td style="padding:8px 0;">${escapeHtml(data.name)}</td></tr>`,
    `<tr><td style="padding:8px 0;color:#666;">Email</td><td style="padding:8px 0;"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td></tr>`,
    `<tr><td style="padding:8px 0;color:#666;">Phone</td><td style="padding:8px 0;">${escapeHtml(data.phone)}</td></tr>`,
    companyHtml,
    `<tr><td style="padding:8px 0;color:#666;">Business type</td><td style="padding:8px 0;">${escapeHtml(data.businessType)}</td></tr>`,
    "</table>",
    '<p style="margin:24px 0 8px;color:#666;">Message</p>',
    `<p style="margin:0;white-space:pre-wrap;line-height:1.5;">${escapeHtml(data.message)}</p>`,
    "</div>",
  ].join("");

  await sendEmail({
    to,
    subject: `New contact from ${data.name} — ${siteConfig.name}`,
    text,
    html,
    replyTo: data.email,
  });
}
