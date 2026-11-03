// frontend/src/components/landing/HeroSection.tsx
import Link from "next/link";
import { ArrowRight, Crown, Flame } from "lucide-react";

// হিরো সেকশনের নিচের ছোট ট্যাগগুলো
const highlights = [
  "MCQ Practice",
  "Model Test",
  "Current Affairs",
  "Previous Year Questions",
  "Performance Analysis",
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 py-16 sm:py-24 dark:from-[#0c1520] dark:via-[#0f2218] dark:to-[#0c1520]">
      {/* ব্যাকগ্রাউন্ড ডট প্যাটার্ন ও রঙিন আভা */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, rgba(13,110,79,0.15) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-primary opacity-20 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-secondary opacity-15 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
            <Flame size={14} />
            বাংলা ভাষায় সম্পূর্ণ পরীক্ষা প্রস্তুতি
          </div>

          <h1 className="mb-4 font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            বাংলাদেশের সবচেয়ে <span className="text-primary">স্মার্ট BCS</span> ও
            চাকরি প্রস্তুতি প্ল্যাটফর্ম
          </h1>

          <p className="mb-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            MCQ Practice, Model Test, Current Affairs, Previous Year Questions,
            Performance Analysis এবং Smart Learning System — সবকিছু এক জায়গায়।
          </p>

          {/* অ্যাকশন বাটন (Guest/Start Without Login বাদ দেওয়া হয়েছে) */}
          <div className="mb-8 flex flex-wrap gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground shadow-md transition-opacity hover:opacity-90"
            >
              ফ্রি শুরু করুন <ArrowRight size={16} />
            </Link>
            <Link
              href="#pricing"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-medium text-accent-foreground shadow-md transition-opacity hover:opacity-90"
            >
              <Crown size={16} /> প্রিমিয়াম নিন
            </Link>
          </div>

          <ul className="flex flex-wrap gap-2">
            {highlights.map((item) => (
              <li
                key={item}
                className="rounded-full border border-border bg-card/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}