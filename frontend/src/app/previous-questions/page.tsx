// frontend/src/app/previous-questions/page.tsx
import type { Metadata } from "next";
import { Clock } from "lucide-react";
import { PreviousQuestionsExplorer } from "@/components/previous-questions/PreviousQuestionsExplorer";

export const metadata: Metadata = {
  title: "বিগত বছরের প্রশ্ন",
  description:
    "BCS, BADC, NTRCA, Bank সহ সকল পরীক্ষার বিগত বছরের প্রশ্ন পড়ুন, পরীক্ষা দিন ও নিজের অগ্রগতি দেখুন",
};

export default function PreviousQuestionsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-8 flex items-center gap-3">
        <Clock size={22} className="text-primary" />
        <div>
          <h1 className="font-display text-2xl font-bold">বিগত বছরের প্রশ্ন</h1>
          <p className="text-sm text-muted-foreground">
            প্রশ্নভান্ডার, পড়ার মোড ও পরীক্ষার মোড এক জায়গায়
          </p>
        </div>
      </div>
      <PreviousQuestionsExplorer />
    </div>
  );
}