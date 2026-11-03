// frontend/src/lib/exam-data.ts

// ⚠️ এই ফাইলের সব ডাটা ডেমো। প্রশ্ন ভান্ডার ও মডেল টেস্ট পরে ডাটাবেজ থেকে আসবে।

export type ExamQuestion = {
  id: string;
  text: string;
  options: string[]; // ঠিক ৪টি অপশন
  correctIndex: number;
  subjectSlug: string;
  topicSlug: string;
  topicName: string;
  explanation: string;
  bookReference?: string;
};

export const questionPool: ExamQuestion[] = [
  {
    id: "e1",
    text: "বাংলাদেশের মুক্তিযুদ্ধ কত সালে সংঘটিত হয়?",
    options: ["১৯৬৯", "১৯৭০", "১৯৭১", "১৯৭২"],
    correctIndex: 2,
    subjectSlug: "bangladesh-affairs",
    topicSlug: "liberation-war-1971",
    topicName: "১৯৭১ সালের মুক্তিযুদ্ধ",
    explanation: "বাংলাদেশের মুক্তিযুদ্ধ ১৯৭১ সালের ২৬ মার্চ শুরু হয়ে ১৬ ডিসেম্বর শেষ হয়।",
  },
  {
    id: "e2",
    text: "বাংলাদেশের সংবিধান কত তারিখে কার্যকর হয়?",
    options: ["২৬ মার্চ ১৯৭২", "১৬ ডিসেম্বর ১৯৭২", "৪ নভেম্বর ১৯৭২", "৭ মার্চ ১৯৭২"],
    correctIndex: 1,
    subjectSlug: "bangladesh-affairs",
    topicSlug: "constitution-principles",
    topicName: "সংবিধানের মূলনীতি",
    explanation: "সংবিধান গৃহীত হয় ৪ নভেম্বর ১৯৭২ এবং কার্যকর হয় ১৬ ডিসেম্বর ১৯৭২।",
    bookReference: "বাংলাদেশের সংবিধান (ডেমো রেফারেন্স)",
  },
  {
    id: "e3",
    text: "UNESCO কত সালে ২১ ফেব্রুয়ারিকে আন্তর্জাতিক মাতৃভাষা দিবস ঘোষণা করে?",
    options: ["১৯৯৭", "১৯৯৮", "১৯৯৯", "২০০০"],
    correctIndex: 2,
    subjectSlug: "bangladesh-affairs",
    topicSlug: "language-movement",
    topicName: "ভাষা আন্দোলন",
    explanation: "১৯৯৯ সালের ১৭ নভেম্বর UNESCO এই ঘোষণা দেয়।",
  },
  {
    id: "e4",
    text: "বাংলাদেশের জাতীয় সংসদে মোট আসন সংখ্যা কত?",
    options: ["৩০০", "৩১০", "৩৫০", "৪০০"],
    correctIndex: 2,
    subjectSlug: "bangladesh-affairs",
    topicSlug: "constitution-principles",
    topicName: "জাতীয় সংসদ",
    explanation: "৩০০টি নির্বাচিত ও ৫০টি সংরক্ষিত আসন মিলিয়ে মোট ৩৫০টি।",
  },
  {
    id: "e5",
    text: "\"আমার সোনার বাংলা\" গানটির রচয়িতা কে?",
    options: ["কাজী নজরুল ইসলাম", "রবীন্দ্রনাথ ঠাকুর", "জীবনানন্দ দাশ", "সুকান্ত ভট্টাচার্য"],
    correctIndex: 1,
    subjectSlug: "bangla-language-literature",
    topicSlug: "national-song",
    topicName: "জাতীয় সংগীত",
    explanation: "গানটির রচয়িতা রবীন্দ্রনাথ ঠাকুর।",
  },
  {
    id: "e6",
    text: "পৃথিবীর বৃহত্তম ব-দ্বীপ কোনটি?",
    options: ["নীলনদ ব-দ্বীপ", "আমাজন ব-দ্বীপ", "গঙ্গা-ব্রহ্মপুত্র ব-দ্বীপ", "মিসিসিপি ব-দ্বীপ"],
    correctIndex: 2,
    subjectSlug: "geography-environment",
    topicSlug: "deltas",
    topicName: "ব-দ্বীপ",
    explanation: "গঙ্গা-ব্রহ্মপুত্র ব-দ্বীপ পৃথিবীর বৃহত্তম ব-দ্বীপ।",
  },
  {
    id: "e7",
    text: "বাংলাদেশের কোন জেলায় সবচেয়ে বেশি চা উৎপাদিত হয়?",
    options: ["সিলেট", "মৌলভীবাজার", "হবিগঞ্জ", "চট্টগ্রাম"],
    correctIndex: 1,
    subjectSlug: "geography-environment",
    topicSlug: "agriculture",
    topicName: "কৃষি",
    explanation: "মৌলভীবাজার জেলায় সবচেয়ে বেশি চা-বাগান রয়েছে।",
  },
  {
    id: "e8",
    text: "বিশ্বের সবচেয়ে বড় লিখিত সংবিধান কোন দেশের?",
    options: ["যুক্তরাষ্ট্র", "ভারত", "চীন", "রাশিয়া"],
    correctIndex: 1,
    subjectSlug: "international-affairs",
    topicSlug: "constitutions",
    topicName: "বিশ্বের সংবিধান",
    explanation: "ভারতের সংবিধান কোনো সার্বভৌম রাষ্ট্রের সবচেয়ে বড় লিখিত সংবিধান।",
  },
  {
    id: "e9",
    text: "বাংলাদেশের জাতীয় ফুল কোনটি?",
    options: ["গোলাপ", "শাপলা", "শিউলি", "কৃষ্ণচূড়া"],
    correctIndex: 1,
    subjectSlug: "bangladesh-affairs",
    topicSlug: "national-symbols",
    topicName: "জাতীয় প্রতীক",
    explanation: "বাংলাদেশের জাতীয় ফুল শাপলা।",
  },
  {
    id: "e10",
    text: "বাংলাদেশের স্বাধীনতা দিবস কবে?",
    options: ["২১ ফেব্রুয়ারি", "২৬ মার্চ", "১৬ ডিসেম্বর", "১৭ এপ্রিল"],
    correctIndex: 1,
    subjectSlug: "bangladesh-affairs",
    topicSlug: "liberation-war-1971",
    topicName: "১৯৭১ সালের মুক্তিযুদ্ধ",
    explanation: "২৬ মার্চ স্বাধীনতা দিবস, ১৬ ডিসেম্বর বিজয় দিবস।",
  },
  {
    id: "e11",
    text: "পানির রাসায়নিক সংকেত কোনটি?",
    options: ["CO₂", "H₂O", "O₂", "NaCl"],
    correctIndex: 1,
    subjectSlug: "general-science",
    topicSlug: "chemistry-basics",
    topicName: "রসায়নের মৌলিক ধারণা",
    explanation: "পানির অণুতে দুটি হাইড্রোজেন ও একটি অক্সিজেন পরমাণু থাকে।",
  },
  {
    id: "e12",
    text: "২০০-এর ১৫% কত?",
    options: ["২০", "৩০", "৪০", "৫০"],
    correctIndex: 1,
    subjectSlug: "mathematical-reasoning",
    topicSlug: "percentage",
    topicName: "শতকরা",
    explanation: "২০০ × ১৫ ÷ ১০০ = ৩০।",
  },
  {
    id: "e13",
    text: "The plural form of 'child' is ____.",
    options: ["childs", "childes", "children", "childrens"],
    correctIndex: 2,
    subjectSlug: "english-language-literature",
    topicSlug: "grammar-plurals",
    topicName: "Plural Forms",
    explanation: "'Child'-এর বহুবচন irregular: children।",
  },
  {
    id: "e14",
    text: "CPU-এর পূর্ণরূপ কী?",
    options: [
      "Central Processing Unit",
      "Computer Personal Unit",
      "Central Program Utility",
      "Control Processing Unit",
    ],
    correctIndex: 0,
    subjectSlug: "computer-it",
    topicSlug: "hardware-basics",
    topicName: "হার্ডওয়্যারের মৌলিক ধারণা",
    explanation: "CPU = Central Processing Unit, কম্পিউটারের প্রধান প্রক্রিয়াকরণ অংশ।",
  },
  {
    id: "e15",
    text: "জাতিসংঘের সদর দপ্তর কোথায় অবস্থিত?",
    options: ["জেনেভা", "প্যারিস", "লন্ডন", "নিউইয়র্ক"],
    correctIndex: 3,
    subjectSlug: "international-affairs",
    topicSlug: "united-nations",
    topicName: "জাতিসংঘ",
    explanation: "জাতিসংঘের সদর দপ্তর যুক্তরাষ্ট্রের নিউইয়র্কে।",
  },
];

