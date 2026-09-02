import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  // Relative asset paths required for Capacitor (file / capacitor origins).
  base: "./",
  plugins: [tsConfigPaths(), react(), tailwindcss()],
  server: {
    port: 3000,
  },
});
