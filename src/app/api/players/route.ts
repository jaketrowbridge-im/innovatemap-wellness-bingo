import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { players, cards, tasks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateCardLayout } from "@/lib/bingo";
import { generateId, formatDate } from "@/lib/utils";
import { MAX_PLAYERS } from "@/lib/constants";

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const trimmedName = name.trim();
    if (trimmedName.length > 50) {
      return NextResponse.json({ error: "Name must be 50 characters or less" }, { status: 400 });
    }

    // Check player cap
    const allPlayers = await db.select().from(players);
    if (allPlayers.length >= MAX_PLAYERS) {
      return NextResponse.json({ error: "Maximum player limit reached" }, { status: 400 });
    }

    // Check if name already exists (case-insensitive login)
    const existing = allPlayers.find(
      (p) => p.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (existing) {
      // "Login" — return existing player
      const response = NextResponse.json({ player: existing });
      response.cookies.set("innovatemap-bingo-player", existing.id, {
        httpOnly: false,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });
      return response;
    }

    // Register new player
    const playerId = generateId();
    const isFirstPlayer = allPlayers.length === 0;

    await db.insert(players).values({
      id: playerId,
      name: trimmedName,
      isAdmin: isFirstPlayer, // First player is admin
      createdAt: formatDate(new Date()),
    });

    // Generate bingo card
    const allTasks = await db.select().from(tasks);
    const taskIds = allTasks.map((t) => t.id);
    const layout = generateCardLayout(taskIds);

    await db.insert(cards).values({
      playerId,
      layout,
    });

    const newPlayer = await db.select().from(players).where(eq(players.id, playerId));

    const response = NextResponse.json({ player: newPlayer[0] }, { status: 201 });
    response.cookies.set("innovatemap-bingo-player", playerId, {
      httpOnly: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("Error in POST /api/players:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
