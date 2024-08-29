import fs from "node:fs/promises"
import path from "node:path"
import { expect, test } from "vitest"
import fm from "front-matter"
import { remarkCodeHike, recmaCodeHike, CodeHikeConfig } from "../src/mdx"

import {
  compileAST,
  compileJS,
  MDFile,
  parsedJS,
  renderHTML,
} from "./utils.ast"
import { errorToMd, getTestNames } from "./utils.suite"

const suitePath = "./tests/md-suite"
const testNames = await getTestNames(suitePath)

testNames.forEach(async (filename) => {
  test(filename, async () => {
    const mdPath = path.resolve(`${suitePath}/${filename}.0.mdx`)
    const md = await fs.readFile(mdPath, "utf-8")
    const { attributes, body } = fm<{
      name?: string
      error?: boolean
      snapshots?: string[]
      syntaxHighlight?: string
    }>(md)
    const file = { value: body, history: [mdPath] }
    const { snapshots = [], syntaxHighlight } = attributes

    const chConfig: CodeHikeConfig = {
      components: {
        code: "MyCode",
        inlineCode: "InlineCode",
      },
      ignoreCode: (codeblock) => codeblock.lang === "mermaid",
    }

    if (syntaxHighlight) {
      chConfig.syntaxHighlighting = { theme: syntaxHighlight as any }
    }

    let render: any
    const renderPath = path.resolve(`${suitePath}/${filename}.0.render.tsx`)
    if (
      await fs
        .access(renderPath)
        .then(() => true)
        .catch(() => false)
    ) {
      const renderModule = await import(renderPath)
      render = renderModule.render
    }

    for (const step of snapshots) {
      try {
        const result = await getStepOutput(file, step, chConfig, render)
        expect(result).toMatchFileSnapshot(sn(filename, step))
      } catch (e) {
        const md = errorToMd(e)
        await expect(md).toMatchFileSnapshot(sn(filename, "error"))
        if (!attributes.error) {
          expect.fail("Unexpected error, see snapshot.")
        }
        return
      }
    }
  })
})

const js = ["before-recma-compiled-js", "compiled-js", "compiled-js-dev"]
const jsx = [
  "before-recma-compiled-jsx",
  "compiled-jsx",
  "parsed-jsx",
  "before-recma-compiled-function",
  "compiled-function",
]
function sn(filename: string, step: string) {
  const index = indexes[step]
  const extention =
    step === "error"
      ? "md"
      : step === "rendered" || step === "rendered-dev"
        ? "html"
        : js.includes(step)
          ? "js"
          : jsx.includes(step)
            ? "jsx"
            : "json"
  return `./md-suite/${filename}.${index}.${step}.${extention}`
}

const indexes = {
  error: 1,
  "before-remark": 2,
  "after-remark": 3,
  "after-rehype": 4,
  "before-recma-compiled-js": 5,
  "before-recma-compiled-jsx": 5,
  "before-recma-compiled-function": 5,
  "before-recma-js": 5,
  "before-recma-js-dev": 5,
  "before-recma-jsx": 5,
  "after-recma-js": 6,
  "after-recma-js-dev": 6,
  "after-recma-jsx": 6,
  "compiled-js": 7,
  "compiled-js-dev": 7,
  "compiled-jsx": 7,
  "compiled-function": 7,
  "parsed-jsx": 8,
  rendered: 9,
  "rendered-dev": 9,
}

async function getStepOutput(
  file: MDFile,
  step: string,
  chConfig: CodeHikeConfig,
  render: any,
) {
  switch (step) {
    case "before-remark":
      return await compileAST(file, (X) => ({
        remarkPlugins: [X],
      }))
    case "after-remark":
      return await compileAST(file, (X) => ({
        remarkPlugins: [[remarkCodeHike, chConfig], X],
      }))
    case "after-rehype":
      return await compileAST(file, (X) => ({
        remarkPlugins: [[remarkCodeHike, chConfig]],
        rehypePlugins: [X],
      }))
    case "before-recma-compiled-js":
      return await compileJS(file, {
        jsx: false,
        remarkPlugins: [[remarkCodeHike, chConfig]],
      })
    case "before-recma-compiled-jsx":
      return await compileJS(file, {
        jsx: true,
        remarkPlugins: [[remarkCodeHike, chConfig]],
      })
    case "before-recma-compiled-function":
      return await compileJS(file, {
        jsx: true,
        outputFormat: "function-body",
        remarkPlugins: [[remarkCodeHike, chConfig]],
      })
    case "before-recma-js":
      return await compileAST(file, (X) => ({
        jsx: false,
        remarkPlugins: [[remarkCodeHike, chConfig]],
        recmaPlugins: [X],
      }))
    case "before-recma-js-dev":
      return await compileAST(file, (X) => ({
        jsx: false,
        development: true,
        remarkPlugins: [[remarkCodeHike, chConfig]],
        recmaPlugins: [X],
      }))
    case "after-recma-js":
      return await compileAST(file, (X) => ({
        jsx: false,
        remarkPlugins: [[remarkCodeHike, chConfig]],
        recmaPlugins: [[recmaCodeHike, chConfig], X],
      }))
    case "after-recma-js-dev":
      return await compileAST(file, (X) => ({
        jsx: false,
        development: true,
        remarkPlugins: [[remarkCodeHike, chConfig]],
        recmaPlugins: [[recmaCodeHike, chConfig], X],
      }))
    case "before-recma-jsx":
      return await compileAST(file, (X) => ({
        jsx: true,
        remarkPlugins: [[remarkCodeHike, chConfig]],
        recmaPlugins: [X],
      }))
    case "after-recma-jsx":
      return await compileAST(file, (X) => ({
        jsx: true,
        remarkPlugins: [[remarkCodeHike, chConfig]],
        recmaPlugins: [[recmaCodeHike, chConfig], X],
      }))
    case "compiled-js-dev":
      return await compileJS(file, {
        jsx: false,
        development: true,
        remarkPlugins: [[remarkCodeHike, chConfig]],
        recmaPlugins: [[recmaCodeHike, chConfig]],
      })
    case "compiled-js":
      return await compileJS(file, {
        jsx: false,
        remarkPlugins: [[remarkCodeHike, chConfig]],
        recmaPlugins: [[recmaCodeHike, chConfig]],
      })
    case "compiled-jsx":
      return await compileJS(file, {
        jsx: true,
        remarkPlugins: [[remarkCodeHike, chConfig]],
        recmaPlugins: [[recmaCodeHike, chConfig]],
      })
    case "compiled-function":
      return await compileJS(file, {
        jsx: true,
        outputFormat: "function-body",
        remarkPlugins: [[remarkCodeHike, chConfig]],
        recmaPlugins: [[recmaCodeHike, chConfig]],
      })
    case "parsed-jsx":
      return await parsedJS(file, {
        remarkPlugins: [[remarkCodeHike, chConfig]],
        recmaPlugins: [[recmaCodeHike, chConfig]],
      })
    case "rendered":
      return await renderHTML(
        file,
        {
          remarkPlugins: [[remarkCodeHike, chConfig]],
          recmaPlugins: [[recmaCodeHike, chConfig]],
          jsx: false,
        },
        render,
      )
    case "rendered-dev":
      return await renderHTML(
        file,
        {
          remarkPlugins: [[remarkCodeHike, chConfig]],
          recmaPlugins: [[recmaCodeHike, chConfig]],
          jsx: false,
          development: true,
        },
        render,
      )
    default:
      throw new Error(`Unknown snapshot: ${step}`)
  }
}
