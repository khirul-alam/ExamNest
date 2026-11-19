// frontend/src/components/dashboard/WeeklySchedule.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { DashboardCard } from "./DashboardCard";
import {
  getItemHref,
  getItemLabel,
  scheduleOptions,
  weekDays,
  type DayKey,
  type Schedule,
} from "@/lib/study-schedule";

type Props = {
  schedule: Schedule;
  todayKey: DayKey;
  onChange: (schedule: Schedule) => void;
};

export function WeeklySchedule({ schedule, todayKey, onChange }: Props) {
  const [editing, setEditing] = useState(false);

  // একটি দিনে কোনো বিষয় বা কাজ যোগ বা বাদ দেওয়া
  const toggle = (day: DayKey, id: string) => {
    const current = schedule[day];
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    onChange({ ...schedule, [day]: next });
  };

  return (
    <DashboardCard
      title="সাপ্তাহিক রুটিন"
      icon={CalendarDays}
      action={
        <button
          onClick={() => setEditing((v) => !v)}
          className="text-xs text-primary hover:underline"
        >
          {editing ? "সম্পন্ন" : "সম্পাদনা"}
        </button>
      }
    >
      <ul className="space-y-2">
        {weekDays.map((day) => {
          const isToday = day.key === todayKey;
          const items = schedule[day.key];

          return (
            <li
              key={day.key}
              className={`rounded-lg px-3 py-2 ${isToday ? "bg-primary/10 ring-1 ring-primary/40" : "bg-muted"}`}
            >
              <p className="mb-1 flex items-center gap-2 text-xs font-semibold">
                {day.label}
                {isToday && (
                  <span className="rounded bg-primary px-1.5 py-0.5 text-xs font-normal text-primary-foreground">
                    আজ
                  </span>
                )}
              </p>

              {editing ? (
                <div className="flex flex-wrap gap-1.5">
                  {scheduleOptions.map((option) => {
                    const selected = items.includes(option.id);
                    return (
                      <button
                        key={option.id}
                        onClick={() => toggle(day.key, option.id)}
                        aria-pressed={selected}
                        className={`rounded-full border px-2 py-0.5 text-xs transition-colors ${
                          selected
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-card text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              ) : items.length === 0 ? (
                <p className="text-xs text-muted-foreground">কিছু ঠিক করা নেই</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {items.map((id) => (
                    <Link
                      key={id}
                      href={getItemHref(id)}
                      className="rounded-full border border-border bg-card px-2 py-0.5 text-xs hover:border-primary hover:text-primary"
                    >
                      {getItemLabel(id)}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-xs text-muted-foreground">
        নিজের সাপ্তাহিক রুটিন ঠিক করুন, আজকের দিনের কাজ &quot;আজকের করণীয়&quot;-তে আসবে।
      </p>
    </DashboardCard>
  );
}