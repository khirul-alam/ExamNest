// frontend/src/app/current-affairs/page.tsx
import type { Metadata } from "next";
import { Globe } from "lucide-react";
import { CurrentAffairsExplorer } from "@/components/current-affairs/CurrentAffairsExplorer";

export const metadata: Metadata = {
  title: "কারেন্ট অ্যাফেয়ার্স",
  description: "প্রতিদিনের গুরুত্বপূর্ণ জাতীয় ও আন্তর্জাতিক ঘটনাপ্রবাহ",
};

export default function CurrentAffairsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="mb-6 flex items-center gap-3">
        <Globe size={22} className="text-primary" />
        <div>
          <h1 className="font-display text-2xl font-bold">কারেন্ট অ্যাফেয়ার্স</h1>
          <p className="text-sm text-muted-foreground">
            প্রতিদিন আপডেট হবে (এখন ডেমো আইটেম)
          </p>
        </div>
      </div>
      <CurrentAffairsExplorer />
    </div>
  );
}