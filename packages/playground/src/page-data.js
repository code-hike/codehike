import fs from "fs/promises"
import { bundleMDX } from "mdx-bundler"
import { remarkShowTree } from "./plugin"
import { remarkCodeHike } from "@code-hike/mdx"

async function getDemoList() {
  const files = await fs.readdir("./content/")

  return files
    .filter(filename => filename.endsWith(".mdx"))
    .map(filename => filename.slice(0, -4))
}

export async function toProps({ demo, theme }) {
  const loadedTheme = await import(
    `shiki/themes/${theme}.json`
  ).then(module => module.default)

  const mdxSource = await fs.readFile(
    `./content/${demo}.mdx`,
    "utf8"
  )

  const preCodeHike = await bundle(mdxSource, [
    remarkShowTree,
  ])

  const postCodeHike = await bundle(mdxSource, [
    [remarkCodeHike, { theme: loadedTheme }],
    remarkShowTree,
  ])

  const result = await bundle(mdxSource, [
    [remarkCodeHike, { theme: loadedTheme }],
  ])

  const shiki = await import("shiki")
  const highlighter = await shiki.getHighlighter({
    theme: "github-light",
  })

  const demos = await getDemoList()

  return {
    source: highlighter.codeToHtml(mdxSource, "markdown"),
    preCodeHike,
    postCodeHike,
    result,
    demos,
    themes: shiki.BUNDLED_THEMES,
    currentTheme: theme,
    currentDemo: demo,
  }
}

async function bundle(source, plugins) {
  const { code } = await bundleMDX(source, {
    esbuildOptions(options) {
      options.platform = "node"
      return options
    },
    xdmOptions(options) {
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        ...plugins,
      ]
      return options
    },
    globals: {
      react: "react",
    },
  })
  return code
}
