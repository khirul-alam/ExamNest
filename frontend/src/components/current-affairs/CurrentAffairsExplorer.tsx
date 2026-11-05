// frontend/src/components/current-affairs/CurrentAffairsExplorer.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import {
  categoryColors,
  currentAffairsCategories,
  currentAffairsItems,
} from "@/lib/current-affairs-data";
import { formatBanglaDate } from "@/lib/format";
import { toBanglaNumber } from "@/lib/pricing";

export function CurrentAffairsExplorer() {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [onlyImportant, setOnlyImportant] = useState(false);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return currentAffairsItems
      .filter((item) => {
        if (category !== "all" && item.category !== category) return false;
        if (onlyImportant && !item.important) return false;
        if (term && !`${item.title} ${item.summary} ${item.detail}`.toLowerCase().includes(term)) {
          return false;
        }
        return true;
      })
      // সবচেয়ে নতুন খবর আগে
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [category, search, onlyImportant]);

  const chipClass = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-sm transition-colors ${
      active
        ? "border-primary bg-primary/10 text-primary"
        : "border-border hover:border-primary/50"
    }`;

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        <button onClick={() => setCategory("all")} className={chipClass(category === "all")}>
          সবকিছু ({toBanglaNumber(currentAffairsItems.length)})
        </button>
        {currentAffairsCategories.map((cat) => (
          <button key={cat} onClick={() => setCategory(cat)} className={chipClass(category === cat)}>
            {cat} ({toBanglaNumber(currentAffairsItems.filter((i) => i.category === cat).length)})
          </button>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="খবর খুঁজুন..."
            aria-label="খবর খুঁজুন"
            className="w-full rounded-lg border border-border bg-muted py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={onlyImportant}
            onChange={(e) => setOnlyImportant(e.target.checked)}
            className="accent-[var(--primary)]"
          />
          শুধু পরীক্ষার জন্য গুরুত্বপূর্ণ
        </label>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
          কোনো খবর পাওয়া যায়নি।
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => {
            const color = categoryColors[item.category];
            return (
              <article key={item.id} className="rounded-xl border border-border bg-card p-5">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span
                    className="rounded px-2 py-0.5 text-xs font-medium"
                    style={{ backgroundColor: `${color}1a`, color }}
                  >
                    {item.category}
                  </span>
                  {item.important && (
                    <span className="rounded bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600 dark:bg-red-950/40">
                      🔥 পরীক্ষার জন্য গুরুত্বপূর্ণ
                    </span>
                  )}
                  <time
                    dateTime={item.date}
                    className="ml-auto font-mono text-xs text-muted-foreground"
                  >
                    প্রকাশ: {formatBanglaDate(item.date)}
                  </time>
                </div>

                <h2 className="mb-2 font-semibold">
                  <Link href={`/current-affairs/${item.id}`} className="hover:text-primary">
                    {item.title}
                  </Link>
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.summary}</p>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">সূত্র: {item.source}</span>
                  <Link
                    href={`/current-affairs/${item.id}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    বিস্তারিত দেখুন <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}