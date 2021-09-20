const { remarkCodeHike } = require("@code-hike/mdx")

module.exports = {
  stories: ["intro.story.mdx", "*.story.@(js|mdx|tsx)"],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-controls",
    "@storybook/addon-actions",
  ],
  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      propFilter: prop => true,
      // componentNameResolver: (exp, source) =>
      //   console.log("!!!$$$", exp, source) || true,
      compilerOptions: {
        allowSyntheticDefaultImports: false,
        esModuleInterop: false,
      },
    },
  },
  webpackFinal: config => {
    // until https://github.com/shikijs/shiki/issues/177 is fixed
    config.node = { fs: "empty", path: "empty" }

    // use xdm
    const mdxRule = config.module.rules.find(
      rule => String(rule.test) === String(/\.mdx$/)
    )
    mdxRule.use = [
      {
        loader: "xdm/webpack.cjs",
        options: { remarkPlugins: [remarkCodeHike] },
      },
    ]

    return config
  },
}

function myPlugin() {
  return ast => {
    console.log("myplugin", ast)
    return ast
  }
}
