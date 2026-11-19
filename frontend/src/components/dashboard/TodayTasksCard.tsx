// frontend/src/components/dashboard/TodayTasksCard.tsx
import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, Circle, ListChecks } from "lucide-react";
import { DashboardCard } from "./DashboardCard";
import type { TodayTask } from "@/lib/dashboard-metrics";

type Props = {
  tasks: TodayTask[];
  onPracticeWrong: () => void;
};

const toneIcons = {
  todo: <Circle size={16} className="mt-0.5 shrink-0 text-muted-foreground" />,
  done: <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" />,
  alert: <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-600" />,
};

export function TodayTasksCard({ tasks, onPracticeWrong }: Props) {
  return (
    <DashboardCard title="আজকের করণীয়" icon={ListChecks}>
      <ul className="space-y-3">
        {tasks.map((task) => (
          <li key={task.id} className="flex items-start gap-2 text-sm">
            {toneIcons[task.tone]}
            <span className="flex-1 leading-snug">{task.text}</span>
            {task.href && (
              <Link
                href={task.href}
                aria-label="যান"
                className="mt-0.5 shrink-0 text-primary hover:opacity-80"
              >
                <ArrowRight size={15} />
              </Link>
            )}
            {task.action === "practice-wrong" && (
              <button
                onClick={onPracticeWrong}
                aria-label="অনুশীলন শুরু করুন"
                className="mt-0.5 shrink-0 text-primary hover:opacity-80"
              >
                <ArrowRight size={15} />
              </button>
            )}
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
}