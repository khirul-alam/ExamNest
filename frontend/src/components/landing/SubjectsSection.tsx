// frontend/src/components/landing/SubjectsSection.tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { toBanglaNumber } from "@/lib/pricing";
import { getSubjectStats } from "@/lib/subject-stats";
import { allSubjects } from "@/lib/subjects-data";

export function SubjectsSection() {
  return (
    <section className="border-y border-border bg-muted/50 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              বিষয়সমূহ
            </h2>
            <p className="mt-1 text-muted-foreground">
              BCS সিলেবাস অনুযায়ী সাজানো বিষয়ভিত্তিক প্রস্তুতি
            </p>
          </div>
          <Link
            href="/subjects"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            সব বিষয় দেখুন <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {allSubjects.map((subject) => {
            const stats = getSubjectStats(subject);
            const hasContent = stats.topics > 0;

            // কার্ডের তিনটি সংখ্যা
            const items = [
              { label: "অধ্যায়", value: stats.chapters },
              { label: "টপিক", value: stats.topics },
              { label: "MCQ", value: stats.mcq },
            ];

            return (
              <div
                key={subject.slug}
                className="flex flex-col rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-md"
              >
                <div
                  className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg text-2xl"
                  style={{ backgroundColor: `${subject.color}1a` }}
                >
                  {subject.icon}
                </div>

                <h3 className="mb-3 text-sm font-semibold leading-snug">
                  <Link
                    href={`/subjects/${subject.slug}`}
                    className="hover:text-primary"
                  >
                    {subject.name}
                  </Link>
                </h3>

                {hasContent ? (
                  <dl className="mb-4 grid grid-cols-3 gap-2">
                    {items.map((item) => (
                      <div
                        key={item.label}
                        className="flex flex-col-reverse rounded-lg bg-muted px-1 py-2 text-center"
                      >
                        <dt className="text-xs text-muted-foreground">
                          {item.label}
                        </dt>
                        <dd
                          className="font-mono text-sm font-bold"
                          style={{ color: subject.color }}
                        >
                          {toBanglaNumber(item.value)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="mb-4 rounded-lg bg-muted px-2 py-3 text-center text-xs text-muted-foreground">
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
    </section>
  );
}