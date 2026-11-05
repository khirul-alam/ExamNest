// frontend/src/app/pricing/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { PricingSection } from "@/components/landing/PricingSection";

export const metadata: Metadata = {
  title: "প্রাইসিং",
  description: "ExamNest-এর ফ্রি, প্রিমিয়াম ও কর্পোরেট প্ল্যানের দাম ও সুবিধা",
};

export default function PricingPage() {
  return (
    <>
      <PricingSection />
      <p className="pb-16 text-center text-sm text-muted-foreground">
        প্ল্যান নিয়ে প্রশ্ন আছে?{" "}
        <Link href="/faq" className="text-primary hover:underline">
          সাধারণ জিজ্ঞাসা দেখুন
        </Link>{" "}
        অথবা{" "}
        <Link href="/contact" className="text-primary hover:underline">
          আমাদের জানান
        </Link>
        ।
      </p>
    </>
  );
}