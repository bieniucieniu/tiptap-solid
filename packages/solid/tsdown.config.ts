import { defineConfig } from "tsdown";

import solid from "unplugin-solid/rolldown";
export default defineConfig({
  entry: ["src/index.ts", "src/menus/index.ts"],
  plugins: [solid()],
  format: ["esm"],
  clean: true,
  dts: true,
  bundle: true,
  deps: {
    neverBundle: [/^@tiptap\//, "solid-js", "solid-js/web"],
  },
  platform: "browser",
  outputOptions: {
    dir: "dist",
  },
});
