// frontend/src/components/model-test/useStartSession.ts
"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { enterFullscreen } from "@/components/exam/useExamGuards";
import { saveSession, type ExamSession } from "@/lib/exam-utils";

// তৈরি করা পরীক্ষা সংরক্ষণ করে সরাসরি চালু করে দেয়
export function useStartSession() {
  const router = useRouter();

  return useCallback(
    (session: ExamSession) => {
      // ফুলস্ক্রিন অনুরোধ অবশ্যই ক্লিকের সাথে সাথে করতে হয়
      if (session.mode === "model") void enterFullscreen();
      saveSession(session);
      router.push("/exam?resume=1");
    },
    [router],
  );
}