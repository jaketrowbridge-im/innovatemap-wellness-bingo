import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NameEntryForm } from "@/components/name-entry-form";

export default async function Home() {
  const cookieStore = await cookies();
  const playerId = cookieStore.get("innovatemap-bingo-player")?.value;

  if (playerId) {
    redirect(`/card/${playerId}`);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-2">
          Wellness Bingo
        </h1>
        <p className="text-slate-500 text-lg">
          Innovatemap Team Challenge
        </p>
      </div>

      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <p className="text-slate-600 text-sm text-center mb-6">
            Enter your name to get your unique bingo card and start completing wellness tasks!
          </p>
          <NameEntryForm />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-5 gap-2 max-w-xs mx-auto">
        {["Physical", "Mental", "Social", "Nutrition", "Fun/Silly"].map((cat) => {
          const colors: Record<string, string> = {
            Physical: "bg-emerald-500",
            Mental: "bg-violet-500",
            Social: "bg-sky-500",
            Nutrition: "bg-amber-500",
            "Fun/Silly": "bg-rose-500",
          };
          return (
            <div key={cat} className="text-center">
              <div className={`w-4 h-4 rounded-full ${colors[cat]} mx-auto mb-1`} />
              <span className="text-[10px] text-slate-400">{cat}</span>
            </div>
          );
        })}
      </div>
    </main>
  );
}
