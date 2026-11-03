// frontend/src/components/providers/ThemeProvider.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";

type ThemeContextValue = {
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  // পেজ লোড হলে html ট্যাগ দেখে বর্তমান থিম জেনে নেওয়া
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("examnest-theme", next ? "dark" : "light");
    } catch {
      // ব্রাউজার সেভ করতে না দিলে উপেক্ষা করা হবে
    }
    setIsDark(next);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme অবশ্যই ThemeProvider-এর ভেতরে ব্যবহার করতে হবে");
  return ctx;
}