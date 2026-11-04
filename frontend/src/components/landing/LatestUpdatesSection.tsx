// frontend/src/components/landing/LatestUpdatesSection.tsx
import Link from "next/link";
import { ArrowRight, Briefcase, Clock, Globe } from "lucide-react";
import { categoryColors, currentAffairsItems } from "@/lib/current-affairs-data";
import { formatBanglaDate } from "@/lib/format";
import { jobItems } from "@/lib/jobs-data";

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
                <div key={item.id} className="rounded-xl border border-border bg-card p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span
                      className="rounded px-2 py-0.5 text-xs font-medium"
                      style={{ backgroundColor: `${color}1a`, color }}
                    >
                      {item.category}
                    </span>
                    <span className="ml-auto font-mono text-xs text-muted-foreground">
                      {formatBanglaDate(item.date)}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold">{item.title}</h3>
                </div>
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
              <div
                key={job.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-border bg-card p-4"
              >
                <div>
                  <h3 className="text-sm font-semibold">{job.org}</h3>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {job.category} · পদ: {job.posts}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1 font-mono text-xs text-muted-foreground">
                  <Clock size={11} /> {formatBanglaDate(job.deadline)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}