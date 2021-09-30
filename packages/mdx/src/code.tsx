import visit from "unist-util-visit"
import { Node, Parent } from "unist"
import { highlight } from "@code-hike/highlighter"
import { extractLinks } from "./links"
import { visitAsync, toJSX } from "./unist-utils"

export async function transformCodeNodes(
  tree: Node,
  { theme }: { theme: any }
) {
  await visitAsync(
    tree,
    "code",
    async (node, index, parent) => {
      const file = await transformCodeFile(
        node,
        index,
        parent!,
        { theme }
      )

      node.children = []
      toJSX(node, {
        name: "CH.Code",
        props: { northFiles: [file], theme },
      })
    }
  )
}

export async function transformCodeFile(
  node: Node,
  index: number,
  parent: Parent,
  { theme }: { theme: any }
) {
  const annotations = extractLinks(
    node,
    index,
    parent,
    node.value as string
  )

  const code = await highlight({
    code: node.value as string,
    lang: node.lang as string,
    theme,
  })

  return {
    meta: typeof node.meta === "string" ? node.meta : "",
    code,
    annotations,
  }
}
