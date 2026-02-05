import { FREE_SPACE_INDEX, GRID_SIZE } from "./constants";

// Precompute all 12 winning lines (indices in the 25-cell grid)
// 5 rows + 5 columns + 2 diagonals
export const WINNING_LINES: number[][] = (() => {
  const lines: number[][] = [];

  // Rows
  for (let row = 0; row < GRID_SIZE; row++) {
    const line: number[] = [];
    for (let col = 0; col < GRID_SIZE; col++) {
      line.push(row * GRID_SIZE + col);
    }
    lines.push(line);
  }

  // Columns
  for (let col = 0; col < GRID_SIZE; col++) {
    const line: number[] = [];
    for (let row = 0; row < GRID_SIZE; row++) {
      line.push(row * GRID_SIZE + col);
    }
    lines.push(line);
  }

  // Diagonal top-left to bottom-right
  const diag1: number[] = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    diag1.push(i * GRID_SIZE + i);
  }
  lines.push(diag1);

  // Diagonal top-right to bottom-left
  const diag2: number[] = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    diag2.push(i * GRID_SIZE + (GRID_SIZE - 1 - i));
  }
  lines.push(diag2);

  return lines;
})();

/**
 * Fisher-Yates shuffle of 24 task IDs, then insert null at center (index 12)
 */
export function generateCardLayout(taskIds: number[]): (number | null)[] {
  const shuffled: (number | null)[] = [...taskIds];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Insert null (free space) at center position
  shuffled.splice(FREE_SPACE_INDEX, 0, null);
  return shuffled;
}

/**
 * Check if a set of completed task IDs forms a bingo on the given card layout.
 * Returns all winning lines (arrays of grid indices).
 */
export function checkBingo(
  layout: (number | null)[],
  completedTaskIds: Set<number>
): number[][] {
  const winningLines: number[][] = [];

  for (const line of WINNING_LINES) {
    const isWin = line.every((cellIndex) => {
      const taskId = layout[cellIndex];
      return taskId === null || completedTaskIds.has(taskId); // null = free space
    });
    if (isWin) {
      winningLines.push(line);
    }
  }

  return winningLines;
}

/**
 * Find the line closest to completion (most cells filled).
 */
export function getClosestLine(
  layout: (number | null)[],
  completedTaskIds: Set<number>
): { line: number[]; completed: number; total: number } | null {
  let best: { line: number[]; completed: number; total: number } | null = null;

  for (const line of WINNING_LINES) {
    let completed = 0;
    for (const cellIndex of line) {
      const taskId = layout[cellIndex];
      if (taskId === null || completedTaskIds.has(taskId)) {
        completed++;
      }
    }
    if (!best || completed > best.completed) {
      best = { line, completed, total: GRID_SIZE };
    }
  }

  return best;
}