export function getQuestionById(id: string): ExamQuestion | undefined {
  return questionPool.find((q) => q.id === id);
}

export type ModelTest = {
  id: string;
  category: string;
  title: string;
  questions: number;
  durationMin: number;
  syllabusCoverage: number; // শতকরা
  premium: boolean;
};

// ডেমো মডেল টেস্টের তালিকা (সব পরীক্ষায় সঠিক উত্তরে +১, তাই মোট নম্বর = প্রশ্ন সংখ্যা)
export const modelTests: ModelTest[] = [
  { id: "bcs-model-1", category: "BCS", title: "BCS মডেল টেস্ট ১", questions: 100, durationMin: 60, syllabusCoverage: 85, premium: false },
  { id: "bcs-model-2", category: "BCS", title: "BCS মডেল টেস্ট ২", questions: 100, durationMin: 60, syllabusCoverage: 90, premium: true },
  { id: "bank-model-1", category: "Bank", title: "ব্যাংক জব মডেল টেস্ট ১", questions: 100, durationMin: 60, syllabusCoverage: 70, premium: false },
  { id: "ntrca-model-1", category: "NTRCA", title: "NTRCA মডেল টেস্ট ১", questions: 100, durationMin: 60, syllabusCoverage: 75, premium: true },
  { id: "primary-model-1", category: "Primary", title: "প্রাইমারি শিক্ষক মডেল টেস্ট ১", questions: 100, durationMin: 60, syllabusCoverage: 80, premium: false },
  { id: "admission-model-1", category: "University Admission", title: "বিশ্ববিদ্যালয় ভর্তি মডেল টেস্ট ১", questions: 100, durationMin: 60, syllabusCoverage: 65, premium: true },
];

export function getModelTest(id: string): ModelTest | undefined {
  return modelTests.find((t) => t.id === id);
}