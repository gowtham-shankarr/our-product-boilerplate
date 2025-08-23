import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/nextauth.ts"],
  format: ["esm"],
  dts: false,
  clean: true,
  external: [
    "@acmecorp/db",
    "@acmecorp/env",
    "next-auth",
    "zod",
    "next",
    "react",
  ],
  treeshake: true,
  sourcemap: true,
  noExternal: ["zod"],
});
