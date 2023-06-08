const { remarkCodeHike } = require("@code-hike/mdx")
/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  ignoredRouteFiles: [".*"],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
  // devServerPort: 8002
  mdx: {
    remarkPlugins: [[remarkCodeHike, { theme: "dracula" }]],
  },
}
