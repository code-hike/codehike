import autoprefixer from "autoprefixer"
import postcss from "rollup-plugin-postcss"

import cssnano from "cssnano"
import typescript from "rollup-plugin-typescript2"
// import copy from "rollup-plugin-copy"
import path from "path"
import json from "@rollup/plugin-json"
import del from "rollup-plugin-delete"

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
