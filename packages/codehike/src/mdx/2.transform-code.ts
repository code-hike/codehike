import { Code, Root } from "mdast"
import { visit } from "unist-util-visit"
import { getObjectAttribute } from "./estree.js"
import { parseCode } from "./1.1.remark-list-to-section.js"
import { CodeHikeConfig } from "./config.js"

export async function transformAllCode(tree: Root, config: CodeHikeConfig) {
  const newTree = await transformAllInlineCode(tree, config)
  return transformAllCodeBlocks(newTree, config)
}

async function transformAllCodeBlocks(tree: Root, config: CodeHikeConfig) {
  if (!config.components?.code) {
    return tree
  }

  const nodes: Code[] = []
  visit(tree, "code", (node) => {
    if (config?.ignoreCode && config.ignoreCode(node as any)) {
      // ignoring this codeblock
      return
    }
    nodes.push(node)
  })

  await Promise.all(
    nodes.map(async (code: any) => {
      Object.assign(code, {
        type: "mdxJsxFlowElement",
        name: config?.components?.code || "Code",
        attributes: [
          {
            type: "mdxJsxAttribute",
            name: "codeblock",
            value: getObjectAttribute(await parseCode(code, config)),
          },
        ],
        children: [],
      })
      delete code.value
      delete code.lang
      delete code.meta
    }),
  )

  return tree
}

async function transformAllInlineCode(tree: Root, config: CodeHikeConfig) {
  if (!config.components?.inlineCode) {
    return tree
  }

  const promises: Promise<void>[] = []

  visit(tree, "emphasis", (node) => {
    if (
      // only nodes with one inlineCode child and maybe some text nodes
      !node.children ||
      node.children.filter((c) => c.type === "inlineCode").length !== 1 ||
      node.children.some((c) => c.type !== "inlineCode" && c.type !== "text")
    ) {
      return
    }

    const text = node.children
      .filter((c) => c.type === "text")
      .map((c: any) => c.value)
      .join(" ")
    const codeNode = node.children.find((c) => c.type === "inlineCode") as any
    const value = codeNode?.value || ""

    // split the first word from the rest
    const lang = text.split(/\s+/)[0]
    const meta = text.slice(lang.length).trim()

    promises.push(
      (async () => {
        const code = await parseCode(
          { value, lang: lang || "jsx", meta },
          config,
        )
        Object.assign(node, {
          type: "mdxJsxTextElement",
          name: config.components!.inlineCode,
          attributes: [
            {
              type: "mdxJsxAttribute",
              name: "codeblock",
              value: getObjectAttribute(code),
            },
          ],
          children: [],
        })
      })(),
    )
  })

  await Promise.all(promises)

  return tree
}
