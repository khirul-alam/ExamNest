// frontend/src/components/auth/RequireLogin.tsx
"use client";

import Link from "next/link";
import { Loader2, Lock } from "lucide-react";
import { useAuthPreview } from "@/components/providers/AuthPreviewProvider";

type Props = {
  title?: string;
  children: React.ReactNode;
};

// লগইন ছাড়া ভিতরের কনটেন্ট দেখানো হয় না (পরে Better Auth-এর আসল সেশন দিয়ে বদলাবে)
export function RequireLogin({ title = "এই পেজ দেখতে লগইন করুন", children }: Props) {
  const { isLoggedIn, isReady } = useAuthPreview();

  if (!isReady) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <Lock size={36} className="mx-auto mb-3 text-primary" />
        <h1 className="mb-2 font-display text-xl font-bold">{title}</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          আপনার Progress, বুকমার্ক ও ফলাফল দেখতে একটি অ্যাকাউন্ট প্রয়োজন।
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/login" className="rounded-lg border border-border px-5 py-2 text-sm font-medium">
            লগইন
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground"
          >
            ফ্রি রেজিস্ট্রেশন
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}