import {
  visitAsync,
  toJSX,
  CH_CODE_CONFIG_PLACEHOLDER,
} from "./unist-utils"
import { Node, Parent } from "unist"
import { extractStepsInfo } from "./steps"
import { getPresetConfig } from "./preview"

export async function transformScrollycodings(
  tree: Node,
  config: { theme: any }
) {
  await visitAsync(
    tree,
    "mdxJsxFlowElement",
    async node => {
      if (node.name === "CH.Scrollycoding") {
        await transformScrollycoding(node, config)
      }
    }
  )
}
async function transformScrollycoding(
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
      codeConfig: CH_CODE_CONFIG_PLACEHOLDER,
      editorSteps: editorSteps,
      presetConfig,
    },
    appendProps: true,
  })
}
