import { analogToMm } from "../valueHelpers";

// Define the state interface
export interface PressdleState {
  device: HIDDevice | null;
  targetActuation: number;
  currentAnalogValue: number;
  currentMm: number;
  guesses: { value: number; feedback: "higher" | "lower" | "correct" }[];
  gameState: "playing" | "won" | "lost";
}

// Define action types
export type PressdleAction =
  | { type: "CONNECT_DEVICE"; payload: HIDDevice }
  | { type: "DISCONNECT_DEVICE"; payload: HIDDevice }
  | { type: "SET_TARGET_ACTUATION"; payload: number }
  | { type: "SET_CURRENT_ANALOG_VALUE"; payload: number }
  | { type: "SET_CURRENT_MM"; payload: number }
  | {
      type: "ADD_GUESS";
      payload: { value: number; feedback: "higher" | "lower" | "correct" };
    }
  | { type: "SET_GAME_STATE"; payload: "playing" | "won" | "lost" }
  | { type: "RESET_GAME" };

// Initial state
export const initialState: PressdleState = {
  device: null,
  targetActuation: 0,
  currentAnalogValue: 0,
  currentMm: 0,
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
    case "SET_CURRENT_ANALOG_VALUE":
      return {
        ...state,
        currentAnalogValue: action.payload,
      };
    case "SET_CURRENT_MM":
      return {
        ...state,
        currentMm: action.payload,
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
    case "RESET_GAME": {
      const randomValue = Math.random();
      const randomMm = analogToMm(randomValue);
      return {
        ...state,
        targetActuation: randomMm,
        guesses: [],
        gameState: "playing",
      };
    }
    default:
      return state;
  }
};
