import visit from "unist-util-visit"
import { Node, Parent } from "unist"
import { highlight } from "@code-hike/highlighter"
import { extractLinks } from "./links"
import { visitAsync, toJSX } from "./unist-utils"

export function remarkCodeHike({ theme }: { theme: any }) {
  return async function transformer(tree: Node) {
    let useCodeComponent = false
    visit(tree, "mdxjsEsm", node => {
      if (
        // TODO too fragile:
        node.value === `import { CH } from "@code-hike/mdx"`
      ) {
        useCodeComponent = true
      }
    })
    if (!useCodeComponent) {
      return
    }

    transformSections(tree)

    await transformEditorNodes(tree, theme)
    await transformCodeNodes(tree, theme)
  }
}

function transformSections(tree: Node) {
  visit(tree, "mdxJsxFlowElement", sectionNode => {
    if (sectionNode.name === "CH.Section")
      visit(sectionNode, "link", (linkNode: any) => {
        const url = decodeURI(linkNode["url"])
        if (url.startsWith("focus://")) {
          const focus = url.slice(8)
          toJSX(linkNode, {
            type: "mdxJsxTextElement",
            name: "CH.SectionLink",
            props: { focus },
          })
        }
      })
  })
}

async function transformEditorNodes(
  tree: Node,
  theme: any
) {
  await visitAsync(
    tree,
    "mdxJsxFlowElement",
    async (editorNode, index, parent) => {
      if (editorNode.name === "CH.Code") {
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

        editorNode.children = []
        toJSX(editorNode, {
          name: "CH.Code",
          props: { northFiles, southFiles, theme },
        })
      }
    }
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

      node.children = []
      toJSX(node, {
        name: "CH.Code",
        props: { northFiles: [file], theme },
      })
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
