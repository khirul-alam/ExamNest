// frontend/src/components/landing/LatestUpdatesSection.tsx
import Link from "next/link";
import { ArrowRight, Briefcase, Globe } from "lucide-react";
import { ApplyButton } from "@/components/jobs/ApplyButton";
import { DeadlineStatus } from "@/components/jobs/DeadlineStatus";
import { categoryColors, currentAffairsItems } from "@/lib/current-affairs-data";
import { formatBanglaDate } from "@/lib/format";
import { getSafeApplyUrl, jobItems } from "@/lib/jobs-data";
import { toBanglaNumber } from "@/lib/pricing";

// সর্বশেষ ৪টি খবর (নতুন আগে)
const latestNews = [...currentAffairsItems]
  .sort((a, b) => b.date.localeCompare(a.date))
  .slice(0, 4);

// সর্বশেষ প্রকাশিত ৪টি বিজ্ঞপ্তি (নতুন আগে)
const latestJobs = [...jobItems]
  .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
  .slice(0, 4);

export function LatestUpdatesSection() {
  return (
    <section className="border-t border-border bg-muted/50 py-16">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-2">
        {/* কারেন্ট অ্যাফেয়ার্স */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-xl font-bold">
              <Globe size={20} className="text-primary" /> কারেন্ট অ্যাফেয়ার্স
            </h2>
            <Link
              href="/current-affairs"
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              সব দেখুন <ArrowRight size={14} />
            </Link>
          </div>

          <div className="space-y-3">
            {latestNews.map((item) => {
              const color = categoryColors[item.category];
              return (
                <article key={item.id} className="rounded-xl border border-border bg-card p-4">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span
                      className="rounded px-2 py-0.5 text-xs font-medium"
                      style={{ backgroundColor: `${color}1a`, color }}
                    >
                      {item.category}
                    </span>
                    <time
                      dateTime={item.date}
                      className="ml-auto font-mono text-xs text-muted-foreground"
                    >
                      প্রকাশ: {formatBanglaDate(item.date)}
                    </time>
                  </div>

                  <h3 className="mb-1 text-sm font-semibold">
                    <Link href={`/current-affairs/${item.id}`} className="hover:text-primary">
                      {item.title}
                    </Link>
                  </h3>
                  <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {item.summary}
                  </p>

                  <Link
                    href={`/current-affairs/${item.id}`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    বিস্তারিত দেখুন <ArrowRight size={12} />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>

        {/* চাকরির বিজ্ঞপ্তি */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-xl font-bold">
              <Briefcase size={20} className="text-primary" /> চাকরির বিজ্ঞপ্তি
            </h2>
            <Link
              href="/job-circular"
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              সব দেখুন <ArrowRight size={14} />
            </Link>
          </div>

          <div className="space-y-3">
            {latestJobs.map((job) => (
              <article key={job.id} className="rounded-xl border border-border bg-card p-4">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {job.category}
                  </span>
                  <time
                    dateTime={job.publishedAt}
                    className="ml-auto font-mono text-xs text-muted-foreground"
                  >
                    প্রকাশ: {formatBanglaDate(job.publishedAt)}
                  </time>
                </div>

                <h3 className="mb-1 text-sm font-semibold">
                  <Link href={`/job-circular/${job.id}`} className="hover:text-primary">
                    {job.org}
                  </Link>
                </h3>
                <p className="mb-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {job.summary}
                </p>

                <p className="mb-1 text-xs text-muted-foreground">
                  পদ: <strong className="text-foreground">{job.posts}</strong>
                </p>
                <DeadlineStatus deadline={job.deadline} className="mb-3" />

                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/job-circular/${job.id}`}
                    className="inline-flex items-center justify-center gap-1 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
                  >
                    বিস্তারিত দেখুন <ArrowRight size={13} />
                  </Link>
                  <ApplyButton applyUrl={getSafeApplyUrl(job)} deadline={job.deadline} />
                </div>
              </article>
            ))}
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            আপাতত {toBanglaNumber(jobItems.length)}টি ডেমো বিজ্ঞপ্তি আছে।
          </p>
        </div>
      </div>
    </section>
  );
}