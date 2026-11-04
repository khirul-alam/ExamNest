// frontend/src/lib/format.ts

const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

// যেকোনো সংখ্যা বা লেখার ইংরেজি অঙ্ককে বাংলা অঙ্কে বদলানো (কমা ছাড়া, যেমন ২০২৬)
export function toBanglaDigits(value: string | number): string {
  return String(value).replace(/\d/g, (digit) => banglaDigits[Number(digit)]);
}

const banglaMonths = [
  "জানুয়ারি",
  "ফেব্রুয়ারি",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্টেম্বর",
  "অক্টোবর",
  "নভেম্বর",
  "ডিসেম্বর",
];

// "2026-11-03" → "৩ নভেম্বর ২০২৬"
export function formatBanglaDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return `${toBanglaDigits(day)} ${banglaMonths[month - 1]} ${toBanglaDigits(year)}`;
}

// আজ থেকে নির্দিষ্ট তারিখ পর্যন্ত কত দিন বাকি (আজই হলে ০, পার হয়ে গেলে নেগেটিভ)
export function daysUntil(iso: string, today: Date): number {
  const [year, month, day] = iso.split("-").map(Number);
  const target = new Date(year, month - 1, day);
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((target.getTime() - start.getTime()) / 86_400_000);
}