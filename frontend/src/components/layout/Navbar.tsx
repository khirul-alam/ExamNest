// frontend/src/components/layout/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Bell,
  Bookmark,
  ChevronDown,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Moon,
  Search,
  StickyNote,
  Sun,
  User,
  UserPlus,
  X,
} from "lucide-react";
import { baseLinks, memberLinks } from "@/lib/nav";
import { demoAccount } from "@/lib/dashboard-data";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useAuthPreview } from "@/components/providers/AuthPreviewProvider";

// প্রোফাইল ড্রপডাউনের লিংক
const profileMenuLinks = [
  { href: "/dashboard", label: "ড্যাশবোর্ড", icon: LayoutDashboard },
  { href: "/profile", label: "প্রোফাইল", icon: User },
  { href: "/bookmarks", label: "বুকমার্ক", icon: Bookmark },
  { href: "/notes", label: "আমার নোট", icon: StickyNote },
];

export function Navbar() {
  const pathname = usePathname();
  const { isDark, toggleTheme } = useTheme();
  const { isLoggedIn, login, logout } = useAuthPreview();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const links = isLoggedIn ? memberLinks : baseLinks;

  // বর্তমান পেজের লিংক চিহ্নিত করার নিয়ম
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // পেজ বদলালে খোলা মেনুগুলো বন্ধ হয়ে যাবে
  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  // ড্রপডাউনের বাইরে ক্লিক করলে বা Esc চাপলে বন্ধ হবে
  useEffect(() => {
    if (!profileOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setProfileOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [profileOpen]);

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

              {/* প্রোফাইল ড্রপডাউন */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={profileOpen}
                  className="flex items-center gap-2 rounded-md bg-muted px-3 py-1.5 text-sm font-medium"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                    {demoAccount.name.charAt(0)}
                  </span>
                  <span className="hidden max-w-[120px] truncate sm:block">
                    {demoAccount.name}
                  </span>
                  <ChevronDown size={14} />
                </button>

                {profileOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-full z-50 mt-1 w-52 rounded-lg border border-border bg-card py-1 shadow-lg"
                  >
                    {profileMenuLinks.map(({ href, label, icon: Icon }) => (
                      <Link
                        key={href}
                        href={href}
                        role="menuitem"
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted"
                      >
                        <Icon size={14} /> {label}
                      </Link>
                    ))}
                    <div className="my-1 border-t border-border" />
                    <button
                      role="menuitem"
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
            aria-expanded={mobileOpen}
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
                  className="flex-1 rounded-md border border-border py-2 text-center text-sm font-medium"
                >
                  লগইন
                </Link>
                <Link
                  href="/register"
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