// frontend/src/components/exam/useExamGuards.ts
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// ফুলস্ক্রিনে প্রবেশ (অবশ্যই ক্লিকের মতো ব্যবহারকারীর কাজের ভেতর থেকে ডাকতে হবে)
export async function enterFullscreen() {
  try {
    await document.documentElement.requestFullscreen();
  } catch {
    // ব্রাউজার (যেমন iPhone Safari) সমর্থন না করলে উপেক্ষা
  }
}

export async function leaveFullscreen() {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
  } catch {
    // উপেক্ষা
  }
}

type Options = {
  active: boolean;
  requireFullscreen: boolean;
  onViolation: (reason: string) => void;
};

// পরীক্ষা চলাকালীন নিয়ম ভাঙা সনাক্ত করা এবং Copy/Right-Click বন্ধ রাখা
// ⚠️ এগুলো শুধু ব্রাউজার-সাইড বাধা; আসল নিরাপত্তা ব্যাকএন্ডে হবে
export function useExamGuards({ active, requireFullscreen, onViolation }: Options) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fsSupported, setFsSupported] = useState(false);
  const lastViolationAt = useRef(0);
  const violationRef = useRef(onViolation);

  useEffect(() => {
    violationRef.current = onViolation;
  }, [onViolation]);

  useEffect(() => {
    setFsSupported(typeof document.documentElement.requestFullscreen === "function");
  }, []);

  // ট্যাব পরিবর্তনে একসাথে কয়েকটি ইভেন্ট আসে, তাই ১.৫ সেকেন্ডে একবারই গোনা হয়
  const report = useCallback((reason: string) => {
    const now = Date.now();
    if (now - lastViolationAt.current < 1500) return;
    lastViolationAt.current = now;
    violationRef.current(reason);
  }, []);

  useEffect(() => {
    if (!active) return;

    setIsFullscreen(Boolean(document.fullscreenElement));

    const onVisibility = () => {
      if (document.hidden) report("ট্যাব পরিবর্তন");
    };
    const onBlur = () => report("উইন্ডো ছেড়ে যাওয়া");
    const onFullscreenChange = () => {
      const inFullscreen = Boolean(document.fullscreenElement);
      setIsFullscreen(inFullscreen);
      if (!inFullscreen && requireFullscreen) report("ফুলস্ক্রিন ত্যাগ");
    };
    const block = (event: Event) => event.preventDefault();
    const onBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault();

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", onBlur);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("copy", block);
    document.addEventListener("cut", block);
    document.addEventListener("paste", block);
    document.addEventListener("contextmenu", block);
    window.addEventListener("beforeunload", onBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener("copy", block);
      document.removeEventListener("cut", block);
      document.removeEventListener("paste", block);
      document.removeEventListener("contextmenu", block);
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [active, requireFullscreen, report]);

  return { isFullscreen, fsSupported };
}