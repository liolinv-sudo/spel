import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Standard Vite + React setup, same build tool Lovable scaffolds every project with.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  preview: {
    // Render's health check / port binding expects the app to listen on
    // the PORT env var it injects, and on 0.0.0.0 rather than localhost.
    host: "0.0.0.0",
    port: Number(process.env.PORT) || 4173,
  },
});
