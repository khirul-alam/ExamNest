// frontend/src/components/jobs/JobsExplorer.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Clock, Search } from "lucide-react";
import { daysUntil, formatBanglaDate } from "@/lib/format";
import { jobCategories, jobItems } from "@/lib/jobs-data";
import { toBanglaNumber } from "@/lib/pricing";

export function JobsExplorer() {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [showExpired, setShowExpired] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  // আজকের তারিখ ব্রাউজারে বসানো হয় (সার্ভারের সময়ের সাথে গোলমাল এড়াতে)
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => {
    setToday(new Date());
  }, []);

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return jobItems
      .map((job) => ({ job, daysLeft: today ? daysUntil(job.deadline, today) : null }))
      .filter(({ job, daysLeft }) => {
        if (category !== "all" && job.category !== category) return false;
        if (term && !job.org.toLowerCase().includes(term)) return false;
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
            const isOpen = openId === job.id;

            let statusText = "";
            if (daysLeft !== null) {
              if (expired) statusText = "মেয়াদ শেষ";
              else if (daysLeft === 0) statusText = "আজই শেষ দিন";
              else statusText = `আর ${toBanglaNumber(daysLeft)} দিন বাকি`;
            }

            return (
              <div
                key={job.id}
                className={`rounded-xl border border-border bg-card p-4 ${expired ? "opacity-60" : ""}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold">{job.org}</h2>
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

                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1 font-mono text-xs text-muted-foreground">
                      <Clock size={11} /> {formatBanglaDate(job.deadline)}
                    </div>
                    {statusText && !expired && (
                      <p className={`mt-0.5 text-xs ${urgent ? "text-red-600" : "text-muted-foreground"}`}>
                        {statusText}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setOpenId(isOpen ? null : job.id)}
                  aria-expanded={isOpen}
                  className="mt-3 flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  বিস্তারিত দেখুন {isOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                </button>

                {isOpen && (
                  <dl className="mt-3 space-y-1.5 rounded-lg bg-muted px-3 py-2.5 text-xs">
                    <div>
                      <dt className="inline font-semibold">প্রকাশের তারিখ: </dt>
                      <dd className="inline text-muted-foreground">
                        {formatBanglaDate(job.publishedAt)}
                      </dd>
                    </div>
                    <div>
                      <dt className="inline font-semibold">যোগ্যতা: </dt>
                      <dd className="inline text-muted-foreground">{job.qualification}</dd>
                    </div>
                    <div>
                      <dt className="inline font-semibold">আবেদন পদ্ধতি: </dt>
                      <dd className="inline text-muted-foreground">{job.applyInfo}</dd>
                    </div>
                  </dl>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}