// frontend/src/app/privacy-policy/page.tsx
import type { Metadata } from "next";
import { LegalDocument } from "@/components/static/LegalDocument";
import { PageShell } from "@/components/static/PageShell";
import { privacySections } from "@/lib/legal-content";

export const metadata: Metadata = {
  title: "প্রাইভেসি পলিসি",
  description: "ExamNest আপনার তথ্য কীভাবে সংগ্রহ, ব্যবহার ও সুরক্ষিত রাখে",
};

export default function PrivacyPolicyPage() {
  return (
    <PageShell title="প্রাইভেসি পলিসি" subtitle="আপনার তথ্য আমরা কীভাবে ব্যবহার ও সুরক্ষিত রাখি">
      <LegalDocument sections={privacySections} />
    </PageShell>
  );
}