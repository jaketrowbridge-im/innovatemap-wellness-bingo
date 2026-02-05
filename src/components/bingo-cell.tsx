"use client";

import { Task, Category, CATEGORY_COLORS } from "@/types";
import { FREE_SPACE_INDEX } from "@/lib/constants";

interface BingoCellProps {
  index: number;
  task: Task | null; // null = free space
  isCompleted: boolean;
  isWinningCell: boolean;
  onToggle: () => void;
  onExpand: () => void;
}

export function BingoCell({ index, task, isCompleted, isWinningCell, onToggle, onExpand }: BingoCellProps) {
  const isFreeSpace = index === FREE_SPACE_INDEX;

  if (isFreeSpace) {
    return (
      <div className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center border-2 border-slate-300">
        <span className="text-xs sm:text-sm font-bold text-slate-500 text-center px-1">FREE SPACE</span>
      </div>
    );
  }

  if (!task) return null;

  const category = task.category as Category;
  const colors = CATEGORY_COLORS[category];

  return (
    <button
      onClick={onToggle}
      className={`aspect-square rounded-lg flex flex-col items-center justify-center p-1 sm:p-2 border-2 transition-all cursor-pointer select-none text-center
        ${isCompleted
          ? isWinningCell
            ? "bg-yellow-200 border-yellow-400 animate-pulse-win"
            : "bg-green-100 border-green-400"
          : `${colors.bg} border-transparent hover:border-slate-300`
        }
      `}
    >
      <span className={`text-[10px] sm:text-xs font-medium leading-tight ${isCompleted ? "text-green-800" : colors.text}`}>
        {task.title}
      </span>
      <span
        className={`hidden sm:inline-block mt-1 text-[8px] rounded-full px-1.5 py-0.5 text-white ${colors.badge}`}
      >
        {category}
      </span>
      {isCompleted && (
        <span className="text-green-600 text-lg leading-none mt-0.5">&#10003;</span>
      )}
      {/* Mobile: tap area for expand */}
      <button
        onClick={(e) => { e.stopPropagation(); onExpand(); }}
        className="sm:hidden absolute inset-0 opacity-0"
        aria-label={`View details for ${task.title}`}
      />
    </button>
  );
}
