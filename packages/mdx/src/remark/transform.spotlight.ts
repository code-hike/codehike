import { visitAsync, toJSX } from "./unist-utils"
import { extractStepsInfo } from "./steps"
import { getPresetConfig } from "./transform.preview"
import { JsxNode, SuperNode } from "./nodes"
import { CodeHikeConfig } from "./config"

export async function transformSpotlights(
  tree: SuperNode,
  config: CodeHikeConfig
) {
  await visitAsync(
    tree,
    "mdxJsxFlowElement",
    async (node: JsxNode) => {
      if (node.name === "CH.Spotlight") {
        await transformSpotlight(node, config)
      }
    }
  )
}

async function transformSpotlight(
  node: JsxNode,
  config: CodeHikeConfig
) {
  const editorSteps = await extractStepsInfo(
    node,
    config,
    "merge steps with header"
  )

  const presetConfig = await getPresetConfig(
    node.attributes
  )

  toJSX(node, {
    props: {
      editorSteps: editorSteps,
      presetConfig,
    },
    appendProps: true,
    addConfigProp: true,
  })
}
