/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,

  env: {
    browser: true,
    es2022: true,
    node: true,
  },

  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended", // strictest Vue 3 ruleset
    "@vue/eslint-config-typescript/recommended",
    "prettier", // must be last – disables rules that conflict with Prettier
  ],

  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },

  rules: {
    // ── Vue ──────────────────────────────────────────────────────────────────
    "vue/multi-word-component-names": "off", // allow single-word names (App, Layout…)
    "vue/require-default-prop": "off", // TypeScript types are sufficient
    "vue/no-v-html": "warn", // flag XSS-prone usage

    // ── TypeScript ────────────────────────────────────────────────────────────
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
    "@typescript-eslint/consistent-type-imports": [
      "error",
      { prefer: "type-imports", disallowTypeAnnotations: false },
    ],

    // ── General ───────────────────────────────────────────────────────────────
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "no-debugger": "error",
    eqeqeq: ["error", "always"],
    "prefer-const": "error",
  },
};
