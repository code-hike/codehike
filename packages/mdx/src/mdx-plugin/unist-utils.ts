import { SuperNode, visit } from "./nodes"
import { valueToEstree } from "./to-estree"

export type NodeInfo<N extends SuperNode = SuperNode> = {
  node: N
  index: number
  parent: SuperNode
}

export function splitChildren(
  parent: SuperNode,
  type: string
) {
  const splits = [] as NodeInfo[][]
  let i = 0
  parent.children.forEach((node, index) => {
    if (node.type === type) {
      i++
    } else {
      if (!splits[i]) {
        splits[i] = []
      }
      splits[i].push({ node, index, parent })
    }
  })
  return splits
}

export async function visitAsync(
  tree: SuperNode,
  type: string | string[],
  visitor: (
    node: SuperNode,
    index: number,
    parent: SuperNode | undefined
  ) => void | Promise<any>
) {
  const promises = [] as Promise<any>[]
  visit(tree, type, (node, index, parent) => {
    const result = visitor(node, index, parent)
    if (result) {
      promises.push(result)
    }
  })
  await Promise.all(promises)
}

export const CH_CODE_CONFIG_PLACEHOLDER =
  "CH_CodeConfig" as any
export const CH_CODE_CONFIG_VAR_NAME = "chCodeConfig"

export function toJSX(
  node: any,
  {
    type = "mdxJsxFlowElement",
    props,
    name,
    appendProps = false,
  }: {
    type?: string
    props: Record<string, any>
    name?: string
    appendProps?: boolean
  }
) {
  // console.log(`transforming ${node.name} to ${name}`)
  node.type = type
  if (name) {
    node.name = name
  }
  if (!appendProps) {
    node.attributes = []
  } else {
    node.attributes = node.attributes || []
  }

  Object.keys(props).forEach(key => {
    if (props[key] === undefined) {
      return
    }
    if (props[key] === CH_CODE_CONFIG_PLACEHOLDER) {
      ;(node as any).attributes.push({
        type: "mdxJsxAttribute",
        name: key,
        value: {
          type: "mdxJsxAttributeValueExpression",
          value: CH_CODE_CONFIG_VAR_NAME,
          data: {
            estree: {
              type: "Program",
              body: [
                {
                  type: "ExpressionStatement",
                  expression: {
                    type: "Identifier",
                    name: CH_CODE_CONFIG_VAR_NAME,
                  },
                },
              ],
              sourceType: "module",
            },
          },
        },
      })
    } else {
      ;(node as any).attributes.push({
        type: "mdxJsxAttribute",
        name: key,
        value: {
          type: "mdxJsxAttributeValueExpression",
          value: JSON.stringify(props[key]),
          data: {
            estree: {
              type: "Program",
              body: [
                {
                  type: "ExpressionStatement",
                  expression: valueToEstree(props[key]),
                },
              ],
              sourceType: "module",
            },
          },
        },
      })
    }
  })
}
