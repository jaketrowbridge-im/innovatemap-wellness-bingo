import { TaskDefinition } from "@/types";

export const WELLNESS_TASKS: TaskDefinition[] = [
  // Physical (5)
  { title: "30-Min Walk", description: "Take a 30-minute walk outside or on a treadmill", category: "Physical" },
  { title: "Desk Stretches", description: "Complete a full desk stretch routine", category: "Physical" },
  { title: "New Workout", description: "Try a workout you've never done before", category: "Physical" },
  { title: "Stairs All Day", description: "Take the stairs instead of the elevator all day", category: "Physical" },
  { title: "Stand Up Hourly", description: "Stand up and move around every hour", category: "Physical" },

  // Mental (5)
  { title: "Meditate 10 Min", description: "Spend 10 minutes meditating or doing breathwork", category: "Mental" },
  { title: "3 Gratitudes", description: "Journal three things you're grateful for", category: "Mental" },
  { title: "Full Lunch Break", description: "Take a full lunch break with no screens", category: "Mental" },
  { title: "Digital Detox", description: "Spend an evening without screens or social media", category: "Mental" },
  { title: "Learn Something", description: "Learn something new that's not work-related", category: "Mental" },

  // Social (5)
  { title: "Coffee Chat", description: "Have a coffee chat with a colleague", category: "Social" },
  { title: "Send a Compliment", description: "Send a genuine compliment to someone", category: "Social" },
  { title: "Call Someone", description: "Call a friend or family member", category: "Social" },
  { title: "Team Activity", description: "Organize or join a team activity", category: "Social" },
  { title: "Standup Shoutout", description: "Give a shoutout to someone in standup", category: "Social" },

  // Nutrition (5)
  { title: "8 Glasses Water", description: "Drink 8 glasses of water throughout the day", category: "Nutrition" },
  { title: "Cook a Meal", description: "Cook a meal from scratch", category: "Nutrition" },
  { title: "Fruits & Veggies", description: "Include a fruit or veggie with every meal", category: "Nutrition" },
  { title: "Skip the Sugar", description: "Skip afternoon sugar and snack healthy instead", category: "Nutrition" },
  { title: "New Healthy Recipe", description: "Try a new healthy recipe", category: "Nutrition" },

  // Fun/Silly (4)
  { title: "Ridiculous Outfit", description: "Wear something ridiculous to a meeting", category: "Fun/Silly" },
  { title: "Work Face Photo", description: "Share your best 'work face' photo", category: "Fun/Silly" },
  { title: "Jumping Jacks", description: "Do 10 jumping jacks between meetings", category: "Fun/Silly" },
  { title: "Positive Sticky", description: "Leave a positive sticky note for someone", category: "Fun/Silly" },
];

export const MAX_PLAYERS = 25;
export const GRID_SIZE = 5;
export const FREE_SPACE_INDEX = 12; // Center of 5x5 grid
export const TOTAL_CELLS = 25;
