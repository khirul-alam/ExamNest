// frontend/src/app/subjects/[subject]/[topic]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TrackTopicVisit } from "@/components/dashboard/TrackTopicVisit";
import { TopicReader } from "@/components/subjects/TopicReader";
import { allTopicParams, getTopicContent, getTopicRef } from "@/lib/subjects-data";

type Props = { params: Promise<{ subject: string; topic: string }> };

export function generateStaticParams() {
  return allTopicParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject, topic } = await params;
  const ref = getTopicRef(subject, topic);
  return { title: ref ? `${ref.topic.name} — ${ref.subject.name}` : "টপিক" };
}

export default async function TopicPage({ params }: Props) {
  const { subject, topic } = await params;
  const ref = getTopicRef(subject, topic);
  if (!ref) notFound();

  const content = getTopicContent(subject, topic);

  return (
    <>
      {/* এই টপিক খোলা হয়েছে বলে মনে রাখে (Dashboard-এর "পড়া চালিয়ে যান"-এর জন্য) */}
      <TrackTopicVisit subjectSlug={ref.subject.slug} topicSlug={ref.topic.slug} />
      <TopicReader
        subject={ref.subject}
        chapter={ref.chapter}
        topic={ref.topic}
        content={content}
      />
    </>
  );
}