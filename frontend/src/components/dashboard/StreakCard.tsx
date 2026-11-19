// frontend/src/components/dashboard/StreakCard.tsx
import { Flame } from "lucide-react";
import { DashboardCard } from "./DashboardCard";
import { formatBanglaDate } from "@/lib/format";
import { toBanglaNumber } from "@/lib/pricing";

type Props = {
  current: number;
  best: number;
  cells: { date: string; active: boolean; today: boolean }[];
};

export function StreakCard({ current, best, cells }: Props) {
  return (
    <DashboardCard
      title="Study Streak"
      icon={Flame}
      action={
        <span className="font-mono text-sm font-bold text-red-500">
          🔥 {toBanglaNumber(current)} দিন
        </span>
      }
    >
      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell) => (
          <div
            key={cell.date}
            title={`${formatBanglaDate(cell.date)}${cell.active ? " — পরীক্ষা দিয়েছেন" : ""}`}
            className={`aspect-square rounded-sm ${cell.active ? "bg-primary" : "bg-muted"} ${
              cell.today ? "outline outline-2 outline-offset-1 outline-primary" : ""
            }`}
          />
        ))}
      </div>
      <p className="mt-2 font-mono text-xs text-muted-foreground">
        গত ৩৫ দিন · সর্বোচ্চ Streak {toBanglaNumber(best)} দিন
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        যে দিন অন্তত একটি পরীক্ষা বা অনুশীলন দেন, সেই দিন সবুজ হয়।
      </p>
    </DashboardCard>
  );
}