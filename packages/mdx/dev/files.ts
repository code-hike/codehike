import fs from "fs"
import { remarkCodeHike } from "../src/index"
import { compile } from "@mdx-js/mdx"
import theme from "shiki/themes/slack-dark.json"
import { withDebugger } from "mdx-debugger"

export async function getFiles() {
  const files = await fs.promises.readdir("./dev/content")
  return files
    .filter(file => file.endsWith(".mdx"))
    .map(filename => filename.slice(0, -4))
}
export async function getContent(filename: string) {
  const file = await fs.promises.readFile(
    `./dev/content/${filename}.mdx`,
    "utf8"
  )

  return file
}

export async function getCode(file: string) {
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
        [remarkCodeHike, { autoImport: false, theme }],
      ],
    })
  )

  return { code, debugLink }
}
