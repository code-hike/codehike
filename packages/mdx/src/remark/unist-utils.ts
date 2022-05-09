import { SuperNode, visit } from "./nodes"
import { valueToEstree } from "./to-estree"
import { Expression } from "estree"

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

// if one of the props in a toJSX call has the CH_CODE_CONFIG_PLACEHOLDER value
// it will be replaced with a reference to the CH_CODE_CONFIG_VAR_NAME var
export const CH_CODE_CONFIG_PLACEHOLDER =
  "CH_CodeConfig" as any
export const CH_CODE_CONFIG_VAR_NAME = "chCodeConfig"

/**
 * Transforms a node into a JSX Flow ELement (or another given type).
 * Most of the work is transforming the props object into an array
 * of mdxJsxAttribute.
 */
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
      node.attributes.push(
        toAttribute(key, CH_CODE_CONFIG_VAR_NAME, {
          type: "Identifier",
          name: CH_CODE_CONFIG_VAR_NAME,
        })
      )
    } else {
      node.attributes.push(
        toAttribute(
          key,
          JSON.stringify(props[key]),
          valueToEstree(props[key])
        )
      )
    }
  })
}

function toAttribute(
  key: string,
  stringValue: string,
  expression: Expression
) {
  return {
    type: "mdxJsxAttribute",
    name: key,
    value: {
      type: "mdxJsxAttributeValueExpression",
      value: stringValue,
      data: {
        estree: {
          type: "Program",
          body: [
            {
              type: "ExpressionStatement",
              expression: expression,
            },
          ],
          sourceType: "module",
        },
      },
    },
  }
}
