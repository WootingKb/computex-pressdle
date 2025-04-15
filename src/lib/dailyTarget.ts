// Constants for target generation
// Use UTC for the start date
const START_DATE = Date.UTC(2024, 0, 1); // January is 0 in JS
const STORAGE_KEY = "pressdle_daily_target";

interface DailyTarget {
  date: string;
  value: number;
}

// Get today's date string in YYYY-MM-DD format (UTC)
function getTodayString(): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Get the number of days since the start date (UTC)
function getDaysSinceStart(): number {
  const now = new Date();
  const todayUTC = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  );
  const diffTime = todayUTC - START_DATE;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

// Generate a deterministic random number based on a seed
function seededRandom(seed: number): number {
  // Simple but effective seeded random number generator
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Generate a target value for a specific day
export function generateTargetForDay(dayIndex: number): number {
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
