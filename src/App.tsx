import { PressdleProvider } from "./lib/PressdleContext";
import { Root } from "./Root";

export default function App() {
  return (
    <PressdleProvider>
      <Root />
    </PressdleProvider>
  );
}
