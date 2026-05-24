"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
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
  serviceSchema,
  type ServiceFormValues,
} from "@/lib/validations/admin";
import { slugify } from "@/lib/slug";

interface Service extends ServiceFormValues {
  _id: string;
  createdAt: string;
}

const defaultValues: ServiceFormValues = {
  title: "",
  slug: "",
  shortDescription: "",
  description: "",
  benefits: [""],
  process: [""],
  icon: "Briefcase",
  imageUrl: "",
  published: true,
  sortOrder: 0,
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues,
  });

  const benefits = form.watch("benefits") ?? [""];
  const processSteps = form.watch("process") ?? [""];

  async function loadServices() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/services");
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setServices(json.data ?? []);
    } catch {
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadServices();
  }, []);

  function openCreate() {
    setEditingId(null);
    form.reset(defaultValues);
    setDialogOpen(true);
  }

  function openEdit(service: Service) {
    setEditingId(service._id);
    form.reset({
      title: service.title,
      slug: service.slug,
      shortDescription: service.shortDescription,
      description: service.description,
      benefits: service.benefits.length ? service.benefits : [""],
      process: service.process.length ? service.process : [""],
      icon: service.icon,
      imageUrl: service.imageUrl ?? "",
      published: service.published,
      sortOrder: service.sortOrder,
    });
    setDialogOpen(true);
  }

  function updateListField(
    field: "benefits" | "process",
    index: number,
    value: string
  ) {
    const current = [...form.getValues(field)];
    current[index] = value;
    form.setValue(field, current);
  }

  function addListField(field: "benefits" | "process") {
    form.setValue(field, [...form.getValues(field), ""]);
  }

  function removeListField(field: "benefits" | "process", index: number) {
    const current = form.getValues(field).filter((_, i) => i !== index);
    form.setValue(field, current.length ? current : [""]);
  }

  async function onSubmit(data: ServiceFormValues) {
    setSaving(true);
    try {
      const payload = {
        ...data,
        benefits: data.benefits.filter(Boolean),
        process: data.process.filter(Boolean),
        slug: data.slug || slugify(data.title),
      };

      const url = editingId
        ? `/api/admin/services/${editingId}`
        : "/api/admin/services";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Save failed");

      toast.success(editingId ? "Service updated" : "Service created");
      setDialogOpen(false);
      void loadServices();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function deleteService(id: string) {
    if (!confirm("Delete this service?")) return;
    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Service deleted");
      void loadServices();
    } catch {
      toast.error("Failed to delete service");
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader
        title="Services"
        description="Manage your consulting services"
        action={
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Button>
        }
      />

      <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
        <motion.div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left">
                <th className="px-4 py-3 font-medium text-muted-foreground">Title</th>
                <th className="hidden px-4 py-3 font-medium text-muted-foreground md:table-cell">
                  Slug
                </th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Order</th>
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
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                    No services yet
                  </td>
                </tr>
              ) : (
                services.map((service) => (
                  <tr
                    key={service._id}
                    className="border-b border-border/60 hover:bg-muted/30"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">{service.title}</td>
                    <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                      {service.slug}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={service.published ? "success" : "secondary"}>
                        {service.published ? "Published" : "Draft"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{service.sortOrder}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEdit(service)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => void deleteService(service._id)}
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
        </motion.div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-card sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Service" : "New Service"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  className="border-border bg-background text-foreground"
                  {...form.register("title")}
                  onChange={(e) => {
                    form.setValue("title", e.target.value);
                    if (!editingId) form.setValue("slug", slugify(e.target.value));
                  }}
                />
              </div>
              <motion.div className="space-y-2">
                <Label>Slug</Label>
                <Input
                  className="border-border bg-background text-foreground"
                  {...form.register("slug")}
                />
              </motion.div>
            </div>

            <div className="space-y-2">
              <Label>Short Description</Label>
              <Textarea
                className="min-h-[80px] border-border bg-background text-foreground"
                {...form.register("shortDescription")}
              />
            </div>

            <div className="space-y-2">
              <Label>Full Description</Label>
              <Textarea
                className="min-h-[120px] border-border bg-background text-foreground"
                {...form.register("description")}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Benefits</Label>
                <Button type="button" variant="ghost" size="sm" onClick={() => addListField("benefits")}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {benefits.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) => updateListField("benefits", index, e.target.value)}
                    className="border-border bg-background text-foreground"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeListField("benefits", index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Process Steps</Label>
                <Button type="button" variant="ghost" size="sm" onClick={() => addListField("process")}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {processSteps.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) => updateListField("process", index, e.target.value)}
                    className="border-border bg-background text-foreground"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeListField("process", index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Icon</Label>
                <Input
                  className="border-border bg-background text-foreground"
                  {...form.register("icon")}
                />
              </div>
              <div className="space-y-2">
                <Label>Sort Order</Label>
                <Input
                  type="number"
                  className="border-border bg-background text-foreground"
                  {...form.register("sortOrder", { valueAsNumber: true })}
                />
              </div>
            </div>

            <ImageUploadField
              value={form.watch("imageUrl")}
              onChange={(url) => form.setValue("imageUrl", url)}
            />

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
