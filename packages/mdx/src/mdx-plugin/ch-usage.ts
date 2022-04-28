import { JsxNode, SuperNode, visit } from "./nodes"

export function chUsage(tree: SuperNode) {
  const usage = []
  visit(
    tree,
    ["mdxJsxFlowElement", "mdxJsxTextElement"],
    (node: JsxNode) => {
      if (
        node.name &&
        node.name.startsWith("CH.") &&
        !usage.includes(node.name)
      ) {
        usage.push(node.name)
      }
    }
  )
  return usage
}
