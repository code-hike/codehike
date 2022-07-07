import { visitAsync, toJSX } from "./unist-utils"
import { extractStepsInfo } from "./steps"
import { getPresetConfig } from "./transform.preview"
import { JsxNode, SuperNode } from "./nodes"
import { CodeHikeConfig } from "./config"

export async function transformSlideshows(
  tree: SuperNode,
  config: CodeHikeConfig
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
  config: CodeHikeConfig
) {
  const { editorSteps, hasPreviewSteps } =
    await extractStepsInfo(
      node,
      config,
      "merge step with previous"
    )

  const presetConfig = await getPresetConfig(
    (node as any).attributes
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
