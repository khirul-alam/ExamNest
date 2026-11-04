// frontend/src/app/contact/page.tsx
import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { PageShell } from "@/components/static/PageShell";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "যোগাযোগ",
  description: `${siteConfig.name}-এর সাথে যোগাযোগ করুন`,
};

export default function ContactPage() {
  // সাইট কনফিগে যে তথ্য বসানো আছে শুধু সেগুলোই দেখানো হয়
  const details = [
    { icon: Mail, label: "ইমেইল", value: siteConfig.supportEmail },
    { icon: Phone, label: "ফোন", value: siteConfig.supportPhone },
    { icon: MapPin, label: "ঠিকানা", value: siteConfig.address },
  ].filter((item) => item.value);

  return (
    <PageShell
      title="যোগাযোগ"
      subtitle="প্রশ্ন, সমস্যা বা পরামর্শ থাকলে নিচের ফর্মে আমাদের জানান"
    >
      {details.length > 0 && (
        <ul className="mb-6 space-y-3 rounded-xl border border-border bg-card p-5">
          {details.map(({ icon: Icon, label, value }) => (
            <li key={label} className="flex items-center gap-3 text-sm">
              <Icon size={16} className="text-primary" />
              <span className="text-muted-foreground">{label}:</span>
              <span className="font-medium">{value}</span>
            </li>
          ))}
        </ul>
      )}
      <ContactForm />
    </PageShell>
  );
}