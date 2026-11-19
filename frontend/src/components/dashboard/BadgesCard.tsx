// frontend/src/components/dashboard/BadgesCard.tsx
import { Award, CheckCircle2 } from "lucide-react";
import { DashboardCard } from "./DashboardCard";
import type { BadgeStatus } from "@/lib/dashboard-metrics";
import { toBanglaNumber } from "@/lib/pricing";

export function BadgesCard({ badges }: { badges: BadgeStatus[] }) {
  return (
    <DashboardCard title="ব্যাজ" icon={Award}>
      <div className="grid grid-cols-2 gap-2">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`rounded-lg bg-muted p-3 text-center ${badge.earned ? "" : "opacity-60"}`}
          >
            <div className={`mb-1 text-2xl ${badge.earned ? "" : "grayscale"}`}>{badge.icon}</div>
            <p className="text-xs font-semibold">{badge.name}</p>
            <p className="text-xs text-muted-foreground">{badge.requirement}</p>
            {badge.earned ? (
              <CheckCircle2 size={13} className="mx-auto mt-1 text-primary" />
            ) : (
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                {toBanglaNumber(Math.min(badge.current, badge.target))}/
                {toBanglaNumber(badge.target)}
              </p>
            )}
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        অধ্যায় ও বিষয়ের সব টপিক &quot;সম্পন্ন&quot; চিহ্নিত করলে ব্যাজ পাবেন।
      </p>
    </DashboardCard>
  );
}