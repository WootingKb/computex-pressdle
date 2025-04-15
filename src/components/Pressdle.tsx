import { useCallback, useEffect } from "react";
import { AnalogReport } from "./ConnectDevice";
import { usePressdleContext } from "../lib/PressdleContext";
import { formatMm, getGuessFeedback, mmToAnalog } from "../lib/valueHelpers";
import { analogToMm } from "../lib/valueHelpers";
import { GUESSES_ALLOWED, TARGET_KEY } from "../lib/gameConstants";

interface Props {
  device: HIDDevice;
}

export function Pressdle({ device }: Props) {
  const {
    targetActuation,
    currentAnalogValue,
    currentMm,
    guesses,
    gameState,
    dispatch,
  } = usePressdleContext();

  // Generate a random target actuation point on component mount
  useEffect(() => {
    const randomValue = Math.random();
    const randomMm = analogToMm(randomValue);
    dispatch({ type: "SET_TARGET_ACTUATION", payload: randomMm });
    console.log("Target actuation point:", formatMm(randomMm), "mm");
  }, []);

  // Process analog reports from the device
  useEffect(() => {
    const handleAnalogReport = (event: AnalogReport) => {
      const { data } = event;
      const targetKeyData = data.find((d) => d.key === TARGET_KEY);

      if (targetKeyData) {
        dispatch({
          type: "SET_CURRENT_ANALOG_VALUE",
          payload: targetKeyData.value,
        });
        dispatch({
          type: "SET_CURRENT_MM",
          payload: analogToMm(targetKeyData.value),
        });
      }
    };

    device.onanalogreport = handleAnalogReport;

    return () => {
      device.onanalogreport = undefined;
    };
  }, [device, dispatch]);

  const submitGuess = useCallback(() => {
    if (gameState !== "playing") return;

    const feedback = getGuessFeedback(currentMm, targetActuation);
    const newGuess = { value: currentMm, feedback };
    dispatch({ type: "ADD_GUESS", payload: newGuess });

    if (feedback === "correct") {
      dispatch({ type: "SET_GAME_STATE", payload: "won" });
    }
  }, [currentMm, gameState, targetActuation, dispatch]);

  // Handle key press to submit a guess
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && gameState === "playing" && device) {
        submitGuess();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentMm, gameState, device, submitGuess]);

  useEffect(() => {
    if (guesses.length >= GUESSES_ALLOWED) {
      console.log("Game over", guesses.length, GUESSES_ALLOWED);
      dispatch({ type: "SET_GAME_STATE", payload: "lost" });
    }
  }, [dispatch, guesses]);

  const resetGame = () => {
    const randomValue = Math.random();
    const randomMm = analogToMm(randomValue);
    dispatch({ type: "SET_TARGET_ACTUATION", payload: randomMm });
    dispatch({ type: "RESET_GAME" });
    console.log("New target actuation point:", formatMm(randomMm), "mm");
  };

  return (
    <div className="mt-8 flex flex-col gap-4 items-center justify-center text-white">
      <div className="w-full text-center bg-zinc-800 p-4 rounded-lg">
        <div>
          Press the <strong>B</strong> key to guess
        </div>
        <div>
          Press <strong>Enter</strong> to lock in your guess
        </div>
      </div>
      <div className="flex gap-4 w-full">
        <div className="bg-zinc-800 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-white mb-2">
            Current Actuation Point:
          </h3>
          <div className="text-3xl font-bold text-white text-center my-2">
            {formatMm(currentMm)} mm
          </div>
          <div className="flex gap-2 py-4 justify-center">
            <div className="relative h-48 w-5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="absolute top-0 w-full bg-blue-500 transition-all duration-100"
                style={{ height: `${currentAnalogValue * 100}%` }}
              ></div>
            </div>
            <div className="flex flex-col justify-between text-xs text-gray-500 -my-1">
              <span>0.01mm</span>
              <span>2.00mm</span>
              <span>4.00mm</span>
            </div>
          </div>
        </div>
        <div className="bg-zinc-800 flex items-center gap-4 rounded-lg p-6">
          {[...Array(GUESSES_ALLOWED)].map((_, index) => {
            const guess = guesses[index];

            if (!guess) {
              return (
                <div
                  className="flex flex-col min-h-[240px] w-14 gap-2 items-center"
                  key={"guess-" + index}
                >
                  <div className="h-48 w-5 bg-gray-200 rounded-full"></div>
                </div>
              );
            }
            return (
              <div
                key={"guess-" + index}
                className="flex flex-col min-h-[240px] w-14 gap-2 items-center"
              >
                <div className="relative h-48 w-5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 w-full bg-blue-500 transition-all duration-100"
                    style={{ height: `${mmToAnalog(guess.value) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 flex flex-col items-center gap-2">
                  <span className="font-semibold">
                    {formatMm(guess.value)} mm
                  </span>
                  <span
                    className={`font-medium text-center ${
                      guess.feedback === "correct"
                        ? "text-green-500"
                        : guess.feedback === "higher"
                        ? "text-orange-500"
                        : "text-blue-500"
                    }`}
                  >
                    {guess.feedback === "correct"
                      ? "Correct!"
                      : guess.feedback === "higher"
                      ? "Deeper"
                      : "Lighter"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {gameState !== "playing" && (
        <div className="text-center p-4 bg-zinc-800 w-full rounded-lg ">
          <h2 className="text-2xl font-bold mb-2">
            {gameState === "won" ? "You Won!" : "Game Over"}
          </h2>
          <p className="mb-4">
            The target actuation point was: {formatMm(targetActuation)} mm
          </p>
          <button
            onClick={resetGame}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
