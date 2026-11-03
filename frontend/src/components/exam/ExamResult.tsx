// frontend/src/components/exam/ExamResult.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { BookOpen, CheckCircle2, Flag, SkipForward, XCircle } from "lucide-react";
import { ReportErrorModal } from "@/components/subjects/ReportErrorModal";
import { getQuestionById } from "@/lib/exam-data";
import { evaluate, formatClock, MAX_VIOLATIONS, PASS_PERCENT, type ExamSession } from "@/lib/exam-utils";
import { optionLabels } from "@/lib/mcq";
import { toBanglaNumber } from "@/lib/pricing";
import { getSubject, getTopicRef } from "@/lib/subjects-data";

export type FinishReason = "manual" | "time" | "violation";

type Props = {
  session: ExamSession;
  reason: FinishReason;
  finishedAt: number;
  onRetry: () => void;
};

// শতকরা অনুযায়ী মূল্যায়নের স্তর
const benchmarks = [
  { min: 0, range: "৬০%-এর নিচে", label: "আরও অনুশীলন করুন", color: "#dc2626" },
  { min: 60, range: "৬০%–৬৯%", label: "পাশ", color: "#0891b2" },
  { min: 70, range: "৭০%–৭৯%", label: "ভালো", color: "#2563eb" },
  { min: 80, range: "৮০%–৮৯%", label: "খুব ভালো", color: "#d97706" },
  { min: 90, range: "৯০%+", label: "অসাধারণ", color: "#0d6e4f" },
];

type Filter = "all" | "wrong" | "skipped";

