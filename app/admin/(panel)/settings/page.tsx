"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  siteSettingsSchema,
  type SiteSettingsFormValues,
} from "@/lib/validations/admin";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const form = useForm<SiteSettingsFormValues>({
    resolver: zodResolver(siteSettingsSchema),
  });

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/settings");
        if (!res.ok) throw new Error("Failed");
        const json = await res.json();
        form.reset({
          companyName: json.data.companyName ?? "",
          tagline: json.data.tagline ?? "",
          description: json.data.description ?? "",
          email: json.data.email ?? "",
          phone: json.data.phone ?? "",
          whatsapp: json.data.whatsapp ?? "",
          instagram: json.data.instagram ?? "",
          instagramHandle: json.data.instagramHandle ?? "",
          tiktok: json.data.tiktok ?? "",
          linkedin: json.data.linkedin ?? "",
          address: json.data.address ?? "",
          logoUrl: json.data.logoUrl ?? "",
          seoTitle: json.data.seoTitle ?? "",
          seoDescription: json.data.seoDescription ?? "",
          homepageHeroTitle: json.data.homepageHeroTitle ?? "",
          homepageHeroSubtitle: json.data.homepageHeroSubtitle ?? "",
        });
      } catch {
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [form]);

  async function onSubmit(data: SiteSettingsFormValues) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Save failed");

      toast.success("Settings saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader
        title="Settings"
        description="Configure your website information and SEO"
      />

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Company Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label>Company Name</Label>
              <Input
                className="border-border bg-background text-foreground"
                {...form.register("companyName")}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Tagline</Label>
              <Input
                className="border-border bg-background text-foreground"
                {...form.register("tagline")}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Description</Label>
              <Textarea
                className="border-border bg-background text-foreground"
                {...form.register("description")}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Address</Label>
              <Input
                className="border-border bg-background text-foreground"
                {...form.register("address")}
              />
            </div>
            <ImageUploadField
              label="Logo"
              value={form.watch("logoUrl")}
              onChange={(url) => form.setValue("logoUrl", url)}
              className="sm:col-span-2"
            />
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Contact & Social</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                className="border-border bg-background text-foreground"
                {...form.register("email")}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone (optional)</Label>
              <Input
                placeholder="Leave empty to hide on the website"
                className="border-border bg-background text-foreground"
                {...form.register("phone")}
              />
            </div>
            <div className="space-y-2">
              <Label>WhatsApp URL (optional)</Label>
              <Input
                placeholder="Leave empty to hide on the website"
                className="border-border bg-background text-foreground"
                {...form.register("whatsapp")}
              />
            </div>
            <motion.div className="space-y-2">
              <Label>Instagram URL</Label>
              <Input
                className="border-border bg-background text-foreground"
                {...form.register("instagram")}
              />
            </motion.div>
            <div className="space-y-2">
              <Label>Instagram Handle</Label>
              <Input
                className="border-border bg-background text-foreground"
                {...form.register("instagramHandle")}
              />
            </div>
            <div className="space-y-2">
              <Label>TikTok URL</Label>
              <Input
                placeholder="https://tiktok.com/@yourhandle"
                className="border-border bg-background text-foreground"
                {...form.register("tiktok")}
              />
            </div>
            <div className="space-y-2">
              <Label>LinkedIn URL</Label>
              <Input
                placeholder="https://linkedin.com/company/yourcompany"
                className="border-border bg-background text-foreground"
                {...form.register("linkedin")}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Homepage Hero</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Hero Title</Label>
              <Input
                className="border-border bg-background text-foreground"
                {...form.register("homepageHeroTitle")}
              />
            </div>
            <div className="space-y-2">
              <Label>Hero Subtitle</Label>
              <Textarea
                className="border-border bg-background text-foreground"
                {...form.register("homepageHeroSubtitle")}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">SEO</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>SEO Title</Label>
              <Input
                className="border-border bg-background text-foreground"
                {...form.register("seoTitle")}
              />
            </div>
            <div className="space-y-2">
              <Label>SEO Description</Label>
              <Textarea
                className="border-border bg-background text-foreground"
                {...form.register("seoDescription")}
              />
            </div>
          </CardContent>
        </Card>

        <Separator />

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} size="lg">
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Settings
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
