// frontend/src/components/jobs/JobsExplorer.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { ApplyButton } from "@/components/jobs/ApplyButton";
import { DeadlineStatus } from "@/components/jobs/DeadlineStatus";
import { daysUntil, formatBanglaDate } from "@/lib/format";
import { getSafeApplyUrl, jobCategories, jobItems } from "@/lib/jobs-data";
import { toBanglaNumber } from "@/lib/pricing";
import { useToday } from "@/lib/useToday";

export function JobsExplorer() {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [showExpired, setShowExpired] = useState(false);
  // আজকের তারিখ ব্রাউজার থেকে (সার্ভারের সময়ের সাথে গোলমাল এড়াতে)
  const today = useToday();

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return jobItems
      .map((job) => ({ job, daysLeft: today ? daysUntil(job.deadline, today) : null }))
      .filter(({ job, daysLeft }) => {
        if (category !== "all" && job.category !== category) return false;
        if (term && !`${job.org} ${job.summary}`.toLowerCase().includes(term)) return false;
        const expired = daysLeft !== null && daysLeft < 0;
        if (expired && !showExpired) return false;
        return true;
      })
      // চলমান বিজ্ঞপ্তি আগে (শেষ তারিখ কাছের টি আগে), মেয়াদোত্তীর্ণ শেষে
      .sort((a, b) => {
        const aExpired = a.daysLeft !== null && a.daysLeft < 0;
        const bExpired = b.daysLeft !== null && b.daysLeft < 0;
        if (aExpired !== bExpired) return aExpired ? 1 : -1;
        return a.job.deadline.localeCompare(b.job.deadline);
      });
  }, [category, search, showExpired, today]);

  const chipClass = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-sm transition-colors ${
      active
        ? "border-primary bg-primary/10 text-primary"
        : "border-border hover:border-primary/50"
    }`;

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        <button onClick={() => setCategory("all")} className={chipClass(category === "all")}>
          সবকিছু
        </button>
        {jobCategories.map((cat) => (
          <button key={cat} onClick={() => setCategory(cat)} className={chipClass(category === cat)}>
            {cat}
          </button>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="সংস্থার নাম খুঁজুন..."
            aria-label="সংস্থার নাম খুঁজুন"
            className="w-full rounded-lg border border-border bg-muted py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showExpired}
            onChange={(e) => setShowExpired(e.target.checked)}
            className="accent-[var(--primary)]"
          />
          মেয়াদোত্তীর্ণও দেখান
        </label>
      </div>

      <p className="mb-3 text-sm text-muted-foreground">
        {toBanglaNumber(rows.length)}টি বিজ্ঞপ্তি পাওয়া গেছে
      </p>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
          কোনো বিজ্ঞপ্তি পাওয়া যায়নি।
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map(({ job, daysLeft }) => {
            const expired = daysLeft !== null && daysLeft < 0;
            const urgent = daysLeft !== null && daysLeft >= 0 && daysLeft <= 7;

            return (
              <article
                key={job.id}
                className={`rounded-xl border border-border bg-card p-4 ${expired ? "opacity-60" : ""}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold">
                        <Link href={`/job-circular/${job.id}`} className="hover:text-primary">
                          {job.org}
                        </Link>
                      </h2>
                      {urgent && (
                        <span className="rounded bg-red-600 px-2 py-0.5 text-xs font-medium text-white">
                          জরুরি
                        </span>
                      )}
                      {expired && (
                        <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                          মেয়াদ শেষ
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="rounded bg-primary/10 px-2 py-0.5 text-primary">
                        {job.category}
                      </span>
                      <span>
                        পদ: <strong className="text-foreground">{job.posts}</strong>
                      </span>
                      <span>
                        বেতন: <strong className="text-foreground">{job.salary}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <DeadlineStatus deadline={job.deadline} className="sm:justify-end" />
                    <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                      প্রকাশ: {formatBanglaDate(job.publishedAt)}
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{job.summary}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    href={`/job-circular/${job.id}`}
                    className="inline-flex items-center justify-center gap-1 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
                  >
                    বিস্তারিত দেখুন <ArrowRight size={13} />
                  </Link>
                  <ApplyButton applyUrl={getSafeApplyUrl(job)} deadline={job.deadline} />
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}