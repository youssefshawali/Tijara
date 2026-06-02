import { Resend } from "resend";
import nodemailer from "nodemailer";

function getDefaultFrom() {
  return (
    process.env.EMAIL_FROM ??
    process.env.SMTP_FROM ??
    "TIJARA <notifications@tijara.dev>"
  );
}

export function isResendConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

export function isSmtpConfigured() {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASSWORD
  );
}

export function isEmailConfigured() {
  return isResendConfigured() || isSmtpConfigured();
}

function createSmtpTransport() {
  const port = Number(process.env.SMTP_PORT ?? 587);
  const secure =
    process.env.SMTP_SECURE === "true" || port === 465;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

async function sendViaResend(options: {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: getDefaultFrom(),
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
    replyTo: options.replyTo,
  });

  if (error) {
    throw new Error(error.message);
  }
}

async function sendViaSmtp(options: {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}) {
  const transport = createSmtpTransport();
  await transport.sendMail({
    from: getDefaultFrom(),
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
    replyTo: options.replyTo,
  });
}

export async function sendEmail(options: {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}) {
  if (!isEmailConfigured()) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[Email] No provider configured (set RESEND_API_KEY or SMTP)");
    }
    return false;
  }

  if (isResendConfigured()) {
    await sendViaResend(options);
    return true;
  }

  await sendViaSmtp(options);
  return true;
}
