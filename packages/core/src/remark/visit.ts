import { visit } from "unist-util-visit"

export async function visitAsync(tree, test, visitor) {
  const promises = []
  visit(tree, test, node => {
    promises.push(visitor(node))
  })
  await Promise.all(promises)
}
