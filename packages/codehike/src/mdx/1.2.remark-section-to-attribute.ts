import { MdxJsxAttribute, MdxJsxFlowElement } from "mdast-util-mdx-jsx"
import { toMarkdown } from "mdast-util-to-markdown"
import { HikeSection, JSXChild } from "./1.1.remark-list-to-section.js"
import { getObjectAttribute } from "./estree.js"

export function sectionToAttribute(
  root: HikeSection,
  markdownEnabled: boolean,
) {
  const children: JSXChild[] = getSectionContainers(root, "")

  const serializableTree = getSerializableNode(root, "", markdownEnabled)

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
) {
  const newPath = path ? [path, section.name].join(".") : section.name
  const node: any = {
    children: newPath,
    title: section.title,
    _data: section._data,
  }

  section.children.forEach((child) => {
    if (child.type === "content") {
      if (markdownEnabled) {
        // If Markdown is enabled, convert paragraph nodes into Markdown text
        // and accumulate them in the `node.markdown` property.
        if (child.value.type === "paragraph") {
          if (node.markdown == null) {
            node.markdown = toMarkdown(child.value)
          } else {
            node.markdown += toMarkdown(child.value)
          }
        }
      }
      return
    }
    if (child.type === "section") {
      const childNode = getSerializableNode(child, newPath, markdownEnabled)

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
