// frontend/src/app/terms/page.tsx
import type { Metadata } from "next";
import { LegalDocument } from "@/components/static/LegalDocument";
import { PageShell } from "@/components/static/PageShell";
import { termsSections } from "@/lib/legal-content";

export const metadata: Metadata = {
  title: "শর্তাবলি",
  description: "ExamNest ব্যবহারের শর্তাবলি",
};

export default function TermsPage() {
  return (
    <PageShell title="শর্তাবলি" subtitle="ExamNest ব্যবহারের আগে অনুগ্রহ করে পড়ুন">
      <LegalDocument sections={termsSections} />
    </PageShell>
  );
}