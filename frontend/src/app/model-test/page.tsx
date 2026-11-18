// frontend/src/app/model-test/page.tsx
import type { Metadata } from "next";
import { ModelTestHub } from "@/components/model-test/ModelTestHub";

export const metadata: Metadata = {
  title: "মডেল টেস্ট",
  description: "পরীক্ষা দিন, নিজের প্রস্তুতি ও পারফরম্যান্স বিশ্লেষণ করুন এবং কাস্টম মডেল টেস্ট তৈরি করুন",
};

export default function ModelTestPage() {
  return <ModelTestHub />;
}