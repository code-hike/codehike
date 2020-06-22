import styles from "rollup-plugin-styles";
import autoprefixer from "autoprefixer";
// import postcss from "rollup-plugin-postcss";
// import embedCSS from "rollup-plugin-embed-css";
import cssnano from "cssnano";
import typescript from "rollup-plugin-typescript2";

const plugins = [
  typescript(),
  styles({
    plugins: [autoprefixer(), cssnano()],
    mode: [
      "inject",
      {
        // container: "body",
        singleTag: true,
        // prepend: true,
        // attributes: { id: "global" },
      },
    ],
  }),
  // // postcss({
  // //   plugins: [],
  // // }),
];

const createConfig = (filename) => ({
  input: `src/${filename}.tsx`,
  output: [
    {
      file: `./dist/${filename}.js`,
      format: "umd",
      name: "foo",
    },
    {
      file: `./dist/${filename}.cjs.js`,
      format: "cjs",
      name: "foo",
    },
    {
      file: `./dist/${filename}.esm.js`,
      format: "es",
    },
  ],
  plugins,
});

const configs = ["index"].map((filename) => createConfig(filename));

export default configs;
