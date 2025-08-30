import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/rq.ts", "src/actions.ts"],
  format: ["esm"],
  dts: process.env.NODE_ENV === "production",
  clean: true,
  external: [
    "@acmecorp/db",
    "@acmecorp/env",
    "ky",
    "zod",
    "@tanstack/react-query",
    "react",
  ],
  treeshake: true,
  sourcemap: process.env.NODE_ENV === "production",
});
