// frontend/src/components/previous-questions/PyqReadMode.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BookOpenCheck, Lock, Play, SkipForward } from "lucide-react";
import { PyqQuestionCard } from "./PyqQuestionCard";
import type { QuestionProgressApi } from "./useQuestionProgress";
import { getQuestionById } from "@/lib/exam-data";
import { getFrequency, type Frequency } from "@/lib/mcq";
import { getQuestionSources, type PyqExam } from "@/lib/previous-questions-data";
import { toBanglaNumber } from "@/lib/pricing";

type StatusFilter = "all" | "read" | "unread" | "bookmarked" | "wrong";
type FrequencyFilter = "all" | Frequency["level"];

const PAGE_SIZE = 10;

const statusOptions: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "সকল প্রশ্ন" },
  { id: "read", label: "পড়া হয়েছে" },
  { id: "unread", label: "পড়া হয়নি" },
  { id: "bookmarked", label: "Bookmark করা" },
  { id: "wrong", label: "ভুল উত্তর দেওয়া" },
];

const frequencyOptions: { value: FrequencyFilter; label: string }[] = [
  { value: "all", label: "সব Frequency" },
  { value: "very", label: "🔥 অত্যন্ত গুরুত্বপূর্ণ (৫+ পরীক্ষা)" },
  { value: "important", label: "⭐ গুরুত্বপূর্ণ (৩-৪ পরীক্ষা)" },
  { value: "moderate", label: "📌 মাঝারি (১-২ পরীক্ষা)" },
];

type Props = {
  ids: string[]; // ফিল্টার ও সার্চের পরের স্বতন্ত্র প্রশ্ন
  singleExam: PyqExam | null; // একটি পরীক্ষা বাছা থাকলে মূল প্রশ্নপত্রের ক্রমে নম্বর
  progress: QuestionProgressApi;
  wrongSet: Set<string>;
  canAct: boolean;
  showLock: boolean;
  onNeedLogin: () => void;
  onReport: (label: string) => void;
  onTakeWrong: (ids: string[]) => void;
};

const chipClass = (active: boolean) =>
  `rounded-full border px-3 py-1.5 text-sm transition-colors ${
    active ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50"
  }`;

