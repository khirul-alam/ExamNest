// frontend/src/components/auth/ResendVerification.tsx
"use client";

import { useEffect, useState } from "react";

// ভেরিফিকেশন ইমেইল আবার পাঠানোর বাটন (৬০ সেকেন্ড অপেক্ষা)
export function ResendVerification() {
  const [cooldown, setCooldown] = useState(60);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  return (
    <button
      type="button"
      disabled={cooldown > 0}
      // TODO: ব্যাকএন্ডে ভেরিফিকেশন ইমেইল আবার পাঠানোর API কল হবে
      onClick={() => setCooldown(60)}
      className="rounded-lg border border-border px-5 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:text-muted-foreground"
    >
      {cooldown > 0 ? `আবার পাঠান (${cooldown}s)` : "ইমেইল আবার পাঠান"}
    </button>
  );
}