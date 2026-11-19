// frontend/src/components/dashboard/WrongSavedCard.tsx
import Link from "next/link";
import { Bookmark, RotateCcw, XCircle } from "lucide-react";
import { DashboardCard } from "./DashboardCard";
import { toBanglaNumber } from "@/lib/pricing";

type Props = {
  wrongCount: number;
  savedTopics: number;
  onPracticeWrong: () => void;
};

export function WrongSavedCard({ wrongCount, savedTopics, onPracticeWrong }: Props) {
  return (
    <DashboardCard title="ভুল ও সংরক্ষিত">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-muted p-3">
          <XCircle size={16} className="mb-1 text-red-500" />
          <p className="font-mono text-2xl font-bold">{toBanglaNumber(wrongCount)}</p>
          <p className="mb-2 text-xs text-muted-foreground">ভুল করা প্রশ্ন</p>
          <button
            onClick={onPracticeWrong}
            disabled={wrongCount === 0}
            className="flex w-full items-center justify-center gap-1 rounded-lg border border-primary px-2 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 disabled:cursor-not-allowed disabled:border-border disabled:text-muted-foreground disabled:hover:bg-transparent"
          >
            <RotateCcw size={12} /> অনুশীলন
          </button>
        </div>

        <div className="rounded-lg bg-muted p-3">
          <Bookmark size={16} className="mb-1 text-amber-600" />
          <p className="font-mono text-2xl font-bold">{toBanglaNumber(savedTopics)}</p>
          <p className="mb-2 text-xs text-muted-foreground">সংরক্ষিত টপিক</p>
          <Link
            href="/bookmarks"
            className="flex w-full items-center justify-center rounded-lg border border-border px-2 py-1.5 text-xs font-medium hover:bg-card"
          >
            দেখুন
          </Link>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        &quot;ভুল করা প্রশ্ন&quot; বলতে যে প্রশ্নে আপনার সর্বশেষ উত্তর ভুল ছিল। পরে ঠিক করলে তালিকা
        থেকে বাদ যায়। প্রশ্ন বুকমার্ক করার সুবিধা শীঘ্রই আসছে।
      </p>
    </DashboardCard>
  );
}