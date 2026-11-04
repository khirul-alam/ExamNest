// frontend/src/app/previous-questions/page.tsx
import type { Metadata } from "next";
import { Clock } from "lucide-react";
import { PreviousQuestionsExplorer } from "@/components/previous-questions/PreviousQuestionsExplorer";

export const metadata: Metadata = {
  title: "বিগত বছরের প্রশ্ন",
  description: "BCS, Bank, NTRCA, Primary সহ সকল পরীক্ষার বিগত বছরের প্রশ্ন ও সমাধান",
};

export default function PreviousQuestionsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="mb-6 flex items-center gap-3">
        <Clock size={22} className="text-primary" />
        <div>
          <h1 className="font-display text-2xl font-bold">বিগত বছরের প্রশ্ন</h1>
          <p className="text-sm text-muted-foreground">
            পরীক্ষার ধরন, সাল ও বিষয় অনুযায়ী বিগত প্রশ্ন (ডেমো তালিকা)
          </p>
        </div>
      </div>
      <PreviousQuestionsExplorer />
    </div>
  );
}