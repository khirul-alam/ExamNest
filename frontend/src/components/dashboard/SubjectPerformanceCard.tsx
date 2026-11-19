// frontend/src/components/dashboard/SubjectPerformanceCard.tsx
"use client";

import Link from "next/link";
import { ChevronRight, Layers } from "lucide-react";
import { DashboardCard } from "./DashboardCard";
import { strengthLabels } from "@/components/model-test/SubjectAnalytics";
import { useStudyProgress } from "@/components/providers/StudyProgressPreviewProvider";
import { classifySubject, MIN_ANSWERED_FOR_ANALYSIS, type SubjectStat } from "@/lib/analytics";
import { toBanglaNumber } from "@/lib/pricing";
import { getSubjectProgress } from "@/lib/subject-progress";
import { allSubjects } from "@/lib/subjects-data";

type Props = {
  stats: SubjectStat[];
};

export function SubjectPerformanceCard({ stats }: Props) {
  const progress = useStudyProgress();

  // যেসব বিষয়ে কনটেন্ট আছে অথবা অন্তত একটি প্রশ্নে উত্তর দেওয়া হয়েছে
  const rows = allSubjects
    .map((subject) => ({ subject, stat: stats.find((s) => s.subjectSlug === subject.slug) }))
    .filter(({ subject, stat }) => subject.chapters.length > 0 || (stat?.answered ?? 0) > 0);

  return (
    <DashboardCard title="বিষয়ভিত্তিক অগ্রগতি ও Performance" icon={Layers}>
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          কনটেন্ট যুক্ত হলে বা পরীক্ষা দিলে এখানে প্রতিটি বিষয়ের তথ্য দেখা যাবে।
        </p>
      ) : (
        <div className="space-y-5">
          {rows.map(({ subject, stat }) => {
            const hasContent = subject.chapters.length > 0;
            const reading = hasContent ? getSubjectProgress(subject, progress.isCompleted) : null;
            const strength = stat ? classifySubject(stat) : "insufficient";
            const label = strengthLabels[strength];
            const chaptersDone = subject.chapters.filter((chapter) =>
              chapter.topics.every((topic) => progress.isCompleted(subject.slug, topic.slug)),
            ).length;

            return (
              <div key={subject.slug}>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <Link
                    href={`/subjects/${subject.slug}`}
                    className="flex items-center gap-2 text-sm font-medium hover:text-primary"
                  >
                    <span>{subject.icon}</span> {subject.name}
                  </Link>
                  {stat && (
                    <span className={`shrink-0 rounded px-2 py-0.5 text-xs font-medium ${label.className}`}>
                      {label.text}
                    </span>
                  )}
                </div>

                {reading && (
                  <div className="mb-2">
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        পড়ার অগ্রগতি · {toBanglaNumber(reading.done)}/{toBanglaNumber(reading.total)} টপিক
                        · {toBanglaNumber(chaptersDone)}/{toBanglaNumber(subject.chapters.length)} অধ্যায়
                      </span>
                      <span className="font-mono font-bold" style={{ color: subject.color }}>
                        {toBanglaNumber(reading.percent)}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${reading.percent}%`, backgroundColor: subject.color }}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Accuracy
                      {stat && stat.answered > 0 && ` · ${toBanglaNumber(stat.answered)}টি উত্তর`}
                    </span>
                    <span className="font-mono font-medium">
                      {stat?.accuracy != null ? `${toBanglaNumber(stat.accuracy)}%` : "এখনও পরীক্ষা নেই"}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-violet-500 transition-all"
                      style={{ width: `${stat?.accuracy ?? 0}%` }}
                    />
                  </div>
                  {strength === "insufficient" && stat && stat.answered > 0 && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      শক্তিশালী বা দুর্বল বলতে কমপক্ষে {toBanglaNumber(MIN_ANSWERED_FOR_ANALYSIS)}টি
                      উত্তর লাগবে।
                    </p>
                  )}
                </div>

                {/* অধ্যায়ভিত্তিক অগ্রগতি (SRS: Chapter Progress) */}
                {hasContent && (
                  <details className="group mt-2">
                    <summary className="flex cursor-pointer list-none items-center gap-1 text-xs text-primary [&::-webkit-details-marker]:hidden">
                      <ChevronRight
                        size={13}
                        className="transition-transform group-open:rotate-90"
                      />
                      অধ্যায়ভিত্তিক অগ্রগতি
                    </summary>
                    <ul className="mt-2 space-y-2 border-l border-border pl-3">
                      {subject.chapters.map((chapter) => {
                        const done = chapter.topics.filter((topic) =>
                          progress.isCompleted(subject.slug, topic.slug),
                        ).length;
                        const percent = chapter.topics.length
                          ? Math.round((done / chapter.topics.length) * 100)
                          : 0;
                        return (
                          <li key={chapter.slug}>
                            <div className="mb-0.5 flex items-center justify-between text-xs">
                              <span>{chapter.name}</span>
                              <span className="font-mono text-muted-foreground">
                                {toBanglaNumber(done)}/{toBanglaNumber(chapter.topics.length)} ·{" "}
                                {toBanglaNumber(percent)}%
                              </span>
                            </div>
                            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                              <div
                                className="h-full rounded-full"
                                style={{ width: `${percent}%`, backgroundColor: subject.color }}
                              />
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </details>
                )}
              </div>
            );
          })}
        </div>
      )}
    </DashboardCard>
  );
}