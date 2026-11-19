// frontend/src/components/dashboard/DailyGoalCard.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, Target } from "lucide-react";
import { DashboardCard } from "./DashboardCard";
import { DAILY_GOAL_MAX, DAILY_GOAL_MIN, isValidDailyGoal } from "@/lib/daily-goal";
import { toBanglaNumber } from "@/lib/pricing";

const presets = [20, 50, 100, 150] as const;

type Props = {
  answeredToday: number;
  goal: number;
  onGoalChange: (goal: number) => void;
};

export function DailyGoalCard({ answeredToday, goal, onGoalChange }: Props) {
  const [editing, setEditing] = useState(false);
  const [custom, setCustom] = useState("");
  const [error, setError] = useState("");

  const percent = Math.min(100, Math.round((answeredToday / goal) * 100));
  const remaining = Math.max(0, goal - answeredToday);
  const done = remaining === 0;

  const applyGoal = (value: number) => {
    if (!isValidDailyGoal(value)) {
      setError(
        `লক্ষ্য ${toBanglaNumber(DAILY_GOAL_MIN)} থেকে ${toBanglaNumber(DAILY_GOAL_MAX)}-এর মধ্যে দিন`,
      );
      return;
    }
    setError("");
    onGoalChange(value);
    setEditing(false);
  };

  return (
    <DashboardCard
      title="আজকের লক্ষ্য"
      icon={Target}
      action={
        <button
          onClick={() => {
            setCustom(String(goal));
            setError("");
            setEditing((v) => !v);
          }}
          className="text-xs text-primary hover:underline"
        >
          {editing ? "বন্ধ করুন" : "লক্ষ্য বদলান"}
        </button>
      }
    >
      <div className="mb-3 flex items-end justify-between">
        <div>
          <span className="font-mono text-3xl font-bold text-primary">
            {toBanglaNumber(answeredToday)}
          </span>
          <span className="font-mono text-lg text-muted-foreground">
            {" "}
            / {toBanglaNumber(goal)} MCQ
          </span>
        </div>
        <span className="font-mono text-lg font-bold">{toBanglaNumber(percent)}%</span>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all ${done ? "bg-emerald-500" : "bg-primary"}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {done ? (
        <p className="mt-3 flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 size={15} /> আজকের লক্ষ্য পূরণ হয়েছে। চাইলে আরও অনুশীলন করতে পারেন।
        </p>
      ) : (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            লক্ষ্য পূরণে আরও {toBanglaNumber(remaining)}টি MCQ বাকি।
          </p>
          <Link
            href="/exam"
            className="rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            অনুশীলন শুরু করুন
          </Link>
        </div>
      )}

      <p className="mt-3 text-xs text-muted-foreground">
        পরীক্ষা ও অনুশীলনে উত্তর দেওয়া প্রশ্ন গোনা হয়। পড়ার সময় আলাদা করে মাপা হয় না।
      </p>

      {editing && (
        <div className="mt-4 rounded-lg bg-muted p-3">
          <p className="mb-2 text-xs font-medium">দৈনিক MCQ লক্ষ্য বেছে নিন</p>
          <div className="mb-2 flex flex-wrap gap-2">
            {presets.map((value) => (
              <button
                key={value}
                onClick={() => applyGoal(value)}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  goal === value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {toBanglaNumber(value)}টি
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              min={DAILY_GOAL_MIN}
              max={DAILY_GOAL_MAX}
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              aria-label="নিজের লক্ষ্য"
              className="w-32 rounded-lg border border-border bg-card px-3 py-1.5 text-sm outline-none focus:border-primary"
            />
            <button
              onClick={() => applyGoal(Number(custom))}
              className="rounded-lg border border-primary px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10"
            >
              সংরক্ষণ
            </button>
          </div>
          {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
        </div>
      )}
    </DashboardCard>
  );
}