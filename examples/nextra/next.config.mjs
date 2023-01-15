import nextra from "nextra"
import { remarkCodeHike } from "@code-hike/mdx"
import theme from "shiki/themes/material-palenight.json" assert { type: "json" }

const withNextra = nextra({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.mjs",
  mdxOptions: {
    remarkPlugins: [[remarkCodeHike, { theme }]],
  },
})

export default withNextra()
