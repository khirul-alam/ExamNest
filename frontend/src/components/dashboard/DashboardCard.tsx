// frontend/src/components/dashboard/DashboardCard.tsx
import type { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  children: React.ReactNode;
};

// ড্যাশবোর্ডের সব কার্ডের সাধারণ কাঠামো (শিরোনাম, আইকন ও ডানের অ্যাকশন)
export function DashboardCard({ title, icon: Icon, action, children }: Props) {
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 font-semibold">
          {Icon && <Icon size={18} className="text-primary" />}
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}