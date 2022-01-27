import {
  visitAsync,
  toJSX,
  CH_CODE_CONFIG_PLACEHOLDER,
} from "./unist-utils"
import { Node } from "unist"

export async function transformInlineCodes(tree: Node) {
  await visitAsync(
    tree,
    ["mdxJsxFlowElement", "mdxJsxTextElement"],
    async node => {
      if (node.name === "CH.InlineCode") {
        toJSX(node, {
          props: {
            codeConfig: CH_CODE_CONFIG_PLACEHOLDER,
          },
          appendProps: true,
        })
      }
    }
  )
}
