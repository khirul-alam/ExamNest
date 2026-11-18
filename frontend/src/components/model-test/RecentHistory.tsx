// frontend/src/components/model-test/RecentHistory.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, RotateCcw } from "lucide-react";
import { useStartSession } from "./useStartSession";
import type { Attempt } from "@/lib/attempts";
import { retakeSession } from "@/lib/custom-test";
import { evaluate } from "@/lib/exam-utils";
import { formatBanglaDate } from "@/lib/format";
import { toLocalIsoDate } from "@/lib/notes";
import { toBanglaNumber } from "@/lib/pricing";

const PREVIEW_COUNT = 5;

type Props = {
  // নতুন থেকে পুরনো ক্রমে সাজানো
  attempts: Attempt[];
};

export function RecentHistory({ attempts }: Props) {
  const [showAll, setShowAll] = useState(false);
  const startSession = useStartSession();

  if (attempts.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
        এখনও কোনো পরীক্ষা দেননি।
      </p>
    );
  }

  const visible = showAll ? attempts : attempts.slice(0, PREVIEW_COUNT);

  const handleRetake = (attempt: Attempt) => {
    const session = retakeSession(attempt);
    if (session) startSession(session);
  };

  return (
    <div>
      <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
        {visible.map((attempt) => {
          const stats = evaluate(attempt.session);
          return (
            <li key={attempt.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-2 text-sm font-medium">
                  <span className="truncate">{attempt.session.title}</span>
                  <span className="rounded bg-muted px-2 py-0.5 text-xs font-normal text-muted-foreground">
                    {attempt.session.mode === "model" ? "মডেল টেস্ট" : "অনুশীলন"}
                  </span>
                </p>
                <p className="font-mono text-xs text-muted-foreground">
                  {formatBanglaDate(toLocalIsoDate(attempt.finishedAt))}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-bold">
                  {toBanglaNumber(Math.round(stats.score * 100) / 100)}/{toBanglaNumber(stats.total)}
                </span>
                <span
                  className={`rounded px-2 py-0.5 text-xs font-medium ${
                    stats.passed
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                      : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                  }`}
                >
                  {stats.passed ? "উত্তীর্ণ" : "অনুত্তীর্ণ"}
                </span>
                <Link
                  href={`/model-test/attempts/${attempt.id}`}
                  className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted"
                >
                  <Eye size={13} /> ফলাফল ও সমাধান
                </Link>
                <button
                  onClick={() => handleRetake(attempt)}
                  className="flex items-center gap-1 rounded-lg border border-primary px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10"
                >
                  <RotateCcw size={13} /> আবার দিন
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {attempts.length > PREVIEW_COUNT && (
        <button
          onClick={() => setShowAll((v) => !v)}
          className="mt-3 w-full rounded-xl border border-border py-2.5 text-sm font-medium hover:bg-muted"
        >
          {showAll ? "কম দেখান" : `সব দেখান (${toBanglaNumber(attempts.length)}টি)`}
        </button>
      )}
    </div>
  );
}