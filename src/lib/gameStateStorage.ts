import { PressdleState } from "./PressdleContext/reducer";

const GAME_STATE_KEY = "pressdle_game_state";

// Save the current game state to localStorage
export function saveGameState(state: PressdleState): void {
  // Only save the relevant parts of the state
  const stateToSave = {
    targetActuation: state.targetActuation,
    guesses: state.guesses,
    gameState: state.gameState,
  };

  localStorage.setItem(GAME_STATE_KEY, JSON.stringify(stateToSave));
}

// Get the saved game state from localStorage
export function getSavedGameState(): Partial<PressdleState> | null {
  const savedState = localStorage.getItem(GAME_STATE_KEY);

  if (!savedState) {
    return null;
  }

  try {
    return JSON.parse(savedState);
  } catch (error) {
    console.error("Error parsing saved game state:", error);
    return null;
  }
}

// Check if the saved game state is from today
export function isSavedStateFromToday(): boolean {
  const savedState = getSavedGameState();

  if (!savedState) {
    return false;
  }

  // If we have a saved state, check if it matches today's target
  const todayTarget = getDailyTarget();
  return savedState.targetActuation === todayTarget;
}

// Import the getDailyTarget function
import { getDailyTarget } from "./dailyTarget";
