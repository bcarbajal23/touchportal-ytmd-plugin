import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import stylistic from "@stylistic/eslint-plugin";

export default defineConfig([
  ...tseslint.configs.recommended,
  { ignores: ["dist"] },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js, tseslint, "@stylistic": stylistic },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.node },
  },
  {
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@stylistic/quotes": [
        "error",
        "double",
        {
          avoidEscape: true,
          allowTemplateLiterals: "avoidEscape",
        },
      ],
    },
  },
  {
    files: ["**/*.js"],
    languageOptions: { sourceType: "commonjs" },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
]);
