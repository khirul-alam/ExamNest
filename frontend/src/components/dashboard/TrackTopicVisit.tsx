// frontend/src/components/dashboard/TrackTopicVisit.tsx
"use client";

import { useEffect } from "react";
import { saveLastTopic } from "@/lib/last-topic";

type Props = {
  subjectSlug: string;
  topicSlug: string;
};

// টপিক পেজ খুললে "শেষ পড়া টপিক" হিসেবে মনে রাখে (Dashboard-এর Continue Learning-এর জন্য)
export function TrackTopicVisit({ subjectSlug, topicSlug }: Props) {
  useEffect(() => {
    saveLastTopic(subjectSlug, topicSlug);
  }, [subjectSlug, topicSlug]);

  return null;
}