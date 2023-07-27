import { visitAsync, toJSX } from "./unist-utils"
import { isEditorNode, mapAnyCodeNode } from "./code"
import { SuperNode, visit } from "./nodes"
import { CodeHikeConfig } from "./config"

export async function transformSections(
  tree: SuperNode,
  config: CodeHikeConfig
) {
  await visitAsync(
    tree,
    "mdxJsxFlowElement",
    async (sectionNode: any) => {
      if (sectionNode.name === "CH.Section") {
        await transformSection(sectionNode, config)
      }
    }
  )
}

async function transformSection(
  node: SuperNode,
  config: CodeHikeConfig
) {
  let props
  await visitAsync(
    node,
    ["mdxJsxFlowElement", "code"],
    async (editorNode, index, parent) => {
      if (isEditorNode(editorNode, config)) {
        props = await mapAnyCodeNode(
          { node: editorNode, index, parent },
          config
        )
        toJSX(editorNode, {
          name: "CH.SectionCode",
          appendProps: true,
          addConfigProp: true,
          props: {},
        })
      }
    }
  )
  node.data = { editorStep: props }
  transformLinks(node)

  if (props) {
    toJSX(node, {
      name: "CH.Section",
      props: { editorStep: props },
      addConfigProp: true,
      appendProps: true,
    })
  } else {
    toJSX(node, { name: "div", props: {} })
  }
}

export function transformLinks(tree: SuperNode) {
  visit(tree, "link", (linkNode: any) => {
    const url = decodeURI(linkNode["url"])
    if (url.startsWith("focus://")) {
      const [firstPart, secondPart] = decodeURI(url)
        .substr("focus://".length)
        .split("#")
      const hasFile = Boolean(secondPart)
      const props = hasFile
        ? { file: firstPart, focus: secondPart, id: url }
        : { focus: firstPart, id: url }
      toJSX(linkNode, {
        type: "mdxJsxTextElement",
        name: "CH.SectionLink",
        props,
      })
    }
  })
}
