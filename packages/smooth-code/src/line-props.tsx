import React from "react"
import {
  useCodeDiff,
  CodeLine,
  CodeMap,
} from "@code-hike/code-diff"
import {
  getFocusByKey,
  getFocusIndexes,
  FocusString,
} from "./focus-parser"
import { IRawTheme } from "vscode-textmate"
import {
  Tween,
  FullTween,
  withDefault,
} from "@code-hike/utils"

export function useLineProps(
  code: Tween<string>,
  focus: Tween<FocusString>,
  language: string,
  theme: IRawTheme
) {
  const {
    keys,
    codeMap,
    backgroundColor,
    color,
  } = useCodeDiff({
    code,
    lang: language,
    theme,
  })

  return React.useMemo(() => {
    return something(
      withDefault(focus, null),
      keys,
      codeMap,
      backgroundColor,
      color
    )
  }, [
    focus.prev,
    keys.prev,
    focus.next,
    keys.next,
    codeMap,
  ])
}

function something(
  focus: FullTween<FocusString>,
  keys: FullTween<number[]>,
  codeMap: CodeMap,
  backgroundColor: string,
  color: string
) {
  const prevFocusByKey = getFocusByKey(
    focus.prev,
    keys.prev
  )
  const prevFocusIndexes = getFocusIndexes(
    focus.prev,
    keys.prev
  )

  const nextFocusByKey = getFocusByKey(
    focus.next,
    keys.next
  )
  const nextFocusIndexes = getFocusIndexes(
    focus.next,
    keys.next
  )

  const prevLines = keys.prev.map(key => {
    const prevFocus = prevFocusByKey[key]
    const nextFocus = nextFocusByKey[key]
    const focusPerColumn =
      Array.isArray(prevFocus) || Array.isArray(nextFocus)
    if (!focusPerColumn) {
      return {
        key,
        element: <Line line={codeMap[key]} />,
      }
    } else {
      return {
        key,
        element: <Line line={codeMap[key]} />,
        elementWithProgress: (progress: number) => (
          <ColumnedLine
            line={codeMap[key]}
            progress={progress}
            prevFocus={prevFocus}
            nextFocus={nextFocus}
          />
        ),
      }
    }
  })

  const nextLines = keys.next.map(key => {
    const prevFocus = prevFocusByKey[key]
    const nextFocus = nextFocusByKey[key]
    const focusPerColumn =
      Array.isArray(prevFocus) || Array.isArray(nextFocus)
    if (!focusPerColumn) {
      return {
        key,
        element: <Line line={codeMap[key]} />,
      }
    } else {
      return {
        key,
        element: <Line line={codeMap[key]} />,
        elementWithProgress: (progress: number) => (
          <ColumnedLine
            line={codeMap[key]}
            progress={progress}
            prevFocus={prevFocus}
            nextFocus={nextFocus}
          />
        ),
      }
    }
  })

  return {
    prevLines,
    nextLines,
    prevFocusIndexes,
    nextFocusIndexes,
    backgroundColor,
    color,
  }
}

function Line({ line }: { line: CodeLine }) {
  return (
    <div
      style={{
        display: "inline-block",
      }}
    >
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
  prevFocus,
  nextFocus,
}: {
  line: CodeLine
  progress: number
  prevFocus: undefined | boolean | number[]
  nextFocus: undefined | boolean | number[]
}) {
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
