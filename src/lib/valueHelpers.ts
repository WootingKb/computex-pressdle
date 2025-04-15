import { MIN_ACTUATION, MAX_ACTUATION } from "./gameConstants";

// Helper function to convert analog value (0-1) to mm
export const analogToMm = (value: number | undefined): number => {
  if (value === undefined || value === 0) {
    return 0;
  }
  return MIN_ACTUATION + (MAX_ACTUATION - MIN_ACTUATION) * value;
};

export const mmToAnalog = (mm: number): number => {
  return (mm - MIN_ACTUATION) / (MAX_ACTUATION - MIN_ACTUATION);
};

// Helper function to format mm to 2 decimal places
export const formatMm = (mm: number): string => {
  return mm.toFixed(2);
};

// Helper function to determine if a guess is correct
export const isCorrectGuess = (guess: number, target: number): boolean => {
  // Consider it correct if within 0.05mm
  // the params are provided in raw analog value (0-1) so we need to convert them to mm first to handle the range properly
  return Math.abs(analogToMm(guess) - analogToMm(target)) <= 0.05;
};

// Helper function to determine if a guess is higher or lower
export const getGuessFeedback = (
  guess: number,
  target: number
): "higher" | "lower" | "correct" => {
  if (isCorrectGuess(guess, target)) {
    return "correct";
  }
  return guess < target ? "higher" : "lower";
};
