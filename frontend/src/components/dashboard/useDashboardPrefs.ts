// frontend/src/components/dashboard/useDashboardPrefs.ts
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DEFAULT_DAILY_GOAL,
  isValidDailyGoal,
  loadDailyGoal,
  saveDailyGoal,
} from "@/lib/daily-goal";
import { emptySchedule, loadSchedule, saveSchedule, type Schedule } from "@/lib/study-schedule";

// দৈনিক MCQ লক্ষ্য (ব্রাউজারে সংরক্ষিত)
export function useDailyGoal() {
  const [goal, setGoal] = useState(DEFAULT_DAILY_GOAL);

  useEffect(() => {
    setGoal(loadDailyGoal());
  }, []);

  const update = useCallback((value: number) => {
    if (!isValidDailyGoal(value)) return;
    setGoal(value);
    saveDailyGoal(value);
  }, []);

  return { goal, update };
}

// সাপ্তাহিক রুটিন (ব্রাউজারে সংরক্ষিত)
export function useSchedule() {
  const [schedule, setSchedule] = useState<Schedule>(emptySchedule);

  useEffect(() => {
    setSchedule(loadSchedule());
  }, []);

  const update = useCallback((next: Schedule) => {
    setSchedule(next);
    saveSchedule(next);
  }, []);

  return { schedule, update };
}