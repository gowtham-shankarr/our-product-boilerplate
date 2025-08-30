import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/nextauth.ts"],
  format: ["esm"],
  dts: process.env.NODE_ENV === "production",
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
  sourcemap: process.env.NODE_ENV === "production",
  noExternal: ["zod"],
});
