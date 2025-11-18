import tailwindcss from "@tailwindcss/postcss";
import { defineConfig } from "electron-vite";

import react from "@vitejs/plugin-react";

export default defineConfig({
  main: {
    publicDir: false,
  },
  preload: {
    build: {
      rollupOptions: {
        output: {
          format: "cjs",
          entryFileNames: "[name].js",
        },
      },
    },
  },
  renderer: {
    plugins: [react()],
    css: {
      postcss: {
        plugins: [tailwindcss()],
      },
    },
  },
});
