import autoprefixer from "autoprefixer"
import postcss from "rollup-plugin-postcss"

import cssnano from "cssnano"
import typescript from "rollup-plugin-typescript2"
import copy from "rollup-plugin-copy"
import path from "path"

const plugins = [
  typescript(),
  postcss({
    extract: path.resolve("dist/index.css"),
    plugins: [autoprefixer(), cssnano()],
  }),
  copy({
    targets: [{ src: "src/index.scss", dest: "dist" }],
  }),
]

const createConfig = filename => ({
  input: `src/${filename}.tsx`,
  output: [
    {
      file: `./dist/${filename}.js`,
      format: "umd",
      name: "ch", //todo get by parameter
    },
    {
      file: `./dist/${filename}.cjs.js`,
      format: "cjs",
      name: "ch", //todo get by parameter
    },
    {
      file: `./dist/${filename}.esm.js`,
      format: "es",
    },
  ],
  plugins,
})

const configs = ["index"].map(filename =>
  createConfig(filename)
)

export default configs
