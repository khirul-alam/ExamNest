// frontend/src/lib/useToday.ts
"use client";

import { useEffect, useState } from "react";

// আজকের তারিখ ব্রাউজার থেকে নেয়।
// প্রথম রেন্ডারে null থাকে (সার্ভারের সময়ের সাথে গোলমাল এড়াতে), তারপর আসল তারিখ বসে।
export function useToday(): Date | null {
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => {
    setToday(new Date());
  }, []);

  return today;
}