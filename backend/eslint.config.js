import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly",

        // Jest globals
        describe: "readonly",
        test: "readonly",
        expect: "readonly"
      }
    }
  }
];