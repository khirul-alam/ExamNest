// frontend/src/components/previous-questions/PyqFilters.tsx
"use client";

import { RotateCcw, Search } from "lucide-react";
import { toBanglaDigits } from "@/lib/format";
import { toBanglaNumber } from "@/lib/pricing";
import { ALL, type FilterOptions, type PyqFilterKey, type PyqFilters } from "@/lib/pyq-filters";
import { getSubject } from "@/lib/subjects-data";

type Props = {
  filters: PyqFilters;
  options: FilterOptions;
  search: string;
  hasFilter: boolean;
  examCount: number;
  questionCount: number;
  onChange: (key: PyqFilterKey, value: string) => void;
  onSearch: (value: string) => void;
  onReset: () => void;
};

const selectClass =
  "w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm outline-none focus:border-primary";

export function PyqFilters({
  filters,
  options,
  search,
  hasFilter,
  examCount,
  questionCount,
  onChange,
  onSearch,
  onReset,
}: Props) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="relative mb-3">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="প্রশ্ন, অপশন বা ব্যাখ্যায় খুঁজুন..."
          aria-label="প্রশ্ন খুঁজুন"
          className={`${selectClass} pl-9`}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <label className="block text-xs font-medium">
          বছর
          <select
            value={filters.year}
            onChange={(e) => onChange("year", e.target.value)}
            className={`${selectClass} mt-1`}
          >
            <option value={ALL}>সকল বছর</option>
            {options.years.map((year) => (
              <option key={year} value={year}>
                {toBanglaDigits(year)}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-xs font-medium">
          প্রতিষ্ঠান
          <select
            value={filters.organization}
            onChange={(e) => onChange("organization", e.target.value)}
            className={`${selectClass} mt-1`}
          >
            <option value={ALL}>সকল প্রতিষ্ঠান</option>
            {options.organizations.map((org) => (
              <option key={org} value={org}>
                {org}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-xs font-medium">
          পদ
          <select
            value={filters.post}
            onChange={(e) => onChange("post", e.target.value)}
            className={`${selectClass} mt-1`}
          >
            <option value={ALL}>সকল পদ</option>
            {options.posts.map((post) => (
              <option key={post} value={post}>
                {post}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-xs font-medium">
          বিষয়
          <select
            value={filters.subject}
            onChange={(e) => onChange("subject", e.target.value)}
            className={`${selectClass} mt-1`}
          >
            <option value={ALL}>সকল বিষয়</option>
            {options.subjects.map((slug) => (
              <option key={slug} value={slug}>
                {getSubject(slug)?.name ?? slug}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-xs font-medium">
          পরীক্ষা
          <select
            value={filters.exam}
            onChange={(e) => onChange("exam", e.target.value)}
            className={`${selectClass} mt-1`}
          >
            <option value={ALL}>সকল পরীক্ষা</option>
            {options.exams.map((exam) => (
              <option key={exam.id} value={exam.id}>
                {exam.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
        <span>
          {toBanglaNumber(examCount)}টি পরীক্ষা · {toBanglaNumber(questionCount)}টি স্বতন্ত্র প্রশ্ন
        </span>
        {hasFilter && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-primary hover:underline"
          >
            <RotateCcw size={13} /> ফিল্টার মুছুন
          </button>
        )}
      </div>
    </div>
  );
}