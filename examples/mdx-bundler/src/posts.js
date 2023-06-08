import fs from "fs"
import path from "path"
import { remarkCodeHike } from "@code-hike/mdx"
import { bundleMDX } from "mdx-bundler"

export function getPostNames() {
  return fs
    .readdirSync("posts")
    .filter((path) => /\.mdx?$/.test(path))
    .map((fileName) => {
      const postName = fileName.replace(/\.mdx?$/, "")
      return postName
    })
}

export async function getPostSource(postName) {
  // can be from a local file, database, anywhere
  const source = fs.readFileSync(`posts/${postName}.mdx`, "utf-8")

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
    mdxOptions(options) {
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        [remarkCodeHike, { theme: "material-palenight" }],
      ]
      return options
    },
  })

  return code
}
