// frontend/src/lib/subject-progress.ts
import type { Subject } from "@/lib/subjects-data";

export type ProgressStatus = "not-started" | "in-progress" | "completed";

export type SubjectProgress = {
  total: number; // মোট টপিক
  done: number; // সম্পন্ন টপিক
  percent: number;
  status: ProgressStatus;
  // "পড়া শুরু/চালিয়ে যান" লিংক: প্রথম অসম্পন্ন টপিক, সব শেষ হলে প্রথম টপিক
  resumeHref: string | null;
};

// একটি বিষয়ে ব্যবহারকারীর অগ্রগতি হিসাব করা
export function getSubjectProgress(
  subject: Subject,
  isCompleted: (subjectSlug: string, topicSlug: string) => boolean,
): SubjectProgress {
  const topics = subject.chapters.flatMap((chapter) => chapter.topics);
  const total = topics.length;
  const done = topics.filter((topic) => isCompleted(subject.slug, topic.slug)).length;

  const nextTopic = topics.find((topic) => !isCompleted(subject.slug, topic.slug));
  const resumeTopic = nextTopic ?? topics[0];

  let status: ProgressStatus = "in-progress";
  if (done === 0) status = "not-started";
  else if (done === total) status = "completed";

  return {
    total,
    done,
    percent: total ? Math.round((done / total) * 100) : 0,
    status,
    resumeHref: resumeTopic ? `/subjects/${subject.slug}/${resumeTopic.slug}` : null,
  };
}