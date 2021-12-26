import { visitAsync, toJSX } from "./unist-utils"
import { Node, Parent } from "unist"
import { extractStepsInfo } from "./steps"
import { getPresetConfig } from "./preview"

export async function transformSlideshows(
  tree: Node,
  config: { theme: any }
) {
  await visitAsync(
    tree,
    "mdxJsxFlowElement",
    async node => {
      if (node.name === "CH.Slideshow") {
        await transformSlideshow(node, config)
      }
    }
  )
}
async function transformSlideshow(
  node: Node,
  { theme }: { theme: any }
) {
  const editorSteps = await extractStepsInfo(
    node as Parent,
    { theme },
    "merge step with previous"
  )

  const presetConfig = await getPresetConfig(
    (node as any).attributes
  )

  toJSX(node, {
    props: {
      codeConfig: { theme },
      editorSteps: editorSteps,
      presetConfig,
    },
    appendProps: true,
  })
}
