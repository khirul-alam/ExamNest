// frontend/src/lib/subject-stats.ts
import type { Subject } from "@/lib/subjects-data";

export type SubjectStats = {
  chapters: number;
  topics: number;
  mcq: number;
  // "পড়া শুরু করুন" লিংক (কনটেন্ট না থাকলে null)
  startHref: string | null;
};

// একটি বিষয়ের অধ্যায়, টপিক ও MCQ সংখ্যা গণনা করা।
// ব্যাকএন্ড যুক্ত হলে এই হিসাব ডাটাবেজের Count/Aggregate থেকে আসবে।
export function getSubjectStats(subject: Subject): SubjectStats {
  const topics = subject.chapters.flatMap((chapter) => chapter.topics);

  return {
    chapters: subject.chapters.length,
    topics: topics.length,
    mcq: topics.reduce((sum, topic) => sum + topic.questionCount, 0),
    startHref:
      topics.length > 0 ? `/subjects/${subject.slug}/${topics[0].slug}` : null,
  };
}