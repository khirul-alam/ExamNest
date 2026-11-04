// frontend/src/lib/pricing.ts

// Premium প্ল্যান (চূড়ান্ত দাম)। পরে Admin Panel থেকে নিয়ন্ত্রণ করা হবে।
export const premiumPlans = [
  { id: "1m", months: 1, label: "১ মাস", price: 299 },
  { id: "3m", months: 3, label: "৩ মাস", price: 499 },
  { id: "6m", months: 6, label: "৬ মাস", price: 999 },
  { id: "12m", months: 12, label: "১ বছর", price: 1999 },
] as const;

// Corporate: প্রতি শিক্ষার্থী প্রতি মাসে ১০০ টাকা, ন্যূনতম ২০ জন
export const CORPORATE_PRICE_PER_STUDENT = 100;
export const CORPORATE_MIN_STUDENTS = 20;

// ২ বছর (২৪ মাস) বা তার বেশি মেয়াদে ছাড়
export const CORPORATE_LONG_TERM_MONTHS = 24;
export const CORPORATE_LONG_TERM_DISCOUNT_PERCENT = 20;

export const corporateDurations = [
  { months: 1, label: "১ মাস", discountPercent: 0 },
  { months: 3, label: "৩ মাস", discountPercent: 0 },
  { months: 6, label: "৬ মাস", discountPercent: 0 },
  { months: 12, label: "১ বছর", discountPercent: 0 },
  {
    months: CORPORATE_LONG_TERM_MONTHS,
    label: "২ বছর",
    discountPercent: CORPORATE_LONG_TERM_DISCOUNT_PERCENT,
  },
] as const;

// দ্রুত নির্বাচনের জন্য শিক্ষার্থী সংখ্যা
export const corporateQuickCounts = [20, 50, 100, 200, 300] as const;

// মেয়াদ অনুযায়ী ছাড়ের শতকরা হার
export function getCorporateDiscountPercent(months: number): number {
  return months >= CORPORATE_LONG_TERM_MONTHS
    ? CORPORATE_LONG_TERM_DISCOUNT_PERCENT
    : 0;
}

// বিলের বিস্তারিত হিসাব: মোট দাম, ছাড় ও ছাড়ের পরের দাম
export function calcCorporateBreakdown(students: number, months: number) {
  const subtotal = students * months * CORPORATE_PRICE_PER_STUDENT;
  const discountPercent = getCorporateDiscountPercent(months);
  const discount = Math.round((subtotal * discountPercent) / 100);
  return { subtotal, discountPercent, discount, total: subtotal - discount };
}

export function calcCorporateTotal(students: number, months: number): number {
  return calcCorporateBreakdown(students, months).total;
}

// সংখ্যাকে বাংলা অঙ্কে টাকার রূপ দেওয়া (যেমন ৳২,০০০)
export function formatTaka(amount: number): string {
  return `৳${new Intl.NumberFormat("bn-BD").format(amount)}`;
}

export function toBanglaNumber(value: number): string {
  return new Intl.NumberFormat("bn-BD").format(value);
}