// frontend/src/components/exam/ExamRunner.tsx
"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Lock } from "lucide-react";
import { ExamResult, type FinishReason } from "./ExamResult";
import { ExamRunning } from "./ExamRunning";
import { ExamSetup } from "./ExamSetup";
import { enterFullscreen, leaveFullscreen, useExamGuards } from "./useExamGuards";
import { useAuthPreview } from "@/components/providers/AuthPreviewProvider";
import {
  clearSession,
  createSession,
  filterPool,
  formatClock,
  loadSession,
  MAX_VIOLATIONS,
  saveSession,
  type ExamMode,
  type ExamSession,
} from "@/lib/exam-utils";

type Phase = "loading" | "gate" | "resume" | "setup" | "running" | "result";
type Finish = { session: ExamSession; reason: FinishReason; finishedAt: number };

type Props = {
  title: string;
  mode: ExamMode;
  subject?: string;
  topic?: string;
  preset?: { durationMin: number; questionCount: number };
};

export function ExamRunner({ title, mode, subject, topic, preset }: Props) {
  const { isLoggedIn, isReady } = useAuthPreview();

  const [phase, setPhase] = useState<Phase>("loading");
  const [session, setSession] = useState<ExamSession | null>(null);
  const [saved, setSaved] = useState<ExamSession | null>(null);
  const [finish, setFinish] = useState<Finish | null>(null);
  const [remaining, setRemaining] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  // সর্বশেষ সেশনের কপি (টাইমার ও জমা দেওয়ার সময় পুরনো মান এড়াতে)
  const sessionRef = useRef<ExamSession | null>(null);
  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  // শুরুতে লগইন ও অসমাপ্ত পরীক্ষা যাচাই
  useEffect(() => {
    if (!isReady) return;
    if (!isLoggedIn) {
      setPhase((prev) => (prev === "loading" || prev === "setup" ? "gate" : prev));
      return;
    }
    const stored = loadSession();
    setSaved(stored);
    setPhase((prev) => (prev === "loading" || prev === "gate" ? (stored ? "resume" : "setup") : prev));
  }, [isReady, isLoggedIn]);

  // পরীক্ষা জমা দেওয়া
  const submit = useCallback((reason: FinishReason) => {
    const current = sessionRef.current;
    if (!current) return;
    sessionRef.current = null;
    clearSession();
    void leaveFullscreen();
    setFinish({ session: current, reason, finishedAt: Date.now() });
    setSession(null);
    setPhase("result");
  }, []);

  // নিয়ম ভাঙলে গণনা বাড়ানো ও সতর্কতা দেখানো
  const handleViolation = useCallback((reason: string) => {
    setSession((prev) => (prev ? { ...prev, violations: prev.violations + 1 } : prev));
    setToast(`সতর্কতা: ${reason} সনাক্ত হয়েছে`);
  }, []);

  const guards = useExamGuards({
    active: phase === "running",
    requireFullscreen: session?.mode === "model",
    onViolation: handleViolation,
  });

  // সীমা পার হলে স্বয়ংক্রিয় জমা
  useEffect(() => {
    if (phase === "running" && session && session.violations >= MAX_VIOLATIONS) {
      submit("violation");
    }
  }, [phase, session, submit]);

  // টাইমার: শেষ হওয়ার সময়ের সাথে বর্তমান সময়ের পার্থক্য থেকে হিসাব (রিফ্রেশেও ঠিক থাকে)
  useEffect(() => {
    if (phase !== "running") return;
    const tick = () => {
      const current = sessionRef.current;
      if (!current) return;
      const left = Math.max(0, Math.ceil((current.endsAt - Date.now()) / 1000));
      setRemaining(left);
      if (left <= 0) submit("time");
    };
    tick();
    const timer = setInterval(tick, 500);
    return () => clearInterval(timer);
  }, [phase, submit]);

  // প্রতিটি পরিবর্তনে স্বয়ংক্রিয় সংরক্ষণ
  useEffect(() => {
    if (phase === "running" && session) saveSession(session);
  }, [phase, session]);

  // সতর্কতার বার্তা ৪ সেকেন্ড পর মুছে যাবে
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const start = (config: { durationMin: number; questionCount: number }) => {
    // ফুলস্ক্রিন অনুরোধ অবশ্যই ক্লিকের সাথে সাথে করতে হয়
    if (mode === "model") void enterFullscreen();
    const next = createSession({ title, mode, subject, topic, ...config });
    setSession(next);
    setFinish(null);
    setToast(null);
    setPhase("running");
  };

  const updateSession = (change: (prev: ExamSession) => ExamSession) =>
    setSession((prev) => (prev ? change(prev) : prev));

  // ---- পর্দা ----

  if (phase === "loading") {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );
  }

  if (phase === "gate") {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <Lock size={36} className="mx-auto mb-3 text-primary" />
        <h1 className="mb-2 font-display text-xl font-bold">পরীক্ষা দিতে লগইন করুন</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          পরীক্ষা, ফলাফল ও Progress সংরক্ষণের জন্য একটি অ্যাকাউন্ট প্রয়োজন।
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/login" className="rounded-lg border border-border px-5 py-2 text-sm font-medium">
            লগইন
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground"
          >
            ফ্রি রেজিস্ট্রেশন
          </Link>
        </div>
      </div>
    );
  }

  if (phase === "resume" && saved) {
    const left = Math.max(0, Math.ceil((saved.endsAt - Date.now()) / 1000));
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="mb-2 font-display text-xl font-bold">অসমাপ্ত পরীক্ষা পাওয়া গেছে</h1>
        <p className="mb-1 text-sm">{saved.title}</p>
        <p className="mb-6 text-sm text-muted-foreground">
          {left > 0 ? `বাকি সময়: ${formatClock(left)}` : "সময় শেষ হয়ে গেছে, ফলাফল দেখতে চালিয়ে যান"}
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => {
              setSession(saved);
              setPhase("running");
            }}
            className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground"
          >
            চালিয়ে যান
          </button>
          <button
            onClick={() => {
              clearSession();
              setSaved(null);
              setPhase("setup");
            }}
            className="rounded-lg border border-border px-5 py-2 text-sm font-medium"
          >
            বাতিল করে নতুন শুরু
          </button>
        </div>
      </div>
    );
  }

  if (phase === "setup") {
    return (
      <ExamSetup
        title={title}
        mode={mode}
        poolSize={filterPool(subject, topic).length}
        preset={preset}
        onStart={start}
      />
    );
  }

  if (phase === "result" && finish) {
    return (
      <ExamResult
        session={finish.session}
        reason={finish.reason}
        finishedAt={finish.finishedAt}
        onRetry={() => {
          setFinish(null);
          setPhase("setup");
        }}
      />
    );
  }

  if (phase === "running" && session) {
    return (
      <ExamRunning
        session={session}
        remainingSec={remaining}
        toast={toast}
        needFullscreen={session.mode === "model" && guards.fsSupported && !guards.isFullscreen}
        onEnterFullscreen={() => void enterFullscreen()}
        onSelect={(questionId, originalIndex) =>
          updateSession((prev) => {
            const answers = { ...prev.answers };
            if (originalIndex === null) delete answers[questionId];
            else answers[questionId] = originalIndex;
            return { ...prev, answers };
          })
        }
        onToggleFlag={(questionId) =>
          updateSession((prev) => ({
            ...prev,
            flags: prev.flags.includes(questionId)
              ? prev.flags.filter((id) => id !== questionId)
              : [...prev.flags, questionId],
          }))
        }
        onGo={(index) =>
          updateSession((prev) => ({
            ...prev,
            current: Math.min(Math.max(index, 0), prev.questions.length - 1),
          }))
        }
        onSubmit={() => submit("manual")}
      />
    );
  }

  return null;
}