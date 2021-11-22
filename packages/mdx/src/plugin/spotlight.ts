import { visitAsync, toJSX } from "./unist-utils"
import { Node, Parent } from "unist"
import { extractStepsInfo } from "./steps"
import { getPresetConfig } from "./preview"

export async function transformSpotlights(
  tree: Node,
  config: { theme: any }
) {
  await visitAsync(
    tree,
    "mdxJsxFlowElement",
    async node => {
      if (node.name === "CH.Spotlight") {
        await transformSpotlight(node, config)
      }
    }
  )
}

async function transformSpotlight(
  node: Node,
  { theme }: { theme: any }
) {
  const editorSteps = await extractStepsInfo(
    node as Parent,
    { theme },
    "merge steps with header"
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
