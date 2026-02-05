import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { players, cards, completions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { checkBingo, WINNING_LINES } from "@/lib/bingo";

export async function GET() {
  try {
    const allPlayers = await db.select().from(players);
    const allCards = await db.select().from(cards);
    const allCompletions = await db.select().from(completions);

    const leaderboard = allPlayers.map((player) => {
      const card = allCards.find((c) => c.playerId === player.id);
      const playerCompletions = allCompletions
        .filter((c) => c.playerId === player.id)
        .sort((a, b) => a.completedAt.localeCompare(b.completedAt));

      const completedIds = new Set(playerCompletions.map((c) => c.taskId));
      const layout = card ? (card.layout as (number | null)[]) : [];
      const winningLines = card ? checkBingo(layout, completedIds) : [];
      const hasBingo = winningLines.length > 0;

      // Find earliest bingo time: simulate completions in order
      let bingoAt: string | null = null;
      if (hasBingo && card) {
        const growingSet = new Set<number>();
        for (const completion of playerCompletions) {
          growingSet.add(completion.taskId);
          const lines = checkBingo(layout, growingSet);
          if (lines.length > 0) {
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

    // Sort: bingo winners first (earliest bingo time), then by completion count desc
    leaderboard.sort((a, b) => {
      if (a.hasBingo && !b.hasBingo) return -1;
      if (!a.hasBingo && b.hasBingo) return 1;
      if (a.hasBingo && b.hasBingo) {
        return (a.bingoAt || "").localeCompare(b.bingoAt || "");
      }
      return b.completionCount - a.completionCount;
    });

    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error("Error in GET /api/leaderboard:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
