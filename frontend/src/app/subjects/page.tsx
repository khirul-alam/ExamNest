// frontend/src/app/subjects/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { toBanglaNumber } from "@/lib/pricing";
import { getSubjectStats } from "@/lib/subject-stats";
import { allSubjects } from "@/lib/subjects-data";

export const metadata: Metadata = {
  title: "বিষয়সমূহ",
  description: "BCS ও চাকরি পরীক্ষার সকল বিষয়ভিত্তিক প্রস্তুতি",
};

export default function SubjectsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-6">
        <h1 className="mb-1 font-display text-2xl font-bold">বিষয়সমূহ</h1>
        <p className="text-sm text-muted-foreground">BCS ও চাকরি পরীক্ষার সকল বিষয়</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {allSubjects.map((subject) => {
          const stats = getSubjectStats(subject);
          const hasContent = stats.topics > 0;

          // কার্ডের তিনটি সংখ্যা (Landing পেজের সাথে একই হিসাব)
          const items = [
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

              <h2 className="mb-4 font-semibold leading-snug">
                <Link
                  href={`/subjects/${subject.slug}`}
                  className="hover:text-primary"
                >
                  {subject.name}
                </Link>
              </h2>

              {hasContent ? (
                <dl className="mb-4 grid grid-cols-3 gap-2">
                  {items.map((item) => (
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
                <p className="mb-4 rounded-lg bg-muted px-2 py-3.5 text-center text-xs text-muted-foreground">
                  শীঘ্রই আসছে
                </p>
              )}

              {stats.startHref ? (
                <Link
                  href={stats.startHref}
                  className="mt-auto flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                  পড়া শুরু করুন <ArrowRight size={14} />
                </Link>
              ) : (
                <span
                  aria-disabled="true"
                  className="mt-auto flex cursor-not-allowed items-center justify-center rounded-lg bg-muted px-3 py-2 text-sm font-medium text-muted-foreground"
                >
                  পড়া শুরু করুন
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}