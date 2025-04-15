// Define the state interface
export interface PressdleState {
  device: HIDDevice | null;
  targetActuation: number;
  guesses: { value: number; feedback: "higher" | "lower" | "correct" }[];
  gameState: "playing" | "won" | "lost";
  isPracticeMode: boolean;
  dailyChallengeState?: {
    targetActuation: number;
    guesses: { value: number; feedback: "higher" | "lower" | "correct" }[];
    gameState: "playing" | "won" | "lost";
  };
}

// Define action types
export type PressdleAction =
  | { type: "CONNECT_DEVICE"; payload: HIDDevice }
  | { type: "DISCONNECT_DEVICE"; payload: HIDDevice }
  | { type: "SET_TARGET_ACTUATION"; payload: number }
  | {
      type: "ADD_GUESS";
      payload: { value: number; feedback: "higher" | "lower" | "correct" };
    }
  | { type: "SET_GAME_STATE"; payload: "playing" | "won" | "lost" }
  | { type: "RESET_GAME"; payload: number }
  | { type: "LEAVE_PRACTICE_MODE" };

// Initial state
export const initialState: PressdleState = {
  device: null,
  targetActuation: 0,
  guesses: [],
  gameState: "playing",
  isPracticeMode: false,
};

// Reducer function
export const reducer = (
  state: PressdleState,
  action: PressdleAction
): PressdleState => {
  // Variable to store daily challenge state
  let dailyChallengeState;

  switch (action.type) {
    case "CONNECT_DEVICE":
      if (state.device && state.device !== action.payload) {
        state.device.close();
      }
      return {
        ...state,
        device: action.payload,
      };
    case "DISCONNECT_DEVICE":
      if (state.device && state.device === action.payload) {
        state.device.forget();
        return {
          ...state,
          device: null,
        };
      }
      return state;
    case "SET_TARGET_ACTUATION":
      return {
        ...state,
        targetActuation: action.payload,
      };
    case "ADD_GUESS":
      return {
        ...state,
        guesses: [...state.guesses, action.payload],
      };
    case "SET_GAME_STATE":
      return {
        ...state,
        gameState: action.payload,
      };
    case "RESET_GAME":
      // If we're not already in practice mode, save the current state as daily challenge state
      dailyChallengeState = !state.isPracticeMode
        ? {
            targetActuation: state.targetActuation,
            guesses: state.guesses,
            gameState: state.gameState,
          }
        : state.dailyChallengeState;

      return {
        ...state,
        targetActuation: action.payload,
        guesses: [],
        gameState: "playing",
        isPracticeMode: true,
        dailyChallengeState,
      };
    case "LEAVE_PRACTICE_MODE":
      // If we have a saved daily challenge state, restore it
      if (state.dailyChallengeState) {
        return {
          ...state,
          targetActuation: state.dailyChallengeState.targetActuation,
          guesses: state.dailyChallengeState.guesses,
          gameState: state.dailyChallengeState.gameState,
          isPracticeMode: false,
        };
      }
      // Otherwise, just exit practice mode but keep the current state
      return {
        ...state,
        isPracticeMode: false,
      };
    default:
      return state;
  }
};
