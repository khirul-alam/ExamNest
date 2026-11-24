// frontend/src/components/previous-questions/PyqExamList.tsx
"use client";

import Link from "next/link";
import { BookOpen, Lock, Play } from "lucide-react";
import { toBanglaDigits } from "@/lib/format";
import { toBanglaNumber } from "@/lib/pricing";
import type { PyqExam } from "@/lib/previous-questions-data";

type Props = {
  exams: PyqExam[];
  selectedExamId: string;
  canAct: boolean;
  showLock: boolean;
  readCount: (exam: PyqExam) => number;
  onRead: (examId: string) => void;
  onTake: (exam: PyqExam) => void;
};

export function PyqExamList({
  exams,
  selectedExamId,
  canAct,
  showLock,
  readCount,
  onRead,
  onTake,
}: Props) {
  if (exams.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
        এই ফিল্টারে কোনো পরীক্ষা পাওয়া যায়নি।
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {exams.map((exam) => {
        const total = exam.questionIds.length;
        const read = canAct ? readCount(exam) : 0;
        const percent = total ? Math.round((read / total) * 100) : 0;
        const selected = selectedExamId === exam.id;

        return (
          <article
            key={exam.id}
            className={`flex flex-col rounded-xl border bg-card p-4 ${
              selected ? "border-primary ring-1 ring-primary/40" : "border-border"
            }`}
          >
            <div className="mb-2 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="rounded bg-secondary px-2 py-0.5 font-mono text-secondary-foreground">
                {exam.organization}
              </span>
              <span className="rounded bg-muted px-2 py-0.5">{exam.post}</span>
              <span className="font-mono text-muted-foreground">{toBanglaDigits(exam.year)}</span>
            </div>

            <h4 className="mb-1 text-sm font-semibold leading-snug">{exam.name}</h4>
            <p className="mb-3 text-xs text-muted-foreground">
              {exam.kind} · {toBanglaNumber(total)}টি প্রশ্ন
            </p>

            {canAct && (
              <div className="mb-3">
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    পড়া {toBanglaNumber(read)}/{toBanglaNumber(total)}
                  </span>
                  <span className="font-mono font-bold text-primary">
                    {toBanglaNumber(percent)}%
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
                </div>
              </div>
            )}

            <div className="mt-auto flex gap-2">
              <button
                onClick={() => onRead(exam.id)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-muted"
              >
                <BookOpen size={13} /> {read > 0 && read < total ? "পড়া চালিয়ে যান" : "প্রশ্ন পড়ুন"}
              </button>

              {canAct ? (
                <button
                  onClick={() => onTake(exam)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:opacity-90"
                >
                  <Play size={13} /> পরীক্ষা দিন
                </button>
              ) : (
                <Link
                  href="/login"
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:opacity-90"
                >
                  <Play size={13} /> পরীক্ষা দিন
                  {showLock && <Lock size={11} aria-label="লগইন প্রয়োজন" />}
                </Link>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}