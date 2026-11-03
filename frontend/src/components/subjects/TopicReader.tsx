// frontend/src/components/subjects/TopicReader.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { Bookmark, CheckCircle2, ChevronRight, Clock, Flag, Lock, Target } from "lucide-react";
import { CollapsibleSection } from "./CollapsibleSection";
import { PracticeMcq } from "./PracticeMcq";
import { PreviousQuestionCard } from "./PreviousQuestionCard";
import { ReportErrorModal } from "./ReportErrorModal";
import { useAuthPreview } from "@/components/providers/AuthPreviewProvider";
import { useStudyProgress } from "@/components/providers/StudyProgressPreviewProvider";
import { toBanglaNumber } from "@/lib/pricing";
import type { Chapter, Subject, Topic, TopicContent } from "@/lib/subjects-data";

type Props = {
  subject: Subject;
  chapter: Chapter;
  topic: Topic;
  content: TopicContent | null;
};

// তথ্যভিত্তিক চারটি সেকশনের সাজসজ্জা
const infoSections = [
  { key: "important", icon: "💡", title: "গুরুত্বপূর্ণ তথ্য", header: "bg-amber-50 dark:bg-card", text: "text-amber-600 dark:text-amber-400" },
  { key: "content", icon: "📖", title: "বিষয়বস্তু", header: "bg-blue-50 dark:bg-card", text: "text-blue-600 dark:text-blue-400" },
  { key: "shortcut", icon: "⚡", title: "Shortcut Technique", header: "bg-violet-50 dark:bg-card", text: "text-violet-600 dark:text-violet-400" },
  { key: "bcsNote", icon: "🎯", title: "BCS Special Notes", header: "bg-emerald-50 dark:bg-card", text: "text-emerald-700 dark:text-emerald-400" },
] as const;

