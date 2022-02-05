import fetch from "node-fetch"
import {
  visitAsync,
  toJSX,
  CH_CODE_CONFIG_PLACEHOLDER,
} from "./unist-utils"
import { Node } from "unist"

export async function getPresetConfig(
  attributes?: {
    name: string
    value: "string"
  }[]
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

export async function transformPreviews(tree: Node) {
  await visitAsync(
    tree,
    "mdxJsxFlowElement",
    async node => {
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
