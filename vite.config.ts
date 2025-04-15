import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  // This needs to be the name of the repo to host the game on github pages
  base: "/pressdle/",
  plugins: [react(), tailwindcss()],
  build: {
    // Ensure proper MIME types for GitHub Pages
    rollupOptions: {
      output: {
        // Ensure proper file extensions for module scripts
        entryFileNames: "assets/[name].[hash].js",
        chunkFileNames: "assets/[name].[hash].js",
        assetFileNames: "assets/[name].[hash].[ext]",
      },
    },
  },
  // Add proper headers for GitHub Pages
  server: {
    headers: {
      "Content-Type": "application/javascript",
    },
  },
});
