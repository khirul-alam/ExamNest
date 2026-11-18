// frontend/src/lib/useAttempts.ts
"use client";

import { useEffect, useState } from "react";
import { loadAttempts, type Attempt } from "@/lib/attempts";

// ব্রাউজারে জমা থাকা পরীক্ষাগুলো পড়ে (পুরনো থেকে নতুন ক্রমে)
export function useAttempts() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setAttempts(loadAttempts());
    setReady(true);
  }, []);

  return { attempts, ready };
}