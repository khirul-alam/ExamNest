// frontend/src/components/bookmarks/BookmarksView.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Bookmark, CheckCircle2, Loader2, Play, Trash2 } from "lucide-react";
import { useStartSession } from "@/components/model-test/useStartSession";
import { PyqQuestionCard } from "@/components/previous-questions/PyqQuestionCard";
import { useQuestionProgress } from "@/components/previous-questions/useQuestionProgress";
import { useStudyProgress } from "@/components/providers/StudyProgressPreviewProvider";
import { ReportErrorModal } from "@/components/subjects/ReportErrorModal";
import { estimateDurationMin, getQuestionHistory } from "@/lib/analytics";
import { sessionFromQuestionIds } from "@/lib/custom-test";
import { getQuestionById } from "@/lib/exam-data";
import { getQuestionSources } from "@/lib/previous-questions-data";
import { toBanglaNumber } from "@/lib/pricing";
import { allSubjects, getSubject } from "@/lib/subjects-data";
import { useAttempts } from "@/lib/useAttempts";

type Tab = "topics" | "questions";

type Props = {
  initialTab?: Tab;
};

// সংরক্ষিত প্রশ্ন নিয়ে পরীক্ষায় একবারে সর্বোচ্চ এতগুলো প্রশ্ন
const SAVED_PRACTICE_MAX = 30;
const ALL = "all";

// সব টপিকের সমতল তালিকা (বিষয় ও অধ্যায়সহ)
const allTopics = allSubjects.flatMap((subject) =>
  subject.chapters.flatMap((chapter) =>
    chapter.topics.map((topic) => ({ subject, chapter, topic })),
  ),
);

