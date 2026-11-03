// frontend/src/app/(auth)/layout.tsx

// সব Auth পেজের জন্য সাধারণ ব্যাকগ্রাউন্ড ও মাঝখানে সাজানো লেআউট
export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 px-4 py-12 dark:from-[#0c1520] dark:via-[#0f2218] dark:to-[#0c1520]">
      {children}
    </div>
  );
}