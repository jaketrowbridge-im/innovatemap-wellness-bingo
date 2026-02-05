import { db } from "./index";
import { tasks, gameSettings } from "./schema";
import { WELLNESS_TASKS } from "../lib/constants";
import { eq } from "drizzle-orm";

export async function seed() {
  // Check if tasks already exist
  const existingTasks = await db.select().from(tasks);
  if (existingTasks.length > 0) {
    console.log("Database already seeded, skipping...");
    return;
  }

  console.log("Seeding database...");

  // Insert tasks
  for (let i = 0; i < WELLNESS_TASKS.length; i++) {
    const task = WELLNESS_TASKS[i];
    await db.insert(tasks).values({
      title: task.title,
      description: task.description,
      category: task.category,
      sortOrder: i + 1,
    });
  }

  // Insert default game settings
  const existingSettings = await db.select().from(gameSettings);
  if (existingSettings.length === 0) {
    const now = new Date();
    const twoWeeksLater = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    await db.insert(gameSettings).values({
      startDate: now.toISOString(),
      endDate: twoWeeksLater.toISOString(),
      isActive: true,
    });
  }

  console.log(`Seeded ${WELLNESS_TASKS.length} tasks and game settings.`);
}

// Run seed if called directly
seed().catch(console.error);
