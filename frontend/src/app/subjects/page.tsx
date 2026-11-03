// frontend/src/app/subjects/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { allSubjects, countTopics } from "@/lib/subjects-data";
import { toBanglaNumber } from "@/lib/pricing";

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
          const topics = countTopics(subject);
          return (
            <Link
              key={subject.slug}
              href={`/subjects/${subject.slug}`}
              className="group rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg text-3xl"
                style={{ backgroundColor: `${subject.color}1a` }}
              >
                {subject.icon}
              </div>
              <h2 className="mb-3 font-semibold leading-snug group-hover:text-primary">
                {subject.name}
              </h2>
              <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
                <span>
                  {topics > 0
                    ? `${toBanglaNumber(subject.chapters.length)} অধ্যায় · ${toBanglaNumber(topics)} টপিক`
                    : "শীঘ্রই আসছে"}
                </span>
                <span className="flex items-center gap-1 text-primary">
                  পড়ুন <ChevronRight size={12} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}