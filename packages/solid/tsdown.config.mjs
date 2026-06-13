import { defineConfig } from "tsdown";
import solid from "unplugin-solid/rolldown";

export default defineConfig({
  entry: ["src/index.ts", "src/menus/index.ts", "src/node-view.ts"],
  plugins: [solid()],
  format: ["esm"],
  clean: true,
  dts: true,
  unbundle: false,
  deps: {
    // Match @tiptap/react: keep all node_modules external in the bundle.
    neverBundle: [/^[^./]/],
  },
  platform: "browser",
  outputOptions: {
    dir: "dist",
  },
});
