import { db } from "@/db";
import { players, tasks, completions, gameSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Header } from "@/components/header";
import { GameControls } from "@/components/admin/game-controls";
import { PlayerList } from "@/components/admin/player-list";
import { TaskEditor } from "@/components/admin/task-editor";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const currentPlayerId = cookieStore.get("innovatemap-bingo-player")?.value;

  if (!currentPlayerId) redirect("/");

  const currentPlayer = await db.select().from(players).where(eq(players.id, currentPlayerId));
  if (currentPlayer.length === 0 || !currentPlayer[0].isAdmin) {
    redirect("/");
  }

  const allPlayers = await db.select().from(players);
  const allTasks = await db.select().from(tasks);
  const allCompletions = await db.select().from(completions);
  const settings = await db.select().from(gameSettings);

  return (
    <div className="min-h-screen">
      <Header playerName={currentPlayer[0].name} isAdmin={true} />
      <main className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Admin Dashboard</h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">Game Controls</h2>
            <GameControls
              initialSettings={settings[0] || null}
              stats={{
                totalPlayers: allPlayers.length,
                totalCompletions: allCompletions.length,
              }}
            />
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">
              Players ({allPlayers.length})
            </h2>
            <PlayerList initialPlayers={allPlayers} />
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">
              Tasks ({allTasks.length})
            </h2>
            <TaskEditor initialTasks={allTasks as import("@/types").Task[]} />
          </section>
        </div>
      </main>
    </div>
  );
}
