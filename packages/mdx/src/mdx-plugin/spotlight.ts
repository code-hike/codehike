import {
  visitAsync,
  toJSX,
  CH_CODE_CONFIG_PLACEHOLDER,
} from "./unist-utils"
import { extractStepsInfo } from "./steps"
import { getPresetConfig } from "./preview"
import { JsxNode, SuperNode } from "./nodes"

export async function transformSpotlights(
  tree: SuperNode,
  config: { theme: any }
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
  { theme }: { theme: any }
) {
  const editorSteps = await extractStepsInfo(
    node,
    { theme },
    "merge steps with header"
  )

  const presetConfig = await getPresetConfig(
    node.attributes
  )

  toJSX(node, {
    props: {
      codeConfig: CH_CODE_CONFIG_PLACEHOLDER,
      editorSteps: editorSteps,
      presetConfig,
    },
    appendProps: true,
  })
}
