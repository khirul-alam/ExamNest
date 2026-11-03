// frontend/src/components/layout/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  ChevronDown,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Moon,
  Search,
  Sun,
  User,
  UserPlus,
  X,
} from "lucide-react";
import { baseLinks, memberLinks } from "@/lib/nav";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useAuthPreview } from "@/components/providers/AuthPreviewProvider";

export function Navbar() {
  const pathname = usePathname();
  const { isDark, toggleTheme } = useTheme();
  const { isLoggedIn, login, logout } = useAuthPreview();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const links = isLoggedIn ? memberLinks : baseLinks;

  // বর্তমান পেজের লিংক চিহ্নিত করার নিয়ম
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* লোগো */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-emerald-800 font-display text-sm font-bold text-white">
            EN
          </div>
          <div className="hidden sm:block">
            <div className="font-display text-sm font-bold leading-tight text-primary">
              ExamNest
            </div>
            <div className="text-xs leading-tight text-muted-foreground">
              BCS & Job Preparation
            </div>
          </div>
        </Link>

        {/* ডেস্কটপ মেনু */}
        <div className="hidden items-center gap-1 lg:flex">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive(href)
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <Icon size={14} />
              {label}
            </Link>
          ))}
        </div>

        {/* ডান পাশের অংশ */}
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <button
                aria-label="সার্চ"
                className="hidden rounded-md p-2 text-muted-foreground hover:bg-muted sm:flex"
              >
                <Search size={18} />
              </button>
              <button
                aria-label="নোটিফিকেশন"
                className="relative hidden rounded-md p-2 text-muted-foreground hover:bg-muted sm:flex"
              >
                <Bell size={18} />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
              </button>
              <Link
                href="/dashboard"
                aria-label="ড্যাশবোর্ড"
                className="hidden rounded-md p-2 text-muted-foreground hover:bg-muted sm:flex"
              >
                <LayoutDashboard size={18} />
              </Link>

              {/* প্রোফাইল ড্রপডাউন */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-md bg-muted px-3 py-1.5 text-sm font-medium"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                    র
                  </span>
                  <span className="hidden sm:block">রাহিম</span>
                  <ChevronDown size={14} />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-lg border border-border bg-card py-1 shadow-lg">
                    <Link
                      href="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted"
                    >
                      <User size={14} /> প্রোফাইল
                    </Link>
                    <Link
                      href="/dashboard"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted"
                    >
                      <LayoutDashboard size={14} /> ড্যাশবোর্ড
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setProfileOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-muted"
                    >
                      <LogOut size={14} /> লগআউট
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted sm:flex"
              >
                <LogIn size={14} /> লগইন
              </Link>
              <Link
                href="/register"
                className="hidden items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground sm:flex"
              >
                <UserPlus size={14} /> রেজিস্ট্রেশন
              </Link>
            </>
          )}

          {/* ডার্ক মোড বাটন */}
          <button
            onClick={toggleTheme}
            aria-label="থিম পরিবর্তন"
            className="rounded-md p-2 text-muted-foreground hover:bg-muted"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* ⚠️ শুধু ডেভেলপমেন্টে: লগইন অবস্থার প্রিভিউ বাটন (পরে মুছে ফেলা হবে) */}
          {process.env.NODE_ENV === "development" && !isLoggedIn && (
            <button
              onClick={login}
              className="rounded-md border border-dashed border-accent px-2 py-1 text-xs text-accent"
            >
              প্রিভিউ: লগইন
            </button>
          )}

          {/* মোবাইল মেনু বাটন */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="মেনু"
            className="rounded-md p-2 hover:bg-muted lg:hidden"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* মোবাইল মেনু */}
      {mobileOpen && (
        <div className="border-t border-border bg-card px-4 py-3 lg:hidden">
          <div className="flex flex-col gap-1">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium ${
                  isActive(href)
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
            {!isLoggedIn && (
              <div className="mt-2 flex gap-2 sm:hidden">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 rounded-md border border-border py-2 text-center text-sm font-medium"
                >
                  লগইন
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 rounded-md bg-primary py-2 text-center text-sm font-medium text-primary-foreground"
                >
                  রেজিস্ট্রেশন
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}