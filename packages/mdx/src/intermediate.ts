import { Node, Parent } from "unist"
import { extractLinks } from "./links"
import { highlight } from "@code-hike/highlighter"

async function toFile(
  node: Node,
  index: number,
  parent: Parent,
  theme: any
) {
  const linkAnnotations = extractLinks(
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
  const meta =
    typeof node.meta === "string" ? node.meta : ""

  node.type = "chFiles"
  node.data = {
    meta,
    code,
    annotations: linkAnnotations,
  }
}

// transform(tree, "code[focus]", transformCode, { theme })
