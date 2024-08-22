import { mergeProps } from "./merge-props.js"
import { CustomLineProps, CustomPreProps, CustomTokenProps } from "./types.js"

export const InnerPre = ({
  merge,
  ...rest
}: { merge: CustomPreProps } & Partial<CustomPreProps>) => {
  const { _stack, ...result } = mergeProps(merge, rest)
  const [Next, ...stack] = _stack
  if (Next) {
    return <Next _stack={stack} {...result} />
  } else {
    const { _ref, data, children, ...props } = result
    return (
      <pre {...props} ref={_ref} data-ch={true}>
        <div style={{ minWidth: "fit-content" }}>{children}</div>
      </pre>
    )
  }
}

export function getPreRef(
  props: CustomPreProps,
): React.RefObject<HTMLPreElement> {
  const p = props
  if (!p?._ref) {
    throw new Error("`getPreRef` can only be used inside `PreWithRef`")
  }
  return p?._ref
}

export const InnerLine = ({
  merge,
  ...rest
}: { merge: CustomLineProps } & Partial<CustomLineProps>) => {
  const { _stack, ...result } = mergeProps(merge, rest)

  const [next, ...stack] = _stack
  if (next) {
    const { Component, annotation } = next
    return <Component _stack={stack} {...result} annotation={annotation!} />
  } else {
    const { lineNumber, totalLines, indentation, data, annotation, ...props } =
      result
    return <div {...props} />
  }
}

export const InnerToken = ({
  merge,
  ...rest
}: { merge: CustomTokenProps } & Partial<CustomTokenProps>) => {
  const { _stack, ...result } = mergeProps(merge, rest)
  const [next, ...stack] = _stack
  if (next) {
    const { Component, annotation } = next
    return <Component _stack={stack} {...result} annotation={annotation!} />
  } else {
    const { value, data, ...props } = result
    return <span {...props}>{value}</span>
  }
}
