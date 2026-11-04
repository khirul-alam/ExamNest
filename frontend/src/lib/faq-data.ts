// frontend/src/lib/faq-data.ts
import { MARK_CORRECT, MARK_WRONG, MAX_VIOLATIONS, PASS_PERCENT } from "@/lib/exam-utils";
import {
  CORPORATE_LONG_TERM_DISCOUNT_PERCENT,
  CORPORATE_MIN_STUDENTS,
  CORPORATE_PRICE_PER_STUDENT,
  corporateDurations,
  formatTaka,
  premiumPlans,
  toBanglaNumber,
} from "@/lib/pricing";

export type FaqItem = { question: string; answer: string };
export type FaqGroup = { title: string; items: FaqItem[] };

// দাম ও নিয়ম সরাসরি pricing.ts ও exam-utils.ts থেকে নেওয়া, তাই বদলালে FAQ নিজে হালনাগাদ হবে
const premiumPriceList = premiumPlans.map((p) => `${p.label} ${formatTaka(p.price)}`).join(", ");
const corporateDurationList = corporateDurations.map((d) => d.label).join(", ");

export const faqGroups: FaqGroup[] = [
  {
    title: "অ্যাকাউন্ট ও ফ্রি ট্রায়াল",
    items: [
      {
        question: "ফ্রি অ্যাকাউন্টে আমি কী কী সুবিধা পাব?",
        answer:
          "নিবন্ধনের পর ৭ দিন পূর্ণ সুবিধা পাবেন: Progress Tracking, ড্যাশবোর্ড, লিডারবোর্ড, বুকমার্ক, পরীক্ষার ইতিহাস, ভুল উত্তরের পর্যালোচনা, Study Streak ও ব্যাজ।",
      },
      {
        question: "৭ দিন পর কী হবে?",
        answer:
          "৭ দিন পর আপনার অ্যাকাউন্ট বিজ্ঞাপনসহ Read Mode-এ চলবে, অর্থাৎ পড়তে পারবেন কিন্তু বিজ্ঞাপন দেখাবে। Premium নিলে আবার সব সুবিধা কোনো বিজ্ঞাপন ছাড়া চালু হবে।",
      },
      {
        question: "লগইন ছাড়া আমি কী দেখতে পারব?",
        answer:
          "লগইন ছাড়াই বিষয়ভিত্তিক পড়া, বিগত বছরের প্রশ্ন, কারেন্ট অ্যাফেয়ার্স ও চাকরির বিজ্ঞপ্তি দেখা যাবে। পরীক্ষা দেওয়া, Progress, বুকমার্ক, নোট ও লিডারবোর্ডের জন্য লগইন করতে হবে।",
      },
      {
        question: "পাসওয়ার্ড কেমন হতে হবে?",
        answer:
          "কমপক্ষে ৮ অক্ষর, এবং এতে ১টি বড় হাতের অক্ষর, ১টি ছোট হাতের অক্ষর, ১টি সংখ্যা ও ১টি বিশেষ চিহ্ন থাকতে হবে। খুব সাধারণ পাসওয়ার্ড (যেমন password বা 12345678) গ্রহণ করা হয় না।",
      },
    ],
  },
  {
    title: "প্রিমিয়াম ও পেমেন্ট",
    items: [
      {
        question: "প্রিমিয়ামের দাম কত?",
        answer: `প্রিমিয়াম প্ল্যান: ${premiumPriceList}। প্রিমিয়ামে Unlimited Model Test, Premium Notes, AI Analysis, বিজ্ঞাপনমুক্ত অভিজ্ঞতা, Advanced Analytics ও Smart Study Plan পাবেন।`,
      },
      {
        question: "কোন কোন মাধ্যমে পেমেন্ট করা যাবে?",
        answer:
          "পেমেন্ট পদ্ধতি চূড়ান্ত হলে এখানে জানানো হবে। সাইট চালুর আগে এই তথ্য যুক্ত করা হবে।",
      },
    ],
  },
  {
    title: "কর্পোরেট অ্যাকাউন্ট",
    items: [
      {
        question: "কর্পোরেট অ্যাকাউন্ট কীভাবে কাজ করে?",
        answer: `কোচিং সেন্টার বা প্রতিষ্ঠান নিজের নামে অ্যাকাউন্ট খুলে মেয়াদ (${corporateDurationList}) বেছে নেয়। প্রতি শিক্ষার্থীর জন্য মাসে ${formatTaka(CORPORATE_PRICE_PER_STUDENT)} এবং ন্যূনতম ${toBanglaNumber(CORPORATE_MIN_STUDENTS)} জন শিক্ষার্থী। ২ বছর বা তার বেশি মেয়াদে ${toBanglaNumber(CORPORATE_LONG_TERM_DISCOUNT_PERCENT)}% ছাড় পাওয়া যায়।`,
      },
      {
        question: "প্রতিষ্ঠান কীভাবে শিক্ষার্থী যুক্ত করবে?",
        answer:
          "অ্যাকাউন্ট খোলার পর ইমেইল, CSV ফাইল বা মোবাইল নম্বর দিয়ে শিক্ষার্থী যুক্ত করা যাবে।",
      },
    ],
  },
  {
    title: "পরীক্ষা ও ফলাফল",
    items: [
      {
        question: "নম্বর কীভাবে হিসাব হয়?",
        answer: `প্রতিটি সঠিক উত্তরে +${toBanglaNumber(MARK_CORRECT)}, ভুল উত্তরে −${toBanglaNumber(Math.abs(MARK_WRONG))} এবং উত্তর না দিলে ০ নম্বর। মোট নম্বরের ${toBanglaNumber(PASS_PERCENT)}% বা তার বেশি পেলে উত্তীর্ণ ধরা হয়।`,
      },
      {
        question: "পরীক্ষা চলার সময় কোন নিয়মগুলো মানতে হবে?",
        answer: `ট্যাব বদলানো বা উইন্ডো ছাড়লে সতর্কতা আসে; ${toBanglaNumber(MAX_VIOLATIONS)} বার হলে পরীক্ষা নিজে জমা হয়ে যায়। মডেল টেস্টে ফুলস্ক্রিন মোড বাধ্যতামূলক। পরীক্ষার সময় Copy, Paste ও Right-Click বন্ধ থাকে।`,
      },
      {
        question: "পরীক্ষার মাঝে ব্রাউজার বন্ধ বা রিফ্রেশ হলে কী হবে?",
        answer:
          "আপনার উত্তর ও অবশিষ্ট সময় স্বয়ংক্রিয়ভাবে সংরক্ষিত থাকে। আবার পরীক্ষার পেজে এলে চালিয়ে যাওয়ার সুযোগ পাবেন। তবে বন্ধ থাকার সময়টুকুও আপনার সময় থেকে কেটে যাবে, কারণ ঘড়ি থামে না।",
      },
    ],
  },
  {
    title: "কনটেন্ট",
    items: [
      {
        question: "প্রশ্ন বা উত্তরে ভুল পেলে কী করব?",
        answer:
          "প্রতিটি টপিক ও প্রশ্নের নিচে \"Report Error\" বাটন আছে। ভুলের ধরন বেছে, বিবরণ লিখে এবং চাইলে স্ক্রিনশটসহ জমা দিন। আমরা যাচাই করে সংশোধন করব।",
      },
      {
        question: "বিগত বছরের প্রশ্নের 🔥 ⭐ 📌 চিহ্নের মানে কী?",
        answer:
          "এটি প্রশ্নটি কতবার এসেছে তা বোঝায়: 🔥 অত্যন্ত গুরুত্বপূর্ণ (৫ বা তার বেশি বার), ⭐ গুরুত্বপূর্ণ (৩-৪ বার), 📌 মাঝারি (১-২ বার)।",
      },
    ],
  },
];