"use client";

import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import AdminLoginForm from "./login-form";

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="admin-root flex min-h-screen items-center justify-center bg-background p-4">
          <Skeleton className="h-96 w-full max-w-md rounded-xl" />
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
