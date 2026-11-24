// frontend/src/lib/question-progress.ts
import { getQuestionById } from "@/lib/exam-data";

// ⚠️ প্রশ্ন পড়া ও বুকমার্ক এখন শুধু এই ব্রাউজারে (localStorage) থাকে। ব্যাকএন্ড যুক্ত হলে অ্যাকাউন্টে যাবে।
export const QUESTION_PROGRESS_KEY = "examnest-question-progress";

export type QuestionProgress = {
  read: string[]; // ব্যবহারকারী নিজে "পড়া হয়েছে" চিহ্নিত করেছেন
  bookmarked: string[];
};

export function emptyQuestionProgress(): QuestionProgress {
  return { read: [], bookmarked: [] };
}

// ব্রাউজারে রাখা তথ্য বদলানো থাকতে পারে, তাই অজানা প্রশ্ন বাদ দিয়ে ও পুনরাবৃত্তি সরিয়ে নেওয়া হয়
function cleanIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return Array.from(
    new Set(
      value.filter(
        (id): id is string => typeof id === "string" && getQuestionById(id) !== undefined,
      ),
    ),
  );
}

export function loadQuestionProgress(): QuestionProgress {
  try {
    const raw = localStorage.getItem(QUESTION_PROGRESS_KEY);
    if (!raw) return emptyQuestionProgress();
    const data: unknown = JSON.parse(raw);
    if (typeof data !== "object" || data === null) return emptyQuestionProgress();

    const record = data as Record<string, unknown>;
    return { read: cleanIds(record.read), bookmarked: cleanIds(record.bookmarked) };
  } catch {
    return emptyQuestionProgress();
  }
}

export function saveQuestionProgress(progress: QuestionProgress): void {
  try {
    localStorage.setItem(QUESTION_PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // সংরক্ষণ না হলেও পেজ চলবে
  }
}