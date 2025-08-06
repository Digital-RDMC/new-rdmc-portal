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
    ignores: [".next/**", "node_modules/**", "out/**", "dist/**"]
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
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
