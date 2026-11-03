// frontend/src/lib/validation.ts
import { z } from "zod";

// খুব সাধারণ পাসওয়ার্ডের তালিকা (পরে ব্যাকএন্ডে বড় তালিকা দিয়ে যাচাই হবে)
const commonPasswords = [
  "password",
  "password1",
  "12345678",
  "123456789",
  "qwerty123",
  "11111111",
  "iloveyou",
  "admin123",
];

// পাসওয়ার্ডের প্রতিটি নিয়ম (শক্তি মিটারেও এটি ব্যবহার হবে)
export const passwordRules = [
  { id: "length", label: "কমপক্ষে ৮ অক্ষর", test: (v: string) => v.length >= 8 },
  { id: "upper", label: "১টি বড় হাতের অক্ষর (A-Z)", test: (v: string) => /[A-Z]/.test(v) },
  { id: "lower", label: "১টি ছোট হাতের অক্ষর (a-z)", test: (v: string) => /[a-z]/.test(v) },
  { id: "number", label: "১টি সংখ্যা (0-9)", test: (v: string) => /\d/.test(v) },
  { id: "special", label: "১টি বিশেষ চিহ্ন (!@#$...)", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

export const emailSchema = z
  .string()
  .min(1, "ইমেইল দিন")
  .email("সঠিক ইমেইল ঠিকানা দিন");

// বাংলাদেশের মোবাইল নম্বর: 01 দিয়ে শুরু, মোট ১১ সংখ্যা
export const phoneSchema = z
  .string()
  .regex(/^01[3-9]\d{8}$/, "সঠিক মোবাইল নম্বর দিন (যেমন 017XXXXXXXX)");

export const passwordSchema = z
  .string()
  .min(1, "পাসওয়ার্ড দিন")
  .refine(
    (v) => passwordRules.every((rule) => rule.test(v)),
    "পাসওয়ার্ড নীতিমালা পূরণ হয়নি",
  )
  .refine(
    (v) => !commonPasswords.includes(v.toLowerCase()),
    "এই পাসওয়ার্ডটি খুব সাধারণ, অন্য একটি বেছে নিন",
  );

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "পাসওয়ার্ড দিন"),
});

export const phoneLoginSchema = z.object({ phone: phoneSchema });

export const otpSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, "৬ সংখ্যার কোডটি দিন"),
});

export const forgotPasswordSchema = z.object({ email: emailSchema });

export const registerSchema = z
  .object({
    name: z.string().min(2, "আপনার নাম লিখুন"),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "পাসওয়ার্ড আবার লিখুন"),
    agree: z.boolean().refine((v) => v === true, "শর্তাবলিতে সম্মত হতে হবে"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "পাসওয়ার্ড দুটি মিলছে না",
    path: ["confirmPassword"],
  });

export const corporateRegisterSchema = z
  .object({
    institutionName: z.string().min(2, "প্রতিষ্ঠানের নাম লিখুন"),
    institutionType: z.string().min(1, "প্রতিষ্ঠানের ধরন বেছে নিন"),
    contactName: z.string().min(2, "যোগাযোগকারী ব্যক্তির নাম লিখুন"),
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "পাসওয়ার্ড আবার লিখুন"),
    students: z.coerce
      .number({ message: "শিক্ষার্থীর সংখ্যা দিন" })
      .int("পূর্ণ সংখ্যা দিন")
      .min(20, "ন্যূনতম ২০ জন শিক্ষার্থী প্রয়োজন"),
    months: z.string().min(1, "মেয়াদ বেছে নিন"),
    agree: z.boolean().refine((v) => v === true, "শর্তাবলিতে সম্মত হতে হবে"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "পাসওয়ার্ড দুটি মিলছে না",
    path: ["confirmPassword"],
  });