// frontend/src/components/model-test/RecommendedPractice.tsx
"use client";

import { Clock, Lightbulb } from "lucide-react";
import { useStartSession } from "./useStartSession";
import type { Recommendation } from "@/lib/analytics";
import { sessionFromQuestionIds } from "@/lib/custom-test";
import { toBanglaNumber } from "@/lib/pricing";

const kindLabels: Record<Recommendation["kind"], { text: string; className: string }> = {
  weak: {
    text: "উন্নতি প্রয়োজন",
    className: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  },
  mistakes: {
    text: "ভুল পর্যালোচনা",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
  new: {
    text: "নতুন প্রশ্ন",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  },
};

export function RecommendedPractice({ items }: { items: Recommendation[] }) {
  const startSession = useStartSession();

  if (items.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
        এই মুহূর্তে কোনো পরামর্শ নেই। সব প্রশ্নে উত্তর দেওয়া হয়ে গেছে এবং ভুল করা প্রশ্নও নেই।
      </p>
    );
  }

  // অনুশীলন সাধারণ মোডে চলে (ফুলস্ক্রিন ছাড়া)
  const handleStart = (item: Recommendation) => {
    const session = sessionFromQuestionIds({
      title: item.title,
      mode: "practice",
      durationMin: item.durationMin,
      questionIds: item.questionIds,
    });
    if (session) startSession(session);
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item) => {
        const label = kindLabels[item.kind];
        return (
          <article key={item.id} className="flex flex-col rounded-xl border border-border bg-card p-5">
            <span
              className={`mb-3 inline-block w-fit rounded px-2 py-0.5 text-xs font-medium ${label.className}`}
            >
              {label.text}
            </span>
            <h3 className="mb-1 flex items-start gap-2 font-semibold leading-snug">
              <Lightbulb size={16} className="mt-0.5 shrink-0 text-accent" />
              {item.title}
            </h3>
            <p className="mb-3 text-sm text-muted-foreground">{item.reason}</p>
            <p className="mb-4 flex items-center gap-3 text-xs text-muted-foreground">
              <span>{toBanglaNumber(item.questionIds.length)}টি MCQ</span>
              <span className="flex items-center gap-1">
                <Clock size={12} /> {toBanglaNumber(item.durationMin)} মিনিট
              </span>
            </p>
            <button
              onClick={() => handleStart(item)}
              className="mt-auto rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              অনুশীলন শুরু করুন
            </button>
          </article>
        );
      })}
    </div>
  );
}