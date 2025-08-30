import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: process.env.NODE_ENV === "production",
  clean: true,
  external: ["next", "react", "zod", "next/navigation", "next/link"],
  treeshake: true,
  sourcemap: process.env.NODE_ENV === "production",
  minify: false,
  splitting: false,
  bundle: true,
  outDir: "dist",
  target: "es2020",
});
