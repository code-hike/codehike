import fs from "fs"
import { remarkCodeHike } from "../src/index"
import { compile } from "@mdx-js/mdx"
import theme from "shiki/themes/slack-dark.json"

export async function getFiles() {
  const files = await fs.promises.readdir("./dev/content")
  return files
    .filter(file => file.endsWith(".mdx"))
    .map(filename => filename.slice(0, -4))
}

export async function getCode(filename: string) {
  const file = await fs.promises.readFile(
    `./dev/content/${filename}.mdx`,
    "utf8"
  )

  const code = String(
    await compile(file, {
      outputFormat: "function-body",
      remarkPlugins: [
        [remarkCodeHike, { autoImport: false, theme }],
      ],
    })
  )

  return code
}
