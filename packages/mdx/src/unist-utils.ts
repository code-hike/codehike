import { Node, Parent } from "unist"
import visit from "unist-util-visit"

export async function visitAsync(
  tree: Node,
  type: string | string[],
  visitor: (
    node: Node,
    index: number,
    parent: Parent | undefined
  ) => void | Promise<any>
) {
  const promises = [] as Promise<any>[]
  visit(tree, type, (node, index, parent) => {
    const result = visitor(node, index, parent)
    if (result) {
      promises.push(result)
    }
  })
  await Promise.all(promises)
}

export function toJSX(
  node: Node,
  {
    type = "mdxJsxFlowElement",
    props,
    name,
  }: {
    type?: string
    props: Record<string, any>
    name: string
  }
) {
  node.type = type
  node.name = name
  node.attributes = Object.keys(props).map(key => ({
    type: "mdxJsxAttribute",
    name: key,
    value: JSON.stringify(props[key]),
  }))
}
