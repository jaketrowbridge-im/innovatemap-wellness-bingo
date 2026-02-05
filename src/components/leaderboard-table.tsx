"use client";

import { LeaderboardEntry } from "@/types";

export function LeaderboardTable({ entries }: { entries: LeaderboardEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        No players yet. Be the first to join!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Desktop table */}
      <div className="hidden sm:block overflow-hidden rounded-xl border border-slate-200">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 text-left text-xs text-slate-500 uppercase tracking-wider">
              <th className="px-4 py-3 w-12">Rank</th>
              <th className="px-4 py-3">Player</th>
              <th className="px-4 py-3">Progress</th>
              <th className="px-4 py-3 w-24 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {entries.map((entry, i) => (
              <tr key={entry.player.id} className={entry.hasBingo ? "bg-yellow-50" : "bg-white"}>
                <td className="px-4 py-3 text-sm font-bold text-slate-700">
                  {i + 1}
                </td>
                <td className="px-4 py-3">
                  <span className="font-medium text-slate-900">{entry.player.name}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${entry.hasBingo ? "bg-yellow-400" : "bg-emerald-500"}`}
                        style={{ width: `${(entry.completionCount / 24) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500 w-10 text-right">
                      {entry.completionCount}/24
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  {entry.hasBingo ? (
                    <span className="inline-block px-2 py-1 text-xs font-bold text-yellow-700 bg-yellow-200 rounded-full">
                      BINGO!
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">Playing</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card layout */}
      <div className="sm:hidden space-y-2">
        {entries.map((entry, i) => (
          <div
            key={entry.player.id}
            className={`rounded-lg border p-4 ${entry.hasBingo ? "bg-yellow-50 border-yellow-200" : "bg-white border-slate-200"}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-slate-400 w-6">#{i + 1}</span>
                <span className="font-semibold text-slate-900">{entry.player.name}</span>
              </div>
              {entry.hasBingo && (
                <span className="px-2 py-1 text-xs font-bold text-yellow-700 bg-yellow-200 rounded-full">
                  BINGO!
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${entry.hasBingo ? "bg-yellow-400" : "bg-emerald-500"}`}
                  style={{ width: `${(entry.completionCount / 24) * 100}%` }}
                />
              </div>
              <span className="text-xs text-slate-500">{entry.completionCount}/24</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
