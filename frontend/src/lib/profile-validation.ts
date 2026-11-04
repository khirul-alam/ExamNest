// frontend/src/lib/profile-validation.ts
import { z } from "zod";
import { passwordSchema, phoneSchema } from "@/lib/validation";

// প্রোফাইল তথ্যের যাচাই (ফোন ঐচ্ছিক, দিলে সঠিক হতে হবে)
export const profileSchema = z.object({
  name: z.string().min(2, "আপনার নাম লিখুন").max(60, "নাম ৬০ অক্ষরের বেশি হতে পারবে না"),
  phone: phoneSchema.or(z.literal("")),
  institution: z.string().max(100, "প্রতিষ্ঠানের নাম ১০০ অক্ষরের বেশি হতে পারবে না"),
  targetExam: z.string(),
  showOnLeaderboard: z.boolean(),
});

// পাসওয়ার্ড পরিবর্তনের যাচাই
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "বর্তমান পাসওয়ার্ড দিন"),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "নতুন পাসওয়ার্ড আবার লিখুন"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "পাসওয়ার্ড দুটি মিলছে না",
    path: ["confirmPassword"],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "নতুন পাসওয়ার্ড বর্তমানটির থেকে আলাদা হতে হবে",
    path: ["newPassword"],
  });