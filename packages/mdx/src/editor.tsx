import visit from "unist-util-visit"
import { Node, Parent } from "unist"
import { visitAsync, toJSX } from "./unist-utils"
import { transformCodeFile } from "./code"

export async function transformEditorNodes(
  tree: Node,
  { theme }: { theme: any }
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
            transformCodeFile(node, index, parent, {
              theme,
            })
          )
        )
        const southFiles = await Promise.all(
          southNodes.map(([node, index, parent]) =>
            transformCodeFile(node, index, parent, {
              theme,
            })
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
