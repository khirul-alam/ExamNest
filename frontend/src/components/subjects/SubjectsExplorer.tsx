// frontend/src/components/subjects/SubjectsExplorer.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, FileText, Lock, RotateCcw, Search } from "lucide-react";
import { useAuthPreview } from "@/components/providers/AuthPreviewProvider";
import { useStudyProgress } from "@/components/providers/StudyProgressPreviewProvider";
import { toBanglaNumber } from "@/lib/pricing";
import { getSubjectModelTest } from "@/lib/subject-model-test";
import {
  getSubjectProgress,
  type ProgressStatus,
  type SubjectProgress,
} from "@/lib/subject-progress";
import { getSubjectStats } from "@/lib/subject-stats";
import { allSubjects, type Subject } from "@/lib/subjects-data";

type ContentFilter = "all" | "available" | "coming" | "model-test";
type ProgressFilter = "all" | ProgressStatus;
type SortKey = "default" | "name" | "mcq" | "topics" | "progress";

// ডাটা থেকে একবারই হিসাব করা তথ্য (ব্যবহারকারীর অবস্থার ওপর নির্ভর করে না)
const subjectInfos = allSubjects.map((subject) => ({
  subject,
  stats: getSubjectStats(subject),
  modelTest: getSubjectModelTest(subject.slug),
}));

type Row = (typeof subjectInfos)[number] & {
  progress: SubjectProgress | null;
  hits: string[]; // সার্চে যেসব অধ্যায়/টপিকের নাম মিলেছে
};

