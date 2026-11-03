// frontend/src/lib/useSimpleForm.ts
"use client";

import { useState } from "react";
import type { ZodTypeAny } from "zod";

type FormValues = Record<string, string | boolean>;

// ছোট ফর্ম হুক: মান ধরে রাখে এবং zod দিয়ে যাচাই করে ফিল্ড অনুযায়ী এরর দেয়
export function useSimpleForm<T extends FormValues>(
  initial: T,
  schema: ZodTypeAny,
) {
  const [values, setValues] = useState<T>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // কোনো ফিল্ড বদলালে তার পুরনো এরর মুছে ফেলা হয়
  const setValue = <K extends keyof T>(key: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
  };

  // সব ফিল্ড যাচাই করে; ঠিক থাকলে true ফেরত দেয়
  const validate = (): boolean => {
    const result = schema.safeParse(values);
    if (result.success) {
      setErrors({});
      return true;
    }
    const next: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0] ?? "form");
      // প্রতি ফিল্ডে প্রথম এররটিই দেখানো হবে
      if (!next[key]) next[key] = issue.message;
    }
    setErrors(next);
    return false;
  };

  return { values, errors, setValue, validate };
}