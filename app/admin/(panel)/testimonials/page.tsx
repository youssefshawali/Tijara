"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  testimonialSchema,
  type TestimonialFormValues,
} from "@/lib/validations/admin";
import { cn } from "@/lib/utils";

interface Testimonial extends TestimonialFormValues {
  _id: string;
  createdAt: string;
}

const defaultValues: TestimonialFormValues = {
  clientName: "",
  position: "",
  company: "",
  quote: "",
  imageUrl: "",
  rating: 5,
  published: true,
  sortOrder: 0,
};

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (rating: number) => void;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="rounded p-0.5 transition-transform hover:scale-110"
        >
          <Star
            className={cn(
              "h-5 w-5",
              star <= value
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground/40"
            )}
          />
        </button>
      ))}
    </div>
  );
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues,
  });

  async function loadTestimonials() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/testimonials");
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setTestimonials(json.data ?? []);
    } catch {
      toast.error("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadTestimonials();
  }, []);

  function openCreate() {
    setEditingId(null);
    form.reset(defaultValues);
    setDialogOpen(true);
  }

  function openEdit(item: Testimonial) {
    setEditingId(item._id);
    form.reset({
      clientName: item.clientName,
      position: item.position,
      company: item.company,
      quote: item.quote,
      imageUrl: item.imageUrl ?? "",
      rating: item.rating,
      published: item.published,
      sortOrder: item.sortOrder,
    });
    setDialogOpen(true);
  }

  async function onSubmit(data: TestimonialFormValues) {
    setSaving(true);
    try {
      const url = editingId
        ? `/api/admin/testimonials/${editingId}`
        : "/api/admin/testimonials";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Save failed");

      toast.success(editingId ? "Testimonial updated" : "Testimonial created");
      setDialogOpen(false);
      void loadTestimonials();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function deleteTestimonial(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Testimonial deleted");
      void loadTestimonials();
    } catch {
      toast.error("Failed to delete testimonial");
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader
        title="Testimonials"
        description="Manage client testimonials and reviews"
        action={
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Testimonial
          </Button>
        }
      />

      <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left">
                <th className="px-4 py-3 font-medium text-muted-foreground">Client</th>
                <th className="hidden px-4 py-3 font-medium text-muted-foreground md:table-cell">
                  Company
                </th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Rating</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-4 py-3">
                      <Skeleton className="h-8" />
                    </td>
                  </tr>
                ))
              ) : testimonials.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                    No testimonials yet
                  </td>
                </tr>
              ) : (
                testimonials.map((item) => (
                  <tr key={item._id} className="border-b border-border/60 hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{item.clientName}</p>
                      <p className="text-xs text-muted-foreground">{item.position}</p>
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                      {item.company}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-3.5 w-3.5",
                              i < item.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted-foreground/30"
                            )}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={item.published ? "success" : "secondary"}>
                        {item.published ? "Published" : "Hidden"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(item)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => void deleteTestimonial(item._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-card sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Testimonial" : "New Testimonial"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Client Name</Label>
                <Input
                  className="border-border bg-background text-foreground"
                  {...form.register("clientName")}
                />
              </div>
              <div className="space-y-2">
                <Label>Position</Label>
                <Input
                  className="border-border bg-background text-foreground"
                  {...form.register("position")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Company</Label>
              <Input
                className="border-border bg-background text-foreground"
                {...form.register("company")}
              />
            </div>

            <div className="space-y-2">
              <Label>Quote</Label>
              <Textarea
                className="min-h-[100px] border-border bg-background text-foreground"
                {...form.register("quote")}
              />
            </div>

            <div className="space-y-2">
              <Label>Rating</Label>
              <StarRating
                value={form.watch("rating")}
                onChange={(r) => form.setValue("rating", r)}
              />
            </div>

            <ImageUploadField
              label="Client Photo"
              value={form.watch("imageUrl")}
              onChange={(url) => form.setValue("imageUrl", url)}
            />

            <div className="space-y-2">
              <Label>Sort Order</Label>
              <Input
                type="number"
                className="border-border bg-background text-foreground"
                {...form.register("sortOrder", { valueAsNumber: true })}
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" {...form.register("published")} className="rounded" />
              Published
            </label>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingId ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
