"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Instagram, MessageCircle } from "lucide-react";
import { fadeUp, slideInLeft, slideInRight, defaultViewport } from "@/lib/animations";
import { contactFormSchema, type ContactFormValues } from "@/lib/validations/contact";
import { submitContactForm } from "@/lib/services/contact.service";
import { businessTypes } from "@/data/content";
import type { PublicContactInfo } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ContactHeroSection() {
  return (
    <section className="relative min-h-[40vh] flex items-center overflow-hidden">
      <Image
        src="/pictures/cta-reception.jpeg"
        alt="Contact TIJARA"
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/60" />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="relative z-10 container-wide section-padding pt-32"
      >
        <span className="inline-block mb-4 text-sm font-medium tracking-widest uppercase text-tijara-green">
          Get In Touch
        </span>
        <h1 className="font-serif text-4xl md:text-5xl font-semibold text-white max-w-2xl">
          Let&apos;s start the conversation
        </h1>
        <p className="mt-4 text-tijara-gray max-w-xl">
          Ready to scale? Tell us about your business and we&apos;ll respond
          within one business day.
        </p>
      </motion.div>
    </section>
  );
}

export function ContactFormSection({ contactInfo }: { contactInfo: PublicContactInfo }) {
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      businessType: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setSubmitStatus(null);
    try {
      const response = await submitContactForm({
        ...data,
        company: data.company ?? "",
      });
      setSubmitStatus({ type: "success", message: response.message });
      reset();
    } catch {
      setSubmitStatus({
        type: "error",
        message: "Something went wrong. Please try again or contact us directly.",
      });
    }
  };

  return (
    <section className="section-padding">
      <div className="container-wide">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="grid lg:grid-cols-5 gap-12 lg:gap-16"
        >
          <motion.div variants={slideInLeft} className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-white mb-6">
                Contact Information
              </h2>
              <ul className="space-y-5">
                <li>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="flex items-center gap-4 text-tijara-gray hover:text-tijara-green-light transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-tijara-green/10 flex items-center justify-center group-hover:bg-tijara-green/20 transition-colors">
                      <Mail className="w-5 h-5 text-tijara-green" />
                    </div>
                    <div>
                      <span className="block text-xs text-tijara-gray uppercase tracking-wider">
                        Email
                      </span>
                      <span className="text-sm text-white">{contactInfo.email}</span>
                    </div>
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}
                    className="flex items-center gap-4 text-tijara-gray hover:text-tijara-green-light transition-colors group"
                  >
                    <motion.div className="w-10 h-10 rounded-lg bg-tijara-green/10 flex items-center justify-center group-hover:bg-tijara-green/20 transition-colors">
                      <Phone className="w-5 h-5 text-tijara-green" />
                    </motion.div>
                    <div>
                      <span className="block text-xs text-tijara-gray uppercase tracking-wider">
                        Phone
                      </span>
                      <span className="text-sm text-white">{contactInfo.phone}</span>
                    </div>
                  </a>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-tijara-green/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-tijara-green" />
                  </div>
                  <div>
                    <span className="block text-xs text-tijara-gray uppercase tracking-wider">
                      Location
                    </span>
                    <span className="text-sm text-white">{contactInfo.address}</span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="flex gap-4">
              <a
                href={contactInfo.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-colors text-sm font-medium"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </a>
              <a
                href={contactInfo.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors text-sm font-medium"
              >
                <Instagram className="w-5 h-5" />
                Instagram
              </a>
            </div>

            <div className="rounded-2xl overflow-hidden aspect-video glass-card">
              <div className="w-full h-full flex items-center justify-center bg-tijara-charcoal-light">
                <div className="text-center p-6">
                  <MapPin className="w-8 h-8 text-tijara-green mx-auto mb-3" />
                  <p className="text-sm text-tijara-gray">
                    Google Maps integration
                  </p>
                  <p className="text-xs text-tijara-gray mt-1">
                    {contactInfo.address}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={slideInRight} className="lg:col-span-3">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="p-8 md:p-10 rounded-2xl glass-card space-y-6"
              noValidate
            >
              <h2 className="font-serif text-2xl font-semibold text-white mb-2">
                Send us a message
              </h2>
              <p className="text-sm text-tijara-gray mb-6">
                Fill out the form below and our team will get back to you shortly.
              </p>

              <motion.div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    {...register("name")}
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-400">{errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    {...register("email")}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-400">{errors.email.message}</p>
                  )}
                </div>
              </motion.div>

              <motion.div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+20 100 000 0000"
                    {...register("phone")}
                    aria-invalid={!!errors.phone}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-400">{errors.phone.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    placeholder="Your company name"
                    {...register("company")}
                  />
                </div>
              </motion.div>

              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type *</Label>
                <Controller
                  name="businessType"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        id="businessType"
                        aria-invalid={!!errors.businessType}
                      >
                        <SelectValue placeholder="Select your business type" />
                      </SelectTrigger>
                      <SelectContent>
                        {businessTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.businessType && (
                  <p className="text-xs text-red-400">
                    {errors.businessType.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your business goals and how we can help..."
                  rows={5}
                  {...register("message")}
                  aria-invalid={!!errors.message}
                />
                {errors.message && (
                  <p className="text-xs text-red-400">{errors.message.message}</p>
                )}
              </div>

              {submitStatus && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-sm ${
                    submitStatus.type === "success"
                      ? "text-tijara-green-light"
                      : "text-red-400"
                  }`}
                  role="alert"
                >
                  {submitStatus.message}
                </motion.p>
              )}

              <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export function NewsletterPlaceholder() {
  return (
    <section className="section-padding bg-tijara-charcoal/50">
      <div className="container-wide max-w-2xl mx-auto text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={fadeUp}
          className="p-8 rounded-2xl glass-card"
        >
          <h2 className="font-serif text-2xl font-semibold text-white mb-2">
            Stay ahead of the curve
          </h2>
          <p className="text-sm text-tijara-gray mb-6">
            Newsletter coming soon. Get insights on business growth, strategy, and
            scaling delivered to your inbox.
          </p>
          <Button variant="outline" disabled>
            Subscribe — Coming Soon
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
