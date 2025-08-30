import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/schema.ts"],
  format: ["esm"],
  dts: process.env.NODE_ENV === "production",
  splitting: false,
  sourcemap: process.env.NODE_ENV === "production",
  clean: true,
  external: ["@prisma/client"],
});
