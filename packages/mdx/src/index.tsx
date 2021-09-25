import React from "react"
import visit from "unist-util-visit"
import { Node, Parent } from "unist"
import { CodeSpring } from "@code-hike/smooth-code"
import { EditorSpring } from "@code-hike/mini-editor"
import { highlight } from "@code-hike/highlighter"
import { extractLinks } from "./links"

export function Code({
  code,
  meta,
  theme,
  annotations,
}: {
  code: string
  meta: string
  theme: string
  annotations: string
}) {
  const { name, focus } = parseMetastring(meta)
  return name ? (
    <EditorSpring
      northPanel={{
        tabs: [name],
        active: name,
        heightRatio: 1,
      }}
      files={[
        {
          name,
          code: JSON.parse(code),
          focus,
          annotations: parseAnnotations(annotations),
        },
      ]}
      codeConfig={{ theme: JSON.parse(theme) }}
    />
  ) : (
    <CodeSpring
      config={{ theme: JSON.parse(theme) }}
      step={{
        code: JSON.parse(code),
        focus,
        annotations: parseAnnotations(annotations),
      }}
    />
  )
}

function parseAnnotations(annotations: string) {
  const list = JSON.parse(annotations) || []
  console.log({ list })
  return list.map(
    ({ type, ...rest }: { type: string }) => ({
      Component: CodeLink,
      ...rest,
    })
  )
}

function CodeLink({
  children,
  data,
}: {
  data: {
    url: string
    title: string | undefined
  }
  children: React.ReactNode
}) {
  return (
    <a
      href={data.url}
      target="_blank"
      rel="noopener noreferrer"
      title={data.title}
      style={{
        textDecoration: "underline",
        textDecorationStyle: "dotted",
      }}
    >
      {children}
    </a>
  )
}

export function remarkCodeHike({ theme }: { theme: any }) {
  return async function transformer(tree: Node) {
    // console.log(tree)
    let useCodeComponent = false
    visit(tree, "mdxjsEsm", node => {
      if (
        // TODO too fragile:
        node.value ===
        `import { Code } from "@code-hike/mdx"`
      ) {
        useCodeComponent = true
      }
    })

    if (!useCodeComponent) {
      return
    }

    const codeNodes = [] as [Node, number, Parent][]
    visit(tree, "code", (node, index, parent) => {
      codeNodes.push([node, index, parent!])
    })

    await Promise.all(
      codeNodes.map(async ([node, index, parent]) => {
        // links
        const annotations = extractLinks(
          node,
          index,
          parent,
          node.value as string
        )

        const code = await highlight({
          code: node.value as string,
          lang: node.lang as string,
          theme,
        })
        node.type = "mdxJsxFlowElement"
        node.name = "Code"
        node.attributes = [
          {
            type: "mdxJsxAttribute",
            name: "code",
            value: JSON.stringify(code),
          },
          {
            type: "mdxJsxAttribute",
            name: "meta",
            value:
              typeof node.meta === "string"
                ? node.meta
                : "",
          },
          {
            type: "mdxJsxAttribute",
            name: "theme",
            value: JSON.stringify(theme),
          },
          {
            type: "mdxJsxAttribute",
            name: "annotations",
            value: JSON.stringify(annotations),
          },
        ]
        node.children = []

        // console.log({ annotations })
      })
    )
  }
}

type FileOptions = {
  focus?: string
  active?: string
  hidden?: boolean
}
function parseMetastring(
  metastring: string
): { name: string | null } & FileOptions {
  const params = metastring.split(" ")
  const options = {} as FileOptions
  let name: string | null = null
  params.forEach(param => {
    const [key, value] = param.split("=")
    if (value != null) {
      ;(options as any)[key] = value
    } else if (name === null) {
      name = key
    } else {
      ;(options as any)[key] = true
    }
  })
  return { name, ...options }
}
