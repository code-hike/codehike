import { transformCodes } from "./transform.code"
import { transformSections } from "./transform.section"
import { transformSpotlights } from "./transform.spotlight"
import { transformScrollycodings } from "./transform.scrollycoding"
import { transformSlideshows } from "./transform.slideshow"
import { transformInlineCodes } from "./transform.inline-code"
import { transformPreviews } from "./transform.preview"

import { valueToEstree } from "./to-estree"
import { CH_CODE_CONFIG_VAR_NAME } from "./unist-utils"
import { JsxNode, SuperNode, visit } from "./nodes"
import { addConfigDefaults, CodeHikeConfig } from "./config"

const transforms = [
  transformPreviews,
  transformScrollycodings,
  transformSpotlights,
  transformSlideshows,
  transformSections,
  transformInlineCodes,
  transformCodes,
]
export function transform(unsafeConfig: CodeHikeConfig) {
  return async (tree: SuperNode, file: any) => {
    const config = addConfigDefaults(
      unsafeConfig,
      file?.cwd,
      file?.history
        ? file.history[file.history.length - 1]
        : undefined
    )

    try {
      for (const transform of transforms) {
        await transform(tree, config)
      }

      const usedCodeHikeComponents =
        getUsedCodeHikeComponentNames(tree)

      if (usedCodeHikeComponents.length > 0) {
        addConfig(tree, config)

        if (config.autoImport) {
          addSmartImport(tree, usedCodeHikeComponents)
        }
      }
    } catch (e) {
      console.error("error running remarkCodeHike", e)
      throw e
    }
  }
}

/**
 * Returns a the list of component names
 * used inside the tree
 * that looks like `<CH.* />`
 */
function getUsedCodeHikeComponentNames(
  tree: SuperNode
): string[] {
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

/**
 * Creates a `chCodeConfig` variable node in the tree
 * so that the components can access the config
 */
function addConfig(
  tree: SuperNode,
  config: CodeHikeConfig
) {
  tree.children.unshift({
    type: "mdxjsEsm",
    value: `export const ${CH_CODE_CONFIG_VAR_NAME} = {}`,
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

/**
 * Add an import node at the start of the tree
 * importing all the components used
 */
function addSmartImport(
  tree: SuperNode,
  componentNames: string[]
) {
  const specifiers = [
    "annotations",
    ...componentNames.map(name => name.slice("CH.".length)),
  ]

  tree.children.unshift({
    type: "mdxjsEsm",
    value: `export const CH = { ${specifiers.join(", ")} }`,
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
                    name: "CH",
                  },
                  init: {
                    type: "ObjectExpression",
                    properties: specifiers.map(
                      specifier => ({
                        type: "Property",
                        method: false,
                        shorthand: true,
                        computed: false,
                        key: {
                          type: "Identifier",
                          name: specifier,
                        },
                        kind: "init",
                        value: {
                          type: "Identifier",
                          name: specifier,
                        },
                      })
                    ),
                  },
                },
              ],
              kind: "const",
            },
            specifiers: [],
            source: null,
          },
        ],
        sourceType: "module",
        comments: [],
      },
    },
  })

  tree.children.unshift({
    type: "mdxjsEsm",
    value: `import { ${specifiers.join(
      ", "
    )} } from "@code-hike/mdx/dist/components.cjs.js"`,
    data: {
      estree: {
        type: "Program",
        body: [
          {
            type: "ImportDeclaration",

            specifiers: specifiers.map(specifier => ({
              type: "ImportSpecifier",
              imported: {
                type: "Identifier",
                name: specifier,
              },
              local: {
                type: "Identifier",
                name: specifier,
              },
            })),
            source: {
              type: "Literal",
              value:
                "@code-hike/mdx/dist/components.cjs.js",
              raw: '"@code-hike/mdx/dist/components.cjs.js"',
            },
          },
        ],
        sourceType: "module",
      },
    },
  })
}
