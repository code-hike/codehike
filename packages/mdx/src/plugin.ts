import { Node, Parent } from "unist"
import { transformCodeNodes } from "./plugin/code"
import { transformEditorNodes } from "./plugin/editor"
import { transformSections } from "./plugin/section"
import { transformSpotlights } from "./plugin/spotlight"
import { transformScrollycodings } from "./plugin/scrollycoding"
import visit from "unist-util-visit"
import { transformSlideshows } from "./plugin/slideshow"
import { valueToEstree } from "./plugin/to-estree"
import { CH_CODE_CONFIG_VAR_NAME } from "./plugin/unist-utils"
import { transformPreviews } from "./plugin/preview"
import { transformInlineCodes } from "./plugin/inline-code"

type CodeHikeConfig = {
  theme: any
  lineNumbers?: boolean
}

export function remarkCodeHike(config: CodeHikeConfig) {
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

    addConfig(tree as Parent, config)

    if (!hasCodeHikeImport) {
      addImportNode(tree as Parent)
    }

    try {
      await transformInlineCodes(tree)
      await transformPreviews(tree)
      await transformScrollycodings(tree, config)
      await transformSpotlights(tree, config)
      await transformSlideshows(tree, config)
      await transformSections(tree, config)
      await transformEditorNodes(tree, config)
      await transformCodeNodes(tree, config)
    } catch (e) {
      console.error("error running remarkCodeHike", e)
      throw e
    }
  }
}

function addConfig(tree: Parent, config: CodeHikeConfig) {
  tree.children.unshift({
    type: "mdxjsEsm",
    value: "export const chCodeConfig = {}",
    data: {
      estree: {
        type: "Program",
        body: [
          {
            type: "ExportNamedDeclaration",
            declaration: {
              type: "VariableDeclaration",
              declarations: [
                {
                  type: "VariableDeclarator",
                  id: {
                    type: "Identifier",
                    name: CH_CODE_CONFIG_VAR_NAME,
                  },
                  init: valueToEstree(config),
                },
              ],
              kind: "const",
            },
            specifiers: [],
            source: null,
          },
        ],
        sourceType: "module",
      },
    },
  })
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
