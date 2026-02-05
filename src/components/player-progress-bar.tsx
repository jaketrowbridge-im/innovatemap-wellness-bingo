export function PlayerProgressBar({ completed, total = 24 }: { completed: number; total?: number }) {
  const percentage = Math.round((completed / total) * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs text-slate-500">{percentage}%</span>
    </div>
  );
}
