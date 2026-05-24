"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Copy, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

interface MediaFile {
  _id: string;
  filename: string;
  url: string;
  format: string;
  bytes: number;
  width?: number;
  height?: number;
  createdAt: string;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function loadMedia() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/media");
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setFiles(json.data ?? []);
    } catch {
      toast.error("Failed to load media");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadMedia();
  }, []);

  async function handleUpload(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;

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
      if (!res.ok) throw new Error(json.error ?? "Upload failed");

      toast.success("File uploaded");
      void loadMedia();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function deleteFile(id: string) {
    if (!confirm("Delete this file permanently?")) return;
    try {
      const res = await fetch(`/api/admin/media?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("File deleted");
      void loadMedia();
    } catch {
      toast.error("Failed to delete file");
    }
  }

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("URL copied to clipboard");
    } catch {
      toast.error("Failed to copy URL");
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader
        title="Media Library"
        description="Upload and manage images for your website"
        action={
          <Button onClick={() => inputRef.current?.click()} disabled={uploading}>
            {uploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Upload Image
          </Button>
        }
      />

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => void handleUpload(e.target.files)}
      />

      <motion.button
        type="button"
        whileHover={{ scale: 1.005 }}
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/20 px-6 py-12 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-muted/40"
      >
        {uploading ? (
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        ) : (
          <Upload className="h-8 w-8 text-primary" />
        )}
        <p className="text-sm font-medium">
          {uploading ? "Uploading..." : "Drop images here or click to upload"}
        </p>
        <p className="text-xs">JPEG, PNG, WebP, GIF, SVG — max 5 MB</p>
      </motion.button>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-xl" />
          ))}
        </div>
      ) : files.length === 0 ? (
        <Card className="border-border/60">
          <CardContent className="py-16 text-center text-muted-foreground">
            No media files yet. Upload your first image above.
          </CardContent>
        </Card>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {files.map((file, index) => (
            <motion.div
              key={file._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
            >
              <Card className="group overflow-hidden border-border/60 shadow-sm transition-shadow hover:shadow-md">
                <div className="relative aspect-square bg-muted">
                  <Image
                    src={file.url}
                    alt={file.filename}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-9 w-9"
                      onClick={() => void copyUrl(file.url)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-9 w-9 text-destructive"
                      onClick={() => void deleteFile(file._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="space-y-1 p-3">
                  <p className="truncate text-sm font-medium text-foreground">{file.filename}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(file.bytes)} · {file.format.toUpperCase()}
                    {file.width && file.height && ` · ${file.width}×${file.height}`}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
