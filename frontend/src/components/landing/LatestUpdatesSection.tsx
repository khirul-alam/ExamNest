// frontend/src/components/landing/LatestUpdatesSection.tsx
import Link from "next/link";
import { ArrowRight, Briefcase, Clock, Globe } from "lucide-react";
import { categoryColors, latestJobs, latestNews } from "@/lib/landing-data";

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
              const color = categoryColors[item.cat] ?? "#666666";
              return (
                <div key={item.title} className="rounded-xl border border-border bg-card p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span
                      className="rounded px-2 py-0.5 text-xs font-medium"
                      style={{ backgroundColor: `${color}1a`, color }}
                    >
                      {item.cat}
                    </span>
                    <span className="ml-auto font-mono text-xs text-muted-foreground">
                      {item.time}
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
                key={job.org}
                className="flex items-start justify-between gap-3 rounded-xl border border-border bg-card p-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold">{job.org}</h3>
                    {job.urgent && (
                      <span className="rounded bg-red-600 px-2 py-0.5 text-xs text-white">
                        জরুরি
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {job.type} · পদ: {job.posts}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1 font-mono text-xs text-muted-foreground">
                  <Clock size={11} /> {job.deadline}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}