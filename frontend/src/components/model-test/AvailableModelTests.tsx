// frontend/src/components/model-test/AvailableModelTests.tsx
"use client";

import Link from "next/link";
import { useMemo } from "react";
import { BarChart2, Clock, Crown, FileText } from "lucide-react";
import { useAuthPreview } from "@/components/providers/AuthPreviewProvider";
import { modelTests } from "@/lib/exam-data";
import { evaluate, MARK_CORRECT } from "@/lib/exam-utils";
import { toBanglaNumber } from "@/lib/pricing";
import { useAttempts } from "@/lib/useAttempts";

export function AvailableModelTests() {
  const { isLoggedIn, isReady } = useAuthPreview();
  const { attempts } = useAttempts();

  // প্রতিটি মডেল টেস্ট আগে কতবার দেওয়া হয়েছে ও সর্বোচ্চ কত শতাংশ পেয়েছেন (নাম মিলিয়ে)
  const previous = useMemo(() => {
    const map = new Map<string, { count: number; best: number }>();
    for (const attempt of attempts) {
      if (attempt.session.mode !== "model") continue;
      const percent = evaluate(attempt.session).percent;
      const entry = map.get(attempt.session.title) ?? { count: 0, best: 0 };
      entry.count += 1;
      entry.best = Math.max(entry.best, percent);
      map.set(attempt.session.title, entry);
    }
    return map;
  }, [attempts]);

  // বিভাগ অনুযায়ী মডেল টেস্ট সাজানো
  const categories = Array.from(new Set(modelTests.map((t) => t.category)));
  const showPrevious = isReady && isLoggedIn;

  return (
    <div className="space-y-8">
      {categories.map((category) => (
        <section key={category}>
          <h3 className="mb-3 font-display text-lg font-bold">{category} Model Test</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modelTests
              .filter((t) => t.category === category)
              .map((test) => {
                const prev = previous.get(test.title);
                return (
                  <div
                    key={test.id}
                    className="flex flex-col rounded-xl border border-border bg-card p-5"
                  >
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <h4 className="font-semibold leading-snug">{test.title}</h4>
                      {test.premium && (
                        <span className="flex shrink-0 items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent">
                          <Crown size={11} /> প্রিমিয়াম
                        </span>
                      )}
                    </div>

                    {/* Total Marks ও Syllabus Coverage */}
                    <div className="mb-4 rounded-lg bg-muted p-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Total Marks</span>
                        <span className="font-mono text-lg font-bold text-primary">
                          {toBanglaNumber(test.questions * MARK_CORRECT)}
                        </span>
                      </div>
                      <div className="mt-2">
                        <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <BarChart2 size={12} /> Syllabus Coverage
                          </span>
                          <span className="font-mono">
                            {toBanglaNumber(test.syllabusCoverage)}%
                          </span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-border">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${test.syllabusCoverage}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mb-3 flex gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FileText size={13} /> {toBanglaNumber(test.questions)} প্রশ্ন
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={13} /> {toBanglaNumber(test.durationMin)} মিনিট
                      </span>
                    </div>

                    {showPrevious && (
                      <p className="mb-3 text-xs text-muted-foreground">
                        {prev
                          ? `আপনি ${toBanglaNumber(prev.count)} বার দিয়েছেন · সর্বোচ্চ ${toBanglaNumber(prev.best)}%`
                          : "আপনি এখনও এটি দেননি"}
                      </p>
                    )}

                    <Link
                      href={`/exam?test=${test.id}`}
                      className="mt-auto rounded-lg bg-primary py-2 text-center text-sm font-medium text-primary-foreground hover:opacity-90"
                    >
                      পরীক্ষা শুরু করুন
                    </Link>
                  </div>
                );
              })}
          </div>
        </section>
      ))}
    </div>
  );
}