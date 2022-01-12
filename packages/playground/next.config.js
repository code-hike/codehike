const { remarkCodeHike } = require("@code-hike/mdx")
const theme = require("shiki/themes/monokai.json")
const withBundleAnalyzer = require("@next/bundle-analyzer")(
  {
    enabled: process.env.ANALYZE === "true",
    // enabled: true,
  }
)
module.exports = withBundleAnalyzer({
  experimental: { esmExternals: true },
  pageExtensions: ["md", "mdx", "tsx", "ts", "jsx", "js"],
  webpack(config, options) {
    config.module.rules.push({
      test: /\.mdx?$/,
      use: [
        // The default `babel-loader` used by Next:
        options.defaultLoaders.babel,
        {
          loader: "@mdx-js/loader",
          /** @type {import('@mdx-js/loader').Options} */
          options: {
            remarkPlugins: [[remarkCodeHike, { theme }]],
          },
        },
      ],
    })
    return config
  },
})
