import { defineConfig } from "vite-plus";
import solid from "unplugin-solid/rolldown";

const shared = {
  plugins: [solid()],
  format: ["esm"],
  clean: false,
  dts: true,
  unbundle: false,
  deps: {
    neverBundle: [/^[^./]/],
  },
  platform: "browser",
};

export default defineConfig({
  pack: [
    {
      ...shared,
      entry: ["src/index.ts", "src/node-view.ts"],
      clean: true,
      outputOptions: { dir: "dist" },
    },
    {
      ...shared,
      entry: ["src/menus/index.ts"],
      outputOptions: { dir: "dist/menus" },
    },
  ],
});
