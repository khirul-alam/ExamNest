// frontend/src/components/previous-questions/PyqQuestionCard.tsx
"use client";

import Link from "next/link";
import { Bookmark, CheckCircle2, Circle, Flag } from "lucide-react";
import type { ExamQuestion } from "@/lib/exam-data";
import { toBanglaDigits } from "@/lib/format";
import { getFrequency, optionLabels } from "@/lib/mcq";
import type { QuestionSource } from "@/lib/previous-questions-data";
import { toBanglaNumber } from "@/lib/pricing";
import { getSubject, getTopicRef } from "@/lib/subjects-data";

type Props = {
  question: ExamQuestion;
  label: string;
  sources: QuestionSource[];
  isRead: boolean;
  isBookmarked: boolean;
  isWrong: boolean;
  canAct: boolean;
  onToggleRead: () => void;
  onToggleBookmark: () => void;
  onReport: (label: string) => void;
  onNeedLogin: () => void;
};

export function PyqQuestionCard({
  question: q,
  label,
  sources,
  isRead,
  isBookmarked,
  isWrong,
  canAct,
  onToggleRead,
  onToggleBookmark,
  onReport,
  onNeedLogin,
}: Props) {
  const frequency = getFrequency(sources.length);
  const topicRef = getTopicRef(q.subjectSlug, q.topicSlug);

  // লগইন ছাড়া পড়া/বুকমার্কের চেষ্টা করলে লগইনের অনুরোধ দেখানো হয়
  const guarded = (action: () => void) => () => (canAct ? action() : onNeedLogin());

  return (
    <article
      id={`pyq-${q.id}`}
      className={`scroll-mt-24 overflow-hidden rounded-xl border bg-card ${
        isRead ? "border-emerald-300 dark:border-emerald-900" : "border-border"
      }`}
    >
      <div className="p-4">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded bg-muted px-2 py-0.5 font-mono font-medium">{label}</span>
          <span className={`flex items-center gap-1 ${frequency.className}`}>
            {frequency.emoji} {frequency.label}
            <span className="text-muted-foreground">
              ({toBanglaNumber(sources.length)}টি পরীক্ষায়)
            </span>
          </span>
          {isRead && (
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={12} /> পড়া হয়েছে
            </span>
          )}
          {isWrong && (
            <span className="rounded bg-red-100 px-2 py-0.5 text-red-700 dark:bg-red-950 dark:text-red-300">
              আগে ভুল করেছেন
            </span>
          )}
        </div>

        <p className="mb-3 text-sm font-medium">{q.text}</p>

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

        {/* প্রশ্নের উৎস: একই প্রশ্ন একাধিক পরীক্ষায় এলে সবগুলো দেখানো হয় */}
        <div className="mt-3">
          <p className="mb-1 text-xs font-semibold">প্রশ্নের উৎস</p>
          <ul className="space-y-1">
            {sources.map((source) => (
              <li key={source.exam.id} className="text-xs text-muted-foreground">
                <span className="rounded bg-secondary px-1.5 py-0.5 font-mono text-secondary-foreground">
                  {source.exam.organization}
                </span>{" "}
                {source.exam.post} · {source.exam.kind} · {toBanglaDigits(source.exam.year)} ·
                প্রশ্ন নং {toBanglaNumber(source.order)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-muted/50 px-4 py-2">
        <p className="text-xs text-muted-foreground">
          বিষয়:{" "}
          <Link href={`/subjects/${q.subjectSlug}`} className="text-primary hover:underline">
            {getSubject(q.subjectSlug)?.name}
          </Link>
          {" · "}
          {topicRef ? (
            <Link
              href={`/subjects/${q.subjectSlug}/${q.topicSlug}`}
              className="text-primary hover:underline"
            >
              {q.topicName}
            </Link>
          ) : (
            q.topicName
          )}
        </p>

        <div className="flex items-center gap-1.5">
          <button
            onClick={guarded(onToggleRead)}
            aria-pressed={isRead}
            className={`flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
              isRead
                ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                : "border-border hover:bg-card"
            }`}
          >
            {isRead ? <CheckCircle2 size={13} /> : <Circle size={13} />}
            {isRead ? "পড়া হয়নি করুন" : "পড়া হয়েছে"}
          </button>
          <button
            onClick={guarded(onToggleBookmark)}
            aria-pressed={isBookmarked}
            aria-label="প্রশ্ন সংরক্ষণ"
            className={`rounded-lg border p-1.5 transition-colors ${
              isBookmarked
                ? "border-amber-500 text-amber-600"
                : "border-border text-muted-foreground hover:bg-card"
            }`}
          >
            <Bookmark size={13} fill={isBookmarked ? "currentColor" : "none"} />
          </button>
          <button
            onClick={() => onReport(q.text)}
            className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-xs text-red-500 hover:bg-card"
          >
            <Flag size={12} /> Report Error
          </button>
        </div>
      </div>
    </article>
  );
}