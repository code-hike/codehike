import visit from "unist-util-visit"
import { Node } from "unist"
import { transformCodeNodes } from "./code"
import { transformEditorNodes } from "./editor"
import { transformSections } from "./section"

export function remarkCodeHike({ theme }: { theme: any }) {
  return async (tree: Node) => {
    let useCodeComponent = false
    visit(tree, "mdxjsEsm", node => {
      if (
        // TODO too fragile:
        node.value === `import { CH } from "@code-hike/mdx"`
      ) {
        useCodeComponent = true
      }
    })
    if (!useCodeComponent) {
      return
    }

    await transformSections(tree, { theme })
    await transformEditorNodes(tree, { theme })
    await transformCodeNodes(tree, { theme })
  }
}
