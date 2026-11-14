// ESLint "flat" configuration: recommended JS + TypeScript rules,
// with formatting rules switched off because Prettier handles formatting.
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default tseslint.config(
  { ignores: ["dist/", "node_modules/", "public/", "coverage/"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.ts", "tests/**/*.ts"],
    languageOptions: { globals: { ...globals.browser } },
  },
  {
    files: ["server/**/*.js", "*.config.js", "*.config.ts"],
    languageOptions: { globals: { ...globals.node } },
  },
  prettier,
);
