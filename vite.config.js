import { defineConfig } from 'vite'
import postcssConfig from "./postcss.config.js";

export default defineConfig({
  css: {
    postcss: postcssConfig
  },
  build: {
    minify: false,
    lib: {
      entry: 'main.js',
      fileName: 'pentatrion-theme',
      formats: ['es']
    }
  }
});