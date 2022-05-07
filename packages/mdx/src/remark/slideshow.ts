import {
  visitAsync,
  toJSX,
  CH_CODE_CONFIG_PLACEHOLDER,
} from "./unist-utils"
import { extractStepsInfo } from "./steps"
import { getPresetConfig } from "./preview"
import { JsxNode, SuperNode } from "./nodes"

export async function transformSlideshows(
  tree: SuperNode,
  config: { theme: any }
) {
  await visitAsync(
    tree,
    "mdxJsxFlowElement",
    async (node: JsxNode) => {
      if (node.name === "CH.Slideshow") {
        await transformSlideshow(node, config)
      }
    }
  )
}
async function transformSlideshow(
  node: SuperNode,
  { theme }: { theme: any }
) {
  const editorSteps = await extractStepsInfo(
    node,
    { theme },
    "merge step with previous"
  )

  const presetConfig = await getPresetConfig(
    (node as any).attributes
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
