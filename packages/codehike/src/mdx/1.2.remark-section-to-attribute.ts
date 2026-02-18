import { MdxJsxAttribute, MdxJsxFlowElement } from "mdast-util-mdx-jsx"
import { HikeSection, JSXChild } from "./1.1.remark-list-to-section.js"
import { getObjectAttribute } from "./estree.js"

export function sectionToAttribute(
  root: HikeSection,
  markdownEnabled: boolean,
  source?: string,
) {
  const children: JSXChild[] = getSectionContainers(root, "")

  const serializableTree = getSerializableNode(
    root,
    "",
    markdownEnabled,
    source,
  )

  return {
    children,
    attributes: [
      {
        type: "mdxJsxAttribute",
        name: "__hike",
        value: getObjectAttribute(serializableTree),
      } as MdxJsxAttribute,
    ],
  }
}

function getSerializableNode(
  section: HikeSection,
  path: string,
  markdownEnabled: boolean = false,
  source?: string,
) {
  const newPath = path ? [path, section.name].join(".") : section.name
  const node: any = {
    children: newPath,
    title: section.title,
    _data: section._data,
  }

  const markdown = computeSectionMarkdownFromContentNodes(
    section,
    markdownEnabled,
    source,
  )
  if (markdown !== undefined) {
    node.markdown = markdown
  }

  section.children.forEach((child) => {
    if (child.type === "content") {
      return
    }
    if (child.type === "section") {
      const childNode = getSerializableNode(
        child,
        newPath,
        markdownEnabled,
        source,
      )

      if (child.multi) {
        node[child.name] = node[child.name] || []
        node[child.name].push(childNode)
      } else {
        node[child.name] = childNode
      }
      return
    }

    let { name, index, multi, type, ...childNode } = child

    if (child.type === "quote") {
      childNode = child.value as any
    }

    if (multi) {
      node[name] = node[name] || []
      node[name].push(childNode)
    } else {
      node[name] = childNode
    }
  })

  return node
}

function computeSectionMarkdownFromContentNodes(
  section: HikeSection,
  markdownEnabled: boolean,
  source?: string,
): string | undefined {
  if (!markdownEnabled || source == null) {
    return undefined
  }

  let markdown: string | undefined
  let pendingBrCount = 0

  for (const child of section.children) {
    if (child.type !== "content") {
      continue
    }

    const contentNode = child.value

    if (isFlowBrElement(contentNode)) {
      pendingBrCount += 1
      continue
    }

    if (isParagraphNode(contentNode)) {
      let paragraph = sliceOriginalSourceByNodeOffset(source, contentNode)
      paragraph = paragraph.trimEnd()

      if (paragraph === "") {
        continue
      }

      if (markdown === undefined) {
        // First paragraph in this section.
        // Each preceding flow-level <br /> adds one leading newline.
        const leadingNewlines =
          pendingBrCount > 0 ? "\n".repeat(pendingBrCount) : ""
        markdown = leadingNewlines + paragraph
      } else {
        // For each paragraph after the first:
        // Add one newline by default, plus one extra newline for each
        // flow-level <br /> seen since the previous paragraph.
        const newlineCount = 1 + pendingBrCount
        markdown += "\n".repeat(newlineCount) + paragraph
      }

      // Reset pending flow-level <br /> spacing after applying it to this paragraph.
      pendingBrCount = 0
    }
  }

  if (markdown !== undefined && pendingBrCount > 0) {
    markdown += "\n".repeat(pendingBrCount)
  }

  return markdown
}

function sliceOriginalSourceByNodeOffset(
  source: string,
  node: JSXChild,
): string {
  const start = node.position?.start?.offset
  const end = node.position?.end?.offset

  if (typeof start !== "number" || typeof end !== "number") {
    return ""
  }

  return source.slice(start, end)
}

function isParagraphNode(node: JSXChild): boolean {
  return node.type === "paragraph"
}

function isFlowBrElement(node: JSXChild): boolean {
  return (
    node.type === "mdxJsxFlowElement" &&
    typeof node.name === "string" &&
    node.name.toLowerCase() === "br"
  )
}

function getSectionContainers(section: HikeSection, path: string) {
  const newPath = path ? [path, section.name].join(".") : section.name
  const children: JSXChild[] = [sectionContainer(section, newPath)]
  section.children
    .filter((child) => child.type === "section")
    .forEach((child) => {
      children.push(...getSectionContainers(child as HikeSection, newPath))
    })
  return children
}

function sectionContainer(section: HikeSection, path: string): JSXChild {
  return {
    type: "mdxJsxFlowElement",
    name: "slot",
    attributes: [
      {
        type: "mdxJsxAttribute",
        name: "path",
        value: path,
      },
    ],
    children: sectionChildren(section),
  }
}

function sectionChildren(section: HikeSection) {
  const elements = section.children
    .map((child) => {
      if (child.type === "content") {
        return child.value
      }
      if (child.type === "section") {
        return placeholder(child)
      }
    })
    .filter((x) => !!x) as JSXChild[]

  const child: JSXChild =
    elements.length == 1
      ? elements[0]
      : {
          // wrap elemts in fragment
          type: "mdxJsxFlowElement",
          name: null,
          attributes: [],
          children: elements,
        }

  return child ? [child] : []
}

function placeholder(node: HikeSection) {
  const { name, index } = node
  const startsWithLowercase =
    name && name.charAt(0) === name.charAt(0).toLowerCase()
  if (startsWithLowercase) {
    return null
  }

  const attributes: MdxJsxFlowElement["attributes"] = [
    {
      type: "mdxJsxAttribute",
      name: "title",
      value: node.title,
    },
  ]
  if (index != null) {
    attributes.push({
      type: "mdxJsxAttribute",
      name: "index",
      value: {
        type: "mdxJsxAttributeValueExpression",
        value: index.toString(),
        data: {
          estree: {
            type: "Program",
            body: [
              {
                type: "ExpressionStatement",
                expression: {
                  type: "Literal",
                  value: index,
                  raw: index.toString(),
                },
              },
            ],
            sourceType: "module",
            comments: [],
          },
        },
      },
    })
  }
  return {
    type: "mdxJsxFlowElement",
    name: name,
    attributes,
    children: sectionChildren(node),
  } as JSXChild
}
