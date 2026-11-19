// frontend/src/lib/daily-goal.ts

// ⚠️ দৈনিক লক্ষ্য এখন শুধু এই ব্রাউজারে (localStorage) থাকে। ব্যাকএন্ড যুক্ত হলে অ্যাকাউন্টে যাবে।
export const DAILY_GOAL_KEY = "examnest-daily-goal";
export const DEFAULT_DAILY_GOAL = 50;
export const DAILY_GOAL_MIN = 5;
export const DAILY_GOAL_MAX = 500;

export function isValidDailyGoal(value: number): boolean {
  return Number.isInteger(value) && value >= DAILY_GOAL_MIN && value <= DAILY_GOAL_MAX;
}

// ব্রাউজারে রাখা মান বদলানো থাকতে পারে, তাই যাচাই করে নেওয়া হয়
export function loadDailyGoal(): number {
  try {
    const raw = localStorage.getItem(DAILY_GOAL_KEY);
    const value = raw === null ? Number.NaN : Number(raw);
    return isValidDailyGoal(value) ? value : DEFAULT_DAILY_GOAL;
  } catch {
    return DEFAULT_DAILY_GOAL;
  }
}

export function saveDailyGoal(goal: number): void {
  try {
    localStorage.setItem(DAILY_GOAL_KEY, String(goal));
  } catch {
    // সংরক্ষণ না হলেও পেজ চলবে
  }
}