// frontend/src/components/model-test/StrongWeakSection.tsx
import { AlertTriangle, ThumbsUp } from "lucide-react";
import {
  classifySubject,
  MIN_ANSWERED_FOR_ANALYSIS,
  STRONG_ACCURACY,
  WEAK_ACCURACY,
  type SubjectStat,
} from "@/lib/analytics";
import { toBanglaNumber } from "@/lib/pricing";
import { getSubject } from "@/lib/subjects-data";

type ListProps = {
  title: string;
  hint: string;
  stats: SubjectStat[];
  emptyText: string;
  tone: "strong" | "weak";
};

function SubjectList({ title, hint, stats, emptyText, tone }: ListProps) {
  const isStrong = tone === "strong";
  const Icon = isStrong ? ThumbsUp : AlertTriangle;

  return (
    <div
      className={`rounded-xl border p-5 ${
        isStrong
          ? "border-emerald-300 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/20"
          : "border-red-300 bg-red-50/50 dark:border-red-900 dark:bg-red-950/20"
      }`}
    >
      <h3
        className={`mb-1 flex items-center gap-2 font-semibold ${
          isStrong ? "text-emerald-700 dark:text-emerald-300" : "text-red-700 dark:text-red-300"
        }`}
      >
        <Icon size={16} /> {title}
      </h3>
      <p className="mb-3 text-xs text-muted-foreground">{hint}</p>

      {stats.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyText}</p>
      ) : (
        <ul className="space-y-2">
          {stats.map((stat) => {
            const subject = getSubject(stat.subjectSlug);
            return (
              <li
                key={stat.subjectSlug}
                className="flex items-center justify-between gap-2 rounded-lg bg-card px-3 py-2 text-sm"
              >
                <span>
                  {subject?.icon} {subject?.name}
                </span>
                <span className="font-mono text-xs font-bold">
                  {toBanglaNumber(stat.accuracy ?? 0)}%
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function StrongWeakSection({ stats }: { stats: SubjectStat[] }) {
  const strong = stats.filter((s) => classifySubject(s) === "strong");
  const weak = stats.filter((s) => classifySubject(s) === "weak");
  const insufficient = stats.filter((s) => classifySubject(s) === "insufficient");

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2">
        <SubjectList
          title="শক্তিশালী বিষয়"
          hint={`Accuracy ${toBanglaNumber(STRONG_ACCURACY)}% বা তার বেশি`}
          stats={strong}
          emptyText="এখনও কোনো বিষয় এই তালিকায় নেই।"
          tone="strong"
        />
        <SubjectList
          title="উন্নতি প্রয়োজন"
          hint={`Accuracy ${toBanglaNumber(WEAK_ACCURACY)}%-এর কম`}
          stats={weak}
          emptyText="এখনও কোনো বিষয় এই তালিকায় নেই।"
          tone="weak"
        />
      </div>

      {insufficient.length > 0 && (
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          {toBanglaNumber(insufficient.length)}টি বিষয়ে এখনও যথেষ্ট তথ্য নেই। কমপক্ষে{" "}
          {toBanglaNumber(MIN_ANSWERED_FOR_ANALYSIS)}টি প্রশ্নের উত্তর না দিলে কোনো বিষয়কে
          শক্তিশালী বা দুর্বল বলা হয় না, যাতে কয়েকটি প্রশ্নের ফলে ভুল ধারণা না তৈরি হয়।
        </p>
      )}
    </div>
  );
}