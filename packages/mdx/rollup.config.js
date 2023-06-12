import autoprefixer from "autoprefixer"
import postcss from "rollup-plugin-postcss"

import cssnano from "cssnano"
import typescript from "rollup-plugin-typescript2"
// import copy from "rollup-plugin-copy"
import path from "path"
import json from "@rollup/plugin-json"
import del from "rollup-plugin-delete"
import dts from "rollup-plugin-dts"
import { nodeResolve } from "@rollup/plugin-node-resolve"
// import { terser } from "rollup-plugin-terser"
import commonjs from "@rollup/plugin-commonjs"
import banner2 from "rollup-plugin-banner2"

const clientExternal = [
  "react",
  "react-dom",
  // "@codesandbox/sandpack-client",
  // "use-spring",
  // "diff",
]
const remarkExternal = [
  // "hast-util-to-estree",
  "@code-hike/lighter",
  // "is-plain-obj",
  "node-fetch",
  // "remark-rehype",
  "react",
  // "unified",
  // "unist-util-visit",
  // "unist-util-visit-parents",
]

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
      onwarn(warning, warn) {
        if (warning.code === "FILE_NAME_CONFLICT") return
        warn(warning)
      },
    },
    {
      input: `src/index.tsx`,
      output: [
        {
          file: `./dist/index.esm.mjs`,
          format: "es",
        },
        {
          file: `./dist/index.cjs.js`,
          format: "cjs",
        },
      ],
      external: remarkExternal,
      plugins: [
        nodeResolve(),
        commonjs(),
        json({ compact: true }),
        typescript({
          tsconfigOverride: {
            compilerOptions: { jsx: "react" },
          },
        }),
      ],
    },
    {
      input: `src/index.tsx`,
      output: [{ file: `./dist/index.d.ts`, format: "es" }],
      external: remarkExternal,
      plugins: [nodeResolve(), commonjs(), dts()],
    },
    {
      input: `src/index.tsx`,
      output: [
        {
          file: `./dist/index.browser.mjs`,
          format: "es",
        },
      ],
      external: remarkExternal,
      plugins: [
        nodeResolve(),
        commonjs(),
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
          file: `./dist/components.esm.mjs`,
          format: "es",
        },
      ],
      external: clientExternal,
      plugins: [
        nodeResolve(),
        commonjs(),
        json({ compact: true }),
        typescript({
          tsconfigOverride: {
            compilerOptions: { jsx: "react" },
          },
        }),
        banner2(() => `"use client";\n`),
      ],
    },
    {
      input: `src/components.tsx`,
      output: [
        { file: `./dist/components.d.ts`, format: "es" },
        // because of typescript not following package.json exports sometimes
        { file: `./components.d.ts`, format: "es" },
      ],
      external: clientExternal,
      plugins: [dts()],
    },
  ]
}
