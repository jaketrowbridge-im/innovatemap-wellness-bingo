import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { players, cards, tasks, completions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { checkBingo } from "@/lib/bingo";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ playerId: string }> }
) {
  try {
    const { playerId } = await params;

    const player = await db.select().from(players).where(eq(players.id, playerId));
    if (player.length === 0) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    const card = await db.select().from(cards).where(eq(cards.playerId, playerId));
    if (card.length === 0) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    const allTasks = await db.select().from(tasks);
    const playerCompletions = await db
      .select()
      .from(completions)
      .where(eq(completions.playerId, playerId));

    const completedTaskIds = playerCompletions.map((c) => c.taskId);
    const completedSet = new Set(completedTaskIds);
    const layout = card[0].layout as (number | null)[];
    const winningLines = checkBingo(layout, completedSet);

    return NextResponse.json({
      player: player[0],
      card: card[0],
      tasks: allTasks,
      completions: completedTaskIds,
      hasBingo: winningLines.length > 0,
      winningLines,
    });
  } catch (error) {
    console.error("Error in GET /api/players/[playerId]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
