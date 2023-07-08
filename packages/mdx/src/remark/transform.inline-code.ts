import { visitAsync, toJSX } from "./unist-utils"
import { highlight } from "./lighter"
import { EditorStep } from "../mini-editor"
import { Code } from "../utils"
import { SuperNode, visit } from "./nodes"
import visitParents from "unist-util-visit-parents"
import { CodeHikeConfig } from "./config"

export async function transformInlineCodes(
  tree: SuperNode,
  { theme }: CodeHikeConfig
) {
  // transform *`foo`* to <CH.InlineCode>foo</CH.InlineCode>
  visit(tree, "emphasis", (node: any) => {
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
    async (node: any) => {
      if (node.name === "CH.InlineCode") {
        const inlinedCode = node.children[0].value as string
        const lang = node.attributes?.lang

        toJSX(node, {
          props: {
            code: await getCode(
              tree,
              node,
              inlinedCode,
              lang,
              theme
            ),
          },
          appendProps: true,
          addConfigProp: true,
        })
      }
    }
  )
}

async function getCode(
  tree: SuperNode,
  node: SuperNode,
  inlinedCode: string,
  lang: string | undefined,
  theme: any
) {
  const ancestors = getAncestors(tree, node)
  const sectionNode = ancestors.find(
    n => n.data?.editorStep
  )

  // if node isn't inside a section-like parent, use provided lang or "jsx"
  if (!sectionNode) {
    return await highlight({
      code: inlinedCode,
      lang: lang || "jsx",
      theme,
    })
  }

  const editorStep = sectionNode?.data
    ?.editorStep as any as EditorStep

  // if the same code is present in the editor step, use it
  const existingCode = getExistingCode(
    editorStep.files,
    inlinedCode
  )

  if (existingCode) {
    return existingCode
  }

  // or else, try to guess the language from somewhere
  const activeFile =
    editorStep.files?.find(
      f => f.name === editorStep.northPanel?.active
    ) || editorStep.files[0]

  const activeLang = activeFile?.code?.lang

  return await highlight({
    code: inlinedCode,
    lang: lang || activeLang || "jsx",
    theme,
  })
}

function getAncestors(
  tree: SuperNode,
  node: SuperNode
): SuperNode[] {
  let ancestors: SuperNode[] = []
  visitParents(tree, node as any, (node, nodeAncestors) => {
    ancestors = nodeAncestors as SuperNode[]
  })
  return ancestors
}

function getExistingCode(
  files: EditorStep["files"] | undefined,
  inlinedCode: string
): Code | undefined {
  if (!files) {
    return undefined
  }

  for (const file of files) {
    for (const line of file.code.lines) {
      const lineContent = line.tokens
        .map(t => t.content)
        .join("")
      const index = lineContent.indexOf(inlinedCode)
      if (index !== -1) {
        const tokens = sliceTokens(
          line,
          index,
          inlinedCode.length
        )
        return { lang: file.code.lang, lines: [{ tokens }] }
      }
    }
  }
  return undefined
}

/**
 * Slice a line of tokens from a given index to a given length
 * Turns ("[abc][de][fgh]", 2, 4) into "[c][de][f]")
 */
function sliceTokens(
  line: Code["lines"][0],
  start: number,
  length: number
) {
  const tokens = line.tokens
  let currentLength = 0

  let headTokens = [] as Code["lines"][0]["tokens"]

  // this for loop remove the unwanted prefix tokens and put the rest in headTokens
  for (
    let tokenIndex = 0;
    tokenIndex < tokens.length;
    tokenIndex++
  ) {
    if (currentLength === start) {
      headTokens = tokens.slice(tokenIndex)
      break
    }
    if (
      currentLength + tokens[tokenIndex].content.length >
      start
    ) {
      const newToken = {
        ...tokens[tokenIndex],
        content: tokens[tokenIndex].content.slice(
          start - currentLength
        ),
      }
      headTokens = [newToken].concat(
        tokens.slice(tokenIndex + 1)
      )
      break
    }
    currentLength += tokens[tokenIndex].content.length
  }
  // headTokens is now "[c][de][fgh]" (from the example above)
  currentLength = 0
  // this for loop remove the unwanted suffix tokens from headTokens
  for (
    let headTokenIndex = 0;
    headTokenIndex <= headTokens.length;
    headTokenIndex++
  ) {
    if (currentLength >= length) {
      return headTokens.slice(0, headTokenIndex)
    }
    const currentToken = headTokens[headTokenIndex]
    if (
      currentLength + currentToken.content.length >
      length
    ) {
      const newToken = {
        ...currentToken,
        content: currentToken.content.slice(
          0,
          length - currentLength
        ),
      }

      return headTokens
        .slice(0, headTokenIndex)
        .concat([newToken])
    }
    currentLength += currentToken.content.length
  }
  return []
}
