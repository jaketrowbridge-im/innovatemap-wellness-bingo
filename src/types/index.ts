export type Category = "Physical" | "Mental" | "Social" | "Nutrition" | "Fun/Silly";

export interface TaskDefinition {
  title: string;
  description: string;
  category: Category;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  category: Category;
  sortOrder: number;
}

export interface Player {
  id: string;
  name: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface Card {
  id: number;
  playerId: string;
  layout: (number | null)[]; // 25 elements: task IDs + null at index 12
}

export interface Completion {
  id: number;
  playerId: string;
  taskId: number;
  completedAt: string;
}

export interface GameSettings {
  id: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface PlayerCardData {
  player: Player;
  card: Card;
  tasks: Task[];
  completions: number[]; // completed task IDs
  hasBingo: boolean;
  winningLines: number[][];
}

export interface LeaderboardEntry {
  player: Player;
  completionCount: number;
  hasBingo: boolean;
  bingoAt: string | null;
}

export const CATEGORY_COLORS: Record<Category, { bg: string; text: string; badge: string }> = {
  Physical: { bg: "bg-emerald-100", text: "text-emerald-700", badge: "bg-emerald-500" },
  Mental: { bg: "bg-violet-100", text: "text-violet-700", badge: "bg-violet-500" },
  Social: { bg: "bg-sky-100", text: "text-sky-700", badge: "bg-sky-500" },
  Nutrition: { bg: "bg-amber-100", text: "text-amber-700", badge: "bg-amber-500" },
  "Fun/Silly": { bg: "bg-rose-100", text: "text-rose-700", badge: "bg-rose-500" },
};
