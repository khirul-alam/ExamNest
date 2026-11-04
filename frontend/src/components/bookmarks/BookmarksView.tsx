// frontend/src/components/bookmarks/BookmarksView.tsx
"use client";

import Link from "next/link";
import { Bookmark, CheckCircle2, Trash2 } from "lucide-react";
import { useStudyProgress } from "@/components/providers/StudyProgressPreviewProvider";
import { toBanglaNumber } from "@/lib/pricing";
import { allSubjects } from "@/lib/subjects-data";

// সব টপিকের সমতল তালিকা (বিষয় ও অধ্যায়সহ)
const allTopics = allSubjects.flatMap((subject) =>
  subject.chapters.flatMap((chapter) =>
    chapter.topics.map((topic) => ({ subject, chapter, topic })),
  ),
);

export function BookmarksView() {
  const progress = useStudyProgress();

  const bookmarked = allTopics.filter(({ subject, topic }) =>
    progress.isBookmarked(subject.slug, topic.slug),
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="mb-6 flex items-center gap-3">
        <Bookmark size={22} className="text-amber-600" />
        <div>
          <h1 className="font-display text-2xl font-bold">বুকমার্ক</h1>
          <p className="text-sm text-muted-foreground">
            {toBanglaNumber(bookmarked.length)}টি টপিক সংরক্ষিত
          </p>
        </div>
      </div>

      {bookmarked.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
          <p className="mb-3 text-sm text-muted-foreground">এখনও কোনো টপিক বুকমার্ক করা হয়নি।</p>
          <Link
            href="/subjects"
            className="inline-block rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground"
          >
            বিষয়সমূহ দেখুন
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {bookmarked.map(({ subject, chapter, topic }) => (
            <li
              key={`${subject.slug}/${topic.slug}`}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
            >
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-2xl"
                style={{ backgroundColor: `${subject.color}1a` }}
              >
                {subject.icon}
              </span>
              <Link href={`/subjects/${subject.slug}/${topic.slug}`} className="min-w-0 flex-1">
                <p className="flex items-center gap-2 font-semibold hover:text-primary">
                  <span className="truncate">{topic.name}</span>
                  {progress.isCompleted(subject.slug, topic.slug) && (
                    <CheckCircle2 size={14} className="shrink-0 text-emerald-600" />
                  )}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {subject.name} · {chapter.name}
                </p>
              </Link>
              <button
                onClick={() => progress.toggleBookmarked(subject.slug, topic.slug)}
                aria-label={`${topic.name} বুকমার্ক থেকে সরান`}
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}