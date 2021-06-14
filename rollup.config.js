/* eslint-env node */
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";

const commonConfig = {
  input: "src/index.js",
  plugins: [
    nodeResolve()
  ]
};

export default [
  // CommonJS build
  {
    output: {
      dir: "./dist",
      format: "cjs",
      entryFileNames: "[name].js",
      chunkFileNames: "[name].js"
    },
    ...commonConfig
  },
  // ES6 Build
  {
    output: {
      dir: "./dist",
      format: "esm",
      entryFileNames: "[name].mjs",
      chunkFileNames: "[name].mjs"
    },
    ...commonConfig
  }
];