export function PyqReadMode({
  ids,
  singleExam,
  progress,
  wrongSet,
  canAct,
  showLock,
  onNeedLogin,
  onReport,
  onTakeWrong,
}: Props) {
  const [status, setStatus] = useState<StatusFilter>("all");
  const [frequency, setFrequency] = useState<FrequencyFilter>("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [confirmAll, setConfirmAll] = useState(false);
  const [scrollTarget, setScrollTarget] = useState<string | null>(null);

  // ফিল্টার বদলালে তালিকা আবার শুরু থেকে দেখানো হবে
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    setConfirmAll(false);
  }, [ids, status, frequency]);

  // "Continue Reading": প্রথম অপঠিত প্রশ্ন দেখানোর পর সেখানে স্ক্রল
  useEffect(() => {
    if (!scrollTarget) return;
    document.getElementById(`pyq-${scrollTarget}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    setScrollTarget(null);
  }, [scrollTarget]);

  // লগইন ছাড়া শুধু "সকল প্রশ্ন" দেখা যায়
  const effectiveStatus: StatusFilter = canAct ? status : "all";

  // Frequency ফিল্টার করা পরিধি: পড়ার অগ্রগতি এই পরিধির ওপর হিসাব হয়
  const scope = useMemo(
    () =>
      ids.filter(
        (id) =>
          frequency === "all" || getFrequency(getQuestionSources(id).length).level === frequency,
      ),
    [ids, frequency],
  );

  const readCount = scope.filter((id) => progress.isRead(id)).length;
  const unreadCount = scope.length - readCount;
  const percent = scope.length ? Math.round((readCount / scope.length) * 100) : 0;

  const listIds = scope.filter((id) => {
    if (effectiveStatus === "read") return progress.isRead(id);
    if (effectiveStatus === "unread") return !progress.isRead(id);
    if (effectiveStatus === "bookmarked") return progress.isBookmarked(id);
    if (effectiveStatus === "wrong") return wrongSet.has(id);
    return true;
  });

  const handleContinue = () => {
    const index = listIds.findIndex((id) => !progress.isRead(id));
    if (index === -1) return;
    setVisibleCount((count) => Math.max(count, index + 1));
    setScrollTarget(listIds[index]);
  };

  // সবগুলো "পড়া হয়েছে" করতে দুবার চাপতে হয় (ভুল করে চাপা ঠেকাতে)
  const handleMarkAll = () => {
    if (!confirmAll) {
      setConfirmAll(true);
      return;
    }
    progress.setReadMany(scope, true);
    setConfirmAll(false);
  };

  const labelFor = (id: string, index: number) => {
    if (singleExam) {
      const order = singleExam.questionIds.indexOf(id) + 1;
      return `প্রশ্ন ${String(order).padStart(2, "0").replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)])}`;
    }
    return `#${toBanglaNumber(index + 1)}`;
  };

  return (
    <div>
      {/* পড়ার অগ্রগতি */}
      {canAct ? (
        <div className="mb-4 rounded-xl border border-border bg-card p-4">
          <div className="mb-3 grid grid-cols-3 gap-3 text-center">
            {[
              { label: "পড়া হয়েছে", value: readCount, color: "text-emerald-600" },
              { label: "পড়া বাকি", value: unreadCount, color: "text-amber-600" },
              { label: "মোট প্রশ্ন", value: scope.length, color: "text-foreground" },
            ].map((item) => (
              <div key={item.label} className="rounded-lg bg-muted py-2">
                <p className={`font-mono text-xl font-bold ${item.color}`}>
                  {toBanglaNumber(item.value)}
                </p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">পড়াশোনার অগ্রগতি</span>
            <span className="font-mono font-bold text-primary">{toBanglaNumber(percent)}%</span>
          </div>
          <div className="mb-3 h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${percent}%` }} />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleContinue}
              disabled={!listIds.some((id) => !progress.isRead(id))}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <SkipForward size={14} /> Continue Reading
            </button>
            <button
              onClick={handleMarkAll}
              disabled={scope.length === 0 || unreadCount === 0}
              className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              <BookOpenCheck size={14} />
              {confirmAll ? "নিশ্চিত? আবার চাপুন" : "Mark All as Read"}
            </button>
            {effectiveStatus === "wrong" && listIds.length > 0 && (
              <button
                onClick={() => onTakeWrong(listIds)}
                className="flex items-center gap-1.5 rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10"
              >
                <Play size={14} /> এই ভুল প্রশ্নগুলো নিয়ে পরীক্ষা দিন
              </button>
            )}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            প্রশ্ন স্ক্রিনে দেখা গেলেই &quot;পড়া&quot; ধরা হয় না। প্রতিটি প্রশ্ন পড়ার পর নিজে চিহ্নিত
            করুন।
          </p>
        </div>
      ) : (
        showLock && (
          <p className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
            <Lock size={14} /> পড়ার অগ্রগতি, বুকমার্ক ও ভুল প্রশ্নের তালিকা পেতে
            <Link href="/login" className="font-medium text-primary hover:underline">
              লগইন করুন
            </Link>
          </p>
        )
      )}

      {/* ফিল্টার */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {(canAct ? statusOptions : statusOptions.slice(0, 1)).map((option) => (
          <button
            key={option.id}
            onClick={() => setStatus(option.id)}
            aria-pressed={effectiveStatus === option.id}
            className={chipClass(effectiveStatus === option.id)}
          >
            {option.label}
          </button>
        ))}
        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as FrequencyFilter)}
          aria-label="Frequency"
          className="ml-auto rounded-lg border border-border bg-muted px-3 py-1.5 text-sm outline-none focus:border-primary"
        >
          {frequencyOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {listIds.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
          এই ফিল্টারে কোনো প্রশ্ন পাওয়া যায়নি।
        </div>
      ) : (
        <div className="space-y-4">
          {listIds.slice(0, visibleCount).map((id, index) => {
            const question = getQuestionById(id);
            if (!question) return null;
            return (
              <PyqQuestionCard
                key={id}
                question={question}
                label={labelFor(id, index)}
                sources={getQuestionSources(id)}
                isRead={canAct && progress.isRead(id)}
                isBookmarked={canAct && progress.isBookmarked(id)}
                isWrong={canAct && wrongSet.has(id)}
                canAct={canAct}
                onToggleRead={() => progress.toggleRead(id)}
                onToggleBookmark={() => progress.toggleBookmark(id)}
                onReport={onReport}
                onNeedLogin={onNeedLogin}
              />
            );
          })}
        </div>
      )}

      {listIds.length > visibleCount && (
        <button
          onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
          className="mt-6 w-full rounded-xl border border-border py-3 text-sm font-medium hover:bg-muted"
        >
          আরও দেখান ({toBanglaNumber(listIds.length - visibleCount)}টি বাকি)
        </button>
      )}
    </div>
  );
}