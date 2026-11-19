// frontend/src/components/dashboard/ContinueLearningCard.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BookOpen } from "lucide-react";
import { DashboardCard } from "./DashboardCard";
import { useStudyProgress } from "@/components/providers/StudyProgressPreviewProvider";
import { loadLastTopic, type LastTopic } from "@/lib/last-topic";
import { toBanglaNumber } from "@/lib/pricing";
import { getSubjectProgress } from "@/lib/subject-progress";
import { allSubjects, getTopicRef } from "@/lib/subjects-data";

export function ContinueLearningCard() {
  const progress = useStudyProgress();
  const [last, setLast] = useState<LastTopic | null>(null);
  const [ready, setReady] = useState(false);

  // শেষ খোলা টপিক ব্রাউজার থেকে পড়া
  useEffect(() => {
    setLast(loadLastTopic());
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <DashboardCard title="পড়া চালিয়ে যান" icon={BookOpen}>
        <p className="text-sm text-muted-foreground">লোড হচ্ছে...</p>
      </DashboardCard>
    );
  }

  // শেষ খোলা টপিক; না থাকলে সব বিষয় ঘুরে প্রথম অসম্পন্ন টপিক
  const lastRef = last ? getTopicRef(last.subjectSlug, last.topicSlug) : null;
  let target = lastRef;
  if (!target) {
    for (const subject of allSubjects) {
      for (const chapter of subject.chapters) {
        const topic = chapter.topics.find((t) => !progress.isCompleted(subject.slug, t.slug));
        if (topic && !target) target = { subject, chapter, topic };
      }
    }
  }

  if (!target) {
    return (
      <DashboardCard title="পড়া চালিয়ে যান" icon={BookOpen}>
        <p className="text-sm text-muted-foreground">
          পড়ার মতো টপিক এখন নেই। সব টপিক সম্পন্ন হয়েছে অথবা নতুন কনটেন্ট শীঘ্রই আসছে।
        </p>
      </DashboardCard>
    );
  }

  const { subject, chapter, topic } = target;
  const subjectProgress = getSubjectProgress(subject, progress.isCompleted);
  const topicDone = progress.isCompleted(subject.slug, topic.slug);

  // একই বিষয়ে এই টপিকের বাইরে পরের অসম্পন্ন টপিক
  const nextTopic = subject.chapters
    .flatMap((c) => c.topics)
    .find((t) => t.slug !== topic.slug && !progress.isCompleted(subject.slug, t.slug));

  return (
    <DashboardCard title="পড়া চালিয়ে যান" icon={BookOpen}>
      <p className="mb-1 text-xs text-muted-foreground">
        {lastRef ? "আপনি শেষ যেখানে ছিলেন" : "পড়া শুরু করার জন্য প্রস্তাবিত টপিক"}
      </p>
      <div className="mb-3 flex items-center gap-3">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-2xl"
          style={{ backgroundColor: `${subject.color}1a` }}
        >
          {subject.icon}
        </span>
        <div className="min-w-0">
          <p className="truncate font-semibold">{topic.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {subject.name} · {chapter.name}
          </p>
        </div>
      </div>

      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          বিষয়ের অগ্রগতি: {toBanglaNumber(subjectProgress.done)}/
          {toBanglaNumber(subjectProgress.total)} টপিক
        </span>
        <span className="font-mono font-bold" style={{ color: subject.color }}>
          {toBanglaNumber(subjectProgress.percent)}%
        </span>
      </div>
      <div className="mb-4 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${subjectProgress.percent}%`, backgroundColor: subject.color }}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={`/subjects/${subject.slug}/${topic.slug}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          {topicDone ? "আবার পড়ুন" : "পড়া চালিয়ে যান"} <ArrowRight size={14} />
        </Link>
        {nextTopic && (
          <Link
            href={`/subjects/${subject.slug}/${nextTopic.slug}`}
            className="text-sm text-primary hover:underline"
          >
            পরের টপিক: {nextTopic.name}
          </Link>
        )}
      </div>
    </DashboardCard>
  );
}