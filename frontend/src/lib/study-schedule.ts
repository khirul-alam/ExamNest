// frontend/src/lib/study-schedule.ts
import { allSubjects, getSubject } from "@/lib/subjects-data";

// ⚠️ সাপ্তাহিক রুটিন এখন শুধু এই ব্রাউজারে (localStorage) থাকে। ব্যাকএন্ড যুক্ত হলে অ্যাকাউন্টে যাবে।
export const SCHEDULE_KEY = "examnest-weekly-schedule";

// বাংলাদেশে সপ্তাহ শনিবার থেকে শুরু
export const weekDays = [
  { key: "sat", label: "শনিবার" },
  { key: "sun", label: "রবিবার" },
  { key: "mon", label: "সোমবার" },
  { key: "tue", label: "মঙ্গলবার" },
  { key: "wed", label: "বুধবার" },
  { key: "thu", label: "বৃহস্পতিবার" },
  { key: "fri", label: "শুক্রবার" },
] as const;

export type DayKey = (typeof weekDays)[number]["key"];
export type Schedule = Record<DayKey, string[]>;

// বিষয় ছাড়াও রুটিনে যেসব বিশেষ কাজ রাখা যায়
export const specialItems = [
  { id: "model-test", label: "মডেল টেস্ট", href: "/model-test" },
  { id: "revision", label: "রিভিশন", href: "/bookmarks" },
] as const;

// রুটিনে বেছে নেওয়ার সব অপশন (বিষয় + বিশেষ কাজ)
export const scheduleOptions: { id: string; label: string }[] = [
  ...allSubjects.map((subject) => ({ id: subject.slug, label: subject.name })),
  ...specialItems.map((item) => ({ id: item.id, label: item.label })),
];

export function emptySchedule(): Schedule {
  return { sat: [], sun: [], mon: [], tue: [], wed: [], thu: [], fri: [] };
}

// আজ সপ্তাহের কোন দিন (JS-এ রবিবার = ০, তাই শনিবার-ভিত্তিক ক্রমে বদলানো হয়)
export function getTodayDayKey(today: Date): DayKey {
  return weekDays[(today.getDay() + 1) % 7].key;
}

function isKnownItem(id: string): boolean {
  return specialItems.some((item) => item.id === id) || getSubject(id) !== undefined;
}

export function getItemLabel(id: string): string | undefined {
  return specialItems.find((item) => item.id === id)?.label ?? getSubject(id)?.name;
}

export function getItemHref(id: string): string {
  return specialItems.find((item) => item.id === id)?.href ?? `/subjects/${id}`;
}

// ব্রাউজারে রাখা তথ্য বদলানো থাকতে পারে, তাই অজানা আইটেম বাদ দিয়ে ও পুনরাবৃত্তি সরিয়ে পড়া হয়
export function loadSchedule(): Schedule {
  const schedule = emptySchedule();
  try {
    const raw = localStorage.getItem(SCHEDULE_KEY);
    if (!raw) return schedule;
    const data: unknown = JSON.parse(raw);
    if (typeof data !== "object" || data === null) return schedule;

    for (const day of weekDays) {
      const value = (data as Record<string, unknown>)[day.key];
      if (Array.isArray(value)) {
        schedule[day.key] = Array.from(
          new Set(value.filter((id): id is string => typeof id === "string" && isKnownItem(id))),
        );
      }
    }
    return schedule;
  } catch {
    return schedule;
  }
}

export function saveSchedule(schedule: Schedule): void {
  try {
    localStorage.setItem(SCHEDULE_KEY, JSON.stringify(schedule));
  } catch {
    // সংরক্ষণ না হলেও পেজ চলবে
  }
}