const vuePlugin = require("eslint-plugin-vue")
const tsPlugin = require("@typescript-eslint/eslint-plugin")
const tsParser = require("@typescript-eslint/parser")
const vueParser = require("vue-eslint-parser")

module.exports = [
  {
    ignores: ["node_modules", "dist", "build", "public"],
  },
  // 基础推荐规则
  ...vuePlugin.configs["flat/recommended"],
  ...tsPlugin.configs["flat/recommended"],
  // 自定义规则
  {
    files: ["src/**/*.ts", "src/**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
        process: "readonly",
      },
    },
    rules: {
      // 生产环境禁止 console/debugger
      "no-console": process.env.NODE_ENV === "prod" ? "warn" : "off",
      "no-debugger": process.env.NODE_ENV === "prod" ? "warn" : "off",
      // 允许 App.vue 单文件组件名
      "vue/multi-word-component-names": ["error", {
        ignores: ["App"],
      }],
      // TypeScript 规则
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      }],
    },
  },
]