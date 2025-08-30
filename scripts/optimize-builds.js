#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packages = [
  "@acmecorp/api",
  "@acmecorp/auth",
  "@acmecorp/config",
  "@acmecorp/db",
  "@acmecorp/email",
  "@acmecorp/icons",
  "@acmecorp/orgs",
  "@acmecorp/payments",
  "@acmecorp/router",
  "@acmecorp/ui",
  "@acmecorp/users",
];

packages.forEach((pkg) => {
  const configPath = path.join(
    __dirname,
    "..",
    "packages",
    pkg,
    "tsup.config.ts"
  );

  if (fs.existsSync(configPath)) {
    let content = fs.readFileSync(configPath, "utf8");

    // Replace dts: true with conditional
    content = content.replace(
      /dts:\s*true/g,
      'dts: process.env.NODE_ENV === "production"'
    );

    // Replace sourcemap: true with conditional
    content = content.replace(
      /sourcemap:\s*true/g,
      'sourcemap: process.env.NODE_ENV === "production"'
    );

    fs.writeFileSync(configPath, content);
    console.log(`✅ Optimized ${pkg}`);
  }
});

console.log("\n🎉 All tsup configs optimized for faster development builds!");
console.log('💡 Use "pnpm dev:fast" for the fastest development experience');
