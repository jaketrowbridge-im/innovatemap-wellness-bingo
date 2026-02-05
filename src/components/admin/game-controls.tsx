"use client";

import { useState } from "react";

interface GameControlsProps {
  initialSettings: {
    startDate: string;
    endDate: string;
    isActive: boolean;
  } | null;
  stats: { totalPlayers: number; totalCompletions: number };
}

export function GameControls({ initialSettings, stats }: GameControlsProps) {
  const [startDate, setStartDate] = useState(
    initialSettings?.startDate ? initialSettings.startDate.slice(0, 10) : ""
  );
  const [endDate, setEndDate] = useState(
    initialSettings?.endDate ? initialSettings.endDate.slice(0, 10) : ""
  );
  const [message, setMessage] = useState("");

  async function handleUpdateDates() {
    setMessage("");
    const res = await fetch("/api/admin/game", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "updateDates",
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
      }),
    });
    if (res.ok) setMessage("Dates updated!");
    else setMessage("Failed to update dates.");
  }

  async function handleReset() {
    if (!confirm("Are you sure? This will clear all completions and reshuffle all cards.")) return;
    setMessage("");
    const res = await fetch("/api/admin/game", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reset" }),
    });
    if (res.ok) setMessage("Game reset! All cards have been reshuffled.");
    else setMessage("Failed to reset game.");
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-2xl font-bold text-slate-900">{stats.totalPlayers}</div>
          <div className="text-sm text-slate-500">Players</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-2xl font-bold text-slate-900">{stats.totalCompletions}</div>
          <div className="text-sm text-slate-500">Completions</div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <h3 className="font-semibold text-slate-900 mb-3">Game Dates</h3>
        <div className="flex gap-3 items-end">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Start</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-slate-300 rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">End</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-slate-300 rounded px-3 py-2 text-sm"
            />
          </div>
          <button
            onClick={handleUpdateDates}
            className="px-4 py-2 bg-emerald-500 text-white text-sm rounded hover:bg-emerald-600"
          >
            Save
          </button>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <h3 className="font-semibold text-red-900 mb-2">Danger Zone</h3>
        <p className="text-sm text-red-600 mb-3">
          Reset will clear all completions and reshuffle all player cards.
        </p>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600"
        >
          Reset Game
        </button>
      </div>

      {message && (
        <p className="text-sm text-emerald-600 font-medium">{message}</p>
      )}
    </div>
  );
}
