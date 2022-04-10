import autoprefixer from "autoprefixer"
import postcss from "rollup-plugin-postcss"

import cssnano from "cssnano"
import typescript from "rollup-plugin-typescript2"
// import copy from "rollup-plugin-copy"
import path from "path"
import json from "@rollup/plugin-json"
import del from "rollup-plugin-delete"
import replace from "@rollup/plugin-replace"
// import { terser } from "rollup-plugin-terser"

export default function makeConfig(commandOptions) {
  return [
    {
      input: "src/index.scss",
      output: {
        file: "dist/index.css",
        format: "es",
      },
      plugins: [
        del({ targets: "dist/*" }),
        postcss({
          extract: path.resolve("dist/index.css"),
          plugins: [autoprefixer(), cssnano()],
        }),
      ],
    },
    {
      input: `src/index.tsx`,
      output: [
        {
          file: `./dist/index.cjs.js`,
          format: "cjs",
        },
        {
          file: `./dist/index.esm.js`,
          format: "es",
        },
      ],
      // external: ["react"],
      plugins: [
        json({ compact: true }),
        typescript({
          tsconfigOverride: {
            compilerOptions: { jsx: "react" },
          },
        }),
      ],
    },
    // for the browser esm we need to replace shiki with shiki/dist/index.browser.mjs
    // https://github.com/shikijs/shiki/issues/131#issuecomment-1094281851
    {
      input: `src/index.tsx`,
      output: [
        {
          file: `./dist/index.browser.mjs`,
          format: "es",
        },
      ],
      // external: ["react"],
      plugins: [
        replace({
          delimiters: ["", ""],
          values: {
            'from "shiki"':
              'from "shiki/dist/index.browser.mjs"',
          },
        }),
        json({ compact: true }),
        typescript({
          tsconfigOverride: {
            compilerOptions: { jsx: "react" },
          },
        }),
        // terser(),
      ],
    },
    {
      input: `src/components.tsx`,
      output: [
        {
          file: `./dist/components.cjs.js`,
          format: "cjs",
        },
        {
          file: `./dist/components.esm.js`,
          format: "es",
        },
      ],
      // external: ["react"],
      plugins: [
        json({ compact: true }),
        typescript({
          tsconfigOverride: {
            compilerOptions: { jsx: "react" },
          },
        }),
      ],
    },
  ]
}
