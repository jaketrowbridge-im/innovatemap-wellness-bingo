"use client";

import { useState } from "react";
import { Player } from "@/types";

export function PlayerList({ initialPlayers }: { initialPlayers: Player[] }) {
  const [playerList, setPlayerList] = useState(initialPlayers);
  const [message, setMessage] = useState("");

  async function handleToggleAdmin(playerId: string, currentAdmin: boolean) {
    const res = await fetch(`/api/admin/players/${playerId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAdmin: !currentAdmin }),
    });
    if (res.ok) {
      const data = await res.json();
      setPlayerList((prev) =>
        prev.map((p) => (p.id === playerId ? data.player : p))
      );
    }
  }

  async function handleDelete(playerId: string, name: string) {
    if (!confirm(`Remove ${name} from the game? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/players/${playerId}`, { method: "DELETE" });
    if (res.ok) {
      setPlayerList((prev) => prev.filter((p) => p.id !== playerId));
      setMessage(`${name} removed.`);
    }
  }

  return (
    <div>
      {message && <p className="text-sm text-emerald-600 mb-3">{message}</p>}
      <div className="space-y-2">
        {playerList.map((player) => (
          <div
            key={player.id}
            className="bg-white border border-slate-200 rounded-lg p-3 flex items-center justify-between"
          >
            <div>
              <span className="font-medium text-slate-900">{player.name}</span>
              {player.isAdmin && (
                <span className="ml-2 text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">
                  Admin
                </span>
              )}
              <div className="text-xs text-slate-400 mt-0.5">
                Joined {new Date(player.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleToggleAdmin(player.id, player.isAdmin)}
                className="text-xs px-3 py-1 border border-slate-300 rounded hover:bg-slate-50"
              >
                {player.isAdmin ? "Remove Admin" : "Make Admin"}
              </button>
              <button
                onClick={() => handleDelete(player.id, player.name)}
                className="text-xs px-3 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
