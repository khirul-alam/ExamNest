// frontend/src/lib/last-topic.ts
import { getTopicRef } from "@/lib/subjects-data";

// ⚠️ শেষ খোলা টপিক এখন শুধু এই ব্রাউজারে থাকে। ব্যাকএন্ড যুক্ত হলে অ্যাকাউন্টে যাবে।
export const LAST_TOPIC_KEY = "examnest-last-topic";

export type LastTopic = {
  subjectSlug: string;
  topicSlug: string;
  visitedAt: number;
};

export function saveLastTopic(subjectSlug: string, topicSlug: string): void {
  try {
    localStorage.setItem(
      LAST_TOPIC_KEY,
      JSON.stringify({ subjectSlug, topicSlug, visitedAt: Date.now() }),
    );
  } catch {
    // সংরক্ষণ না হলেও পেজ চলবে
  }
}

// ব্রাউজারে রাখা তথ্য যাচাই করে ফেরত দেয়; যে টপিক আর নেই সেটি বাদ
export function loadLastTopic(): LastTopic | null {
  try {
    const raw = localStorage.getItem(LAST_TOPIC_KEY);
    if (!raw) return null;
    const data: unknown = JSON.parse(raw);
    if (typeof data !== "object" || data === null) return null;

    const item = data as Partial<LastTopic>;
    if (
      typeof item.subjectSlug !== "string" ||
      typeof item.topicSlug !== "string" ||
      typeof item.visitedAt !== "number"
    ) {
      return null;
    }
    if (!getTopicRef(item.subjectSlug, item.topicSlug)) return null;

    return {
      subjectSlug: item.subjectSlug,
      topicSlug: item.topicSlug,
      visitedAt: item.visitedAt,
    };
  } catch {
    return null;
  }
}