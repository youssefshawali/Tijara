"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  blogPostSchema,
  type BlogPostFormValues,
} from "@/lib/validations/admin";
import { slugify } from "@/lib/slug";

interface BlogPost extends BlogPostFormValues {
  _id: string;
  publishedAt?: string;
  createdAt: string;
}

const defaultValues: BlogPostFormValues = {
  title: "",
  slug: "",
  content: "",
  excerpt: "",
  featuredImage: "",
  category: "General",
  tags: [],
  seoTitle: "",
  seoDescription: "",
  status: "draft",
};

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [tagsInput, setTagsInput] = useState("");

  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues,
  });

  async function loadPosts() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blog");
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setPosts(json.data ?? []);
    } catch {
      toast.error("Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadPosts();
  }, []);

  function openCreate() {
    setEditingId(null);
    form.reset(defaultValues);
    setTagsInput("");
    setDialogOpen(true);
  }

  function openEdit(post: BlogPost) {
    setEditingId(post._id);
    form.reset({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt ?? "",
      featuredImage: post.featuredImage ?? "",
      category: post.category,
      tags: post.tags ?? [],
      seoTitle: post.seoTitle ?? "",
      seoDescription: post.seoDescription ?? "",
      status: post.status,
    });
    setTagsInput((post.tags ?? []).join(", "));
    setDialogOpen(true);
  }

  async function onSubmit(data: BlogPostFormValues) {
    setSaving(true);
    try {
      const payload = {
        ...data,
        slug: data.slug || slugify(data.title),
        tags: tagsInput
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };

      const url = editingId ? `/api/admin/blog/${editingId}` : "/api/admin/blog";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Save failed");

      toast.success(editingId ? "Post updated" : "Post created");
      setDialogOpen(false);
      void loadPosts();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function deletePost(id: string) {
    if (!confirm("Delete this blog post?")) return;
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Post deleted");
      void loadPosts();
    } catch {
      toast.error("Failed to delete post");
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader
        title="Blog Posts"
        description="Create and manage blog content"
        action={
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        }
      />

      <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left">
                <th className="px-4 py-3 font-medium text-muted-foreground">Title</th>
                <th className="hidden px-4 py-3 font-medium text-muted-foreground md:table-cell">
                  Category
                </th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Date</th>
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
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                    No blog posts yet
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post._id} className="border-b border-border/60 hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium text-foreground">{post.title}</td>
                    <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                      {post.category}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={post.status === "published" ? "success" : "secondary"}>
                        {post.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <motion.div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(post)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => void deletePost(post._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-card sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Post" : "New Post"}</DialogTitle>
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
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input
                  className="border-border bg-background text-foreground"
                  {...form.register("slug")}
                />
              </div>
            </div>

            <motion.div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                className="min-h-[280px] border-border bg-background font-mono text-sm leading-relaxed text-foreground"
                placeholder="Write your blog post content here. Supports plain text and markdown-style formatting."
                {...form.register("content")}
              />
              <p className="text-xs text-muted-foreground">
                Rich content editor — use markdown-style headings, lists, and links.
              </p>
            </motion.div>

            <motion.div className="space-y-2">
              <Label>Excerpt</Label>
              <Textarea
                className="min-h-[80px] border-border bg-background text-foreground"
                {...form.register("excerpt")}
              />
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Category</Label>
                <Input
                  className="border-border bg-background text-foreground"
                  {...form.register("category")}
                />
              </div>
              <div className="space-y-2">
                <Label>Tags (comma-separated)</Label>
                <Input
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="border-border bg-background text-foreground"
                  placeholder="growth, strategy, consulting"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={form.watch("status")}
                onValueChange={(v: "draft" | "published") => form.setValue("status", v)}
              >
                <SelectTrigger className="border-border bg-background text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <ImageUploadField
              label="Featured Image"
              value={form.watch("featuredImage")}
              onChange={(url) => form.setValue("featuredImage", url)}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>SEO Title</Label>
                <Input
                  className="border-border bg-background text-foreground"
                  {...form.register("seoTitle")}
                />
              </div>
              <div className="space-y-2">
                <Label>SEO Description</Label>
                <Input
                  className="border-border bg-background text-foreground"
                  {...form.register("seoDescription")}
                />
              </div>
            </div>

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
