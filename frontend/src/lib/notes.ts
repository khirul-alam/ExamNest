// frontend/src/lib/notes.ts

// ⚠️ নোট এখন শুধু এই ব্রাউজারে (localStorage) থাকে। ব্যাকএন্ড যুক্ত হলে ডাটাবেজে যাবে।

export type Note = {
  id: string;
  title: string;
  body: string;
  topicKey: string; // "বিষয়-স্লাগ/টপিক-স্লাগ" অথবা খালি
  createdAt: number;
  updatedAt: number;
};

export const NOTES_KEY = "examnest-notes";
export const NOTE_TITLE_MAX = 100;
export const NOTE_BODY_MAX = 2000;

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createNote(input: { title: string; body: string; topicKey: string }): Note {
  const now = Date.now();
  return { id: newId(), ...input, createdAt: now, updatedAt: now };
}

// ব্রাউজারে রাখা তথ্য বদলানো থাকতে পারে, তাই গঠন যাচাই করে ও দৈর্ঘ্য ছেঁটে নেওয়া হয়
export function loadNotes(): Note[] {
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    if (!raw) return [];
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];

    const notes: Note[] = [];
    for (const item of data) {
      if (
        typeof item?.id === "string" &&
        typeof item.title === "string" &&
        typeof item.body === "string" &&
        typeof item.topicKey === "string" &&
        typeof item.createdAt === "number" &&
        typeof item.updatedAt === "number"
      ) {
        notes.push({
          id: item.id,
          title: item.title.slice(0, NOTE_TITLE_MAX),
          body: item.body.slice(0, NOTE_BODY_MAX),
          topicKey: item.topicKey,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        });
      }
    }
    return notes;
  } catch {
    return [];
  }
}

export function saveNotes(notes: Note[]) {
  try {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  } catch {
    // সংরক্ষণ না হলেও পেজ চলবে
  }
}

// সময় (মিলিসেকেন্ড) থেকে স্থানীয় তারিখ "YYYY-MM-DD" রূপে
export function toLocalIsoDate(timestamp: number): string {
  const date = new Date(timestamp);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}