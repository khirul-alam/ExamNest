// frontend/src/lib/subjects-data.ts
import { subjects as baseSubjects, type SubjectCard } from "@/lib/landing-data";

// ⚠️ এই ফাইলের সব ডাটা ডেমো। Exam নাম, সাল, প্রশ্ন ও টপিকের লেখা যাচাই ছাড়া প্রকাশ করা যাবে না।
// ব্যাকএন্ড তৈরি হলে এগুলো Admin Panel-এর ডাটাবেজ থেকে আসবে।

export type Topic = { slug: string; name: string; questionCount: number };
export type Chapter = { slug: string; name: string; topics: Topic[] };
export type Subject = SubjectCard & { chapters: Chapter[] };

export type PreviousQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  exam: string;
  year: string;
  timesAsked: number; // এই প্রশ্ন (বা একই ধরনের প্রশ্ন) কতবার এসেছে
};

export type PracticeQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type TopicContent = {
  important: string;
  content: string;
  shortcut: string;
  bcsNote: string;
  previousQuestions: PreviousQuestion[];
  practiceQuestions: PracticeQuestion[];
};

// প্রতিটি টপিকের অনন্য চাবি (প্রোগ্রেস ও বুকমার্কে ব্যবহৃত হয়)
export const topicKey = (subjectSlug: string, topicSlug: string) =>
  `${subjectSlug}/${topicSlug}`;

// অধ্যায় ও টপিকের ডেমো তালিকা
const chaptersBySubject: Record<string, Chapter[]> = {
  "bangladesh-affairs": [
    {
      slug: "history-liberation-war",
      name: "বাংলাদেশের ইতিহাস ও মুক্তিযুদ্ধ",
      topics: [
        { slug: "language-movement", name: "ভাষা আন্দোলন", questionCount: 24 },
        { slug: "liberation-war-background", name: "মুক্তিযুদ্ধের পটভূমি", questionCount: 18 },
        { slug: "liberation-war-1971", name: "১৯৭১ সালের মুক্তিযুদ্ধ", questionCount: 32 },
      ],
    },
    {
      slug: "constitution",
      name: "বাংলাদেশের সংবিধান",
      topics: [
        { slug: "constitution-principles", name: "সংবিধানের মূলনীতি", questionCount: 20 },
        { slug: "fundamental-rights", name: "মৌলিক অধিকার", questionCount: 16 },
      ],
    },
    {
      slug: "economy",
      name: "বাংলাদেশের অর্থনীতি",
      topics: [
        { slug: "national-economy-structure", name: "জাতীয় অর্থনীতির কাঠামো", questionCount: 14 },
      ],
    },
  ],
};

// landing-data-এর বিষয়ের তালিকার সাথে অধ্যায় জুড়ে পূর্ণ Subject তৈরি
export const allSubjects: Subject[] = baseSubjects.map((subject) => ({
  ...subject,
  chapters: chaptersBySubject[subject.slug] ?? [],
}));

