import { visitAsync } from "./unist-utils"
import { Node, Parent } from "unist"

export function Spotlight({}) {
  return "Hi Spotlight"
}

export async function transformSpotlights(
  tree: Node,
  config: { theme: any }
) {
  await visitAsync(
    tree,
    "mdxJsxFlowElement",
    async node => {
      if (node.name === "CH.Section") {
        await transformSection(node, config)
      }
    }
  )
}

async function transformSection(
  node: Node,
  config: { theme: any }
) {}
