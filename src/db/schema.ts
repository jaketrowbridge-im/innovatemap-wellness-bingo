import { sqliteTable, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core";

export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  sortOrder: integer("sort_order").notNull(),
});

export const players = sqliteTable("players", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  isAdmin: integer("is_admin", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull(),
});

export const cards = sqliteTable("cards", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  playerId: text("player_id")
    .notNull()
    .unique()
    .references(() => players.id, { onDelete: "cascade" }),
  layout: text("layout", { mode: "json" }).notNull().$type<(number | null)[]>(),
});

export const completions = sqliteTable(
  "completions",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    playerId: text("player_id")
      .notNull()
      .references(() => players.id, { onDelete: "cascade" }),
    taskId: integer("task_id")
      .notNull()
      .references(() => tasks.id, { onDelete: "cascade" }),
    completedAt: text("completed_at").notNull(),
  },
  (table) => [
    uniqueIndex("completions_player_task_idx").on(table.playerId, table.taskId),
  ]
);

export const gameSettings = sqliteTable("game_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
});
