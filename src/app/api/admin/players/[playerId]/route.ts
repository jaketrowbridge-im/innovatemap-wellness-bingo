import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { players, cards, completions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCookie } from "@/lib/utils";

async function isAdmin(request: NextRequest): Promise<boolean> {
  const playerId = getCookie("innovatemap-bingo-player", request.headers.get("cookie"));
  if (!playerId) return false;
  const player = await db.select().from(players).where(eq(players.id, playerId));
  return player.length > 0 && player[0].isAdmin;
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ playerId: string }> }
) {
  try {
    if (!(await isAdmin(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { playerId } = await params;

    // Delete completions and card first (cascade should handle this, but be explicit)
    await db.delete(completions).where(eq(completions.playerId, playerId));
    await db.delete(cards).where(eq(cards.playerId, playerId));
    await db.delete(players).where(eq(players.id, playerId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/admin/players/[playerId]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ playerId: string }> }
) {
  try {
    if (!(await isAdmin(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { playerId } = await params;
    const { isAdmin: setAdmin } = await request.json();

    if (typeof setAdmin !== "boolean") {
      return NextResponse.json({ error: "isAdmin must be a boolean" }, { status: 400 });
    }

    await db.update(players).set({ isAdmin: setAdmin }).where(eq(players.id, playerId));

    const updated = await db.select().from(players).where(eq(players.id, playerId));
    return NextResponse.json({ player: updated[0] });
  } catch (error) {
    console.error("Error in PATCH /api/admin/players/[playerId]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
