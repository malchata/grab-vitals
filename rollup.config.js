/* eslint-env node */
import pkg from "./package.json";

const commonConfig = {
  input: "src/index.js",
  external: [
    "web-vitals",
    "whatwg-fetch"
  ]
};

export default [
  // CommonJS build
  {
    output: {
      file: pkg.main,
      format: "cjs"
    },
    ...commonConfig
  },
  // ES6 Build
  {
    output: {
      file: pkg.module,
      format: "esm"
    },
    ...commonConfig
  }
];