const progressLabels: Record<ProgressStatus, { text: string; className: string }> = {
  "not-started": { text: "শুরু হয়নি", className: "bg-muted text-muted-foreground" },
  "in-progress": {
    text: "চলছে",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
  completed: {
    text: "সম্পন্ন ✔",
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  },
};

// সার্চ শব্দ বিষয়ের নাম, অধ্যায় বা টপিকের নামে মেলে কিনা দেখা
function getSearchMatch(subject: Subject, term: string): { matched: boolean; hits: string[] } {
  if (subject.name.toLowerCase().includes(term)) return { matched: true, hits: [] };

  const hits: string[] = [];
  for (const chapter of subject.chapters) {
    if (chapter.name.toLowerCase().includes(term)) hits.push(chapter.name);
    for (const topic of chapter.topics) {
      if (topic.name.toLowerCase().includes(term)) hits.push(topic.name);
    }
  }
  return { matched: hits.length > 0, hits };
}

const chipClass = (active: boolean) =>
  `rounded-full border px-3 py-1.5 text-sm transition-colors ${
    active
      ? "border-primary bg-primary/10 text-primary"
      : "border-border hover:border-primary/50"
  }`;

export function SubjectsExplorer() {
  const { isLoggedIn, isReady } = useAuthPreview();
  const studyProgress = useStudyProgress();

  const [search, setSearch] = useState("");
  const [content, setContent] = useState<ContentFilter>("all");
  const [progressFilter, setProgressFilter] = useState<ProgressFilter>("all");
  const [sort, setSort] = useState<SortKey>("default");

  // লগইন না থাকলে Progress-সংক্রান্ত অপশন কাজ করবে না
  const showProgress = isReady && isLoggedIn;
  const effectiveProgressFilter: ProgressFilter = showProgress ? progressFilter : "all";
  const effectiveSort: SortKey = sort === "progress" && !showProgress ? "default" : sort;

  const term = search.trim().toLowerCase();

  // প্রতিটি বিষয়ের সাথে অগ্রগতি ও সার্চের মিল যুক্ত করা
  const allRows: Row[] = subjectInfos.map((info) => ({
    ...info,
    progress: showProgress ? getSubjectProgress(info.subject, studyProgress.isCompleted) : null,
    hits: term ? getSearchMatch(info.subject, term).hits : [],
  }));

  const filtered = allRows.filter((row) => {
    if (term && !getSearchMatch(row.subject, term).matched) return false;
    if (content === "available" && row.stats.topics === 0) return false;
    if (content === "coming" && row.stats.topics > 0) return false;
    if (content === "model-test" && !row.modelTest.available) return false;
    if (effectiveProgressFilter !== "all") {
      if (!row.progress || row.progress.total === 0) return false;
      if (row.progress.status !== effectiveProgressFilter) return false;
    }
    return true;
  });

  // কনটেন্টবিহীন বিষয়কে অগ্রগতির সাজে সবার শেষে রাখা হয়
  const progressRank = (row: Row) =>
    row.progress && row.progress.total > 0 ? row.progress.percent : -1;

  const rows = [...filtered];
  if (effectiveSort === "name") {
    rows.sort((a, b) => a.subject.name.localeCompare(b.subject.name, "bn"));
  } else if (effectiveSort === "mcq") {
    rows.sort((a, b) => b.stats.mcq - a.stats.mcq);
  } else if (effectiveSort === "topics") {
    rows.sort((a, b) => b.stats.topics - a.stats.topics);
  } else if (effectiveSort === "progress") {
    rows.sort((a, b) => progressRank(b) - progressRank(a));
  }

  // সামগ্রিক অগ্রগতি (সব বিষয় মিলিয়ে, ফিল্টার ছাড়া)
  const totalTopics = allRows.reduce((sum, row) => sum + row.stats.topics, 0);
  const doneTopics = allRows.reduce((sum, row) => sum + (row.progress?.done ?? 0), 0);
  const overallPercent = totalTopics ? Math.round((doneTopics / totalTopics) * 100) : 0;

  const hasFilter =
    term !== "" || content !== "all" || progressFilter !== "all" || sort !== "default";

  const resetFilters = () => {
    setSearch("");
    setContent("all");
    setProgressFilter("all");
    setSort("default");
  };

  const contentOptions: { id: ContentFilter; label: string; count: number }[] = [
    { id: "all", label: "সব বিষয়", count: subjectInfos.length },
    {
      id: "available",
      label: "কনটেন্ট আছে",
      count: subjectInfos.filter((i) => i.stats.topics > 0).length,
    },
    {
      id: "coming",
      label: "শীঘ্রই আসছে",
      count: subjectInfos.filter((i) => i.stats.topics === 0).length,
    },
    {
      id: "model-test",
      label: "মডেল টেস্ট আছে",
      count: subjectInfos.filter((i) => i.modelTest.available).length,
    },
  ];

  const progressOptions: { id: ProgressFilter; label: string }[] = [
    { id: "all", label: "সব অবস্থা" },
    { id: "not-started", label: "শুরু হয়নি" },
    { id: "in-progress", label: "চলছে" },
    { id: "completed", label: "সম্পন্ন" },
  ];

  return (
    <div>
      {/* সামগ্রিক অগ্রগতি অথবা লগইনের আমন্ত্রণ */}
      {showProgress ? (
        <div className="mb-6 rounded-xl border border-border bg-card p-4">
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="font-medium">আপনার সামগ্রিক অগ্রগতি</span>
            <span className="font-mono text-xs text-muted-foreground">
              {toBanglaNumber(doneTopics)}/{toBanglaNumber(totalTopics)} টপিক ·{" "}
              <span className="font-bold text-primary">{toBanglaNumber(overallPercent)}%</span>
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
        </div>
      ) : (
        isReady && (
          <p className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
            <Lock size={14} /> বিষয়ভিত্তিক অগ্রগতি দেখতে ও মডেল টেস্ট দিতে
            <Link href="/login" className="font-medium text-primary hover:underline">
              লগইন করুন
            </Link>
            অথবা
            <Link href="/register" className="font-medium text-primary hover:underline">
              ফ্রি অ্যাকাউন্ট খুলুন
            </Link>
          </p>
        )
      )}

      {/* সার্চ ও সাজানো */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="বিষয়, অধ্যায় বা টপিক খুঁজুন..."
            aria-label="বিষয় খুঁজুন"
            className="w-full rounded-lg border border-border bg-muted py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>

        <select
          value={effectiveSort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          aria-label="সাজান"
          className="rounded-lg border border-border bg-muted px-3 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="default">ডিফল্ট ক্রম</option>
          <option value="name">নাম অনুযায়ী</option>
          <option value="mcq">বেশি MCQ আগে</option>
          <option value="topics">বেশি টপিক আগে</option>
          {showProgress && <option value="progress">বেশি অগ্রগতি আগে</option>}
        </select>
      </div>

      {/* ফিল্টার */}
      <div className="mb-3 flex flex-wrap gap-2">
        {contentOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setContent(option.id)}
            aria-pressed={content === option.id}
            className={chipClass(content === option.id)}
          >
            {option.label} ({toBanglaNumber(option.count)})
          </button>
        ))}
      </div>

      {showProgress && (
        <div className="mb-3 flex flex-wrap gap-2">
          {progressOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setProgressFilter(option.id)}
              aria-pressed={progressFilter === option.id}
              className={chipClass(progressFilter === option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
        <span>{toBanglaNumber(rows.length)}টি বিষয় পাওয়া গেছে</span>
        {hasFilter && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-primary hover:underline"
          >
            <RotateCcw size={13} /> ফিল্টার মুছুন
          </button>
        )}
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
          কোনো বিষয় পাওয়া যায়নি।
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map(({ subject, stats, modelTest, progress, hits }) => {
            const hasContent = stats.topics > 0;
            const progressLabel = progress ? progressLabels[progress.status] : null;

            // অগ্রগতি অনুযায়ী মূল বোতামের লেখা ও লিংক
            let readLabel = "পড়া শুরু করুন";
            if (progress?.status === "in-progress") readLabel = "পড়া চালিয়ে যান";
            if (progress?.status === "completed") readLabel = "আবার পড়ুন";
            const readHref = progress?.resumeHref ?? stats.startHref;

            const statItems = [
              { label: "অধ্যায়", value: stats.chapters },
              { label: "টপিক", value: stats.topics },
              { label: "MCQ", value: stats.mcq },
            ];

            return (
              <div
                key={subject.slug}
                className="flex flex-col rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
              >
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg text-3xl"
                  style={{ backgroundColor: `${subject.color}1a` }}
                >
                  {subject.icon}
                </div>

                <h2 className="mb-1 font-semibold leading-snug">
                  <Link href={`/subjects/${subject.slug}`} className="hover:text-primary">
                    {subject.name}
                  </Link>
                </h2>

                {hits.length > 0 && (
                  <p className="mb-2 text-xs text-primary">
                    মিলেছে: {hits.slice(0, 3).join(", ")}
                    {hits.length > 3 && ` +${toBanglaNumber(hits.length - 3)}`}
                  </p>
                )}

                <div className="mb-4 mt-3">
                  {hasContent ? (
                    <dl className="grid grid-cols-3 gap-2">
                      {statItems.map((item) => (
                        <div
                          key={item.label}
                          className="flex flex-col-reverse rounded-lg bg-muted px-1 py-2.5 text-center"
                        >
                          <dt className="text-xs text-muted-foreground">{item.label}</dt>
                          <dd
                            className="font-mono text-base font-bold"
                            style={{ color: subject.color }}
                          >
                            {toBanglaNumber(item.value)}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  ) : (
                    <p className="rounded-lg bg-muted px-2 py-3.5 text-center text-xs text-muted-foreground">
                      শীঘ্রই আসছে
                    </p>
                  )}
                </div>

                {/* অগ্রগতি (শুধু লগইন করা ব্যবহারকারীর জন্য) */}
                {progress && progress.total > 0 && progressLabel && (
                  <div className="mb-4">
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {toBanglaNumber(progress.done)}/{toBanglaNumber(progress.total)} টপিক সম্পন্ন
                      </span>
                      <span className="font-mono font-bold" style={{ color: subject.color }}>
                        {toBanglaNumber(progress.percent)}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${progress.percent}%`, backgroundColor: subject.color }}
                      />
                    </div>
                    <span
                      className={`mt-2 inline-block rounded px-2 py-0.5 text-xs font-medium ${progressLabel.className}`}
                    >
                      {progressLabel.text}
                    </span>
                  </div>
                )}

                <div className="mt-auto flex flex-col gap-2">
                  {readHref ? (
                    <Link
                      href={readHref}
                      className="flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                    >
                      {readLabel} <ArrowRight size={14} />
                    </Link>
                  ) : (
                    <span
                      aria-disabled="true"
                      className="flex cursor-not-allowed items-center justify-center rounded-lg bg-muted px-3 py-2 text-sm font-medium text-muted-foreground"
                    >
                      পড়া শুরু করুন
                    </span>
                  )}

                  {modelTest.available ? (
                    <>
                      <Link
                        href={modelTest.href}
                        className="flex items-center justify-center gap-1.5 rounded-lg border border-primary px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10"
                      >
                        <FileText size={14} /> মডেল টেস্ট দিন
                        {isReady && !isLoggedIn && (
                          <Lock size={12} aria-label="লগইন প্রয়োজন" />
                        )}
                      </Link>
                      <p className="text-center text-xs text-muted-foreground">
                        {toBanglaNumber(modelTest.questionCount)}টি প্রশ্ন ·{" "}
                        {toBanglaNumber(modelTest.durationMin)} মিনিট
                      </p>
                    </>
                  ) : (
                    <span
                      aria-disabled="true"
                      title="এই বিষয়ে এখনও মডেল টেস্টের জন্য যথেষ্ট প্রশ্ন নেই"
                      className="flex cursor-not-allowed items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground"
                    >
                      <FileText size={14} /> মডেল টেস্ট (শীঘ্রই)
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}