import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  Dispatch,
  useMemo,
} from "react";
import {
  reducer,
  initialState,
  PressdleState,
  PressdleAction,
} from "./reducer";

interface PressdleContextType extends PressdleState {
  dispatch: Dispatch<PressdleAction>;
}

const PressdleContext = createContext<PressdleContextType | undefined>(
  undefined
);

export const usePressdleContext = () => {
  const context = useContext(PressdleContext);
  if (context === undefined) {
    throw new Error(
      "usePressdleContext must be used within a PressdleProvider"
    );
  }
  return context;
};

interface PressdleProviderProps {
  children: ReactNode;
}

export const PressdleProvider: React.FC<PressdleProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

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
