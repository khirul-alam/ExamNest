// frontend/src/components/previous-questions/PyqBrowse.tsx
"use client";

import { toBanglaDigits } from "@/lib/format";
import { toBanglaNumber } from "@/lib/pricing";
import { getOrganizationStats, getYearStats } from "@/lib/pyq-filters";

// প্রতিটি বছর ও প্রতিষ্ঠানের হিসাব ডাটা থেকে একবারই গোনা হয়
const yearStats = getYearStats();
const organizationStats = getOrganizationStats();

type Props = {
  selectedYear: string;
  selectedOrganization: string;
  onPickYear: (year: string) => void;
  onPickOrganization: (organization: string) => void;
};

const cardClass = (active: boolean) =>
  `rounded-xl border p-4 text-left transition-colors ${
    active ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/50"
  }`;

export function PyqBrowse({
  selectedYear,
  selectedOrganization,
  onPickYear,
  onPickOrganization,
}: Props) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-1 font-semibold">বছর অনুযায়ী</h3>
        <p className="mb-3 text-xs text-muted-foreground">
          একটি বছর বাছলে সেই বছরের সব প্রতিষ্ঠানের সব পরীক্ষার প্রশ্ন একসঙ্গে আসবে। একই প্রশ্ন একাধিক
          পরীক্ষায় থাকলেও সংখ্যায় একবারই গোনা হয়।
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {yearStats.map((stat) => {
            const active = selectedYear === String(stat.year);
            return (
              <button
                key={stat.year}
                onClick={() => onPickYear(String(stat.year))}
                aria-pressed={active}
                className={cardClass(active)}
              >
                <div className="mb-2 flex items-baseline justify-between">
                  <span className="font-display text-xl font-bold">{toBanglaDigits(stat.year)}</span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {toBanglaNumber(stat.exams)}টি পরীক্ষা
                  </span>
                </div>
                <p className="mb-2 text-sm">
                  <strong className="font-mono text-primary">{toBanglaNumber(stat.questions)}</strong>টি
                  স্বতন্ত্র প্রশ্ন
                </p>
                <ul className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                  {stat.byOrganization.map((item) => (
                    <li key={item.organization}>
                      {item.organization}: {toBanglaNumber(item.questions)}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-semibold">প্রতিষ্ঠান অনুযায়ী</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {organizationStats.map((stat) => {
            const active = selectedOrganization === stat.organization;
            return (
              <button
                key={stat.organization}
                onClick={() => onPickOrganization(stat.organization)}
                aria-pressed={active}
                className={cardClass(active)}
              >
                <div className="mb-2 font-display text-lg font-bold">{stat.organization}</div>
                <p className="mb-1 text-sm">
                  <strong className="font-mono text-primary">{toBanglaNumber(stat.questions)}</strong>টি
                  স্বতন্ত্র প্রশ্ন · {toBanglaNumber(stat.exams)}টি পরীক্ষা
                </p>
                <p className="text-xs text-muted-foreground">
                  সাল: {stat.years.map((year) => toBanglaDigits(year)).join(", ")}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}