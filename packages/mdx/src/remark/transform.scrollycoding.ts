import { visitAsync, toJSX } from "./unist-utils"
import { extractStepsInfo } from "./steps"
import { transformLinks } from "./transform.section"
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
  const { editorSteps, hasPreviewSteps, presetConfig } =
    await extractStepsInfo(
      node,
      config,
      "merge step with previous"
    )

  transformLinks(node)

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
