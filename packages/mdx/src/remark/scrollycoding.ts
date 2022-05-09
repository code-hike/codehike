import {
  visitAsync,
  toJSX,
  CH_CODE_CONFIG_PLACEHOLDER,
} from "./unist-utils"
import { extractStepsInfo } from "./steps"
import { getPresetConfig } from "./transform.preview"
import { transformLinks } from "./section"
import { SuperNode } from "./nodes"
import { CodeHikeConfig } from "./config"

export async function transformScrollycodings(
  tree: SuperNode,
  config: CodeHikeConfig
) {
  await visitAsync(
    tree,
    "mdxJsxFlowElement",
    async (node: any) => {
      if (node.name === "CH.Scrollycoding") {
        await transformScrollycoding(node, config)
      }
    }
  )
}
async function transformScrollycoding(
  node: SuperNode,
  config: CodeHikeConfig
) {
  const editorSteps = await extractStepsInfo(
    node,
    config,
    "merge step with previous"
  )

  const presetConfig = await getPresetConfig(
    (node as any).attributes
  )

  transformLinks(node)

  toJSX(node, {
    props: {
      codeConfig: CH_CODE_CONFIG_PLACEHOLDER,
      editorSteps: editorSteps,
      presetConfig,
    },
    appendProps: true,
  })
}
