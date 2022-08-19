const { remarkCodeHike } = require("@code-hike/mdx")
const theme = require("shiki/themes/nord.json")

module.exports = {
  siteMetadata: {
    title: `gatsby`,
    siteUrl: `https://www.yourdomain.tld`,
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
