import React from "react"
import { codeDiff, CodeLine } from "@code-hike/code-diff"
import { SmoothLines } from "@code-hike/smooth-lines"
import { useDimensions } from "./use-dimensions"
import {
  getFocusByKey,
  getFocusIndexes,
} from "./focus-parser"

type CodeProps = {
  prevCode: string
  prevFocus: string | null
  nextCode: string
  nextFocus: string | null
  progress: number
  language: string
  parentHeight?: number
  minColumns: number
  minZoom: number
  maxZoom: number
  horizontalCenter: boolean
}

export function Code({
  prevCode,
  prevFocus,
  nextCode,
  nextFocus,
  progress,
  language,
  parentHeight,
  minColumns,
  minZoom,
  maxZoom,
  horizontalCenter,
}: CodeProps) {
  const {
    prevLines,
    nextLines,
    prevFocusIndexes,
    nextFocusIndexes,
    prevLongestLine,
    nextLongestLine,
  } = useLineProps(
    prevCode,
    nextCode,
    language,
    prevFocus,
    nextFocus
  )

  const [ref, dimensions] = useDimensions<HTMLPreElement>([
    parentHeight,
    prevLongestLine,
    nextLongestLine,
  ])

  return (
    <pre
      ref={ref}
      className={`language-${language}`}
      style={{
        opacity: dimensions ? 1 : 0,
        overflow: dimensions ? undefined : "hidden", // avoid scrollbars when measuring
      }}
    >
      <code>
        {dimensions ? (
          <SmoothLines
            progress={progress}
            containerWidth={dimensions.width}
            containerHeight={dimensions.height}
            prevLines={prevLines}
            nextLines={nextLines}
            lineHeight={dimensions.lineHeight}
            lineWidth={
              dimensions.lineWidths.map(lw =>
                Math.max(
                  lw,
                  dimensions.colWidth * minColumns
                )
              ) as [number, number]
            }
            prevFocus={prevFocusIndexes}
            nextFocus={nextFocusIndexes}
            minZoom={minZoom}
            maxZoom={maxZoom}
            center={horizontalCenter}
          />
        ) : (
          <>
            <div className="prev-longest-line">
              {prevLongestLine}
            </div>
            <div className="next-longest-line">
              {nextLongestLine}
            </div>
          </>
        )}
      </code>
    </pre>
  )
}

function useLineProps(
  prevCode: string,
  nextCode: string,
  language: string,
  prevFocus: string | null,
  nextFocus: string | null
) {
  return React.useMemo(() => {
    const { prevKeys, nextKeys, codeMap } = codeDiff({
      prevCode,
      nextCode,
      lang: language,
    })

    const prevFocusByKey = getFocusByKey(
      prevFocus,
      prevKeys
    )
    const prevFocusIndexes = getFocusIndexes(
      prevFocus,
      prevKeys
    )
    const prevLongestLineIndex = longestLineIndex(
      prevCode,
      prevFocusIndexes
    )

    const nextFocusByKey = getFocusByKey(
      nextFocus,
      nextKeys
    )
    const nextFocusIndexes = getFocusIndexes(
      nextFocus,
      nextKeys
    )
    const nextLongestLineIndex = longestLineIndex(
      nextCode,
      nextFocusIndexes
    )

    const prevLines = prevKeys.map(key => {
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
    const prevLongestLine =
      prevLongestLineIndex == null
        ? null
        : prevLines[prevLongestLineIndex]?.element

    const nextLines = nextKeys.map(key => {
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
    const nextLongestLine =
      nextLongestLineIndex == null
        ? null
        : nextLines[nextLongestLineIndex]?.element

    return {
      prevLines,
      nextLines,
      prevFocusIndexes,
      nextFocusIndexes,
      prevLongestLine,
      nextLongestLine,
    }
  }, [prevCode, nextCode, language, prevFocus, nextFocus])
}

function Line({ line }: { line: CodeLine }) {
  return (
    <div
      style={{
        display: "inline-block",
      }}
    >
      {line.map(([token, type], i) => (
        <span className={`token ${type}`} key={i + 1}>
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
    const chars = flatMap(line, ([token, type]) =>
      token.split("").map(char => [char, type])
    )

    return chars.map(([char, type], i) => ({
      char,
      type,
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
        ({ char, type, fromOpacity, toOpacity }, i) => (
          <span
            className={`token ${type}`}
            key={i + 1}
            style={{
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

const newlineRe = /\r\n|\r|\n/
function longestLineIndex(
  code: string,
  focusIndexes: number[]
) {
  const first = Math.min(...focusIndexes)
  const last = Math.max(...focusIndexes)
  const focusedLines =
    code == null
      ? []
      : code.split(newlineRe).slice(first, last + 1)

  if (!focusedLines.length) {
    return null
  }

  let longestIndex = 0
  for (let i = 1; i < focusedLines.length; i++) {
    if (
      focusedLines[i].length >
      focusedLines[longestIndex].length
    ) {
      longestIndex = i
    }
  }
  return first + longestIndex
}

export function flatMap<T, U>(
  array: T[],
  callbackfn: (value: T, index: number, array: T[]) => U[]
): U[] {
  return Array.prototype.concat(...array.map(callbackfn))
}
