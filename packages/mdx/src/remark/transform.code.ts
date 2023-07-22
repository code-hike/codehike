import { NodeInfo, toJSX, visitAsync } from "./unist-utils"
import { isEditorNode, mapAnyCodeNode } from "./code"
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
      // here we check if we should skip it because of the language:
      if (isEditorNode(node, config)) {
        await transformCode({ node, index, parent }, config)
      }
    }
  )
}

async function transformCode(
  nodeInfo: NodeInfo,
  config: CodeHikeConfig
) {
  toJSX(nodeInfo.node, {
    name: "CH.Code",
    props: {
      editorStep: await mapAnyCodeNode(nodeInfo, config),
    },
    appendProps: true,
    addConfigProp: true,
  })
}
