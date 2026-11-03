// frontend/src/components/exam/ExamRunning.tsx
"use client";

import { useState } from "react";
import { AlertTriangle, ChevronLeft, ChevronRight, Clock, Flag, Maximize } from "lucide-react";
import { QuestionPalette } from "./QuestionPalette";
import { getQuestionById } from "@/lib/exam-data";
import { formatClock, MAX_VIOLATIONS, type ExamSession } from "@/lib/exam-utils";
import { optionLabels } from "@/lib/mcq";
import { toBanglaNumber } from "@/lib/pricing";
import { getSubject } from "@/lib/subjects-data";

type Props = {
  session: ExamSession;
  remainingSec: number;
  toast: string | null;
  needFullscreen: boolean;
  onEnterFullscreen: () => void;
  onSelect: (questionId: string, originalIndex: number | null) => void;
  onToggleFlag: (questionId: string) => void;
  onGo: (index: number) => void;
  onSubmit: () => void;
};

export function ExamRunning({
  session,
  remainingSec,
  toast,
  needFullscreen,
  onEnterFullscreen,
  onSelect,
  onToggleFlag,
  onGo,
  onSubmit,
}: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const instance = session.questions[session.current];
  const question = getQuestionById(instance.id);
  if (!question) return null;

  const total = session.questions.length;
  const answeredCount = Object.keys(session.answers).length;
  const chosen = session.answers[question.id];
  const isFlagged = session.flags.includes(question.id);
  const timePercent = (remainingSec / session.durationSec) * 100;
  const lowTime = remainingSec < 60;

  return (
    // select-none: লেখা নির্বাচন (Copy) কঠিন করে
    <div className="mx-auto max-w-5xl select-none px-4 py-4">
      {/* সতর্কতার বার্তা */}
      {toast && (
        <div
          role="alert"
          className="fixed left-1/2 top-20 z-50 flex -translate-x-1/2 items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm text-white shadow-lg"
        >
          <AlertTriangle size={16} />
          {toast} ({toBanglaNumber(session.violations)}/{toBanglaNumber(MAX_VIOLATIONS)})
        </div>
      )}

      {/* ফুলস্ক্রিনে ফেরার বাধ্যতামূলক পর্দা (মডেল টেস্ট) */}
      {needFullscreen && (
        <div className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-background/95 px-6 text-center">
          <Maximize size={40} className="mb-4 text-primary" />
          <h2 className="mb-2 font-display text-xl font-bold">ফুলস্ক্রিন মোড প্রয়োজন</h2>
          <p className="mb-5 max-w-sm text-sm text-muted-foreground">
            মডেল টেস্ট চালিয়ে যেতে ফুলস্ক্রিনে ফিরে যান। আপনার সময় চলছে।
          </p>
          <button
            onClick={onEnterFullscreen}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground"
          >
            ফুলস্ক্রিনে ফিরে যান
          </button>
        </div>
      )}

      {/* উপরের বার: প্রশ্ন নম্বর, টাইমার, জমা দিন */}
      <div className="mb-4">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
          <span className="font-mono text-sm text-muted-foreground">
            প্রশ্ন {toBanglaNumber(session.current + 1)} / {toBanglaNumber(total)} · উত্তর দেওয়া{" "}
            {toBanglaNumber(answeredCount)}
          </span>
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 font-mono text-sm font-bold ${
                lowTime ? "bg-red-50 text-red-600 dark:bg-red-950/40" : "bg-muted"
              }`}
              aria-label="অবশিষ্ট সময়"
            >
              <Clock size={15} /> {formatClock(remainingSec)}
            </div>
            <button
              onClick={() => setConfirmOpen(true)}
              className="rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              জমা দিন
            </button>
          </div>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full rounded-full transition-all ${lowTime ? "bg-red-600" : "bg-primary"}`}
            style={{ width: `${timePercent}%` }}
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* প্রশ্ন */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {getSubject(question.subjectSlug)?.name ?? "সাধারণ"}
              </span>
              <button
                onClick={() => onToggleFlag(question.id)}
                aria-pressed={isFlagged}
                className={`flex items-center gap-1.5 rounded-lg border px-2 py-1 text-xs font-medium transition-colors ${
                  isFlagged
                    ? "border-amber-500 bg-amber-50 text-amber-600 dark:bg-amber-950/30"
                    : "border-border text-muted-foreground"
                }`}
              >
                <Flag size={12} /> {isFlagged ? "Review Later ✔" : "Review Later"}
              </button>
            </div>

            <p className="mb-5 text-base">
              <span className="mr-2 font-mono font-bold">{toBanglaNumber(session.current + 1)}.</span>
              {question.text}
            </p>

            <div className="space-y-2.5">
              {instance.optionOrder.map((originalIndex, position) => {
                const selected = chosen === originalIndex;
                return (
                  <button
                    key={originalIndex}
                    onClick={() => onSelect(question.id, originalIndex)}
                    className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                      selected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 font-mono text-xs font-bold ${
                        selected ? "border-primary bg-primary text-white" : "border-border"
                      }`}
                    >
                      {optionLabels[position]}
                    </span>
                    {question.options[originalIndex]}
                  </button>
                );
              })}
            </div>

            {chosen !== undefined && (
              <button
                onClick={() => onSelect(question.id, null)}
                className="mt-3 text-xs text-muted-foreground hover:underline"
              >
                উত্তর মুছে ফেলুন
              </button>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => onGo(session.current - 1)}
              disabled={session.current === 0}
              className="flex items-center gap-1 rounded-lg border border-border px-4 py-2 text-sm disabled:opacity-40"
            >
              <ChevronLeft size={16} /> আগের প্রশ্ন
            </button>
            <button
              onClick={() => onGo(session.current + 1)}
              disabled={session.current === total - 1}
              className="flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-40"
            >
              পরের প্রশ্ন <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* প্যালেট */}
        <QuestionPalette
          questions={session.questions}
          answers={session.answers}
          flags={session.flags}
          current={session.current}
          onGo={onGo}
        />
      </div>

      {/* জমা দেওয়ার নিশ্চিতকরণ */}
      {confirmOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setConfirmOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-xl border border-border bg-card p-5"
          >
            <h3 className="mb-3 font-semibold">পরীক্ষা জমা দেবেন?</h3>
            <ul className="mb-4 space-y-1 text-sm text-muted-foreground">
              <li>🟢 উত্তর দিয়েছেন: {toBanglaNumber(answeredCount)}টি</li>
              <li>⚪ উত্তর দেননি: {toBanglaNumber(total - answeredCount)}টি</li>
              <li>🟡 Review Later: {toBanglaNumber(session.flags.length)}টি</li>
            </ul>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmOpen(false)}
                className="flex-1 rounded-lg border border-border py-2 text-sm"
              >
                ফিরে যান
              </button>
              <button
                onClick={onSubmit}
                className="flex-1 rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground"
              >
                হ্যাঁ, জমা দিন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}