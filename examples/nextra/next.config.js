const { remarkCodeHike } = require("@code-hike/mdx")
const theme = require("shiki/themes/material-palenight.json")

const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.mjs",
  mdxOptions: {
    remarkPlugins: [[remarkCodeHike, { theme }]],
  },
})

module.exports = withNextra()
