import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { gameSettings, completions, cards, players, tasks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCookie } from "@/lib/utils";
import { generateCardLayout } from "@/lib/bingo";

async function isAdmin(request: NextRequest): Promise<boolean> {
  const playerId = getCookie("innovatemap-bingo-player", request.headers.get("cookie"));
  if (!playerId) return false;
  const player = await db.select().from(players).where(eq(players.id, playerId));
  return player.length > 0 && player[0].isAdmin;
}

export async function GET(request: NextRequest) {
  try {
    if (!(await isAdmin(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const settings = await db.select().from(gameSettings);
    const allPlayers = await db.select().from(players);
    const allCompletions = await db.select().from(completions);

    return NextResponse.json({
      settings: settings[0] || null,
      stats: {
        totalPlayers: allPlayers.length,
        totalCompletions: allCompletions.length,
      },
    });
  } catch (error) {
    console.error("Error in GET /api/admin/game:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await isAdmin(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, startDate, endDate } = body;

    if (action === "reset") {
      // Delete all completions and regenerate cards
      await db.delete(completions);
      await db.delete(cards);

      // Regenerate cards for all players
      const allPlayers = await db.select().from(players);
      const allTasks = await db.select().from(tasks);
      const taskIds = allTasks.map((t) => t.id);

      for (const player of allPlayers) {
        const layout = generateCardLayout(taskIds);
        await db.insert(cards).values({ playerId: player.id, layout });
      }

      return NextResponse.json({ success: true, message: "Game reset successfully" });
    }

    if (action === "updateDates") {
      if (!startDate || !endDate) {
        return NextResponse.json({ error: "startDate and endDate are required" }, { status: 400 });
      }
      const settings = await db.select().from(gameSettings);
      if (settings.length > 0) {
        await db.update(gameSettings).set({ startDate, endDate }).where(eq(gameSettings.id, settings[0].id));
      } else {
        await db.insert(gameSettings).values({ startDate, endDate, isActive: true });
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error in POST /api/admin/game:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
