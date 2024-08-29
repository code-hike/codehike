import * as prettier from "prettier"
import { compile, CompileOptions, run } from "@mdx-js/mdx"
import { Pluggable } from "unified"
import * as runtime from "react/jsx-runtime"
import * as devRuntime from "react/jsx-dev-runtime"
import { parse } from "../src/"
import { renderToReadableStream } from "react-dom/server.edge"
import React from "react"
import { AnnotationHandler, RawCode } from "../src/code/types"
import { highlight, Inline, InnerLine, Pre } from "../src/code"
import { MDXContent } from "mdx/types"

export type MDFile = {
  value: string
  history: string[]
}

const ignoreProperties = ["start", "end", "position", "loc", "range"]

export async function compileAST(
  file: MDFile,
  config: (X: Pluggable) => CompileOptions,
) {
  let ast: any

  const options = config(() => (tree) => {
    ast = tree
  })

  await compile(file, options)

  return await prettier.format(
    JSON.stringify(ast, (key, value) =>
      ignoreProperties.includes(key) ? undefined : value,
    ),
    {
      semi: false,
      parser: "json",
    },
  )
}

export async function compileJS(file: MDFile, options: CompileOptions) {
  const r = await compile(file, options)
  return await prettier.format(String(r), {
    semi: false,
    parser: "babel",
  })
}

export async function parsedJS(file: MDFile, options: CompileOptions) {
  const result = await compile(file, {
    ...options,
    outputFormat: "function-body",
    jsx: false,
  })
  const { default: Content } = await run(
    result,
    (options.development ? devRuntime : runtime) as any,
  )
  const block = parse(Content)
  return { block }
}

export async function renderHTML(
  file: MDFile,
  options: CompileOptions,
  render: (Content: MDXContent) => any = defaultRender,
) {
  const result = await compile(file, {
    ...options,
    outputFormat: "function-body",
  })
  const { default: Content } = await run(
    result,
    (options.development ? devRuntime : runtime) as any,
  )

  const html = await rscToHTML(render(Content))
  return html
}

function defaultRender(Content: MDXContent) {
  // @ts-ignore
  return <Content components={{ MyCode, InlineCode }} />
}

async function MyCode({ codeblock }: { codeblock: RawCode }) {
  const highlighted = await highlight(codeblock, "github-dark")
  return <Pre code={highlighted} handlers={[handler]} />
}

async function InlineCode({ codeblock }: { codeblock: RawCode }) {
  const highlighted = await highlight(codeblock, "github-dark")
  return <Inline code={highlighted} style={highlighted.style} />
}

const handler: AnnotationHandler = {
  name: "m",
  Pre: ({ _stack, ...props }) => <section {...props} />,
  AnnotatedLine: ({ annotation, ...props }) => (
    <InnerLine merge={props} data-m={annotation.query || "0"} />
  ),
}

async function rscToHTML(children: any) {
  const stream = await renderToReadableStream(children)
  await stream.allReady
  const response = new Response(stream)
  const html = await response.text()

  return await prettier.format(html.replace(new RegExp("<!-- -->", "g"), ""), {
    htmlWhitespaceSensitivity: "ignore",
    parser: "html",
  })
}
