import { useCallback } from "react";

export const WOOT_VID = 0x31e3;
export const WOOT_ANALOG_USAGE = 0xff54;

export interface AnalogReport {
  data: { key: number; value: number }[];
}

declare global {
  interface HIDDevice {
    onanalogreport: ((this: this, ev: AnalogReport) => void) | undefined;
  }
}

interface ConnectDeviceProps {
  onConnect: (device: HIDDevice) => void;
}

export function ConnectDevice({ onConnect }: ConnectDeviceProps) {
  const onClick = useCallback(async () => {
    const devices = await navigator.hid.requestDevice({
      filters: [
        {
          vendorId: WOOT_VID,
          usagePage: WOOT_ANALOG_USAGE,
        },
      ],
    });

    if (devices.length > 0) {
      const useDevice = devices[0];

      await useDevice.open();

      console.log("Got Device", useDevice);

      useDevice.addEventListener("inputreport", (event) => {
        // The data structure is that there are pairs of 2 bytes for the hid id and one byte for the analog value repeated over and over
        const data = event.data;
        const analogData = [];
        for (let i = 0; i < data.byteLength; i += 3) {
          const key = data.getUint16(i);
          const value = data.getUint8(i + 2) / 255;

          if (value === 0) {
            break;
          }
          analogData.push({
            key,
            value,
          });
        }

        if (useDevice.onanalogreport) {
          useDevice.onanalogreport({ data: analogData });
        } else {
          console.warn("No onanalogreport event listener");
        }
      });

      onConnect(useDevice);
    }
  }, [onConnect]);

  return (
    <div className="bg-zinc-800 rounded-lg text-white p-6 mt-16 max-w-md mx-auto">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold ">
            Connect Your Wooting Keyboard
          </h2>
        </div>

        <div className="space-y-2">
          <p>
            To play Pressdle, you'll need to connect your Wooting keyboard using
            the Web HID API.
          </p>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>Make sure your keyboard is connected via USB</li>
            <li>Use a compatible browser (Chrome, Edge, or Opera)</li>
            <li>Click the button below to connect</li>
          </ul>
        </div>

        <button
          className="w-full py-3 px-4 rounded-md font-medium transition-colors bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
          onClick={onClick}
          onKeyDown={(e) => {
            e.preventDefault();
          }}
        >
          Connect Device
        </button>
      </div>
    </div>
  );
}
