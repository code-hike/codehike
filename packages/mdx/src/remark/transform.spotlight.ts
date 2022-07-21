import { visitAsync, toJSX } from "./unist-utils"
import { extractStepsInfo } from "./steps"
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
  const { editorSteps, hasPreviewSteps, presetConfig } =
    await extractStepsInfo(
      node,
      config,
      "merge steps with header"
    )

  toJSX(node, {
    props: {
      editorSteps: editorSteps,
      presetConfig,
      hasPreviewSteps,
    },
    appendProps: true,
    addConfigProp: true,
  })
}
