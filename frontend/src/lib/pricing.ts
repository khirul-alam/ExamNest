// frontend/src/lib/pricing.ts

// ⚠️ Premium এর দামগুলো ডিজাইন ফাইল থেকে নেওয়া সাময়িক মান।
// পরে এগুলো Admin Panel থেকে নিয়ন্ত্রণ করা হবে।
export const premiumPlans = [
  { id: "1m", months: 1, label: "১ মাস", price: 299 },
  { id: "3m", months: 3, label: "৩ মাস", price: 500 },
  { id: "6m", months: 6, label: "৬ মাস", price: 1000 },
  { id: "12m", months: 12, label: "১ বছর", price: 2000 },
] as const;

// Corporate: প্রতি শিক্ষার্থী প্রতি মাসে ১০০ টাকা, ন্যূনতম ২০ জন
export const CORPORATE_PRICE_PER_STUDENT = 100;
export const CORPORATE_MIN_STUDENTS = 20;

export const corporateDurations = [
  { months: 1, label: "১ মাস" },
  { months: 3, label: "৩ মাস" },
  { months: 6, label: "৬ মাস" },
  { months: 12, label: "১ বছর" },
] as const;

// দ্রুত নির্বাচনের জন্য শিক্ষার্থী সংখ্যা
export const corporateQuickCounts = [20, 50, 100, 200, 300] as const;

// মোট দাম = শিক্ষার্থী × মাস × ১০০ টাকা
export function calcCorporateTotal(students: number, months: number): number {
  return students * months * CORPORATE_PRICE_PER_STUDENT;
}

// সংখ্যাকে বাংলা অঙ্কে টাকার রূপ দেওয়া (যেমন ৳২,০০০)
export function formatTaka(amount: number): string {
  return `৳${new Intl.NumberFormat("bn-BD").format(amount)}`;
}

export function toBanglaNumber(value: number): string {
  return new Intl.NumberFormat("bn-BD").format(value);
}