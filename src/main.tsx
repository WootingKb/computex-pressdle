import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { PressdleProvider } from "./lib/PressdleContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PressdleProvider>
      <App />
    </PressdleProvider>
  </StrictMode>
);
