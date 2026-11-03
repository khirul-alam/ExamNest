// frontend/src/components/subjects/PracticeMcq.tsx
"use client";

import { useState } from "react";
import { CheckCircle2, Flag, XCircle } from "lucide-react";
import { optionLabels } from "@/lib/mcq";
import { toBanglaNumber } from "@/lib/pricing";
import type { PracticeQuestion } from "@/lib/subjects-data";

type Props = {
  questions: PracticeQuestion[];
  onReport: (label: string) => void;
};

export function PracticeMcq({ questions, onReport }: Props) {
  // প্রশ্নের আইডি অনুযায়ী বেছে নেওয়া অপশনের ইনডেক্স
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const answeredCount = Object.keys(answers).length;
  const correctCount = questions.filter((q) => answers[q.id] === q.correctIndex).length;

  const choose = (questionId: string, optionIndex: number) => {
    // একবার উত্তর দিলে আর বদলানো যাবে না
    if (answers[questionId] !== undefined) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  return (
    <div className="divide-y divide-border">
      {questions.map((q, qi) => {
        const chosen = answers[q.id];
        const answered = chosen !== undefined;

        return (
          <div key={q.id} className="p-4">
            <p className="mb-3 text-sm font-semibold">
              {toBanglaNumber(qi + 1)}. {q.question}
            </p>

            <div className="grid gap-2 sm:grid-cols-2">
              {q.options.map((option, oi) => {
                const isCorrect = oi === q.correctIndex;
                const isChosen = chosen === oi;

                let style = "border-border hover:border-primary/50";
                if (answered && isCorrect) {
                  style =
                    "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
                } else if (answered && isChosen) {
                  style =
                    "border-red-500 bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300";
                } else if (answered) {
                  style = "border-border text-muted-foreground";
                }

                return (
                  <button
                    key={option}
                    type="button"
                    disabled={answered}
                    onClick={() => choose(q.id, oi)}
                    className={`flex items-center rounded-lg border px-3 py-2 text-left text-sm transition-colors ${style}`}
                  >
                    <span className="mr-2 font-mono">{optionLabels[oi]}.</span>
                    {option}
                    {answered && isCorrect && <CheckCircle2 size={14} className="ml-auto" />}
                    {answered && isChosen && !isCorrect && (
                      <XCircle size={14} className="ml-auto" />
                    )}
                  </button>
                );
              })}
            </div>

            {answered && (
              <p className="mt-3 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
                <strong className="text-foreground">ব্যাখ্যা:</strong> {q.explanation}
              </p>
            )}

            <button
              type="button"
              onClick={() => onReport(q.question)}
              className="mt-2 flex items-center gap-1 text-xs text-red-500 hover:underline"
            >
              <Flag size={12} /> Report Error
            </button>
          </div>
        );
      })}

      {/* সব উত্তর দেওয়া হলে ফলাফল */}
      {answeredCount === questions.length && questions.length > 0 && (
        <div className="bg-primary/10 p-4 text-center text-sm font-medium text-primary">
          আপনার স্কোর: {toBanglaNumber(correctCount)} / {toBanglaNumber(questions.length)}
        </div>
      )}
    </div>
  );
}