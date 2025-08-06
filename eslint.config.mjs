// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    // Global ignores that apply to all files
    ignores: ["**/*.stories.tsx", "**/*.stories.ts", "**/*.stories.jsx", "**/*.stories.js", ".storybook/**", "storybook-static/**"]
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  ...storybook.configs.flat.recommended,
  {
    files: ["**/*.stories.tsx"],
    rules: {
      "storybook/no-renderer-packages": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/ban-ts-comment": "off"
    }
  },  {
    files: ["**/*.tsx", "**/*.ts"],
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "react-hooks/exhaustive-deps": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@next/next/no-img-element": "warn"
    }
  }
];

export default eslintConfig;
