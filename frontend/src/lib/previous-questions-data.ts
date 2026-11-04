// frontend/src/lib/previous-questions-data.ts

// ⚠️ প্রশ্ন ও উত্তর সত্য তথ্যের ডেমো, কিন্তু পরীক্ষার ধরন, সাল ও "কতবার এসেছে" সংখ্যা ডেমো।
// যাচাই ছাড়া প্রকাশ করা যাবে না। আসল ডাটা পরে Admin Panel থেকে আসবে।

export const examTypes = ["BCS", "Bank Job", "NTRCA", "Primary Teacher", "Railway"] as const;
export type ExamType = (typeof examTypes)[number];

export type PreviousQuestionRecord = {
  id: string;
  question: string;
  options: string[]; // ঠিক ৪টি
  correctIndex: number;
  explanation: string;
  examType: ExamType;
  year: number;
  timesAsked: number; // এই প্রশ্ন কতবার এসেছে
  subjectSlug: string;
  topicSlug?: string;
};

export const previousQuestions: PreviousQuestionRecord[] = [
  {
    id: "py1",
    question: "বাংলাদেশের সংবিধানে মোট কয়টি অনুচ্ছেদ রয়েছে?",
    options: ["১৫০", "১৫৩", "১৫৬", "১৬০"],
    correctIndex: 1,
    explanation: "বাংলাদেশের সংবিধানে মোট ১৫৩টি অনুচ্ছেদ রয়েছে।",
    examType: "BCS",
    year: 2019,
    timesAsked: 5,
    subjectSlug: "bangladesh-affairs",
    topicSlug: "constitution-principles",
  },
  {
    id: "py2",
    question: "বাংলাদেশের জাতীয় কবি কে?",
    options: ["রবীন্দ্রনাথ ঠাকুর", "কাজী নজরুল ইসলাম", "জসীমউদ্দীন", "জীবনানন্দ দাশ"],
    correctIndex: 1,
    explanation: "কাজী নজরুল ইসলাম বাংলাদেশের জাতীয় কবি।",
    examType: "Primary Teacher",
    year: 2022,
    timesAsked: 4,
    subjectSlug: "bangla-language-literature",
  },
  {
    id: "py3",
    question: "পৃথিবীর সবচেয়ে বড় মহাসাগর কোনটি?",
    options: ["আটলান্টিক", "ভারত", "প্রশান্ত", "উত্তর"],
    correctIndex: 2,
    explanation: "প্রশান্ত মহাসাগর পৃথিবীর সবচেয়ে বড় ও গভীরতম মহাসাগর।",
    examType: "Bank Job",
    year: 2021,
    timesAsked: 3,
    subjectSlug: "geography-environment",
  },
  {
    id: "py4",
    question: "জাতিসংঘ প্রতিষ্ঠিত হয় কত সালে?",
    options: ["১৯৪৩", "১৯৪৫", "১৯৪৮", "১৯৫০"],
    correctIndex: 1,
    explanation: "১৯৪৫ সালের ২৪ অক্টোবর জাতিসংঘ আনুষ্ঠানিকভাবে যাত্রা শুরু করে।",
    examType: "BCS",
    year: 2021,
    timesAsked: 6,
    subjectSlug: "international-affairs",
  },
  {
    id: "py5",
    question: "বাংলাদেশ কত সালে জাতিসংঘের সদস্যপদ লাভ করে?",
    options: ["১৯৭২", "১৯৭৩", "১৯৭৪", "১৯৭৫"],
    correctIndex: 2,
    explanation: "১৯৭৪ সালের ১৭ সেপ্টেম্বর বাংলাদেশ জাতিসংঘের সদস্যপদ পায়।",
    examType: "NTRCA",
    year: 2023,
    timesAsked: 4,
    subjectSlug: "international-affairs",
  },
  {
    id: "py6",
    question: "মানবদেহের সবচেয়ে বড় অঙ্গ কোনটি?",
    options: ["যকৃৎ", "ফুসফুস", "ত্বক", "হৃৎপিণ্ড"],
    correctIndex: 2,
    explanation: "ত্বক মানবদেহের সবচেয়ে বড় অঙ্গ।",
    examType: "Railway",
    year: 2018,
    timesAsked: 2,
    subjectSlug: "general-science",
  },
  {
    id: "py7",
    question: "DNA-এর পূর্ণরূপ কী?",
    options: [
      "Deoxyribonucleic Acid",
      "Diribonucleic Acid",
      "Deoxyribose Nitrogen Acid",
      "Dual Nucleic Acid",
    ],
    correctIndex: 0,
    explanation: "DNA = Deoxyribonucleic Acid।",
    examType: "Primary Teacher",
    year: 2024,
    timesAsked: 1,
    subjectSlug: "general-science",
  },
  {
    id: "py8",
    question: "Antonym of 'Generous' is —",
    options: ["Kind", "Stingy", "Rich", "Brave"],
    correctIndex: 1,
    explanation: "'Generous'-এর বিপরীত শব্দ 'Stingy' (কৃপণ)।",
    examType: "Bank Job",
    year: 2022,
    timesAsked: 3,
    subjectSlug: "english-language-literature",
  },
  {
    id: "py9",
    question: "HTML-এর পূর্ণরূপ কী?",
    options: [
      "HyperText Markup Language",
      "High Text Machine Language",
      "HyperText Markdown Language",
      "Home Tool Markup Language",
    ],
    correctIndex: 0,
    explanation: "HTML = HyperText Markup Language, ওয়েবপেজ তৈরির মার্কআপ ভাষা।",
    examType: "BCS",
    year: 2023,
    timesAsked: 2,
    subjectSlug: "computer-it",
  },
  {
    id: "py10",
    question: "৪৮-এর ২৫% কত?",
    options: ["১০", "১২", "১৪", "১৬"],
    correctIndex: 1,
    explanation: "৪৮ × ২৫ ÷ ১০০ = ১২।",
    examType: "Railway",
    year: 2019,
    timesAsked: 1,
    subjectSlug: "mathematical-reasoning",
  },
  {
    id: "py11",
    question: "প্রথম আন্তর্জাতিক মাতৃভাষা দিবস কত সালে পালিত হয়?",
    options: ["১৯৯৯", "২০০০", "২০০১", "২০০২"],
    correctIndex: 1,
    explanation: "২০০০ সালের ২১ ফেব্রুয়ারি প্রথমবার আন্তর্জাতিক মাতৃভাষা দিবস পালিত হয়।",
    examType: "BCS",
    year: 2022,
    timesAsked: 6,
    subjectSlug: "bangladesh-affairs",
    topicSlug: "language-movement",
  },
  {
    id: "py12",
    question: "আয়তনে বাংলাদেশের বৃহত্তম জেলা কোনটি?",
    options: ["খুলনা", "চট্টগ্রাম", "রাঙ্গামাটি", "সিলেট"],
    correctIndex: 2,
    explanation: "আয়তনে বাংলাদেশের সবচেয়ে বড় জেলা রাঙ্গামাটি।",
    examType: "NTRCA",
    year: 2020,
    timesAsked: 3,
    subjectSlug: "geography-environment",
  },
  {
    id: "py13",
    question: "সুন্দরবন কত সালে ইউনেস্কোর বিশ্ব ঐতিহ্যের তালিকায় অন্তর্ভুক্ত হয়?",
    options: ["১৯৮৫", "১৯৯০", "১৯৯৭", "২০০৩"],
    correctIndex: 2,
    explanation: "১৯৯৭ সালে সুন্দরবন ইউনেস্কোর বিশ্ব ঐতিহ্যের তালিকায় স্থান পায়।",
    examType: "BCS",
    year: 2024,
    timesAsked: 5,
    subjectSlug: "geography-environment",
  },
];