import { defineConfig } from "vite";

export default defineConfig({
  build: {
    minify: false,
    lib: {
      entry: "main.js",
      fileName: "pentatrion-theme",
      formats: ["es"],
    },
  },
});
