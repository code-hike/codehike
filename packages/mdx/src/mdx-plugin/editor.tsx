import { Node, Parent } from "unist"
import { visitAsync } from "./unist-utils"
import { transformEditor } from "./code"

export async function transformEditorNodes(
  tree: Node,
  { theme }: { theme: any }
) {
  await visitAsync(
    tree,
    "mdxJsxFlowElement",
    async (node, index, parent) => {
      if (node.name === "CH.Code") {
        await transformEditor(
          { node, index, parent: parent! },
          { theme }
        )
      }
    }
  )
}
