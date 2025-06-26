// import tailwindcss from "@tailwindcss/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    // include: ["@emotion/react", "@emotion/styled", "@mui/material/Tooltip"],
  },
  build: {
    rollupOptions: {
      input: "src/renderer/src/main.tsx",
    },
  },
});
