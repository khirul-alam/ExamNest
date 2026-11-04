// frontend/src/app/job-circular/page.tsx
import type { Metadata } from "next";
import { Briefcase } from "lucide-react";
import { JobsExplorer } from "@/components/jobs/JobsExplorer";

export const metadata: Metadata = {
  title: "চাকরির বিজ্ঞপ্তি",
  description: "সর্বশেষ সরকারি ও বেসরকারি চাকরির বিজ্ঞপ্তি",
};

export default function JobCircularPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="mb-6 flex items-center gap-3">
        <Briefcase size={22} className="text-primary" />
        <div>
          <h1 className="font-display text-2xl font-bold">চাকরির বিজ্ঞপ্তি</h1>
          <p className="text-sm text-muted-foreground">
            সর্বশেষ সরকারি ও বেসরকারি চাকরি (এখন ডেমো বিজ্ঞপ্তি)
          </p>
        </div>
      </div>
      <JobsExplorer />
    </div>
  );
}