// শুধু একটি টপিকের ডেমো কনটেন্ট আছে
const topicContents: Record<string, TopicContent> = {
  [topicKey("bangladesh-affairs", "language-movement")]: {
    important:
      "বাংলাকে রাষ্ট্রভাষা করার দাবিতে ১৯৫২ সালের ২১ ফেব্রুয়ারি ঢাকা বিশ্ববিদ্যালয়ের ছাত্ররা ১৪৪ ধারা ভেঙে মিছিল বের করে। পুলিশের গুলিতে সালাম, বরকত, রফিক, জব্বার শহীদ হন।",
    content:
      "ভাষা আন্দোলন ছিল তৎকালীন পূর্ব পাকিস্তানে সংঘটিত একটি সাংস্কৃতিক ও রাজনৈতিক আন্দোলন। ১৯৪৮ সালে পাকিস্তান সরকার ঘোষণা দেয় যে উর্দুই হবে পাকিস্তানের একমাত্র রাষ্ট্রভাষা।\n\nএর প্রতিবাদে পূর্ব পাকিস্তানের বাংলাভাষী মানুষ আন্দোলন শুরু করে। ১৯৫২ সালের ২১ ফেব্রুয়ারি এই আন্দোলন চরম আকার ধারণ করে।",
    shortcut:
      "শহীদদের নাম মনে রাখার কৌশল এখানে যুক্ত হবে (ডেমো টেক্সট, প্রকাশের আগে যাচাই করতে হবে)।",
    bcsNote:
      "📌 সাল, তারিখ ও শহীদদের নাম বিশেষভাবে মনে রাখুন। (ডেমো নোট, প্রকাশের আগে যাচাই করতে হবে।)",
    previousQuestions: [
      {
        id: "pq1",
        question: "ভাষা আন্দোলনে ১৪৪ ধারা ভেঙে ঢাকায় ঐতিহাসিক মিছিল কত সালে হয়?",
        options: ["১৯৫২", "১৯৪৮", "১৯৭১", "১৯৫৪"],
        correctIndex: 0,
        explanation: "১৯৫২ সালের ২১ ফেব্রুয়ারি ১৪৪ ধারা ভেঙে মিছিল বের হয়।",
        exam: "BCS (ডেমো)",
        year: "২০২০",
        timesAsked: 6,
      },
      {
        id: "pq2",
        question: "আন্তর্জাতিক মাতৃভাষা দিবস কত তারিখে পালিত হয়?",
        options: ["২৬ মার্চ", "২১ ফেব্রুয়ারি", "১৬ ডিসেম্বর", "১৭ মার্চ"],
        correctIndex: 1,
        explanation: "প্রতি বছর ২১ ফেব্রুয়ারি আন্তর্জাতিক মাতৃভাষা দিবস।",
        exam: "Bank (ডেমো)",
        year: "২০২৪",
        timesAsked: 3,
      },
      {
        id: "pq3",
        question: "UNESCO কত সালে ২১ ফেব্রুয়ারিকে আন্তর্জাতিক মাতৃভাষা দিবস ঘোষণা করে?",
        options: ["১৯৯৭", "১৯৯৮", "১৯৯৯", "২০০০"],
        correctIndex: 2,
        explanation: "১৯৯৯ সালের ১৭ নভেম্বর UNESCO এই ঘোষণা দেয়।",
        exam: "Primary (ডেমো)",
        year: "২০২৩",
        timesAsked: 1,
      },
    ],
    practiceQuestions: [
      {
        id: "pm1",
        question: "ভাষা শহীদ দিবস পালিত হয় কোন তারিখে?",
        options: ["১৬ ডিসেম্বর", "২৬ মার্চ", "২১ ফেব্রুয়ারি", "৭ মার্চ"],
        correctIndex: 2,
        explanation: "২১ ফেব্রুয়ারি ভাষা শহীদ দিবস।",
      },
      {
        id: "pm2",
        question: "ভাষা আন্দোলনের সময় পূর্ব পাকিস্তানের মুখ্যমন্ত্রী কে ছিলেন?",
        options: ["নুরুল আমিন", "আতাউর রহমান", "ইস্কান্দার মির্জা", "লিয়াকত আলি"],
        correctIndex: 0,
        explanation: "তৎকালীন মুখ্যমন্ত্রী ছিলেন নুরুল আমিন।",
      },
      {
        id: "pm3",
        question: "প্রথম আন্তর্জাতিক মাতৃভাষা দিবস কত সালে পালিত হয়?",
        options: ["১৯৯৯", "২০০০", "২০০১", "২০০২"],
        correctIndex: 1,
        explanation: "২০০০ সালের ২১ ফেব্রুয়ারি প্রথমবার পালিত হয়।",
      },
    ],
  },
};

// ডেমো: লগইন করা ব্যবহারকারীর সম্পন্ন ও বুকমার্ক করা টপিক
export const demoUserState = {
  completed: [
    topicKey("bangladesh-affairs", "language-movement"),
    topicKey("bangladesh-affairs", "liberation-war-background"),
    topicKey("bangladesh-affairs", "constitution-principles"),
  ],
  bookmarked: [
    topicKey("bangladesh-affairs", "liberation-war-background"),
    topicKey("bangladesh-affairs", "national-economy-structure"),
  ],
};

export function getSubject(slug: string): Subject | undefined {
  return allSubjects.find((s) => s.slug === slug);
}

export function countTopics(subject: Subject): number {
  return subject.chapters.reduce((sum, c) => sum + c.topics.length, 0);
}

// বিষয় + টপিক স্লাগ থেকে বিষয়, অধ্যায় ও টপিক খুঁজে বের করা
export function getTopicRef(subjectSlug: string, topicSlug: string) {
  const subject = getSubject(subjectSlug);
  if (!subject) return null;
  for (const chapter of subject.chapters) {
    const topic = chapter.topics.find((t) => t.slug === topicSlug);
    if (topic) return { subject, chapter, topic };
  }
  return null;
}

export function getTopicContent(subjectSlug: string, topicSlug: string): TopicContent | null {
  return topicContents[topicKey(subjectSlug, topicSlug)] ?? null;
}

// স্ট্যাটিক পেজ তৈরির জন্য সব বিষয়-টপিকের তালিকা
export function allTopicParams() {
  return allSubjects.flatMap((subject) =>
    subject.chapters.flatMap((chapter) =>
      chapter.topics.map((topic) => ({ subject: subject.slug, topic: topic.slug })),
    ),
  );
}