// frontend/src/components/model-test/SubjectAnalytics.tsx
"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import { useStudyProgress } from "@/components/providers/StudyProgressPreviewProvider";
import {
  classifySubject,
  MIN_ANSWERED_FOR_ANALYSIS,
  type Strength,
  type SubjectStat,
} from "@/lib/analytics";
import { toBanglaNumber } from "@/lib/pricing";
import { getSubjectModelTest } from "@/lib/subject-model-test";
import { getSubject } from "@/lib/subjects-data";

export const strengthLabels: Record<Strength, { text: string; className: string }> = {
  strong: {
    text: "শক্তিশালী",
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  },
  weak: {
    text: "উন্নতি প্রয়োজন",
    className: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  },
  average: {
    text: "মাঝারি",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
  insufficient: { text: "তথ্য কম", className: "bg-muted text-muted-foreground" },
};

type MetricProps = {
  label: string;
  percent: number | null;
  text: string;
  color: string;
};

// একটি মেট্রিকের বার (চারটি মেট্রিক আলাদা আলাদা রঙে, একত্রে নয়)
function MetricBar({ label, percent, text, color }: MetricProps) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono font-medium">{text}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${percent ?? 0}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export function SubjectAnalytics({ stats }: { stats: SubjectStat[] }) {
  const studyProgress = useStudyProgress();

  return (
    <div>
      <details className="mb-4 rounded-xl border border-border bg-card px-4 py-3 text-sm">
        <summary className="cursor-pointer font-medium">চারটি মেট্রিকের মানে কী?</summary>
        <ul className="mt-2 list-inside list-disc space-y-1 text-xs leading-relaxed text-muted-foreground">
          <li>
            <strong className="text-foreground">প্রস্তুতির অগ্রগতি:</strong> বিষয়ের কতটি টপিক
            পড়া সম্পন্ন করেছেন।
          </li>
          <li>
            <strong className="text-foreground">MCQ Coverage:</strong> মোট প্রশ্নের মধ্যে কতটি
            স্বতন্ত্র প্রশ্নে উত্তর দিয়েছেন (একই প্রশ্ন বারবার করলেও একবারই গোনা)।
          </li>
          <li>
            <strong className="text-foreground">টেস্ট সফলতা:</strong> যত পরীক্ষায় এই বিষয়ের
            প্রশ্ন ছিল, তার মধ্যে কতটিতে এই বিষয়ের অংশে পাস মার্ক পেয়েছেন।
          </li>
          <li>
            <strong className="text-foreground">Accuracy:</strong> যতগুলো প্রশ্নের উত্তর
            দিয়েছেন, তার কত শতাংশ সঠিক।
          </li>
        </ul>
      </details>

      <div className="grid gap-4 md:grid-cols-2">
        {stats.map((stat) => {
          const subject = getSubject(stat.subjectSlug);
          if (!subject) return null;

          const strength = classifySubject(stat);
          const label = strengthLabels[strength];

          // প্রস্তুতির অগ্রগতি: সম্পন্ন টপিক ÷ মোট টপিক
          const topics = subject.chapters.flatMap((c) => c.topics);
          const doneTopics = topics.filter((t) =>
            studyProgress.isCompleted(subject.slug, t.slug),
          ).length;
          const prepPercent = topics.length ? Math.round((doneTopics / topics.length) * 100) : null;

          // বিষয়ে যথেষ্ট প্রশ্ন থাকলে মডেল টেস্ট, নইলে সাধারণ অনুশীলন
          const modelTest = getSubjectModelTest(subject.slug);
          const practiceHref = modelTest.available
            ? modelTest.href
            : `/exam?subject=${encodeURIComponent(subject.slug)}`;

          return (
            <article key={stat.subjectSlug} className="rounded-xl border border-border bg-card p-5">
              <div className="mb-4 flex items-start justify-between gap-2">
                <h3 className="flex items-center gap-2 font-semibold">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-xl"
                    style={{ backgroundColor: `${subject.color}1a` }}
                  >
                    {subject.icon}
                  </span>
                  <span className="leading-snug">{subject.name}</span>
                </h3>
                <span
                  className={`shrink-0 rounded px-2 py-0.5 text-xs font-medium ${label.className}`}
                >
                  {label.text}
                </span>
              </div>

              <div className="mb-4 space-y-3">
                <MetricBar
                  label="প্রস্তুতির অগ্রগতি"
                  percent={prepPercent}
                  text={
                    prepPercent === null
                      ? "কনটেন্ট শীঘ্রই"
                      : `${toBanglaNumber(doneTopics)}/${toBanglaNumber(topics.length)} টপিক · ${toBanglaNumber(prepPercent)}%`
                  }
                  color="#0d6e4f"
                />
                <MetricBar
                  label="MCQ Coverage"
                  percent={stat.coveragePercent}
                  text={`${toBanglaNumber(stat.uniqueAnswered)}/${toBanglaNumber(stat.totalMcq)} · ${toBanglaNumber(stat.coveragePercent)}%`}
                  color="#2563eb"
                />
                <MetricBar
                  label="টেস্ট সফলতা"
                  percent={stat.successRate}
                  text={
                    stat.successRate === null
                      ? "এখনও পরীক্ষা নেই"
                      : `${toBanglaNumber(stat.passed)}/${toBanglaNumber(stat.tests)} · ${toBanglaNumber(stat.successRate)}%`
                  }
                  color="#d97706"
                />
                <MetricBar
                  label="Accuracy"
                  percent={stat.accuracy}
                  text={stat.accuracy === null ? "তথ্য নেই" : `${toBanglaNumber(stat.accuracy)}%`}
                  color="#7c3aed"
                />
              </div>

              {/* MCQ পরিসংখ্যান */}
              <dl className="mb-3 grid grid-cols-3 gap-2 text-center">
                {[
                  { label: "সম্পন্ন", value: stat.uniqueAnswered },
                  { label: "বাকি", value: stat.totalMcq - stat.uniqueAnswered },
                  { label: "মোট MCQ", value: stat.totalMcq },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col-reverse rounded-lg bg-muted py-2">
                    <dt className="text-xs text-muted-foreground">{item.label}</dt>
                    <dd className="font-mono text-sm font-bold">{toBanglaNumber(item.value)}</dd>
                  </div>
                ))}
              </dl>
              <p className="mb-4 text-xs text-muted-foreground">
                সঠিক{" "}
                <strong className="text-emerald-600">{toBanglaNumber(stat.correct)}</strong> · ভুল{" "}
                <strong className="text-red-600">{toBanglaNumber(stat.wrong)}</strong> · উত্তর না
                দেওয়া <strong>{toBanglaNumber(stat.skipped)}</strong> · পরীক্ষা{" "}
                <strong>{toBanglaNumber(stat.tests)}</strong>টি
              </p>

              {strength === "insufficient" && (
                <p className="mb-3 text-xs text-muted-foreground">
                  শক্তিশালী বা দুর্বল বলার জন্য এই বিষয়ে কমপক্ষে{" "}
                  {toBanglaNumber(MIN_ANSWERED_FOR_ANALYSIS)}টি প্রশ্নের উত্তর দিন।
                </p>
              )}

              <Link
                href={practiceHref}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-primary px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10"
              >
                <FileText size={14} /> এই বিষয়ে পরীক্ষা দিন
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}