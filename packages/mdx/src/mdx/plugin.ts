import { Node, Parent } from "unist"
import { transformCodeNodes } from "../mdx-plugin/code"
import { transformEditorNodes } from "../mdx-plugin/editor"
import { transformSections } from "../mdx-plugin/section"
import { transformSpotlights } from "../mdx-plugin/spotlight"
import { transformScrollycodings } from "../mdx-plugin/scrollycoding"
import visit from "unist-util-visit"
import { transformSlideshows } from "../mdx-plugin/slideshow"
import { valueToEstree } from "../mdx-plugin/to-estree"
import { CH_CODE_CONFIG_VAR_NAME } from "../mdx-plugin/unist-utils"
import { transformPreviews } from "../mdx-plugin/preview"
import { transformInlineCodes } from "../mdx-plugin/inline-code"

type CodeHikeConfig = {
  theme: any
  lineNumbers?: boolean
  autoImport?: boolean
}

export function remarkCodeHike(
  unsafeConfig: CodeHikeConfig
) {
  return async (tree: Node) => {
    const config = addConfigDefaults(unsafeConfig)
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

    if (config.autoImport && !hasCodeHikeImport) {
      addImportNode(tree as Parent)
    }

    try {
      await transformPreviews(tree)
      await transformScrollycodings(tree, config)
      await transformSpotlights(tree, config)
      await transformSlideshows(tree, config)
      await transformSections(tree, config)
      await transformInlineCodes(tree, config)
      await transformEditorNodes(tree, config)
      await transformCodeNodes(tree, config)
    } catch (e) {
      console.error("error running remarkCodeHike", e)
      throw e
    }
  }
}

function addConfigDefaults(
  config: Partial<CodeHikeConfig> | undefined
): CodeHikeConfig {
  return {
    ...config,
    theme: config?.theme || {},
    autoImport: config?.autoImport === false ? false : true,
  }
}

function addConfig(
  tree: Parent<any>,
  config: CodeHikeConfig
) {
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

function addImportNode(tree: Parent<any>) {
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
              value: "@code-hike/mdx/components",
              raw: '"@code-hike/mdx/components"',
            },
          },
        ],
        sourceType: "module",
      },
    },
  })
}
