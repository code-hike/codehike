import visit from "unist-util-visit"
import { Node, Parent } from "unist"
import { highlight } from "@code-hike/highlighter"
import { extractLinks } from "./links"

export function remarkCodeHike({ theme }: { theme: any }) {
  return async function transformer(tree: Node) {
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

    await transformCodeNodes(tree, theme)
  }
}

async function transformEditorNodes(
  tree: Node,
  theme: any
) {
  const editorNodes = [] as [Node, number, Parent][]
  visit(
    tree,
    "mdxJsxFlowElement",
    (node, index, parent) => {
      if (node.name === "Code")
        editorNodes.push([node, index, parent!])
    }
  )
}

async function transformCodeNodes(tree: Node, theme: any) {
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
            typeof node.meta === "string" ? node.meta : "",
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
