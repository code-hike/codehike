import React from "react"
import { codeDiff, CodeLine } from "@code-hike/code-diff"
import { SmoothLines } from "@code-hike/smooth-lines"
import { useDimensions } from "./use-dimensions"
import {
  getFocusExtremes,
  parseFocus,
} from "./focus-parser"

type CodeProps = {
  prevCode: string
  prevFocus: string | null
  nextCode: string
  nextFocus: string | null
  progress: number
  language: string
  parentHeight?: number
}

export function Code({
  prevCode,
  prevFocus,
  nextCode,
  nextFocus,
  progress,
  language,
  parentHeight,
}: CodeProps) {
  const {
    prevLines,
    nextLines,
    prevFocusPair,
    nextFocusPair,
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
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        padding: 0,
        margin: 0,
        overflow: "hidden",
      }}
    >
      <code>
        {dimensions ? (
          <SmoothLines
            center={false}
            progress={progress}
            containerWidth={dimensions.width}
            containerHeight={dimensions.height}
            prevLines={prevLines}
            nextLines={nextLines}
            lineHeight={20}
            lineWidth={dimensions.lineWidths}
            prevFocus={prevFocusPair}
            nextFocus={nextFocusPair}
            maxZoom={1}
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

    const prevLines = prevKeys.map(key => ({
      key,
      element: <Line line={codeMap[key]} />,
    }))

    const prevFocusPair = getFocusExtremes(
      prevFocus,
      prevLines
    )

    const prevLongestLineIndex = longestLineIndex(
      prevCode,
      prevFocusPair
    )
    const prevLongestLine =
      prevLongestLineIndex == null
        ? null
        : prevLines[prevLongestLineIndex]?.element

    const nextLines = nextKeys.map(key => ({
      key,
      element: <Line line={codeMap[key]} />,
    }))

    const nextFocusPair = getFocusExtremes(
      nextFocus,
      nextLines
    )

    const nextLongestLineIndex = longestLineIndex(
      nextCode,
      nextFocusPair
    )
    const nextLongestLine =
      nextLongestLineIndex == null
        ? null
        : nextLines[nextLongestLineIndex]?.element

    return {
      prevLines,
      nextLines,
      prevFocusPair,
      nextFocusPair,
      prevLongestLine,
      nextLongestLine,
    }
  }, [prevCode, nextCode, language, prevFocus, nextFocus])
}

function Line({ line }: { line: CodeLine }) {
  return (
    <div
      style={{
        boxSizing: "border-box",
        outline: "green 1px solid",
        padding: "0 4px",
        display: "inline-block",
      }}
    >
      {line.map(([token, type], i) => (
        <span className={`token ${type}`} key={i + 1}>
          {token}
        </span>
      ))}
    </div>
  )
}
const newlineRe = /\r\n|\r|\n/
function longestLineIndex(
  code: string,
  [first, last]: [number, number]
) {
  const focusedLines = code
    .split(newlineRe)
    .slice(first, last + 1)

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
