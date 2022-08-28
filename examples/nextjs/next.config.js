const { remarkCodeHike } = require("@code-hike/mdx")
const theme = require("shiki/themes/nord.json")

const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [[remarkCodeHike, { theme }]],
  },
})

module.exports = withMDX({
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  eslint: { ignoreDuringBuilds: true },

  webpack: (config, { dev, isServer }) => {
    Object.assign(config.resolve.alias, {
      "react/jsx-runtime.js": "preact/compat/jsx-runtime",
      react: "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react-dom": "preact/compat",
    })

    return config
  },
})
