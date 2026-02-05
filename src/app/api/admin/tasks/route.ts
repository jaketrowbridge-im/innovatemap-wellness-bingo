import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCookie } from "@/lib/utils";
import { players } from "@/db/schema";

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
    const allTasks = await db.select().from(tasks);
    return NextResponse.json({ tasks: allTasks });
  } catch (error) {
    console.error("Error in GET /api/admin/tasks:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!(await isAdmin(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, title, description } = await request.json();
    if (!id || !title || !description) {
      return NextResponse.json({ error: "id, title, and description are required" }, { status: 400 });
    }

    await db
      .update(tasks)
      .set({ title, description })
      .where(eq(tasks.id, id));

    const updated = await db.select().from(tasks).where(eq(tasks.id, id));
    return NextResponse.json({ task: updated[0] });
  } catch (error) {
    console.error("Error in PUT /api/admin/tasks:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
