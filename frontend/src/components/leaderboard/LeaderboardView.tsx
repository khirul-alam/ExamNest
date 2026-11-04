// frontend/src/components/leaderboard/LeaderboardView.tsx
"use client";

import { useState } from "react";
import { Crown, Flame, Star, Trophy } from "lucide-react";
import {
  getLeaderboard,
  leaderboardTabs,
  myPosition,
  type LeaderboardTab,
} from "@/lib/leaderboard-data";
import { toBanglaNumber } from "@/lib/pricing";

const medals = ["🥇", "🥈", "🥉"];
const medalColors = ["#f59e0b", "#94a3b8", "#cd7f32"];

export function LeaderboardView() {
  const [tab, setTab] = useState<LeaderboardTab>("weekly");

  const entries = getLeaderboard(tab);
  const mine = myPosition[tab];
  // মঞ্চের ক্রম: ২য়, ১ম, ৩য়
  const podium = [entries[1], entries[0], entries[2]];

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="mb-6 flex items-center gap-3">
        <Trophy size={22} className="text-amber-600" />
        <div>
          <h1 className="font-display text-2xl font-bold">লিডারবোর্ড</h1>
          <p className="text-sm text-muted-foreground">শীর্ষ শিক্ষার্থীদের তালিকা</p>
        </div>
      </div>

      <p className="mb-4 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-xs">
        এটি ডেমো তালিকা। আসল তালিকায় শুধু সেই ব্যবহারকারীদের নাম দেখাবে যাঁরা Profile সেটিংসে
        &quot;লিডারবোর্ডে নাম দেখাও&quot; চালু রেখেছেন।
      </p>

      {/* ট্যাব */}
      <div className="mb-6 flex gap-1 rounded-xl border border-border bg-muted p-1">
        {leaderboardTabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
              tab === t.id ? "bg-card text-primary shadow" : "text-muted-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* শীর্ষ ৩ জনের মঞ্চ */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        {podium.map((user, index) => {
          const actualRank = index === 0 ? 2 : index === 1 ? 1 : 3;
          const isFirst = actualRank === 1;
          const color = medalColors[actualRank - 1];
          return (
            <div
              key={user.rank}
              className={`relative rounded-xl border bg-card p-4 text-center ${
                isFirst ? "-mt-2 shadow-lg" : ""
              }`}
              style={{ borderColor: color }}
            >
              {isFirst && <Crown size={18} className="mx-auto mb-1" style={{ color }} />}
              <div className="mb-1 text-2xl">{medals[actualRank - 1]}</div>
              <div
                className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full text-base font-bold text-white"
                style={{ backgroundColor: color }}
              >
                {user.avatar}
              </div>
              <p className="mb-1 text-xs font-semibold leading-tight">{user.name}</p>
              <p className="font-mono text-sm font-bold text-primary">{toBanglaNumber(user.score)}</p>
              <p className="mt-1 flex items-center justify-center gap-0.5 font-mono text-xs text-red-500">
                <Flame size={10} /> {toBanglaNumber(user.streak)}
              </p>
            </div>
          );
        })}
      </div>

      {/* পূর্ণ তালিকা */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="grid grid-cols-12 border-b border-border bg-muted px-4 py-2 font-mono text-xs font-bold text-muted-foreground">
          <span className="col-span-1">#</span>
          <span className="col-span-5">নাম</span>
          <span className="col-span-2 text-center">স্কোর</span>
          <span className="col-span-2 text-center">সঠিক%</span>
          <span className="col-span-2 hidden text-center sm:block">Streak</span>
        </div>
        <ul className="divide-y divide-border">
          {entries.map((user) => (
            <li
              key={user.rank}
              className="grid grid-cols-12 items-center px-4 py-3 transition-colors hover:bg-muted/60"
            >
              <span className="col-span-1 font-mono text-sm font-bold">
                {user.rank <= 3 ? medals[user.rank - 1] : toBanglaNumber(user.rank)}
              </span>
              <div className="col-span-5 flex items-center gap-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {user.avatar}
                </span>
                <p className="truncate text-sm font-medium">{user.name}</p>
              </div>
              <span className="col-span-2 text-center font-mono text-sm font-bold text-primary">
                {toBanglaNumber(user.score)}
              </span>
              <span className="col-span-2 text-center font-mono text-sm">
                {toBanglaNumber(user.accuracy)}%
              </span>
              <span className="col-span-2 hidden text-center font-mono text-sm text-red-500 sm:block">
                🔥 {toBanglaNumber(user.streak)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* আমার অবস্থান */}
      <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
        <Star size={16} className="text-primary" />
        <span className="text-sm">আপনার বর্তমান র‍্যাঙ্ক:</span>
        <span className="font-mono font-bold text-primary">#{toBanglaNumber(mine.rank)}</span>
        <span className="ml-auto text-xs text-muted-foreground">
          আরও {toBanglaNumber(mine.pointsToNext)} পয়েন্ট অর্জন করলে #{toBanglaNumber(mine.rank - 1)} হবেন
        </span>
      </div>
    </div>
  );
}