export function TopicReader({ subject, chapter, topic, content }: Props) {
  const { isLoggedIn } = useAuthPreview();
  const progress = useStudyProgress();

  const [needLogin, setNeedLogin] = useState(false);
  const [reportTarget, setReportTarget] = useState<string | null>(null);

  const completed = progress.isCompleted(subject.slug, topic.slug);
  const bookmarked = progress.isBookmarked(subject.slug, topic.slug);

  // বিষয়ের মোট প্রোগ্রেস
  const allTopics = subject.chapters.flatMap((c) => c.topics);
  const doneCount = allTopics.filter((t) => progress.isCompleted(subject.slug, t.slug)).length;
  const percent = allTopics.length ? Math.round((doneCount / allTopics.length) * 100) : 0;
  const bookmarkedTopics = allTopics.filter((t) => progress.isBookmarked(subject.slug, t.slug));

  // লগইন ছাড়া বুকমার্ক বা সম্পন্ন চিহ্নিত করলে লগইনের অনুরোধ দেখানো হয়
  const guarded = (action: () => void) => () => {
    if (!isLoggedIn) {
      setNeedLogin(true);
      return;
    }
    setNeedLogin(false);
    action();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* ব্রেডক্রাম্ব */}
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Link href="/subjects" className="text-primary hover:underline">বিষয়সমূহ</Link>
        <ChevronRight size={14} />
        <Link href={`/subjects/${subject.slug}`} className="text-primary hover:underline">
          {subject.name}
        </Link>
        <ChevronRight size={14} />
        <span className="text-foreground">{topic.name}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* বাম সাইডবার */}
        <aside className="lg:col-span-1">
          <div className="sticky top-20 space-y-4 rounded-xl border border-border bg-card p-4">
            <div>
              <h4 className="mb-1 text-sm font-semibold">{chapter.name}</h4>
              <ul className="space-y-1">
                {chapter.topics.map((t) => {
                  const isCurrent = t.slug === topic.slug;
                  const done = progress.isCompleted(subject.slug, t.slug);
                  return (
                    <li key={t.slug}>
                      <Link
                        href={`/subjects/${subject.slug}/${t.slug}`}
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                          isCurrent ? "bg-primary/10 text-primary" : "hover:bg-muted"
                        }`}
                      >
                        {isLoggedIn && done ? (
                          <CheckCircle2 size={14} className="shrink-0 text-emerald-600" />
                        ) : (
                          <Clock size={14} className="shrink-0 text-muted-foreground" />
                        )}
                        <span className="truncate">{t.name}</span>
                        {isLoggedIn && progress.isBookmarked(subject.slug, t.slug) && (
                          <Bookmark size={12} className="shrink-0 text-amber-600" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {isLoggedIn ? (
              <>
                <div className="border-t border-border pt-4">
                  <div className="mb-2 flex items-center justify-between font-mono text-xs text-muted-foreground">
                    <span>📊 Subject Progress</span>
                    <span className="text-primary">{toBanglaNumber(percent)}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    সম্পন্ন {toBanglaNumber(doneCount)}/{toBanglaNumber(allTopics.length)} · বাকি{" "}
                    {toBanglaNumber(allTopics.length - doneCount)}
                  </p>
                </div>

                <div className="border-t border-border pt-4">
                  <h5 className="mb-2 text-xs font-semibold">🔖 বুকমার্ক তালিকা</h5>
                  {bookmarkedTopics.length === 0 ? (
                    <p className="text-xs text-muted-foreground">কোনো বুকমার্ক নেই</p>
                  ) : (
                    <ul className="space-y-1">
                      {bookmarkedTopics.map((t) => (
                        <li key={t.slug}>
                          <Link
                            href={`/subjects/${subject.slug}/${t.slug}`}
                            className="block truncate text-xs text-primary hover:underline"
                          >
                            {t.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            ) : (
              <p className="flex items-start gap-1.5 border-t border-border pt-4 text-xs text-muted-foreground">
                <Lock size={12} className="mt-0.5 shrink-0" />
                Progress ও বুকমার্ক দেখতে লগইন করুন
              </p>
            )}
          </div>
        </aside>

        {/* মূল কনটেন্ট */}
        <div className="space-y-4 lg:col-span-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-display text-xl font-bold">{topic.name}</h1>
              <p className="mt-0.5 text-xs text-muted-foreground">{chapter.name}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={guarded(() => progress.toggleBookmarked(subject.slug, topic.slug))}
                aria-label="বুকমার্ক"
                aria-pressed={bookmarked}
                className={`rounded-lg border p-2 transition-colors ${
                  isLoggedIn && bookmarked
                    ? "border-amber-500 text-amber-600"
                    : "border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                <Bookmark size={16} fill={isLoggedIn && bookmarked ? "currentColor" : "none"} />
              </button>
              <button
                type="button"
                onClick={() => setReportTarget(`টপিক: ${topic.name}`)}
                className="flex items-center gap-1.5 rounded-lg border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 dark:border-red-900 dark:bg-red-950/30"
              >
                <Flag size={13} /> Report Error
              </button>
            </div>
          </div>

          {needLogin && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm">
              <span>এই সুবিধা পেতে লগইন করতে হবে।</span>
              <span className="flex gap-2">
                <Link href="/login" className="rounded-md border border-border bg-card px-3 py-1 font-medium">
                  লগইন
                </Link>
                <Link href="/register" className="rounded-md bg-primary px-3 py-1 font-medium text-primary-foreground">
                  ফ্রি রেজিস্ট্রেশন
                </Link>
              </span>
            </div>
          )}

          {content ? (
            <>
              {infoSections.map((section) => (
                <CollapsibleSection
                  key={section.key}
                  icon={section.icon}
                  title={section.title}
                  headerClassName={section.header}
                  titleClassName={section.text}
                >
                  <p className="whitespace-pre-line px-4 py-3 text-sm leading-relaxed">
                    {content[section.key]}
                  </p>
                </CollapsibleSection>
              ))}

              <CollapsibleSection icon="📌" title="বিগত বছরের প্রশ্ন">
                <div className="divide-y divide-border">
                  {content.previousQuestions.map((q) => (
                    <PreviousQuestionCard key={q.id} question={q} onReport={setReportTarget} />
                  ))}
                </div>
              </CollapsibleSection>

              <CollapsibleSection icon="🏋️" title="Practice MCQ">
                <PracticeMcq questions={content.practiceQuestions} onReport={setReportTarget} />
              </CollapsibleSection>
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
              এই টপিকের কনটেন্ট শীঘ্রই যুক্ত করা হবে।
            </div>
          )}

          {/* টপিক সম্পন্ন ও পরীক্ষা */}
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={guarded(() => progress.toggleCompleted(subject.slug, topic.slug))}
              className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium ${
                isLoggedIn && completed
                  ? "border border-emerald-600 text-emerald-700 dark:text-emerald-400"
                  : "bg-primary text-primary-foreground hover:opacity-90"
              }`}
            >
              <CheckCircle2 size={16} />
              {isLoggedIn && completed ? "সম্পন্ন ✔ (বাতিল করুন)" : "টপিক সম্পন্ন চিহ্নিত করুন"}
            </button>
            <Link
              href={`/exam?subject=${subject.slug}&topic=${topic.slug}`}
              className="flex items-center gap-2 rounded-lg border border-primary px-5 py-2.5 text-sm font-medium text-primary hover:bg-primary/10"
            >
              <Target size={16} /> এই টপিকের পরীক্ষা দিন
            </Link>
          </div>
        </div>
      </div>

      <ReportErrorModal
        open={reportTarget !== null}
        targetLabel={reportTarget ?? ""}
        onClose={() => setReportTarget(null)}
      />
    </div>
  );
}