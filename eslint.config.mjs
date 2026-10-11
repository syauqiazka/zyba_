export default [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "src/generated/**",
      "public/**",
      "data/**",
      "uploads/**",
      "*.tsbuildinfo"
    ]
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
    rules: {}
  }
];
