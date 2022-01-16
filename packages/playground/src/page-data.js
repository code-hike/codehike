import fs from "fs"
import { bundleMDX } from "mdx-bundler"
import { remarkShowTree } from "./plugin"
import { remarkCodeHike } from "@code-hike/mdx"

async function getDemoList() {
  const files = await fs.promises.readdir("./content/")

  return files
    .filter(filename => filename.endsWith(".mdx"))
    .map(filename => filename.slice(0, -4))
}

async function getFiles(demo) {
  let filenames = []
  try {
    filenames = await fs.promises.readdir(
      `./content/${demo}/`
    )
  } catch (e) {
    return undefined
  }

  const files = {}
  for (const filename of filenames) {
    files[filename] = await fs.promises.readFile(
      `./content/${demo}/${filename}`,
      "utf8"
    )
  }

  return files
}

export async function toProps({ demo, theme }) {
  const mdxSource = await fs.promises.readFile(
    `./content/${demo}.mdx`,
    "utf8"
  )

  const files = await getFiles(demo)

  const preCodeHike = await bundle(mdxSource, files, [
    remarkShowTree,
  ])

  let postCodeHike, result
  try {
    const loadedTheme = await import(
      `shiki/themes/${theme}.json`
    ).then(module => module.default)

    postCodeHike = await bundle(mdxSource, files, [
      [
        remarkCodeHike,
        { theme: loadedTheme, lineNumbers: true },
      ],
      remarkShowTree,
    ])

    result = await bundle(mdxSource, files, [
      [
        remarkCodeHike,
        { theme: loadedTheme, lineNumbers: true },
      ],
    ])
  } catch (e) {
    console.error("remark-code-hike error", e)
    const errorBundle = await bundle(
      `### remark-code-hike error \n ~~~\n${e.toString()}\n~~~`,
      undefined,
      []
    )

    postCodeHike = errorBundle
    result = errorBundle
  }

  const shiki = await import("shiki")
  const highlighter = await shiki.getHighlighter({
    theme: "github-light",
  })

  const demos = await getDemoList()

  const source = highlighter.codeToHtml(
    mdxSource,
    "markdown"
  )

  return {
    source,
    preCodeHike,
    postCodeHike,
    result,
    demos,
    themes: shiki.BUNDLED_THEMES,
    currentTheme: theme,
    currentDemo: demo,
  }
}

async function bundle(source, files, plugins) {
  const { code } = await bundleMDX(source, {
    files,
    esbuildOptions(options) {
      options.minify = false
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
