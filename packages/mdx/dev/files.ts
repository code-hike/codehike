import fs from "fs"
import { remarkCodeHike } from "../src/index"
import { compile } from "@mdx-js/mdx"
import theme from "./theme.js"
import { withDebugger } from "mdx-debugger"

export async function getFiles() {
  const files = await fs.promises.readdir("./dev/content")
  return files
    .filter(file => file.endsWith(".mdx"))
    .map(filename => filename.slice(0, -4))
}
export async function getFile(filename: string) {
  const path = `./dev/content/${filename}.mdx`
  const file = await fs.promises.readFile(path, "utf8")

  return { value: file, path }
}

export async function getCode(file: any, config = {}) {
  let debugLink = ""

  const debugCompile = withDebugger(compile, {
    log: (path: string, url: string) => {
      debugLink = url
    },
  })

  const code = String(
    await debugCompile(file, {
      outputFormat: "function-body",
      remarkPlugins: [
        [
          remarkCodeHike,
          {
            autoImport: false,
            skipLanguages: ["", "mermaid"],
            showCopyButton: true,
            autoLink: true,
            theme: "material-darker",
            ...config,
          },
        ],
      ],
    })
  )

  return { code, debugLink }
}