export function BookmarksView({ initialTab = "topics" }: Props) {
  const topicProgress = useStudyProgress();
  const questionProgress = useQuestionProgress();
  const { attempts } = useAttempts();
  const startSession = useStartSession();

  const [tab, setTab] = useState<Tab>(initialTab);
  const [subjectFilter, setSubjectFilter] = useState(ALL);
  const [reportTarget, setReportTarget] = useState<string | null>(null);

  // সংরক্ষিত টপিক
  const savedTopics = allTopics.filter(({ subject, topic }) =>
    topicProgress.isBookmarked(subject.slug, topic.slug),
  );

  // সংরক্ষিত প্রশ্ন: সবচেয়ে নতুন সংরক্ষণ আগে
  const savedQuestionIds = useMemo(
    () => [...questionProgress.bookmarkedIds].reverse(),
    [questionProgress.bookmarkedIds],
  );

  // যেসব বিষয়ের প্রশ্ন সংরক্ষিত আছে, শুধু সেগুলোই ফিল্টারে আসে
  const subjectOptions = useMemo(() => {
    const slugs = new Set<string>();
    for (const id of savedQuestionIds) {
      const question = getQuestionById(id);
      if (question) slugs.add(question.subjectSlug);
    }
    return allSubjects.filter((subject) => slugs.has(subject.slug));
  }, [savedQuestionIds]);

  // বাছা বিষয়ের প্রশ্ন সব বুকমার্ক মুছে গেলে ফিল্টার নিজে "সব"-তে ফেরে
  const effectiveFilter = subjectOptions.some((s) => s.slug === subjectFilter)
    ? subjectFilter
    : ALL;

  const visibleQuestionIds = savedQuestionIds.filter((id) => {
    if (effectiveFilter === ALL) return true;
    return getQuestionById(id)?.subjectSlug === effectiveFilter;
  });

  const wrongSet = useMemo(() => getQuestionHistory(attempts).wrong, [attempts]);

  // সংরক্ষিত প্রশ্ন নিয়ে অনুশীলন শুরু (সাধারণ মোডে, ফুলস্ক্রিন ছাড়া)
  const handlePractice = () => {
    const ids = visibleQuestionIds.slice(0, SAVED_PRACTICE_MAX);
    const session = sessionFromQuestionIds({
      title: "সংরক্ষিত প্রশ্ন অনুশীলন",
      mode: "practice",
      durationMin: estimateDurationMin(ids.length),
      questionIds: ids,
    });
    if (session) startSession(session);
  };

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "topics", label: "টপিক", count: savedTopics.length },
    { id: "questions", label: "প্রশ্ন", count: savedQuestionIds.length },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="mb-6 flex items-center gap-3">
        <Bookmark size={22} className="text-amber-600" />
        <div>
          <h1 className="font-display text-2xl font-bold">বুকমার্ক</h1>
          <p className="text-sm text-muted-foreground">
            {toBanglaNumber(savedTopics.length)}টি টপিক · {toBanglaNumber(savedQuestionIds.length)}টি
            প্রশ্ন সংরক্ষিত
          </p>
        </div>
      </div>

      <div className="mb-6 flex gap-1 rounded-xl border border-border bg-muted p-1">
        {tabs.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            aria-pressed={tab === item.id}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
              tab === item.id ? "bg-card text-primary shadow" : "text-muted-foreground"
            }`}
          >
            {item.label} ({toBanglaNumber(item.count)})
          </button>
        ))}
      </div>

      {/* সংরক্ষিত টপিক */}
      {tab === "topics" &&
        (savedTopics.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
            <p className="mb-3 text-sm text-muted-foreground">
              এখনও কোনো টপিক বুকমার্ক করা হয়নি।
            </p>
            <Link
              href="/subjects"
              className="inline-block rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground"
            >
              বিষয়সমূহ দেখুন
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {savedTopics.map(({ subject, chapter, topic }) => (
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
                    {topicProgress.isCompleted(subject.slug, topic.slug) && (
                      <CheckCircle2 size={14} className="shrink-0 text-emerald-600" />
                    )}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {subject.name} · {chapter.name}
                  </p>
                </Link>
                <button
                  onClick={() => topicProgress.toggleBookmarked(subject.slug, topic.slug)}
                  aria-label={`${topic.name} বুকমার্ক থেকে সরান`}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        ))}

      {/* সংরক্ষিত প্রশ্ন */}
      {tab === "questions" &&
        (!questionProgress.ready ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-primary" />
          </div>
        ) : savedQuestionIds.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
            <p className="mb-1 text-sm text-muted-foreground">এখনও কোনো প্রশ্ন সংরক্ষণ করা হয়নি।</p>
            <p className="mb-4 text-xs text-muted-foreground">
              বিগত বছরের প্রশ্ন পেজে প্রশ্নের কার্ডের বুকমার্ক আইকন চেপে প্রশ্ন সংরক্ষণ করুন।
            </p>
            <Link
              href="/previous-questions"
              className="inline-block rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground"
            >
              বিগত বছরের প্রশ্ন দেখুন
            </Link>
          </div>
        ) : (
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              {subjectOptions.length > 1 && (
                <select
                  value={effectiveFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  aria-label="বিষয়"
                  className="rounded-lg border border-border bg-muted px-3 py-2 text-sm outline-none focus:border-primary"
                >
                  <option value={ALL}>সব বিষয়</option>
                  {subjectOptions.map((subject) => (
                    <option key={subject.slug} value={subject.slug}>
                      {getSubject(subject.slug)?.name}
                    </option>
                  ))}
                </select>
              )}
              <button
                onClick={handlePractice}
                disabled={visibleQuestionIds.length === 0}
                className="ml-auto flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Play size={14} /> সংরক্ষিত প্রশ্ন নিয়ে পরীক্ষা দিন
              </button>
            </div>

            <p className="mb-3 text-xs text-muted-foreground">
              {toBanglaNumber(visibleQuestionIds.length)}টি প্রশ্ন
              {visibleQuestionIds.length > SAVED_PRACTICE_MAX &&
                ` · পরীক্ষায় সবচেয়ে নতুন ${toBanglaNumber(SAVED_PRACTICE_MAX)}টি আসবে`}
            </p>

            <div className="space-y-4">
              {visibleQuestionIds.map((id, index) => {
                const question = getQuestionById(id);
                if (!question) return null;
                return (
                  <PyqQuestionCard
                    key={id}
                    question={question}
                    label={`#${toBanglaNumber(index + 1)}`}
                    sources={getQuestionSources(id)}
                    isRead={questionProgress.isRead(id)}
                    isBookmarked={questionProgress.isBookmarked(id)}
                    isWrong={wrongSet.has(id)}
                    canAct
                    onToggleRead={() => questionProgress.toggleRead(id)}
                    onToggleBookmark={() => questionProgress.toggleBookmark(id)}
                    onReport={setReportTarget}
                    onNeedLogin={() => undefined}
                  />
                );
              })}
            </div>
          </div>
        ))}

      <ReportErrorModal
        open={reportTarget !== null}
        targetLabel={reportTarget ?? ""}
        onClose={() => setReportTarget(null)}
      />
    </div>
  );
}