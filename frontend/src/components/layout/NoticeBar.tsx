// frontend/src/components/layout/NoticeBar.tsx
import { Megaphone } from "lucide-react";

export function NoticeBar() {
  return (
    <div className="flex items-center gap-3 overflow-hidden bg-secondary px-4 py-1.5 text-secondary-foreground">
      <Megaphone size={14} className="shrink-0" />
      <div className="relative flex-1 overflow-hidden">
        {/* মাউস নিলে স্ক্রলিং থেমে যাবে */}
        <p className="inline-block animate-marquee whitespace-nowrap text-xs hover:[animation-play-state:paused]">
          কোনো প্রশ্ন, উত্তর বা বিষয়বস্তুর মধ্যে ভুল পরিলক্ষিত হলে অনুগ্রহ করে
          &apos;Report Error&apos; বাটনে ক্লিক করে আমাদের অবহিত করুন। আপনার
          মূল্যবান মতামতের ভিত্তিতে আমরা দ্রুত বিষয়টি যাচাই করে প্রয়োজনীয়
          সংশোধন করব।
        </p>
      </div>
    </div>
  );
}