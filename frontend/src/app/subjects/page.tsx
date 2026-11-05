// frontend/src/app/subjects/page.tsx
import type { Metadata } from "next";
import { SubjectsExplorer } from "@/components/subjects/SubjectsExplorer";

export const metadata: Metadata = {
  title: "বিষয়সমূহ",
  description: "BCS ও চাকরি পরীক্ষার সকল বিষয়ভিত্তিক প্রস্তুতি",
};

export default function SubjectsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-6">
        <h1 className="mb-1 font-display text-2xl font-bold">বিষয়সমূহ</h1>
        <p className="text-sm text-muted-foreground">BCS ও চাকরি পরীক্ষার সকল বিষয়</p>
      </div>
      <SubjectsExplorer />
    </div>
  );
}