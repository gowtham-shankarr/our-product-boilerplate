import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  external: ["next", "react", "zod", "next/navigation", "next/link"],
  treeshake: true,
  sourcemap: true,
  minify: false,
  splitting: false,
  bundle: true,
  outDir: "dist",
  target: "es2020",
});
