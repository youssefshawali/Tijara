"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Loader2, Save, Upload, User } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
const TEAM_SLOT_COUNT = 4;

type TeamSlot = {
  id?: string;
  name: string;
  role: string;
  imageUrl: string;
  publicId: string;
  published: boolean;
  sortOrder: number;
};

function emptySlot(sortOrder: number): TeamSlot {
  return {
    name: "",
    role: "",
    imageUrl: "",
    publicId: "",
    published: true,
    sortOrder,
  };
}

function mergeSlotsFromApi(
  rows: Array<{
    _id: string;
    name: string;
    role: string;
    imageUrl?: string | null;
    publicId?: string | null;
    published: boolean;
    sortOrder: number;
  }>
): TeamSlot[] {
  const slots = Array.from({ length: TEAM_SLOT_COUNT }, (_, i) => emptySlot(i));
  for (const row of rows) {
    if (row.sortOrder >= 0 && row.sortOrder < TEAM_SLOT_COUNT) {
      slots[row.sortOrder] = {
        id: row._id,
        name: row.name ?? "",
        role: row.role ?? "",
        imageUrl: row.imageUrl ?? "",
        publicId: row.publicId ?? "",
        published: row.published,
        sortOrder: row.sortOrder,
      };
    }
  }
  return slots;
}

export default function MediaPage() {
  const [slots, setSlots] = useState<TeamSlot[]>(() =>
    Array.from({ length: TEAM_SLOT_COUNT }, (_, i) => emptySlot(i))
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  async function loadTeam() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/team");
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setSlots(mergeSlotsFromApi(json.data ?? []));
    } catch {
      toast.error("Failed to load team");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadTeam();
  }, []);

  function updateSlot(index: number, patch: Partial<TeamSlot>) {
    setSlots((prev) =>
      prev.map((slot, i) => (i === index ? { ...slot, ...patch } : slot))
    );
  }

  async function handleUpload(index: number, fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;

    setUploadingSlot(index);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "tijara/team");

      const res = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload failed");

      updateSlot(index, {
        imageUrl: json.data.url,
        publicId: json.data.publicId ?? "",
      });
      toast.success(`Photo uploaded for slot ${index + 1}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingSlot(null);
      const input = inputRefs.current[index];
      if (input) input.value = "";
    }
  }

  async function saveTeam() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/team", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ members: slots }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Save failed");

      setSlots(mergeSlotsFromApi(json.data ?? []));
      toast.success("About page team updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader
        title="About Team"
        description="Manage the four team member slots shown on the About page"
        action={
          <Button onClick={() => void saveTeam()} disabled={saving || loading}>
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save team
          </Button>
        }
      />

      <p className="text-sm text-muted-foreground">
        Upload a photo for each slot, add name and role, then click Save team. Only
        published members with a photo and name appear on{" "}
        <span className="text-foreground">/about</span>.
      </p>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {Array.from({ length: TEAM_SLOT_COUNT }).map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {slots.map((slot, index) => (
            <Card key={index} className="border-border/60">
              <CardContent className="space-y-4 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">
                    Slot {index + 1}
                  </span>
                  <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={slot.published}
                      onChange={(e) =>
                        updateSlot(index, { published: e.target.checked })
                      }
                      className="rounded border-border"
                    />
                    Show on site
                  </label>
                </div>

                <input
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => void handleUpload(index, e.target.files)}
                />

                <button
                  type="button"
                  onClick={() => inputRefs.current[index]?.click()}
                  disabled={uploadingSlot === index}
                  className="relative mx-auto flex aspect-square w-full max-w-[200px] items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border bg-muted/30 transition-colors hover:border-primary/40 hover:bg-muted/50"
                >
                  {uploadingSlot === index ? (
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  ) : slot.imageUrl ? (
                    <Image
                      src={slot.imageUrl}
                      alt={slot.name || `Team member ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <User className="h-10 w-10 opacity-50" />
                      <span className="text-xs">Upload photo</span>
                    </div>
                  )}
                  {slot.imageUrl && uploadingSlot !== index && (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100">
                      <Upload className="h-6 w-6 text-white" />
                    </span>
                  )}
                </button>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor={`name-${index}`}>Name</Label>
                    <Input
                      id={`name-${index}`}
                      value={slot.name}
                      onChange={(e) => updateSlot(index, { name: e.target.value })}
                      placeholder="e.g. Sarah Ahmed"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`role-${index}`}>Role</Label>
                    <Input
                      id={`role-${index}`}
                      value={slot.role}
                      onChange={(e) => updateSlot(index, { role: e.target.value })}
                      placeholder="e.g. Managing Partner"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
}
