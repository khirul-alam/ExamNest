// frontend/src/components/providers/StudyProgressPreviewProvider.tsx
"use client";

import { createContext, useContext, useState } from "react";
import { demoUserState, topicKey } from "@/lib/subjects-data";

// ⚠️ ডিজাইন দেখার জন্য সাময়িক ব্যবস্থা। ব্যাকএন্ড যুক্ত হলে আসল API দিয়ে বদলানো হবে।
type StudyProgressValue = {
  isCompleted: (subjectSlug: string, topicSlug: string) => boolean;
  isBookmarked: (subjectSlug: string, topicSlug: string) => boolean;
  toggleCompleted: (subjectSlug: string, topicSlug: string) => void;
  toggleBookmarked: (subjectSlug: string, topicSlug: string) => void;
};

const StudyProgressContext = createContext<StudyProgressValue | null>(null);

// তালিকায় চাবি থাকলে বাদ দেয়, না থাকলে যোগ করে
function toggleInList(list: string[], key: string): string[] {
  return list.includes(key) ? list.filter((k) => k !== key) : [...list, key];
}

export function StudyProgressPreviewProvider({ children }: { children: React.ReactNode }) {
  const [completed, setCompleted] = useState<string[]>(demoUserState.completed);
  const [bookmarked, setBookmarked] = useState<string[]>(demoUserState.bookmarked);

  const value: StudyProgressValue = {
    isCompleted: (s, t) => completed.includes(topicKey(s, t)),
    isBookmarked: (s, t) => bookmarked.includes(topicKey(s, t)),
    toggleCompleted: (s, t) => setCompleted((prev) => toggleInList(prev, topicKey(s, t))),
    toggleBookmarked: (s, t) => setBookmarked((prev) => toggleInList(prev, topicKey(s, t))),
  };

  return (
    <StudyProgressContext.Provider value={value}>{children}</StudyProgressContext.Provider>
  );
}

export function useStudyProgress() {
  const ctx = useContext(StudyProgressContext);
  if (!ctx) {
    throw new Error("useStudyProgress অবশ্যই StudyProgressPreviewProvider-এর ভেতরে ব্যবহার করতে হবে");
  }
  return ctx;
}