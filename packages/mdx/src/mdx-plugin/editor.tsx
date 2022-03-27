import { visitAsync } from "./unist-utils"
import { transformEditor } from "./code"
import { JsxNode, SuperNode } from "./nodes"

export async function transformEditorNodes(
  tree: SuperNode,
  { theme }: { theme: any }
) {
  await visitAsync(
    tree,
    "mdxJsxFlowElement",
    async (node: JsxNode, index, parent) => {
      if (node.name === "CH.Code") {
        await transformEditor(
          { node, index, parent: parent! },
          { theme }
        )
      }
    }
  )
}
