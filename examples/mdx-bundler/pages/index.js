import { remarkCodeHike } from "@code-hike/mdx"
import theme from "shiki/themes/solarized-dark.json"
import fs from "fs"
import path from "path"
import { bundleMDX } from "mdx-bundler"
import { getMDXComponent } from "mdx-bundler/client"
import { useMemo } from "react"

export async function getStaticProps() {
  // can be from a local file, database, anywhere
  const source = fs.readFileSync("posts/lorem.mdx", "utf-8")

  // https://github.com/kentcdodds/mdx-bundler#nextjs-esbuild-enoent
  if (process.platform === "win32") {
    process.env.ESBUILD_BINARY_PATH = path.join(
      process.cwd(),
      "node_modules",
      "esbuild",
      "esbuild.exe"
    )
  } else {
    process.env.ESBUILD_BINARY_PATH = path.join(
      process.cwd(),
      "node_modules",
      "esbuild",
      "bin",
      "esbuild"
    )
  }

  const { code } = await bundleMDX({
    source,
    files: {},
    xdmOptions(options) {
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        [remarkCodeHike, { theme }],
      ]
      return options
    },
  })

  return { props: { source: code } }
}

export default function Page({ source }) {
  const Content = getMDXComponent(source)
  return (
    <div style={{ width: 800, margin: "0 auto" }}>
      <Content />
    </div>
  )
}
