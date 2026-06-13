import { defineConfig } from "tsdown";
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

/** @type {import('tsdown').UserConfig[]} */
export default [
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
];
