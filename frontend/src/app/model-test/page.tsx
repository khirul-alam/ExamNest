// frontend/src/app/model-test/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { BarChart2, Clock, Crown, FileText } from "lucide-react";
import { modelTests } from "@/lib/exam-data";
import { MARK_CORRECT } from "@/lib/exam-utils";
import { toBanglaNumber } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "মডেল টেস্ট",
  description: "BCS, Bank, NTRCA, Primary ও বিশ্ববিদ্যালয় ভর্তি পরীক্ষার মডেল টেস্ট",
};

export default function ModelTestPage() {
  // বিভাগ অনুযায়ী মডেল টেস্ট সাজানো
  const categories = Array.from(new Set(modelTests.map((t) => t.category)));

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-8">
        <h1 className="mb-1 font-display text-2xl font-bold">মডেল টেস্ট</h1>
        <p className="text-sm text-muted-foreground">
          বাস্তব পরীক্ষার পরিবেশে নিজেকে যাচাই করুন। (ডেমো তালিকা)
        </p>
      </div>

      <div className="space-y-8">
        {categories.map((category) => (
          <section key={category}>
            <h2 className="mb-3 font-display text-lg font-bold">{category} Model Test</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {modelTests
                .filter((t) => t.category === category)
                .map((test) => (
                  <div key={test.id} className="flex flex-col rounded-xl border border-border bg-card p-5">
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <h3 className="font-semibold leading-snug">{test.title}</h3>
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
                          <span className="font-mono">{toBanglaNumber(test.syllabusCoverage)}%</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-border">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${test.syllabusCoverage}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mb-4 flex gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FileText size={13} /> {toBanglaNumber(test.questions)} প্রশ্ন
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={13} /> {toBanglaNumber(test.durationMin)} মিনিট
                      </span>
                    </div>

                    <Link
                      href={`/exam?test=${test.id}`}
                      className="mt-auto rounded-lg bg-primary py-2 text-center text-sm font-medium text-primary-foreground hover:opacity-90"
                    >
                      পরীক্ষা শুরু করুন
                    </Link>
                  </div>
                ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}