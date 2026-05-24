"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Mail,
  MailOpen,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface Message {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  businessType: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(pagination.page),
        limit: String(pagination.limit),
        status,
      });
      if (search.trim()) params.set("search", search.trim());

      const res = await fetch(`/api/admin/messages?${params}`);
      if (!res.ok) throw new Error("Failed to fetch");

      const json = await res.json();
      setMessages(json.data ?? []);
      setPagination(json.pagination);
    } catch {
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search, status]);

  useEffect(() => {
    void fetchMessages();
  }, [fetchMessages]);

  async function toggleRead(msg: Message) {
    try {
      const res = await fetch(`/api/admin/messages/${msg._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: !msg.read }),
      });
      if (!res.ok) throw new Error("Failed to update");

      toast.success(msg.read ? "Marked as unread" : "Marked as read");
      void fetchMessages();
      if (selected?._id === msg._id) {
        setSelected({ ...msg, read: !msg.read });
      }
    } catch {
      toast.error("Failed to update message");
    }
  }

  async function deleteMessage(id: string) {
    if (!confirm("Delete this message permanently?")) return;

    try {
      const res = await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");

      toast.success("Message deleted");
      setDetailOpen(false);
      setSelected(null);
      void fetchMessages();
    } catch {
      toast.error("Failed to delete message");
    }
  }

  async function openDetail(msg: Message) {
    setSelected(msg);
    setDetailOpen(true);

    if (!msg.read) {
      try {
        await fetch(`/api/admin/messages/${msg._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ read: true }),
        });
        setSelected({ ...msg, read: true });
        void fetchMessages();
      } catch {
        // non-blocking
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <PageHeader
        title="Messages"
        description="Contact form submissions from your website"
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPagination((p) => ({ ...p, page: 1 }));
            }}
            className="border-border bg-background pl-10 text-foreground"
          />
        </div>
        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v);
            setPagination((p) => ({ ...p, page: 1 }));
          }}
        >
          <SelectTrigger className="w-full border-border bg-background text-foreground sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="unread">Unread</SelectItem>
            <SelectItem value="read">Read</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left">
                <th className="px-4 py-3 font-medium text-muted-foreground">Name</th>
                <th className="hidden px-4 py-3 font-medium text-muted-foreground md:table-cell">
                  Email
                </th>
                <th className="hidden px-4 py-3 font-medium text-muted-foreground lg:table-cell">
                  Message
                </th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Date</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border/60">
                    <td colSpan={6} className="px-4 py-3">
                      <Skeleton className="h-8 w-full" />
                    </td>
                  </tr>
                ))
              ) : messages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    No messages found
                  </td>
                </tr>
              ) : (
                messages.map((msg) => (
                  <tr
                    key={msg._id}
                    className="border-b border-border/60 transition-colors hover:bg-muted/30"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">{msg.name}</td>
                    <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                      {msg.email}
                    </td>
                    <td className="hidden max-w-xs truncate px-4 py-3 text-muted-foreground lg:table-cell">
                      {msg.message}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={msg.read ? "secondary" : "warning"}>
                        {msg.read ? "Read" : "Unread"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <motion.div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-foreground hover:bg-muted"
                          onClick={() => void openDetail(msg)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-foreground hover:bg-muted"
                          onClick={() => void toggleRead(msg)}
                        >
                          {msg.read ? (
                            <Mail className="h-4 w-4" />
                          ) : (
                            <MailOpen className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          onClick={() => void deleteMessage(msg._id)}
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

        {!loading && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <p className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-border"
                disabled={pagination.page <= 1}
                onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-border"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto border-border bg-card sm:max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.name}</DialogTitle>
                <DialogDescription>
                  Received {new Date(selected.createdAt).toLocaleString()}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <motion.div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">{selected.email}</p>
                </motion.div>
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-medium text-foreground">{selected.phone}</p>
                </div>
                {selected.company && (
                  <motion.div>
                    <p className="text-muted-foreground">Company</p>
                    <p className="font-medium text-foreground">{selected.company}</p>
                  </motion.div>
                )}
                <div>
                  <p className="text-muted-foreground">Business Type</p>
                  <p className="font-medium text-foreground">{selected.businessType}</p>
                </div>
                <Separator />
                <div>
                  <p className="mb-2 text-muted-foreground">Message</p>
                  <p className="whitespace-pre-wrap text-foreground">{selected.message}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <Button
                  variant="outline"
                  className="border-border"
                  onClick={() => void toggleRead(selected)}
                >
                  {selected.read ? "Mark unread" : "Mark read"}
                </Button>
                <Button
                  variant="ghost"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => void deleteMessage(selected._id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
