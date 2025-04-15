// Define the state interface
export interface PressdleState {
  device: HIDDevice | null;
  targetActuation: number;
  guesses: { value: number; feedback: "higher" | "lower" | "correct" }[];
  gameState: "playing" | "won" | "lost";
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
  | { type: "SET_GAME_STATE"; payload: "playing" | "won" | "lost" };

// Initial state
export const initialState: PressdleState = {
  device: null,
  targetActuation: 0,
  guesses: [],
  gameState: "playing",
};

// Reducer function
export const reducer = (
  state: PressdleState,
  action: PressdleAction
): PressdleState => {
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
    default:
      return state;
  }
};
