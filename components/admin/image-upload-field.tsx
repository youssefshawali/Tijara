"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ImageUploadFieldProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

export function ImageUploadField({
  value,
  onChange,
  label = "Image",
  className,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "tijara");

      const res = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error ?? "Upload failed");
      }

      onChange(json.data.url);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <motion.div className={cn("space-y-2", className)}>
      <Label>{label}</Label>
      {value ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative overflow-hidden rounded-lg border border-border"
        >
          <motion.div className="relative aspect-video w-full bg-muted">
            <Image
              src={value}
              alt="Uploaded preview"
              fill
              className="object-cover"
              unoptimized
            />
          </motion.div>
          <div className="flex gap-2 p-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-border text-foreground hover:bg-muted"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              Replace
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-destructive hover:bg-destructive/10"
              onClick={() => onChange("")}
            >
              <X className="mr-1 h-4 w-4" />
              Remove
            </Button>
          </div>
        </motion.div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-8 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:bg-muted/50"
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          ) : (
            <Upload className="h-6 w-6 text-primary" />
          )}
          {uploading ? "Uploading..." : "Click to upload image"}
        </button>
      )}
      <Input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleUpload(file);
          e.target.value = "";
        }}
      />
      <Input
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste image URL"
        className="border-border bg-background text-foreground"
      />
    </motion.div>
  );
}
