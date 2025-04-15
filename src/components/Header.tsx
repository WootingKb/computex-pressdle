import { usePressdleContext } from "../lib/PressdleContext";
import { Modal } from "./Modal";

export function Header() {
  const { device, dispatch } = usePressdleContext();

  const handleDisconnect = async () => {
    if (device) {
      try {
        dispatch({ type: "DISCONNECT_DEVICE", payload: device });
      } catch (error) {
        console.error("Error disconnecting device:", error);
      }
    }
  };

  return (
    <header className="flex items-center justify-between w-full bg-zinc-800 text-white h-14 px-6 py-2">
      <h1 className="text-2xl font-bold">Pressdle</h1>

      <div className="flex gap-4 h-full">
        {device && (
          <div className="bg-zinc-700 flex items-center gap-2 px-2 h-full rounded-sm">
            <div>{device.productName}</div>
            <button
              className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 cursor-pointer transition-colors"
              onClick={handleDisconnect}
            >
              Disconnect
            </button>
          </div>
        )}

        <Modal triggerText="Rules" title="How to Play Pressdle">
          <div>
            <p className="mb-4">
              Pressdle is a Wordle-like game for guessing the actuation point of
              the day using Wooting keyboards.
            </p>
            <ol className="list-decimal pl-6 mb-4 space-y-2">
              <li>
                Connect your Wooting keyboard using the "Connect Device" button.
              </li>
              <li>
                Press the B key down to a specific actuation point (between
                0.01mm and 4.00mm).
              </li>
              <li>Press Enter to submit your guess.</li>
              <li>
                Use the feedback (higher/lower) to adjust your next guess.
              </li>
              <li>Try to find the exact actuation point within 6 guesses.</li>
            </ol>
            <p>
              A guess is considered correct if it's within 0.05mm of the target
              actuation point.
            </p>
          </div>
        </Modal>
        <Modal triggerText="Credits" title="About Pressdle">
          <div>
            <p className="mb-4">
              Pressdle was created to showcase the analog capabilities of
              Wooting keyboards. The game challenges players to guess the daily
              actuation point by using the analog input from their keyboard.
            </p>

            <h3 className="text-lg font-semibold  border-b border-gray-200 pb-2 mb-4 mt-6">
              Credits
            </h3>
            <p className="mb-4">Created by Khang Nguyen</p>

            <h3 className="text-lg font-semibold  border-b border-gray-200 pb-2 mb-4">
              FAQ
            </h3>
            <div className="mb-6">
              <h4 className="text-md font-medium text-zinc-200 mt-4 mb-2">
                What is an actuation point?
              </h4>
              <p className="">
                The actuation point is the distance a key needs to be pressed
                down before it registers as a keystroke. Wooting keyboards allow
                you to customize this distance, making them highly adaptable to
                different typing styles.
              </p>
            </div>
            <div className="mb-6">
              <h4 className="text-md font-medium text-zinc-200 mt-4 mb-2">
                Why can't I connect my keyboard?
              </h4>
              <p className="">
                Make sure your browser supports the Web HID API (Chrome, Edge,
                and Opera do).
              </p>
            </div>
          </div>
        </Modal>
      </div>
    </header>
  );
}
