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

    await transformEditorNodes(tree, theme)
    await transformCodeNodes(tree, theme)
  }
}

async function transformEditorNodes(
  tree: Node,
  theme: any
) {
  const editorNodes = [] as [Node, number, Parent][]
  await visitAsync(
    tree,
    "mdxJsxFlowElement",
    async (editorNode, index, parent) => {
      if (editorNode.name === "Code") {
        const northNodes = [] as any[]
        const southNodes = [] as any[]
        let breakNode = false
        visit(
          editorNode,
          ["code", "thematicBreak"],
          (node, index, parent) => {
            if (node.type === "thematicBreak") {
              breakNode = true
              return
            }

            if (breakNode) {
              southNodes.push([node, index, parent])
            } else {
              northNodes.push([node, index, parent])
            }
          }
        )

        const northFiles = await Promise.all(
          northNodes.map(([node, index, parent]) =>
            transformCodeFile(node, index, parent, theme)
          )
        )
        const southFiles = await Promise.all(
          southNodes.map(([node, index, parent]) =>
            transformCodeFile(node, index, parent, theme)
          )
        )

        editorNode.type = "mdxJsxFlowElement"
        editorNode.name = "Code"
        editorNode.children = []
        editorNode.attributes = [
          {
            type: "mdxJsxAttribute",
            name: "northFiles",
            value: JSON.stringify(northFiles),
          },
          {
            type: "mdxJsxAttribute",
            name: "southFiles",
            value: JSON.stringify(southFiles),
          },
          {
            type: "mdxJsxAttribute",
            name: "theme",
            value: JSON.stringify(theme),
          },
        ]
      }
    }
  )

  await Promise.all(
    editorNodes.map(async ([editorNode, index, parent]) => {
      visit(editorNode, "code", (node, index, parent) => {})
    })
  )
}

async function transformCodeNodes(tree: Node, theme: any) {
  await visitAsync(
    tree,
    "code",
    async (node, index, parent) => {
      const file = await transformCodeFile(
        node,
        index,
        parent!,
        theme
      )
      node.type = "mdxJsxFlowElement"
      node.name = "Code"
      node.children = []
      node.attributes = [
        {
          type: "mdxJsxAttribute",
          name: "northFiles",
          value: JSON.stringify([file]),
        },
        {
          type: "mdxJsxAttribute",
          name: "theme",
          value: JSON.stringify(theme),
        },
      ]
    }
  )
}

async function transformCodeFile(
  node: Node,
  index: number,
  parent: Parent,
  theme: any
) {
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

  return {
    meta: typeof node.meta === "string" ? node.meta : "",
    code,
    annotations,
  }
}

async function visitAsync(
  tree: Node,
  type: string | string[],
  visitor: (
    node: Node,
    index: number,
    parent: Parent | undefined
  ) => void | Promise<any>
) {
  const promises = [] as Promise<any>[]
  visit(tree, type, (node, index, parent) => {
    const result = visitor(node, index, parent)
    if (result) {
      promises.push(result)
    }
  })
  await Promise.all(promises)
}
