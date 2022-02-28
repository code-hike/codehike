import visit from "unist-util-visit"
import { Node, Parent } from "unist"
import { visitAsync, toJSX } from "./unist-utils"
import { isEditorNode, mapAnyCodeNode } from "./code"

export async function transformSections(
  tree: Node,
  config: { theme: any }
) {
  await visitAsync(
    tree,
    "mdxJsxFlowElement",
    async sectionNode => {
      if (sectionNode.name === "CH.Section") {
        await transformSection(sectionNode, config)
      }
    }
  )
}

async function transformSection(
  node: Node,
  config: { theme: any }
) {
  let props
  await visitAsync(
    node,
    ["mdxJsxFlowElement", "code"],
    async (node, index, parent) => {
      if (isEditorNode(node)) {
        props = await mapAnyCodeNode(
          { node, index, parent: parent! },
          config
        )
        toJSX(node, { name: "CH.SectionCode", props: {} })
      }
    }
  )

  transformLinks(node)

  if (props) {
    toJSX(node, { name: "CH.Section", props: props as any })
  } else {
    toJSX(node, { name: "div", props: {} })
  }
}

export function transformLinks(tree: Node) {
  visit(tree, "link", (linkNode: any) => {
    const url = decodeURI(linkNode["url"])
    if (url.startsWith("focus://")) {
      const [firstPart, secondPart] = decodeURI(url)
        .substr("focus://".length)
        .split("#")
      const hasFile = Boolean(secondPart)
      const props = hasFile
        ? { file: firstPart, focus: secondPart, id: url }
        : { focus: firstPart, id: url }
      toJSX(linkNode, {
        type: "mdxJsxTextElement",
        name: "CH.SectionLink",
        props,
      })
    }
  })
}
