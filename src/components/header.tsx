"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header({ playerName, isAdmin }: { playerName?: string; isAdmin?: boolean }) {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg text-slate-900">
          Wellness Bingo
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {playerName && (
            <>
              <Link
                href="/leaderboard"
                className={`hover:text-slate-900 ${pathname === "/leaderboard" ? "text-slate-900 font-medium" : "text-slate-500"}`}
              >
                Leaderboard
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className={`hover:text-slate-900 ${pathname.startsWith("/admin") ? "text-slate-900 font-medium" : "text-slate-500"}`}
                >
                  Admin
                </Link>
              )}
              <span className="text-slate-400">|</span>
              <span className="text-slate-600">{playerName}</span>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
