// frontend/src/components/exam/QuestionPalette.tsx
import { toBanglaNumber } from "@/lib/pricing";
import type { QuestionInstance } from "@/lib/exam-utils";

type Props = {
  questions: QuestionInstance[];
  answers: Record<string, number>;
  flags: string[];
  current: number;
  onGo: (index: number) => void;
};

// অবস্থার অগ্রাধিকার: বর্তমান > রিভিউ > উত্তর দেওয়া > উত্তর না দেওয়া
function statusClass(isCurrent: boolean, isFlagged: boolean, isAnswered: boolean): string {
  if (isCurrent) return "bg-blue-500 text-white";
  if (isFlagged) return "bg-amber-400 text-black";
  if (isAnswered) return "bg-emerald-500 text-white";
  return "border border-border bg-muted text-muted-foreground";
}

export function QuestionPalette({ questions, answers, flags, current, onGo }: Props) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h3 className="mb-3 text-sm font-semibold">Question Palette</h3>
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 lg:grid-cols-5">
        {questions.map((q, index) => (
          <button
            key={q.id}
            onClick={() => onGo(index)}
            aria-label={`প্রশ্ন ${index + 1}`}
            className={`h-9 rounded-lg font-mono text-xs font-bold transition-opacity hover:opacity-80 ${statusClass(
              index === current,
              flags.includes(q.id),
              answers[q.id] !== undefined,
            )}`}
          >
            {toBanglaNumber(index + 1)}
          </button>
        ))}
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-1.5 text-xs text-muted-foreground">
        <li>🟢 Answered</li>
        <li>⚪ Not Answered</li>
        <li>🟡 Review Later</li>
        <li>🔵 Current</li>
      </ul>
    </div>
  );
}