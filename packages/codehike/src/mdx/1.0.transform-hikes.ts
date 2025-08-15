import { Root } from "mdast"
import { MdxJsxAttribute, MdxJsxFlowElement } from "mdast-util-mdx-jsx"
import { visit } from "unist-util-visit"
import { isHikeElement, listToSection } from "./1.1.remark-list-to-section.js"
import { sectionToAttribute } from "./1.2.remark-section-to-attribute.js"
import { CodeHikeConfig } from "./config.js"

/**
 * Determines whether Markdown is enabled for the given MDX JSX element.
 *
 * This function checks for the presence of a `markdownEnabled` attribute:
 * - If no attribute is found, it returns `false`.
 * - If the attribute is present in shorthand form (e.g. `<SomeTag
 *   markdownEnabled>`), it returns `true`.
 * - If the attribute is an MDX expression (e.g. `<SomeTag
 *   markdownEnabled={true} />`), it checks if the raw expression text is
 *   literally `"true"`.
 */
export function isMarkdownEnabled(node: MdxJsxFlowElement): boolean {
  // Look for the "markdownEnabled" attribute within the node’s attributes.
  const markdownEnabledAttr = node.attributes.find(
    (attr): attr is MdxJsxAttribute =>
      attr.type === "mdxJsxAttribute" && attr.name === "markdownEnabled",
  )

  if (!markdownEnabledAttr) return false

  // Shorthand (<Component markdownEnabled>) implies true.
  if (markdownEnabledAttr.value === null) return true

  // If the attribute value is an object, it indicates an MDX expression
  // (e.g. markdownEnabled={true}). The `.value` property on this object is the
  // raw string representation of the expression, so we check if it’s
  // literally "true".
  if (
    typeof markdownEnabledAttr.value === "object" &&
    markdownEnabledAttr.value.type === "mdxJsxAttributeValueExpression"
  ) {
    return markdownEnabledAttr.value.value.trim() === "true"
  }

  return false
}

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
  const markdownEnabled = isMarkdownEnabled(node)

  const section = await listToSection(node, config)
  const { children, attributes } = sectionToAttribute(section, markdownEnabled)

  node.children = children
  node.attributes.push(...attributes)

  return node
}
