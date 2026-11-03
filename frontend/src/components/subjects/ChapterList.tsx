// frontend/src/components/subjects/ChapterList.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { Bookmark, CheckCircle2, ChevronDown, ChevronRight, ChevronUp, Clock } from "lucide-react";
import { useAuthPreview } from "@/components/providers/AuthPreviewProvider";
import { useStudyProgress } from "@/components/providers/StudyProgressPreviewProvider";
import { toBanglaNumber } from "@/lib/pricing";
import type { Subject } from "@/lib/subjects-data";

export function ChapterList({ subject }: { subject: Subject }) {
  const { isLoggedIn } = useAuthPreview();
  const progress = useStudyProgress();
  // প্রথম অধ্যায় শুরুতে খোলা থাকবে
  const [openChapter, setOpenChapter] = useState<string | null>(subject.chapters[0]?.slug ?? null);

  return (
    <div className="space-y-3">
      {subject.chapters.map((chapter) => {
        const total = chapter.topics.length;
        const done = chapter.topics.filter((t) => progress.isCompleted(subject.slug, t.slug)).length;
        const percent = total ? Math.round((done / total) * 100) : 0;
        const isOpen = openChapter === chapter.slug;

        return (
          <div key={chapter.slug} className="overflow-hidden rounded-xl border border-border bg-card">
            <button
              type="button"
              onClick={() => setOpenChapter(isOpen ? null : chapter.slug)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between px-4 py-4"
            >
              <div className="text-left">
                <p className="text-sm font-semibold">{chapter.name}</p>
                <div className="mt-1 flex items-center gap-3 font-mono text-xs text-muted-foreground">
                  {isLoggedIn ? (
                    <>
                      <span>
                        ✅ {toBanglaNumber(done)}/{toBanglaNumber(total)} টপিক
                      </span>
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
                      </div>
                      <span className="text-primary">{toBanglaNumber(percent)}%</span>
                    </>
                  ) : (
                    <span>{toBanglaNumber(total)}টি টপিক</span>
                  )}
                </div>
              </div>
              {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {isOpen && (
              <ul className="divide-y divide-border border-t border-border">
                {chapter.topics.map((topic) => (
                  <li key={topic.slug}>
                    <Link
                      href={`/subjects/${subject.slug}/${topic.slug}`}
                      className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-muted"
                    >
                      <span className="flex items-center gap-2 text-sm">
                        {isLoggedIn && progress.isCompleted(subject.slug, topic.slug) ? (
                          <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
                        ) : (
                          <Clock size={16} className="shrink-0 text-muted-foreground" />
                        )}
                        {topic.name}
                        {isLoggedIn && progress.isBookmarked(subject.slug, topic.slug) && (
                          <Bookmark size={13} className="text-amber-600" />
                        )}
                      </span>
                      <span className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
                        {toBanglaNumber(topic.questionCount)} প্রশ্ন
                        <ChevronRight size={14} />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}