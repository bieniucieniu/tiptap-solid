import solid from "unplugin-solid/rolldown";
import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: [
    {
      plugins: [solid()],
      format: ["esm"],
      clean: true,
      dts: true,
      unbundle: false,
      deps: {
        neverBundle: [/^[^./]/],
      },
      platform: "browser",
      entry: ["src/index.ts", "src/node-view.ts"],
      outputOptions: { dir: "dist" },
    },
    {
      plugins: [solid()],
      format: ["esm"],
      clean: false,
      dts: true,
      unbundle: false,
      deps: {
        neverBundle: [/^[^./]/],
      },
      platform: "browser",
      entry: ["src/menus/index.ts"],
      outputOptions: { dir: "dist/menus" },
    },
  ],
});
