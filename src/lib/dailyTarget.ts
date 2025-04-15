// Constants for target generation
const START_DATE = new Date("2024-01-01").getTime(); // Fixed start date
const STORAGE_KEY = "pressdle_daily_target";

interface DailyTarget {
  date: string;
  value: number;
}

// Get today's date string in YYYY-MM-DD format
function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

// Get the number of days since the start date
function getDaysSinceStart(): number {
  const today = new Date().getTime();
  const diffTime = today - START_DATE;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

// Generate a deterministic random number based on a seed
function seededRandom(seed: number): number {
  // Simple but effective seeded random number generator
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Generate a target value for a specific day
function generateTargetForDay(dayIndex: number): number {
  // Use the day index as a seed for our random number generator
  const randomValue = seededRandom(dayIndex);
  // Convert to a value between 0 and 1 with max 2 decimal places
  return Math.round(randomValue * 100) / 100;
}

// Get the current daily target, generating a new one if needed
export function getDailyTarget(): number {
  const stored = localStorage.getItem(STORAGE_KEY);
  const today = getTodayString();

  if (stored) {
    const parsed: DailyTarget = JSON.parse(stored);
    if (parsed.date === today) {
      return parsed.value;
    }
  }

  // Generate new target for today
  const dayIndex = getDaysSinceStart();
  const newTarget = generateTargetForDay(dayIndex);

  // Store in localStorage
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      date: today,
      value: newTarget,
    })
  );

  return newTarget;
}
