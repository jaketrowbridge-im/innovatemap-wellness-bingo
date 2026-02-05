import { db } from "@/db";
import { players, cards, tasks, completions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { checkBingo } from "@/lib/bingo";
import { BingoCard } from "@/components/bingo-card";
import { Header } from "@/components/header";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function CardPage({ params }: { params: Promise<{ playerId: string }> }) {
  const { playerId } = await params;

  const player = await db.select().from(players).where(eq(players.id, playerId));
  if (player.length === 0) return notFound();

  const card = await db.select().from(cards).where(eq(cards.playerId, playerId));
  if (card.length === 0) return notFound();

  const allTasks = await db.select().from(tasks);
  const playerCompletions = await db
    .select()
    .from(completions)
    .where(eq(completions.playerId, playerId));

  const completedIds = playerCompletions.map((c) => c.taskId);
  const layout = card[0].layout as (number | null)[];
  const winningLines = checkBingo(layout, new Set(completedIds));

  return (
    <div className="min-h-screen">
      <Header playerName={player[0].name} isAdmin={player[0].isAdmin} />
      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-slate-900">
            {player[0].name}&apos;s Card
          </h1>
          <Link
            href="/leaderboard"
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Leaderboard &rarr;
          </Link>
        </div>

        <BingoCard
          playerId={playerId}
          layout={layout}
          tasks={allTasks as import("@/types").Task[]}
          initialCompletions={completedIds}
          initialHasBingo={winningLines.length > 0}
          initialWinningLines={winningLines}
        />
      </main>
    </div>
  );
}
