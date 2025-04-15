import { createContext, useContext } from "react";
import { PressdleContextType } from ".";

export const PressdleContext = createContext<PressdleContextType | undefined>(
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
