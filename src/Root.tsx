import { Pressdle } from "./components/Pressdle";
import { Header } from "./components/Header";
import { ConnectDevice } from "./components/ConnectDevice";
import { usePressdleContext } from "./lib/PressdleContext";
import { useCallback, useEffect } from "react";

export function Root() {
  const { device, dispatch } = usePressdleContext();
  const onDeviceConnect = useCallback(
    (device: HIDDevice) => {
      dispatch({ type: "CONNECT_DEVICE", payload: device });
    },
    [dispatch]
  );

  // Handle device disconnect
  useEffect(() => {
    const handler = (event: HIDConnectionEvent) => {
      console.log("Device disconnected", event);

      dispatch({ type: "DISCONNECT_DEVICE", payload: event.device });
    };

    navigator.hid.addEventListener("disconnect", handler);

    // Cleanup
    return () => {
      navigator.hid.removeEventListener("disconnect", handler);
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-zinc-900">
      <Header />
      <main className="flex flex-col items-center justify-center">
        {device ? (
          <Pressdle device={device} />
        ) : (
          <ConnectDevice onConnect={onDeviceConnect} />
        )}
      </main>
    </div>
  );
}
