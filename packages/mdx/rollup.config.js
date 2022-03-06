import autoprefixer from "autoprefixer"
import postcss from "rollup-plugin-postcss"

import cssnano from "cssnano"
import typescript from "rollup-plugin-typescript2"
// import copy from "rollup-plugin-copy"
import path from "path"
import json from "@rollup/plugin-json"
import fs from "fs"

const createConfig = filename => ({
  input: `src/${filename}.tsx`,
  output: [
    // {
    //   file: `./dist/${filename}.js`,
    //   format: "umd",
    //   name: "ch", //todo get by parameter
    // },
    {
      file: `./dist/${filename}.cjs.js`,
      format: "cjs",
    },
    {
      file: `./dist/${filename}.esm.js`,
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
    postcss({
      extract: path.resolve("dist/index.css"),
      plugins: [autoprefixer(), cssnano()],
    }),
    // copy({
    //   targets: [{ src: "src/index.scss", dest: "dist" }],
    // }),
  ],
})

export default function makeConfig(commandOptions) {
  const { inputs = ["index"] } = JSON.parse(
    fs.readFileSync("package.json", "utf8")
  )
  return inputs.map(createConfig)
}
