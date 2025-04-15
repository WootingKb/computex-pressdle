import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  // This needs to be the name of the repo to host the game on github pages
  base: "/pressdle/",
  plugins: [react(), tailwindcss()],
});
