// frontend/src/app/exam/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExamRunner } from "@/components/exam/ExamRunner";
import { getModelTest } from "@/lib/exam-data";
import { getTopicRef } from "@/lib/subjects-data";

export const metadata: Metadata = { title: "পরীক্ষা" };

type Props = {
  searchParams: Promise<{ test?: string; subject?: string; topic?: string }>;
};

export default async function ExamPage({ searchParams }: Props) {
  const params = await searchParams;

  // ?test=bcs-model-1 হলে মডেল টেস্ট (সময় ও প্রশ্ন সংখ্যা নির্দিষ্ট)
  if (params.test) {
    const test = getModelTest(params.test);
    if (!test) notFound();
    return (
      <ExamRunner
        key={test.id}
        title={test.title}
        mode="model"
        preset={{ durationMin: test.durationMin, questionCount: test.questions }}
      />
    );
  }

  // ?subject=...&topic=... হলে টপিকভিত্তিক অনুশীলন, নইলে সাধারণ MCQ পরীক্ষা
  const ref =
    params.subject && params.topic ? getTopicRef(params.subject, params.topic) : null;

  return (
    <ExamRunner
      key={`${params.subject ?? ""}/${params.topic ?? ""}`}
      title={ref ? `${ref.topic.name} — টপিক পরীক্ষা` : "MCQ পরীক্ষা"}
      mode="practice"
      subject={params.subject}
      topic={params.topic}
    />
  );
}