import React from "react"
import { CodeLine } from "@code-hike/code-diff"
import { Tween } from "@code-hike/utils"

export { Line, ColumnedLine }

function Line({ line }: { line: CodeLine }) {
  return (
    <div style={{ display: "inline-block" }}>
      {line.map(([token, tokenProps], i) => (
        <span {...tokenProps} key={i + 1}>
          {token}
        </span>
      ))}
      <br />
    </div>
  )
}

const OFF_OPACITY = 0.33

function ColumnedLine({
  line,
  progress,
  focus,
}: {
  line: CodeLine
  progress: number
  focus: Tween<boolean | number[]>
}) {
  const prevFocus = focus.prev
  const nextFocus = focus.next
  const columns = React.useMemo(() => {
    const chars = flatMap(line, ([token, tokenProps]) =>
      token
        .split("")
        .map(char => [char, tokenProps] as const)
    )

    return chars.map(([char, tokenProps], i) => ({
      char,
      tokenProps,
      fromOpacity: !prevFocus
        ? 0.99 // because the line is already transparent
        : prevFocus === true || prevFocus.includes(i)
        ? 0.99
        : OFF_OPACITY,
      toOpacity: !nextFocus
        ? 0.99 // because the line is already transparent
        : nextFocus === true || nextFocus.includes(i)
        ? 0.99
        : OFF_OPACITY,
    }))
  }, [line, prevFocus, nextFocus])

  return (
    <div
      style={{
        display: "inline-block",
        width: "100%",
      }}
    >
      {columns.map(
        (
          { char, tokenProps, fromOpacity, toOpacity },
          i
        ) => (
          <span
            {...tokenProps}
            key={i + 1}
            style={{
              ...tokenProps?.style,
              opacity: tween(
                fromOpacity,
                toOpacity,
                progress
              ),
            }}
          >
            {char}
          </span>
        )
      )}
      <br />
    </div>
  )
}

function tween(p: number, n: number, t: number) {
  return (n - p) * t + p
}

export function flatMap<T, U>(
  array: T[],
  callbackfn: (value: T, index: number, array: T[]) => U[]
): U[] {
  return Array.prototype.concat(...array.map(callbackfn))
}
