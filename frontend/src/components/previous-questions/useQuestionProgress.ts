// frontend/src/components/previous-questions/useQuestionProgress.ts
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  emptyQuestionProgress,
  loadQuestionProgress,
  saveQuestionProgress,
  type QuestionProgress,
} from "@/lib/question-progress";

// প্রশ্ন পড়া ও বুকমার্কের অবস্থা (ব্রাউজারে সংরক্ষিত)
export function useQuestionProgress() {
  const [state, setState] = useState<QuestionProgress>(emptyQuestionProgress);
  const [ready, setReady] = useState(false);
  const latest = useRef(state);

  useEffect(() => {
    const loaded = loadQuestionProgress();
    latest.current = loaded;
    setState(loaded);
    setReady(true);
  }, []);

  const readSet = useMemo(() => new Set(state.read), [state.read]);
  const bookmarkSet = useMemo(() => new Set(state.bookmarked), [state.bookmarked]);

  const commit = useCallback((next: QuestionProgress) => {
    latest.current = next;
    setState(next);
    saveQuestionProgress(next);
  }, []);

  const isRead = useCallback((id: string) => readSet.has(id), [readSet]);
  const isBookmarked = useCallback((id: string) => bookmarkSet.has(id), [bookmarkSet]);

  const toggleRead = useCallback(
    (id: string) => {
      const read = latest.current.read;
      commit({
        ...latest.current,
        read: read.includes(id) ? read.filter((x) => x !== id) : [...read, id],
      });
    },
    [commit],
  );

  const toggleBookmark = useCallback(
    (id: string) => {
      const marked = latest.current.bookmarked;
      commit({
        ...latest.current,
        bookmarked: marked.includes(id) ? marked.filter((x) => x !== id) : [...marked, id],
      });
    },
    [commit],
  );

  // একসাথে অনেকগুলো প্রশ্ন "পড়া হয়েছে" বা "পড়া হয়নি" করা
  const setReadMany = useCallback(
    (ids: string[], value: boolean) => {
      const current = new Set(latest.current.read);
      for (const id of ids) {
        if (value) current.add(id);
        else current.delete(id);
      }
      commit({ ...latest.current, read: Array.from(current) });
    },
    [commit],
  );

  return {
    ready,
    // সংরক্ষণের ক্রমে আইডির তালিকা (সবচেয়ে নতুনটি শেষে)
    readIds: state.read,
    bookmarkedIds: state.bookmarked,
    isRead,
    isBookmarked,
    toggleRead,
    toggleBookmark,
    setReadMany,
  };
}

export type QuestionProgressApi = ReturnType<typeof useQuestionProgress>;