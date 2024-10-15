import { Root } from "mdast"
import { MdxJsxFlowElement } from "mdast-util-mdx-jsx"
import { visit } from "unist-util-visit"
import { isHikeElement, listToSection } from "./1.1.remark-list-to-section.js"
import { sectionToAttribute } from "./1.2.remark-section-to-attribute.js"
import { CodeHikeConfig } from "./config.js"

export async function transformAllHikes(root: Root, config: CodeHikeConfig) {
  let tree = wrapInHike(root)

  const hikes: MdxJsxFlowElement[] = []

  visit(tree, "mdxJsxFlowElement", (node) => {
    if (node.children?.some(isHikeElement)) {
      hikes.push(node)
    }
  })

  await Promise.all(hikes.map((h) => transformRemarkHike(h, config)))

  return tree
}

function wrapInHike(root: Root) {
  // if we find any hikeable element outside of <Hike>s,
  // let's wrap everything in a <Hike>
  if (root.children?.some(isHikeElement)) {
    root.children = [
      {
        type: "mdxJsxFlowElement",
        name: "slot",
        attributes: [],
        // todo what is different between RootContent and (BlockContent | DefinitionContent)
        children: root.children as any,
      },
    ]
  }
  return root
}

async function transformRemarkHike(
  node: MdxJsxFlowElement,
  config: CodeHikeConfig,
) {
  const section = await listToSection(node, config)
  const { children, attributes } = sectionToAttribute(section)

  node.children = children
  node.attributes.push(...attributes)

  return node
}
