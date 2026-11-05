// frontend/src/components/jobs/ApplyButton.tsx
"use client";

import { ExternalLink } from "lucide-react";
import { daysUntil } from "@/lib/format";
import { useToday } from "@/lib/useToday";

type Props = {
  // আগেই যাচাই করা নিরাপদ লিংক (না থাকলে null)
  applyUrl: string | null;
  deadline: string; // YYYY-MM-DD
};

const baseClass =
  "inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium";

// আবেদনের বোতাম: মেয়াদ শেষ হলে বা লিংক না থাকলে নিষ্ক্রিয়
export function ApplyButton({ applyUrl, deadline }: Props) {
  const today = useToday();
  const expired = today !== null && daysUntil(deadline, today) < 0;

  if (expired) {
    return (
      <span
        aria-disabled="true"
        className={`${baseClass} cursor-not-allowed bg-muted text-muted-foreground`}
      >
        আবেদনের সময় শেষ
      </span>
    );
  }

  if (!applyUrl) {
    return (
      <span
        aria-disabled="true"
        className={`${baseClass} cursor-not-allowed bg-muted text-muted-foreground`}
      >
        আবেদনের লিংক নেই
      </span>
    );
  }

  return (
    <a
      href={applyUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseClass} bg-primary text-primary-foreground hover:opacity-90`}
    >
      আবেদন করুন <ExternalLink size={13} />
    </a>
  );
}