"use client";

import { useState, useCallback } from "react";
import { Task, Category, CATEGORY_COLORS } from "@/types";
import { BingoCell } from "./bingo-cell";
import { WinCelebration } from "./win-celebration";
import { CategoryBadge } from "./category-badge";
import { FREE_SPACE_INDEX } from "@/lib/constants";

interface BingoCardProps {
  playerId: string;
  layout: (number | null)[];
  tasks: Task[];
  initialCompletions: number[];
  initialHasBingo: boolean;
  initialWinningLines: number[][];
}

export function BingoCard({
  playerId,
  layout,
  tasks,
  initialCompletions,
  initialHasBingo,
  initialWinningLines,
}: BingoCardProps) {
  const [completions, setCompletions] = useState<Set<number>>(new Set(initialCompletions));
  const [hasBingo, setHasBingo] = useState(initialHasBingo);
  const [winningLines, setWinningLines] = useState<number[][]>(initialWinningLines);
  const [expandedTask, setExpandedTask] = useState<Task | null>(null);
  const [justGotBingo, setJustGotBingo] = useState(false);

  const winningCells = new Set(winningLines.flat());
  const taskMap = new Map(tasks.map((t) => [t.id, t]));

  const toggleCompletion = useCallback(async (taskId: number) => {
    const isCompleted = completions.has(taskId);
    const method = isCompleted ? "DELETE" : "POST";

    // Optimistic update
    setCompletions((prev) => {
      const next = new Set(prev);
      if (isCompleted) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });

    try {
      const res = await fetch("/api/completions", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId, taskId }),
      });
      const data = await res.json();

      if (data.hasBingo && !hasBingo) {
        setJustGotBingo(true);
      }
      setHasBingo(data.hasBingo);
      setWinningLines(data.winningLines || []);
    } catch {
      // Revert on error
      setCompletions((prev) => {
        const next = new Set(prev);
        if (isCompleted) {
          next.add(taskId);
        } else {
          next.delete(taskId);
        }
        return next;
      });
    }
  }, [completions, hasBingo, playerId]);

  return (
    <div className="w-full max-w-lg mx-auto">
      <WinCelebration show={justGotBingo} />

      <div className="grid grid-cols-5 gap-1 sm:gap-2">
        {layout.map((taskId, index) => {
          const task = taskId !== null ? taskMap.get(taskId) || null : null;
          const isCompleted = taskId !== null && completions.has(taskId);
          const isWinning = winningCells.has(index);

          return (
            <BingoCell
              key={index}
              index={index}
              task={task}
              isCompleted={isCompleted || index === FREE_SPACE_INDEX}
              isWinningCell={isWinning}
              onToggle={() => taskId !== null && toggleCompletion(taskId)}
              onExpand={() => task && setExpandedTask(task)}
            />
          );
        })}
      </div>

      <div className="mt-4 text-center text-sm text-slate-500">
        {completions.size} / 24 tasks completed
      </div>

      {/* Mobile task detail bottom sheet */}
      {expandedTask && (
        <div className="fixed inset-0 z-50 sm:hidden" onClick={() => setExpandedTask(null)}>
          <div className="absolute inset-0 bg-black/30" />
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <CategoryBadge category={expandedTask.category as Category} />
              <button
                onClick={() => setExpandedTask(null)}
                className="text-slate-400 text-lg"
              >
                &times;
              </button>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">{expandedTask.title}</h3>
            <p className="text-slate-600 mt-1">{expandedTask.description}</p>
            <button
              onClick={() => {
                toggleCompletion(expandedTask.id);
                setExpandedTask(null);
              }}
              className={`w-full mt-4 py-3 rounded-lg font-medium ${
                completions.has(expandedTask.id)
                  ? "bg-red-50 text-red-600 border border-red-200"
                  : "bg-green-500 text-white"
              }`}
            >
              {completions.has(expandedTask.id) ? "Undo Completion" : "Mark Complete"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
