import { Node, Parent } from "unist"
import { transformCodeNodes } from "./plugin/code"
import { transformEditorNodes } from "./plugin/editor"
import { transformSections } from "./plugin/section"
import { transformSpotlights } from "./plugin/spotlight"
import { transformScrollycodings } from "./plugin/scrollycoding"
import visit from "unist-util-visit"
import { transformSlideshows } from "./plugin/slideshow"

export function remarkCodeHike({ theme }: { theme: any }) {
  return async (tree: Node) => {
    // TODO add opt-in config
    let hasCodeHikeImport = false
    visit(tree, "mdxjsEsm", (node: any) => {
      if (
        node.value.startsWith(
          `import { CH } from "@code-hike/mdx"`
        )
      ) {
        hasCodeHikeImport = true
      }
    })

    if (!hasCodeHikeImport) {
      addImportNode(tree as Parent)
    }

    try {
      await transformScrollycodings(tree, { theme })
      await transformSpotlights(tree, { theme })
      await transformSlideshows(tree, { theme })
      await transformSections(tree, { theme })
      await transformEditorNodes(tree, { theme })
      await transformCodeNodes(tree, { theme })
    } catch (e) {
      console.error("error running remarkCodeHike", e)
      throw e
    }
  }
}

function addImportNode(tree: Parent) {
  tree.children.unshift({
    type: "mdxjsEsm",
    value: 'import { CH } from "@code-hike/mdx"',
    data: {
      estree: {
        type: "Program",
        body: [
          {
            type: "ImportDeclaration",
            specifiers: [
              {
                type: "ImportSpecifier",
                imported: {
                  type: "Identifier",
                  name: "CH",
                },
                local: {
                  type: "Identifier",
                  name: "CH",
                },
              },
            ],
            source: {
              type: "Literal",
              value:
                "@code-hike/mdx/dist/components.cjs.js",
              raw:
                '"@code-hike/mdx/dist/components.cjs.js"',
            },
          },
        ],
        sourceType: "module",
      },
    },
  })
}
