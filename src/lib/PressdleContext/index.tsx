import { useReducer, ReactNode, Dispatch, useMemo, useEffect } from "react";
import {
  reducer,
  initialState,
  PressdleState,
  PressdleAction,
} from "./reducer";
import { getDailyTarget } from "../dailyTarget";
import {
  getSavedGameState,
  isSavedStateFromToday,
  saveGameState,
} from "../gameStateStorage";
import { PressdleContext } from "./selectors";

export interface PressdleContextType extends PressdleState {
  dispatch: Dispatch<PressdleAction>;
}

interface PressdleProviderProps {
  children: ReactNode;
}

export const PressdleProvider: React.FC<PressdleProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState, () => {
    const savedState = getSavedGameState();

    if (savedState && isSavedStateFromToday()) {
      // If we have a saved state from today, use it
      return {
        ...initialState,
        targetActuation:
          savedState.targetActuation || initialState.targetActuation,
        guesses: savedState.guesses || initialState.guesses,
        gameState: savedState.gameState || initialState.gameState,
      };
    } else {
      // Otherwise, use the daily target
      const dailyTarget = getDailyTarget();
      return {
        ...initialState,
        targetActuation: dailyTarget,
      };
    }
  });

  // Save game state whenever it changes
  useEffect(() => {
    saveGameState(state);
  }, [state]);

  const value = useMemo(
    () => ({
      ...state,
      dispatch,
    }),
    [state, dispatch]
  );

  return (
    <PressdleContext.Provider value={value}>
      {children}
    </PressdleContext.Provider>
  );
};
