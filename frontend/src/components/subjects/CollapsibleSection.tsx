// frontend/src/components/subjects/CollapsibleSection.tsx
"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type Props = {
  icon: string;
  title: string;
  headerClassName?: string;
  titleClassName?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

// খোলা-বন্ধ করা যায় এমন সেকশন বক্স
export function CollapsibleSection({
  icon,
  title,
  headerClassName = "bg-card",
  titleClassName = "text-foreground",
  defaultOpen = true,
  children,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`flex w-full items-center justify-between px-4 py-3 ${headerClassName}`}
      >
        <span className={`flex items-center gap-2 text-sm font-semibold ${titleClassName}`}>
          <span aria-hidden>{icon}</span> {title}
        </span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && <div className="border-t border-border">{children}</div>}
    </section>
  );
}