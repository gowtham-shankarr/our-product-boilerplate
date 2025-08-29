// Re-export configurations for easy importing
export { default as eslint } from "../eslint.js";
export { default as prettier } from "../prettier.js";
export { default as tailwind } from "../tailwind.js";

// Type exports
export type { Linter } from "eslint";
export type { Config as PrettierConfig } from "prettier";
