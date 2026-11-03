// frontend/src/components/providers/AuthPreviewProvider.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";

// ⚠️ এটি শুধু ডিজাইন দেখার জন্য সাময়িক ব্যবস্থা।
// পরে Better Auth-এর আসল সেশন দিয়ে এটি বদলে ফেলা হবে।
type AuthPreviewValue = {
  isLoggedIn: boolean;
  // সংরক্ষিত অবস্থা পড়া শেষ হলে true হয়
  isReady: boolean;
  login: () => void;
  logout: () => void;
};

const STORAGE_KEY = "examnest-preview-auth";
const AuthPreviewContext = createContext<AuthPreviewValue | null>(null);

export function AuthPreviewProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // পেজ রিফ্রেশের পরেও প্রিভিউ-লগইন মনে রাখার জন্য ব্রাউজার থেকে পড়া
  useEffect(() => {
    try {
      setIsLoggedIn(localStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      // ব্রাউজার অনুমতি না দিলে উপেক্ষা
    }
    setIsReady(true);
  }, []);

  const update = (value: boolean) => {
    setIsLoggedIn(value);
    try {
      if (value) localStorage.setItem(STORAGE_KEY, "1");
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      // উপেক্ষা
    }
  };

  return (
    <AuthPreviewContext.Provider
      value={{ isLoggedIn, isReady, login: () => update(true), logout: () => update(false) }}
    >
      {children}
    </AuthPreviewContext.Provider>
  );
}

export function useAuthPreview() {
  const ctx = useContext(AuthPreviewContext);
  if (!ctx) {
    throw new Error("useAuthPreview অবশ্যই AuthPreviewProvider-এর ভেতরে ব্যবহার করতে হবে");
  }
  return ctx;
}