import { db } from "@/db";
import { players, cards, completions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { checkBingo } from "@/lib/bingo";
import { LeaderboardTable } from "@/components/leaderboard-table";
import { Header } from "@/components/header";
import { cookies } from "next/headers";
import { LeaderboardEntry } from "@/types";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const cookieStore = await cookies();
  const currentPlayerId = cookieStore.get("innovatemap-bingo-player")?.value;

  let currentPlayer = null;
  if (currentPlayerId) {
    const p = await db.select().from(players).where(eq(players.id, currentPlayerId));
    if (p.length > 0) currentPlayer = p[0];
  }

  const allPlayers = await db.select().from(players);
  const allCards = await db.select().from(cards);
  const allCompletions = await db.select().from(completions);

  const leaderboard: LeaderboardEntry[] = allPlayers.map((player) => {
    const card = allCards.find((c) => c.playerId === player.id);
    const playerCompletions = allCompletions
      .filter((c) => c.playerId === player.id)
      .sort((a, b) => a.completedAt.localeCompare(b.completedAt));

    const completedIds = new Set(playerCompletions.map((c) => c.taskId));
    const layout = card ? (card.layout as (number | null)[]) : [];
    const winningLines = card ? checkBingo(layout, completedIds) : [];
    const hasBingo = winningLines.length > 0;

    let bingoAt: string | null = null;
    if (hasBingo && card) {
      const growingSet = new Set<number>();
      for (const completion of playerCompletions) {
        growingSet.add(completion.taskId);
        if (checkBingo(layout, growingSet).length > 0) {
          bingoAt = completion.completedAt;
          break;
        }
      }
    }

    return {
      player,
      completionCount: playerCompletions.length,
      hasBingo,
      bingoAt,
    };
  });

  leaderboard.sort((a, b) => {
    if (a.hasBingo && !b.hasBingo) return -1;
    if (!a.hasBingo && b.hasBingo) return 1;
    if (a.hasBingo && b.hasBingo) {
      return (a.bingoAt || "").localeCompare(b.bingoAt || "");
    }
    return b.completionCount - a.completionCount;
  });

  return (
    <div className="min-h-screen">
      <Header
        playerName={currentPlayer?.name}
        isAdmin={currentPlayer?.isAdmin}
      />
      <main className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Leaderboard</h1>
        <LeaderboardTable entries={leaderboard} />
      </main>
    </div>
  );
}
