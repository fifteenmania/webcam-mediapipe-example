import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import { defineConfig } from "vite";

export default defineConfig({
  assetsInclude: ["**/*.task"],
  base: '',
  plugins: [
    topLevelAwait()
  ]
});