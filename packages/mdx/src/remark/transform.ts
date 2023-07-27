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

import type { Node } from "unist"
import { getThemeColors } from "@code-hike/lighter"
import { toGlobalConfig } from "core/types"

const transforms = [
  transformPreviews,
  transformScrollycodings,
  transformSpotlights,
  transformSlideshows,
  transformSections,
  transformInlineCodes,
  transformCodes,
]

type VFile = {
  history: string[]
  cwd: string
}

type Transformer = (
  node: Node,
  file: VFile
) => Promise<void>

type CodeHikeRemarkPlugin = (
  config: CodeHikeConfig
) => Transformer

export const attacher: CodeHikeRemarkPlugin =
  unsafeConfig => {
    return async (tree: SuperNode, file: VFile) => {
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
          await addConfig(tree, config)

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

const styleCache = new Map<string, string>()

async function getStyle(
  theme: CodeHikeConfig["theme"],
  themeName: string
) {
  if (styleCache.has(themeName)) {
    return styleCache.get(themeName)
  }
  const rules = await getCSSVariables(theme)
  const style = `[data-ch-theme="${themeName}"] \{  ${rules} \}`
  styleCache.set(themeName, style)
  return style
}

async function getCSSVariables(
  theme: CodeHikeConfig["theme"]
) {
  const themeColors = await getThemeColors(theme)

  if (!themeColors || typeof themeColors !== "object") {
    throw new Error(
      "[Code Hike error] Unknown theme format"
    )
  }
  let rules = ""
  for (const [first, value] of Object.entries(
    themeColors
  )) {
    if (!value) {
      continue
    }
    if (typeof value === "string") {
      rules += `--ch-t-${first}: ${value};`
    } else {
      for (const [second, svalue] of Object.entries(
        value
      )) {
        if (!svalue) {
          continue
        }
        rules += `--ch-t-${first}-${second}: ${svalue};`
      }
    }
  }
  return rules
}

/**
 * Creates a `chGlobalConfig` variable node in the tree
 * so that the components can access the config
 *
 * Also add a style tags with all the css variables with the theme colors
 */
async function addConfig(
  tree: SuperNode,
  config: CodeHikeConfig
) {
  const { theme } = config

  const globalConfig = toGlobalConfig(config)
  const style = await getStyle(
    theme,
    globalConfig.themeName
  )

  tree.children.unshift({
    type: "mdxJsxFlowElement",
    name: "style",
    attributes: [
      {
        type: "mdxJsxAttribute",
        name: "dangerouslySetInnerHTML",
        value: {
          type: "mdxJsxAttributeValueExpression",
          // value: `{ __html: "${style}" }`,
          data: {
            estree: {
              type: "Program",
              start: 34,
              end: 55,
              body: [
                {
                  type: "ExpressionStatement",
                  expression: {
                    type: "ObjectExpression",
                    properties: [
                      {
                        type: "Property",
                        method: false,
                        shorthand: false,
                        computed: false,
                        key: {
                          type: "Identifier",
                          name: "__html",
                        },
                        value: {
                          type: "Literal",
                          value: style,
                          // raw: `"${style}"`,
                        },
                        kind: "init",
                      },
                    ],
                  },
                },
              ],
              sourceType: "module",
            },
          },
        },
      },
    ],
    children: [],
    data: {
      _mdxExplicitJsx: true,
    },
  })
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
                  init: valueToEstree(globalConfig),
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
