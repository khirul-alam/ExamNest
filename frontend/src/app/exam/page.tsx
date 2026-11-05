// frontend/src/app/exam/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExamRunner } from "@/components/exam/ExamRunner";
import { getModelTest } from "@/lib/exam-data";
import { getSubjectModelTest } from "@/lib/subject-model-test";
import { getSubject, getTopicRef } from "@/lib/subjects-data";

export const metadata: Metadata = { title: "পরীক্ষা" };

type Props = {
  searchParams: Promise<{
    test?: string;
    mode?: string;
    subject?: string;
    topic?: string;
  }>;
};

export default async function ExamPage({ searchParams }: Props) {
  const params = await searchParams;

  // ?test=bcs-model-1 হলে নির্দিষ্ট মডেল টেস্ট (সময় ও প্রশ্ন সংখ্যা নির্দিষ্ট)
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

  // ?mode=model&subject=... হলে বিষয়ভিত্তিক মডেল টেস্ট
  if (params.mode === "model" && params.subject) {
    const subject = getSubject(params.subject);
    if (!subject) notFound();

    const modelTest = getSubjectModelTest(subject.slug);

    // যথেষ্ট প্রশ্ন না থাকলে সরাসরি URL দিলেও পরীক্ষা চালু হবে না
    if (!modelTest.available) {
      return (
        <div className="mx-auto max-w-md px-4 py-16 text-center">
          <h1 className="mb-2 font-display text-xl font-bold">মডেল টেস্ট এখনও প্রস্তুত নয়</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            {subject.name} বিষয়ে মডেল টেস্টের জন্য এখনও যথেষ্ট প্রশ্ন যুক্ত হয়নি।
          </p>
          <Link
            href="/subjects"
            className="inline-block rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground"
          >
            বিষয়সমূহে ফিরে যান
          </Link>
        </div>
      );
    }

    return (
      <ExamRunner
        key={`subject-model/${subject.slug}`}
        title={`${subject.name} — মডেল টেস্ট`}
        mode="model"
        subject={subject.slug}
        preset={{
          durationMin: modelTest.durationMin,
          questionCount: modelTest.questionCount,
        }}
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