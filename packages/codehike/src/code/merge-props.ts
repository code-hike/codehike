// Based on https://github.com/andrewbranch/merge-props
// MIT License Andrew Branch

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never

function pushProp(
  target: { [key: string]: any },
  key: string,
  value: any,
): void {
  if (key === "children") {
    target.children = value || target.children
  } else if (key === "_ref") {
    target._ref = value || target._ref
  } else if (key === "data") {
    target.data = target.data ? { ...target.data, ...value } : value
  } else if (key === "className") {
    target.className = [target.className, value].join(" ").trim()
  } else if (key === "style") {
    target.style = { ...target.style, ...value }
  } else if (typeof value === "function") {
    const oldFn = target[key] as Function | undefined
    target[key] = oldFn
      ? (...args: any[]) => {
          oldFn(...args)
          ;(value as Function)(...args)
        }
      : value
  } else if (
    // skip merging undefined values
    value === undefined ||
    // skip if both value are the same primitive value
    (typeof value !== "object" && value === target[key])
  ) {
    return
  } else if (!(key in target)) {
    target[key] = value
  } else {
    throw new Error(
      `Didn’t know how to merge prop '${key}'. ` +
        `Only 'className', 'style', and event handlers are supported`,
    )
  }
}

/**
 * Merges sets of props together:
 *  - duplicate `className` props get concatenated
 *  - duplicate `style` props get shallow merged (later props have precedence for conflicting rules)
 *  - duplicate functions (to be used for event handlers) get called in order from left to right
 * @param props Sets of props to merge together. Later props have precedence.
 */
export function mergeProps<T extends {}[]>(
  ...props: T
): {
  [K in keyof UnionToIntersection<T[number]>]: K extends "className"
    ? string
    : K extends "style"
      ? UnionToIntersection<T[number]>[K]
      : Exclude<Extract<T[number], { [Q in K]: unknown }>[K], undefined>
} {
  if (props.length === 1) {
    return props[0] as any
  }

  return props.reduce((merged, ps: any) => {
    for (const key in ps) {
      pushProp(merged, key, ps[key])
    }
    return merged
  }, {}) as any
}
