// frontend/src/components/model-test/AttemptView.tsx
"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useStartSession } from "./useStartSession";
import { ExamResult } from "@/components/exam/ExamResult";
import { retakeSession } from "@/lib/custom-test";
import { useAttempts } from "@/lib/useAttempts";

// জমা থাকা একটি পরীক্ষার ফলাফল ও বিস্তারিত সমাধান আবার দেখায়
export function AttemptView({ id }: { id: string }) {
  const { attempts, ready } = useAttempts();
  const startSession = useStartSession();

  if (!ready) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );
  }

  const attempt = attempts.find((a) => a.id === id);

  if (!attempt) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="mb-2 font-display text-xl font-bold">পরীক্ষাটি পাওয়া যায়নি</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          এটি মুছে গেছে অথবা অন্য ব্রাউজারে দেওয়া হয়েছিল।
        </p>
        <Link
          href="/model-test"
          className="inline-block rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground"
        >
          মডেল টেস্ট পেজে ফিরে যান
        </Link>
      </div>
    );
  }

  return (
    <ExamResult
      session={attempt.session}
      reason={attempt.reason}
      finishedAt={attempt.finishedAt}
      onRetry={() => {
        const session = retakeSession(attempt);
        if (session) startSession(session);
      }}
    />
  );
}