// frontend/src/components/subjects/PreviousQuestionCard.tsx
"use client";

import { CheckCircle2, Flag } from "lucide-react";
import { getFrequency, optionLabels } from "@/lib/mcq";
import { toBanglaNumber } from "@/lib/pricing";
import type { PreviousQuestion } from "@/lib/subjects-data";

type Props = {
  question: PreviousQuestion;
  onReport: (label: string) => void;
};

// বিগত বছরের একটি প্রশ্ন (উত্তর ও ব্যাখ্যাসহ, সরাসরি দেখানো হয়)
export function PreviousQuestionCard({ question: q, onReport }: Props) {
  const frequency = getFrequency(q.timesAsked);

  return (
    <div className="p-4">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="rounded bg-secondary px-2 py-0.5 font-mono text-xs font-medium text-secondary-foreground">
          {q.exam}
        </span>
        <span className="font-mono text-xs text-muted-foreground">{q.year}</span>
        <span className={`flex items-center gap-1 text-xs ${frequency.className}`}>
          {frequency.emoji} {frequency.label}
          <span className="text-muted-foreground">
            ({toBanglaNumber(q.timesAsked)} বার)
          </span>
        </span>
      </div>

      <p className="mb-3 text-sm">{q.question}</p>

      <div className="grid gap-1.5 sm:grid-cols-2">
        {q.options.map((option, index) => {
          const isCorrect = index === q.correctIndex;
          return (
            <div
              key={option}
              className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs ${
                isCorrect
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                  : "border-border text-muted-foreground"
              }`}
            >
              <span className="w-4 font-mono">{optionLabels[index]}.</span>
              {option}
              {isCorrect && <CheckCircle2 size={12} className="ml-auto" />}
            </div>
          );
        })}
      </div>

      <p className="mt-3 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
        <strong className="text-foreground">ব্যাখ্যা:</strong> {q.explanation}
      </p>

      <button
        type="button"
        onClick={() => onReport(q.question)}
        className="mt-2 flex items-center gap-1 text-xs text-red-500 hover:underline"
      >
        <Flag size={12} /> Report Error
      </button>
    </div>
  );
}