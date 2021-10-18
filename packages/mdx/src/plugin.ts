import visit from "unist-util-visit"
import { Node } from "unist"
import { transformCodeNodes } from "./code"
import { transformEditorNodes } from "./editor"
import { transformSections } from "./section"
import { transformSpotlights } from "./spotlight"
import { transformScrollycodings } from "./scrollycoding"

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

    try {
      await transformScrollycodings(tree, { theme })
      await transformSpotlights(tree, { theme })
      await transformSections(tree, { theme })
      await transformEditorNodes(tree, { theme })
      await transformCodeNodes(tree, { theme })
    } catch (e) {
      console.error("error running remarkCodeHike", e)
      throw e
    }
  }
}
