import { defineConfig } from "tsdown";
import solid from "unplugin-solid/rolldown";

export default defineConfig({
  entry: ["./src/index.ts"],
  platform: "neutral",
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  plugins: [solid()],
});
