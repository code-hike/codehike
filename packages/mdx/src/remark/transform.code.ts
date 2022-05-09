import { NodeInfo, toJSX, visitAsync } from "./unist-utils"
import { mapEditor } from "./code"
import { CodeNode, JsxNode, SuperNode } from "./nodes"
import { CodeHikeConfig } from "./config"

export async function transformCodes(
  tree: SuperNode,
  config: CodeHikeConfig
) {
  await visitAsync(
    tree,
    "mdxJsxFlowElement",
    async (node: JsxNode, index, parent) => {
      if (node.name === "CH.Code") {
        await transformCode({ node, index, parent }, config)
      }
    }
  )
  await visitAsync(
    tree,
    "code",
    async (node: CodeNode, index, parent) => {
      await transformCode({ node, index, parent }, config)
    }
  )
}

async function transformCode(
  nodeInfo: NodeInfo,
  config: CodeHikeConfig
) {
  toJSX(nodeInfo.node, {
    name: "CH.Code",
    props: await mapEditor(nodeInfo, config),
  })
}
