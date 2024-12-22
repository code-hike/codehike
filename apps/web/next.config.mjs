import createNextDocsMDX from "next-docs-mdx/config"
import { remarkCodeHike, recmaCodeHike } from "codehike/mdx"
// import fs from "node:fs"
// import { jsx, toJs } from "estree-util-to-js"
// function recmaPlugin() {
//   return (tree) => {
//     const result = toJs(tree, { handlers: jsx })
//     // console.log("```js")
//     // console.log(result.value)
//     // console.log("```")
//     fs.writeFileSync("recma.js", result.value)
//   }
// }

/** @type {import('codehike/mdx').CodeHikeConfig} */
const chConfig = {
  components: {
    code: "Code",
    inlineCode: "InlineCode",
  },
  // ignoreCode: (codeblock) => codeblock.lang === "mermaid",
  // syntaxHighlighting: {
  //   theme: "github-dark",
  // },
}

const withMDX = createNextDocsMDX({
  mdxOptions: {
    remarkPlugins: [[remarkCodeHike, chConfig]],
    recmaPlugins: [[recmaCodeHike, chConfig]],
    // jsx: true,
  },
})

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  webpack: (config) => {
    // fix https://github.com/microsoft/TypeScript-Website/pull/3022
    config.module.exprContextCritical = false
    return config
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
}

export default withMDX(config)
