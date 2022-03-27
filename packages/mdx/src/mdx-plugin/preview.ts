import fetch from "node-fetch"
import {
  visitAsync,
  toJSX,
  CH_CODE_CONFIG_PLACEHOLDER,
} from "./unist-utils"
import { JsxNode, SuperNode } from "./nodes"

export async function getPresetConfig(
  attributes?: JsxNode["attributes"]
) {
  // todo add cache
  const presetAttribute = attributes?.find(
    (attr: any) => attr.name === "preset"
  )
  if (!presetAttribute) return undefined
  const url = presetAttribute.value
  const prefix = "https://codesandbox.io/s/"
  const csbid = url.slice(prefix.length)
  const configUrl = `https://codesandbox.io/api/v1/sandboxes/${csbid}/sandpack`
  const res = await fetch(configUrl)
  return await res.json()
}

export async function transformPreviews(tree: SuperNode) {
  await visitAsync(
    tree,
    "mdxJsxFlowElement",
    async (node: any) => {
      if (node.name === "CH.Preview") {
        await transformPreview(node)
      }
    }
  )
}

async function transformPreview(node: Node) {
  toJSX(node, {
    props: {
      codeConfig: CH_CODE_CONFIG_PLACEHOLDER,
    },
    appendProps: true,
  })
}