export function ExamResult({ session, reason, finishedAt, onRetry }: Props) {
  const stats = evaluate(session);
  const [filter, setFilter] = useState<Filter>("all");
  const [reportTarget, setReportTarget] = useState<string | null>(null);

  const spentSec = Math.min(
    session.durationSec,
    Math.round((finishedAt - session.startedAt) / 1000),
  );
  const currentLevel = [...benchmarks].reverse().find((b) => stats.percent >= b.min)!;

  const cards = [
    { label: "সঠিক", value: toBanglaNumber(stats.correct), icon: "✅", className: "text-emerald-600" },
    { label: "ভুল", value: toBanglaNumber(stats.wrong), icon: "❌", className: "text-red-600" },
    { label: "Skip", value: toBanglaNumber(stats.skipped), icon: "⏭", className: "text-muted-foreground" },
    { label: "শতকরা", value: `${toBanglaNumber(stats.percent)}%`, icon: "📊", className: "text-primary" },
    { label: "সময় লেগেছে", value: formatClock(spentSec), icon: "⏱", className: "text-foreground" },
    { label: "র‍্যাঙ্ক", value: "—", icon: "🏅", className: "text-muted-foreground" },
  ];

  const visible = session.questions.filter((instance) => {
    const q = getQuestionById(instance.id);
    if (!q) return false;
    const chosen = session.answers[instance.id];
    if (filter === "wrong") return chosen !== undefined && chosen !== q.correctIndex;
    if (filter === "skipped") return chosen === undefined;
    return true;
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {reason !== "manual" && (
        <p className="mb-4 rounded-lg border border-accent/40 bg-accent/10 px-4 py-2.5 text-sm">
          {reason === "time"
            ? "সময় শেষ হওয়ায় পরীক্ষা স্বয়ংক্রিয়ভাবে জমা হয়েছে।"
            : `নিয়ম লঙ্ঘনের সীমা (${toBanglaNumber(MAX_VIOLATIONS)} বার) পার হওয়ায় পরীক্ষা স্বয়ংক্রিয়ভাবে জমা হয়েছে।`}
        </p>
      )}

      {/* ফলাফলের সারাংশ */}
      <div className="mb-6 rounded-xl border border-border bg-card p-6 text-center">
        <div className="mb-3 text-5xl">{stats.passed ? "🎉" : "😔"}</div>
        <h1
          className={`font-display text-2xl font-bold ${stats.passed ? "text-primary" : "text-red-600"}`}
        >
          {stats.passed ? "অভিনন্দন! আপনি উত্তীর্ণ" : "আরও চেষ্টা করুন"}
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">{session.title}</p>
        <div className="my-4 font-mono text-4xl font-bold">
          {toBanglaNumber(Math.round(stats.score * 100) / 100)} / {toBanglaNumber(stats.total)}
        </div>
        <p className="text-xs text-muted-foreground">
          পাস মার্ক {toBanglaNumber(PASS_PERCENT)}% · র‍্যাঙ্ক সার্ভারে ফলাফল জমা হওয়ার পর দেখা যাবে
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {cards.map((item) => (
            <div key={item.label} className="rounded-lg bg-muted p-3">
              <div className="mb-1 text-lg">{item.icon}</div>
              <div className={`font-mono text-xl font-bold ${item.className}`}>{item.value}</div>
              <div className="text-xs text-muted-foreground">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* মূল্যায়ন নির্দেশিকা */}
      <section className="mb-6 rounded-xl border border-border bg-card p-5">
        <h2 className="mb-3 font-display font-bold">ফলাফল মূল্যায়ন নির্দেশিকা</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {benchmarks.map((b) => {
            const isCurrent = b.label === currentLevel.label;
            return (
              <div
                key={b.label}
                className="rounded-xl border p-3 text-center"
                style={{
                  borderColor: isCurrent ? b.color : "var(--border)",
                  backgroundColor: isCurrent ? `${b.color}14` : "transparent",
                }}
              >
                <p className="font-mono text-xs font-bold" style={{ color: b.color }}>
                  {b.range}
                </p>
                <p className="mt-1 text-sm font-semibold">{b.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* বিস্তারিত সমাধান */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display font-bold">বিস্তারিত সমাধান</h2>
        <div className="flex gap-1.5">
          {(
            [
              { id: "all", label: "সব" },
              { id: "wrong", label: "ভুল" },
              { id: "skipped", label: "Skip" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`rounded-full border px-3 py-1 text-xs ${
                filter === tab.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {visible.length === 0 && (
          <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            এই তালিকায় কোনো প্রশ্ন নেই।
          </p>
        )}
        {visible.map((instance) => {
          const q = getQuestionById(instance.id)!;
          const number = session.questions.findIndex((i) => i.id === instance.id) + 1;
          const chosen = session.answers[instance.id];
          const skipped = chosen === undefined;
          const correct = chosen === q.correctIndex;
          const topicRef = getTopicRef(q.subjectSlug, q.topicSlug);

          return (
            <div key={instance.id} className="rounded-xl border border-border bg-card p-4">
              <div className="mb-3 flex items-start gap-2">
                <span className="mt-0.5 shrink-0">
                  {skipped ? (
                    <SkipForward size={16} className="text-muted-foreground" />
                  ) : correct ? (
                    <CheckCircle2 size={16} className="text-emerald-600" />
                  ) : (
                    <XCircle size={16} className="text-red-600" />
                  )}
                </span>
                <p className="text-sm">
                  <span className="mr-2 font-mono font-bold">{toBanglaNumber(number)}.</span>
                  {q.text}
                </p>
              </div>

              <div className="mb-3 grid gap-2 sm:grid-cols-2">
                {q.options.map((option, index) => {
                  const isAnswer = index === q.correctIndex;
                  const isWrongChoice = index === chosen && !correct;
                  return (
                    <div
                      key={option}
                      className={`rounded-lg border px-3 py-2 text-sm ${
                        isAnswer
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                          : isWrongChoice
                            ? "border-red-500 bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300"
                            : "border-border text-muted-foreground"
                      }`}
                    >
                      <span className="mr-2 font-mono">{optionLabels[index]}.</span>
                      {option}
                      {isAnswer && <CheckCircle2 size={13} className="ml-1 inline" />}
                      {isWrongChoice && <span className="ml-1 text-xs">(আপনার উত্তর)</span>}
                    </div>
                  );
                })}
              </div>

              <div className="space-y-1.5 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
                <p>
                  <strong className="text-foreground">ব্যাখ্যা:</strong> {q.explanation}
                </p>
                {q.bookReference && (
                  <p>
                    <strong className="text-foreground">বই রেফারেন্স:</strong> {q.bookReference}
                  </p>
                )}
                <p className="flex flex-wrap items-center gap-1">
                  <BookOpen size={12} />
                  <strong className="text-foreground">সংশ্লিষ্ট টপিক:</strong>{" "}
                  {getSubject(q.subjectSlug)?.name} ·{" "}
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
              </div>

              <button
                onClick={() => setReportTarget(q.text)}
                className="mt-2 flex items-center gap-1 text-xs text-red-500 hover:underline"
              >
                <Flag size={12} /> Report Error
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={onRetry}
          className="flex-1 rounded-xl bg-primary py-3 font-semibold text-primary-foreground hover:opacity-90"
        >
          আবার পরীক্ষা দিন
        </button>
        <Link
          href="/model-test"
          className="flex-1 rounded-xl border border-border py-3 text-center font-semibold hover:bg-muted"
        >
          মডেল টেস্ট তালিকা
        </Link>
      </div>

      <ReportErrorModal
        open={reportTarget !== null}
        targetLabel={reportTarget ?? ""}
        onClose={() => setReportTarget(null)}
      />
    </div>
  );
}