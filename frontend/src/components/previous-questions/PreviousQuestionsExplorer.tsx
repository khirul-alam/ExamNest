// frontend/src/components/previous-questions/PreviousQuestionsExplorer.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { RotateCcw, Search } from "lucide-react";
import { PreviousQuestionCard } from "@/components/subjects/PreviousQuestionCard";
import { ReportErrorModal } from "@/components/subjects/ReportErrorModal";
import { toBanglaDigits } from "@/lib/format";
import { getFrequency, type Frequency } from "@/lib/mcq";
import { examTypes, previousQuestions } from "@/lib/previous-questions-data";
import { toBanglaNumber } from "@/lib/pricing";
import { getSubject, getTopicRef } from "@/lib/subjects-data";

type FrequencyFilter = "all" | Frequency["level"];

const PAGE_SIZE = 10;

const frequencyOptions: { value: FrequencyFilter; label: string }[] = [
  { value: "all", label: "সব Frequency" },
  { value: "very", label: "🔥 অত্যন্ত গুরুত্বপূর্ণ (৫+ বার)" },
  { value: "important", label: "⭐ গুরুত্বপূর্ণ (৩-৪ বার)" },
  { value: "moderate", label: "📌 মাঝারি (১-২ বার)" },
];

// ফিল্টার তালিকার জন্য ডাটা থেকে অনন্য সাল ও বিষয় বের করা
const years = Array.from(new Set(previousQuestions.map((q) => q.year))).sort((a, b) => b - a);
const subjectSlugs = Array.from(new Set(previousQuestions.map((q) => q.subjectSlug)));

const selectClass =
  "w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm outline-none focus:border-primary";

export function PreviousQuestionsExplorer() {
  const [examType, setExamType] = useState("all");
  const [year, setYear] = useState("all");
  const [subject, setSubject] = useState("all");
  const [frequency, setFrequency] = useState<FrequencyFilter>("all");
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [reportTarget, setReportTarget] = useState<string | null>(null);

  // ফিল্টার বদলালে তালিকা আবার শুরু থেকে দেখানো হবে
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [examType, year, subject, frequency, search]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return previousQuestions
      .filter((q) => {
        if (examType !== "all" && q.examType !== examType) return false;
        if (year !== "all" && String(q.year) !== year) return false;
        if (subject !== "all" && q.subjectSlug !== subject) return false;
        if (frequency !== "all" && getFrequency(q.timesAsked).level !== frequency) return false;
        if (term) {
          const haystack = [q.question, ...q.options, q.explanation].join(" ").toLowerCase();
          if (!haystack.includes(term)) return false;
        }
        return true;
      })
      // নতুন সাল আগে, একই সালে বেশি বার আসা প্রশ্ন আগে
      .sort((a, b) => b.year - a.year || b.timesAsked - a.timesAsked);
  }, [examType, year, subject, frequency, search]);

  const shown = filtered.slice(0, visibleCount);
  const hasFilter =
    examType !== "all" || year !== "all" || subject !== "all" || frequency !== "all" || search !== "";

  const resetFilters = () => {
    setExamType("all");
    setYear("all");
    setSubject("all");
    setFrequency("all");
    setSearch("");
  };

  const chipClass = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-sm transition-colors ${
      active
        ? "border-primary bg-primary/10 text-primary"
        : "border-border hover:border-primary/50"
    }`;

  return (
    <div>
      {/* পরীক্ষার ধরন */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button onClick={() => setExamType("all")} className={chipClass(examType === "all")}>
          সব পরীক্ষা ({toBanglaNumber(previousQuestions.length)})
        </button>
        {examTypes.map((type) => (
          <button
            key={type}
            onClick={() => setExamType(type)}
            className={chipClass(examType === type)}
          >
            {type} ({toBanglaNumber(previousQuestions.filter((q) => q.examType === type).length)})
          </button>
        ))}
      </div>

      {/* সার্চ ও অন্যান্য ফিল্টার */}
      <div className="mb-6 grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative sm:col-span-2 lg:col-span-4">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="প্রশ্ন, অপশন বা ব্যাখ্যায় খুঁজুন..."
            aria-label="প্রশ্ন খুঁজুন"
            className={`${selectClass} pl-9`}
          />
        </div>

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          aria-label="সাল"
          className={selectClass}
        >
          <option value="all">সব সাল</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {toBanglaDigits(y)}
            </option>
          ))}
        </select>

        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          aria-label="বিষয়"
          className={`${selectClass} lg:col-span-2`}
        >
          <option value="all">সব বিষয়</option>
          {subjectSlugs.map((slug) => (
            <option key={slug} value={slug}>
              {getSubject(slug)?.name ?? slug}
            </option>
          ))}
        </select>

        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as FrequencyFilter)}
          aria-label="Frequency"
          className={selectClass}
        >
          {frequencyOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3 flex items-center justify-between text-sm text-muted-foreground">
        <span>{toBanglaNumber(filtered.length)}টি প্রশ্ন পাওয়া গেছে</span>
        {hasFilter && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-primary hover:underline"
          >
            <RotateCcw size={13} /> ফিল্টার মুছুন
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
          এই ফিল্টারে কোনো প্রশ্ন পাওয়া যায়নি।
        </div>
      ) : (
        <div className="space-y-4">
          {shown.map((q) => {
            const topicRef = q.topicSlug ? getTopicRef(q.subjectSlug, q.topicSlug) : null;
            return (
              <div key={q.id} className="overflow-hidden rounded-xl border border-border bg-card">
                <PreviousQuestionCard
                  question={{
                    id: q.id,
                    question: q.question,
                    options: q.options,
                    correctIndex: q.correctIndex,
                    explanation: q.explanation,
                    exam: `${q.examType} (ডেমো)`,
                    year: toBanglaDigits(q.year),
                    timesAsked: q.timesAsked,
                  }}
                  onReport={setReportTarget}
                />
                {/* সংশ্লিষ্ট বিষয় ও টপিকের লিংক */}
                <div className="border-t border-border bg-muted/50 px-4 py-2 text-xs text-muted-foreground">
                  বিষয়:{" "}
                  <Link
                    href={`/subjects/${q.subjectSlug}`}
                    className="text-primary hover:underline"
                  >
                    {getSubject(q.subjectSlug)?.name}
                  </Link>
                  {topicRef && (
                    <>
                      {" · "}টপিক:{" "}
                      <Link
                        href={`/subjects/${q.subjectSlug}/${topicRef.topic.slug}`}
                        className="text-primary hover:underline"
                      >
                        {topicRef.topic.name}
                      </Link>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filtered.length > visibleCount && (
        <button
          onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
          className="mt-6 w-full rounded-xl border border-border py-3 text-sm font-medium hover:bg-muted"
        >
          আরও দেখান
        </button>
      )}

      <ReportErrorModal
        open={reportTarget !== null}
        targetLabel={reportTarget ?? ""}
        onClose={() => setReportTarget(null)}
      />
    </div>
  );
}