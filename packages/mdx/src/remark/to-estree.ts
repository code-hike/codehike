import { Expression } from "estree"
import isPlainObject from "is-plain-obj"
import { annotationsMap } from "../mdx-client/annotations"
// import unified from "unified"
// import remarkRehype from "remark-rehype"
import toEstree from "hast-util-to-estree"
import { Node } from "unist"

// forked from https://github.com/remcohaszing/estree-util-value-to-estree/blob/main/src/index.ts

// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/34960#issuecomment-576906058
declare const URL: typeof globalThis extends {
  URL: infer URLCtor
}
  ? URLCtor
  : typeof import("url").URL
declare const URLSearchParams: typeof globalThis extends {
  URL: infer URLSearchParamsCtor
}
  ? URLSearchParamsCtor
  : typeof import("url").URLSearchParams

export interface Options {
  /**
   * If true, treat objects that have a prototype as plain objects.
   */
  instanceAsObject?: boolean
}

/**
 * Convert a value to an ESTree node
 *
 * @param value - The value to convert
 * @param options - Additional options to configure the output.
 * @returns The ESTree node.
 */
export function valueToEstree(
  value?: unknown,
  options: Options = {}
): Expression {
  if (value === undefined) {
    return { type: "Identifier", name: "undefined" }
  }
  if (value == null) {
    return { type: "Literal", value: null, raw: "null" }
  }
  if (value === Number.POSITIVE_INFINITY) {
    return { type: "Identifier", name: "Infinity" }
  }
  if (Number.isNaN(value)) {
    return { type: "Identifier", name: "NaN" }
  }
  if (typeof value === "boolean") {
    return { type: "Literal", value, raw: String(value) }
  }
  if (typeof value === "bigint") {
    return value >= 0
      ? ({
          type: "Literal",
          value,
          raw: `${value}n`,
          bigint: String(value),
        } as any)
      : {
          type: "UnaryExpression",
          operator: "-",
          prefix: true,
          argument: valueToEstree(-value, options),
        }
  }
  if (typeof value === "number") {
    return value >= 0
      ? { type: "Literal", value, raw: String(value) }
      : {
          type: "UnaryExpression",
          operator: "-",
          prefix: true,
          argument: valueToEstree(-value, options),
        }
  }
  if (typeof value === "string") {
    return {
      type: "Literal",
      value,
      raw: JSON.stringify(value),
    }
  }
  if (typeof value === "symbol") {
    if (
      value.description &&
      value === Symbol.for(value.description)
    ) {
      return {
        type: "CallExpression",
        optional: false,
        callee: {
          type: "MemberExpression",
          computed: false,
          optional: false,
          object: { type: "Identifier", name: "Symbol" },
          property: { type: "Identifier", name: "for" },
        },
        arguments: [
          valueToEstree(value.description, options),
        ],
      }
    }
    throw new TypeError(
      `Only global symbols are supported, got: ${String(
        value
      )}`
    )
  }
  if (Array.isArray(value)) {
    const elements: (Expression | null)[] = []
    for (let i = 0; i < value.length; i += 1) {
      elements.push(
        i in value ? valueToEstree(value[i], options) : null
      )
    }
    return { type: "ArrayExpression", elements }
  }
  if (value instanceof RegExp) {
    return {
      type: "Literal",
      value,
      raw: String(value),
      regex: { pattern: value.source, flags: value.flags },
    }
  }
  if (value instanceof Date) {
    return {
      type: "NewExpression",
      callee: { type: "Identifier", name: "Date" },
      arguments: [valueToEstree(value.getTime(), options)],
    }
  }
  if (value instanceof Map) {
    return {
      type: "NewExpression",
      callee: { type: "Identifier", name: "Map" },
      arguments: [
        valueToEstree([...value.entries()], options),
      ],
    }
  }
  if (
    // https://github.com/code-hike/codehike/issues/194
    // value instanceof BigInt64Array ||
    // value instanceof BigUint64Array ||
    value instanceof Float32Array ||
    value instanceof Float64Array ||
    value instanceof Int8Array ||
    value instanceof Int16Array ||
    value instanceof Int32Array ||
    value instanceof Set ||
    value instanceof Uint8Array ||
    value instanceof Uint8ClampedArray ||
    value instanceof Uint16Array ||
    value instanceof Uint32Array
  ) {
    return {
      type: "NewExpression",
      callee: {
        type: "Identifier",
        name: value.constructor.name,
      },
      arguments: [valueToEstree([...value], options)],
    }
  }
  if (
    value instanceof URL ||
    value instanceof URLSearchParams
  ) {
    return {
      type: "NewExpression",
      callee: {
        type: "Identifier",
        name: value.constructor.name,
      },
      arguments: [valueToEstree(String(value), options)],
    }
  }
  if (options.instanceAsObject || isPlainObject(value)) {
    // if ((value as any)?.name === MDX_CHILDREN) {
    //   const tree = { ...(value as any) }
    //   tree.name = null
    //   return (mdastToEstree(tree) as any).body[0].expression
    // }

    if (
      (value as any)?.type ===
      "mdxJsxAttributeValueExpression"
    ) {
      return (value as any).data.estree.body[0].expression
    }

    return {
      type: "ObjectExpression",
      properties: Object.entries(value).map(
        ([name, val]) => ({
          type: "Property",
          method: false,
          shorthand: false,
          computed: false,
          kind: "init",
          key: valueToEstree(name, options),
          value: valueToEstree(val, options),
        })
      ),
    }
  }

  const isAnnotation = Object.values(
    annotationsMap
  ).includes(value as any)

  // code hike annotations patch
  if (isAnnotation) {
    const identifier = Object.keys(annotationsMap).find(
      key => annotationsMap[key] === value
    )!
    return {
      type: "MemberExpression",
      object: {
        type: "MemberExpression",
        object: {
          type: "Identifier",
          name: "CH",
        },
        property: {
          type: "Identifier",
          name: "annotations",
        },
        computed: false,
        optional: false,
      },
      property: {
        type: "Identifier",
        name: identifier,
      },
      computed: false,
      optional: false,
    }
  }

  throw new TypeError(`Unsupported value: ${String(value)}`)
}

// export function mdastToEstree(node: Node) {
//   const nodeTypes = [
//     "mdxFlowExpression",
//     "mdxJsxFlowElement",
//     "mdxJsxTextElement",
//     "mdxTextExpression",
//     "mdxjsEsm",
//   ]
//   const changedTree = unified()
//     .use(remarkRehype, {
//       allowDangerousHtml: true,
//       passThrough: nodeTypes,
//     })
//     .use(rehypeRecma as any)
//     .runSync(node)

//   return changedTree
// }

function rehypeRecma() {
  return (tree: any) => (toEstree as any)(tree)
}

const MDX_CHILDREN = "MDX_CHILDREN"

export function wrapChildren(children: Node[]) {
  const tree = {
    type: "mdxJsxFlowElement",
    children,
    name: MDX_CHILDREN,
  }
  return tree
}
