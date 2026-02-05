import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { completions, cards, tasks } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { checkBingo } from "@/lib/bingo";
import { formatDate } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const { playerId, taskId } = await request.json();

    if (!playerId || !taskId) {
      return NextResponse.json({ error: "playerId and taskId are required" }, { status: 400 });
    }

    // Check that task exists
    const task = await db.select().from(tasks).where(eq(tasks.id, taskId));
    if (task.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Check for existing completion (idempotent)
    const existing = await db
      .select()
      .from(completions)
      .where(and(eq(completions.playerId, playerId), eq(completions.taskId, taskId)));

    if (existing.length > 0) {
      return NextResponse.json({ message: "Already completed", completion: existing[0] });
    }

    await db.insert(completions).values({
      playerId,
      taskId,
      completedAt: formatDate(new Date()),
    });

    // Check for bingo
    const card = await db.select().from(cards).where(eq(cards.playerId, playerId));
    const playerCompletions = await db
      .select()
      .from(completions)
      .where(eq(completions.playerId, playerId));

    const completedIds = new Set(playerCompletions.map((c) => c.taskId));
    const layout = card[0].layout as (number | null)[];
    const winningLines = checkBingo(layout, completedIds);

    return NextResponse.json({
      success: true,
      hasBingo: winningLines.length > 0,
      winningLines,
      completionCount: playerCompletions.length,
    });
  } catch (error) {
    console.error("Error in POST /api/completions:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { playerId, taskId } = await request.json();

    if (!playerId || !taskId) {
      return NextResponse.json({ error: "playerId and taskId are required" }, { status: 400 });
    }

    await db
      .delete(completions)
      .where(and(eq(completions.playerId, playerId), eq(completions.taskId, taskId)));

    // Recheck bingo status
    const card = await db.select().from(cards).where(eq(cards.playerId, playerId));
    const playerCompletions = await db
      .select()
      .from(completions)
      .where(eq(completions.playerId, playerId));

    const completedIds = new Set(playerCompletions.map((c) => c.taskId));
    const layout = card[0].layout as (number | null)[];
    const winningLines = checkBingo(layout, completedIds);

    return NextResponse.json({
      success: true,
      hasBingo: winningLines.length > 0,
      winningLines,
      completionCount: playerCompletions.length,
    });
  } catch (error) {
    console.error("Error in DELETE /api/completions:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
