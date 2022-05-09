import { visitAsync } from "./unist-utils"
import { transformEditor } from "./code"
import { JsxNode, SuperNode } from "./nodes"
import { CodeHikeConfig } from "./config"

export async function transformEditorNodes(
  tree: SuperNode,
  config: CodeHikeConfig
) {
  await visitAsync(
    tree,
    "mdxJsxFlowElement",
    async (node: JsxNode, index, parent) => {
      if (node.name === "CH.Code") {
        await transformEditor(
          { node, index, parent: parent! },
          config
        )
      }
    }
  )
}
