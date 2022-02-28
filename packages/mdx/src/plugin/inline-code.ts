import {
  visitAsync,
  toJSX,
  CH_CODE_CONFIG_PLACEHOLDER,
} from "./unist-utils"
import { Node } from "unist"
import visit from "unist-util-visit"
import { Parent } from "hast-util-to-estree"
import { highlight } from "@code-hike/highlighter"

export async function transformInlineCodes(
  tree: Node,
  { theme }: { theme: any }
) {
  // transform *`foo`* to <CH.InlineCode>foo</CH.InlineCode>
  visit(tree, "emphasis", (node: Parent) => {
    if (
      node.children &&
      node.children.length === 1 &&
      node.children[0].type === "inlineCode"
    ) {
      node.type = "mdxJsxTextElement"
      node.name = "CH.InlineCode"
      node.children = [
        { type: "text", value: node.children[0].value },
      ]
    }
  })

  await visitAsync(
    tree,
    ["mdxJsxFlowElement", "mdxJsxTextElement"],
    async (node: Parent) => {
      if (node.name === "CH.InlineCode") {
        const code = await highlight({
          code: node.children[0].value as string,
          lang: "jsx",
          theme,
        })
        toJSX(node, {
          props: {
            code,
            codeConfig: CH_CODE_CONFIG_PLACEHOLDER,
          },
          appendProps: true,
        })
      }
    }
  )
}
