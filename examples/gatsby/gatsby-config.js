const { remarkCodeHike } = require("@code-hike/mdx")
const theme = require("shiki/themes/material-palenight.json")

module.exports = {
  siteMetadata: {
    title: `codehike-gatsby`,
  },
  plugins: [
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`],
        mdxOptions: {
          remarkPlugins: [[remarkCodeHike, { theme }]],
        },
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: "./src/pages/",
      },
      __key: "pages",
    },
  ],
}
