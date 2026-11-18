// frontend/src/lib/attempts.ts
import { getQuestionById } from "@/lib/exam-data";
import type { ExamSession } from "@/lib/exam-utils";

// ⚠️ পরীক্ষার ফলাফল এখন শুধু এই ব্রাউজারে (localStorage) জমা থাকে।
// ব্যাকএন্ড যুক্ত হলে ডাটাবেজে যাবে এবং একই হিসাব সার্ভারে হবে।

export type AttemptReason = "manual" | "time" | "violation";

export type Attempt = {
  id: string;
  finishedAt: number;
  reason: AttemptReason;
  // প্রশ্ন, অপশনের ক্রম ও উত্তরসহ পুরো পরীক্ষা (ফলাফল ও সমাধান পুনরায় দেখানোর জন্য)
  session: ExamSession;
};

export const ATTEMPTS_KEY = "examnest-attempts";
// সর্বশেষ এতগুলো পরীক্ষা রাখা হয় (ব্রাউজারের জায়গা বাঁচাতে)
export const MAX_ATTEMPTS = 50;

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

// ব্রাউজারে রাখা তথ্য বদলানো থাকতে পারে, তাই পরীক্ষার গঠন যাচাই করে নেওয়া হয়
function isValidSession(value: unknown): value is ExamSession {
  if (typeof value !== "object" || value === null) return false;
  const s = value as Partial<ExamSession>;

  return (
    typeof s.title === "string" &&
    (s.mode === "practice" || s.mode === "model") &&
    typeof s.durationSec === "number" &&
    typeof s.startedAt === "number" &&
    typeof s.endsAt === "number" &&
    Array.isArray(s.questions) &&
    s.questions.length > 0 &&
    s.questions.every(
      (q) =>
        typeof q?.id === "string" &&
        Array.isArray(q.optionOrder) &&
        q.optionOrder.length === 4 &&
        getQuestionById(q.id) !== undefined,
    ) &&
    typeof s.answers === "object" &&
    s.answers !== null &&
    Object.values(s.answers).every((v) => Number.isInteger(v) && v >= 0 && v <= 3) &&
    Array.isArray(s.flags) &&
    typeof s.current === "number" &&
    typeof s.violations === "number"
  );
}

// সব পরীক্ষা পুরনো থেকে নতুন ক্রমে ফেরত দেয়
export function loadAttempts(): Attempt[] {
  try {
    const raw = localStorage.getItem(ATTEMPTS_KEY);
    if (!raw) return [];
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];

    const attempts: Attempt[] = [];
    for (const item of data) {
      if (
        typeof item?.id === "string" &&
        typeof item.finishedAt === "number" &&
        (item.reason === "manual" || item.reason === "time" || item.reason === "violation") &&
        isValidSession(item.session)
      ) {
        attempts.push({
          id: item.id,
          finishedAt: item.finishedAt,
          reason: item.reason,
          session: item.session,
        });
      }
    }
    return attempts.sort((a, b) => a.finishedAt - b.finishedAt);
  } catch {
    return [];
  }
}

// একটি সম্পন্ন পরীক্ষা সংরক্ষণ করা
export function recordAttempt(input: {
  session: ExamSession;
  reason: AttemptReason;
  finishedAt: number;
}): void {
  try {
    const attempts = loadAttempts();
    attempts.push({ id: newId(), ...input });
    localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts.slice(-MAX_ATTEMPTS)));
  } catch {
    // সংরক্ষণ না হলেও ফলাফল দেখানো চলবে
  }
}