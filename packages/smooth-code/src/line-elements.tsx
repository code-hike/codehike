import React from "react"
import { FocusedLine, LineWithElement } from "./step-parser"
import { map } from "@code-hike/utils"
import { easing, stagger } from "./tween"

export function getLinesWithElements(
  lines: FocusedLine[],
  verticalInterval: [number, number],
  enterCount: number,
  exitCount: number
) {
  // startY is the progress when we start moving vertically
  // endY is when we stop
  const [startY, endY] = verticalInterval

  return lines.map(line => {
    const lineIndex = map(
      line.lineNumber,
      ln => ln && ln - 1
    )

    const { enterIndex, exitIndex } = line
    const tweenY =
      line.move === "exit"
        ? { fixed: true, value: lineIndex.prev! }
        : line.move === "enter"
        ? { fixed: true, value: lineIndex.next! }
        : {
            fixed: false,
            extremes: [lineIndex.prev!, lineIndex.next!],
            interval: [startY, endY],
            ease: easing.easeInOutCubic,
          }

    const tweenX =
      line.move === "exit"
        ? {
            fixed: false,
            extremes: [0, -1],
            ease: easing.easeInQuad,
            interval: stagger(
              [0, startY],
              exitIndex!,
              exitCount
            ),
          }
        : line.move === "enter"
        ? {
            fixed: false,
            extremes: [1, 0],
            ease: easing.easeOutQuad,
            interval: stagger(
              [endY, 1],
              enterIndex!,
              enterCount
            ),
          }
        : { fixed: true, value: 0 }

    return {
      ...line,
      tweenX,
      tweenY,
      element: <Line tokens={line.tokens} />,
      elementWithProgress: t => (
        <LineWithProgress line={line} progress={t} />
      ),
    } as LineWithElement
  })
}

function Line({
  tokens,
}: {
  tokens: FocusedLine["tokens"]
}) {
  return (
    <div style={{ display: "inline-block" }}>
      {tokens.map(({ content, props }, i) => (
        <span {...props} key={i + 1}>
          {content}
        </span>
      ))}
      <br />
    </div>
  )
}

function LineWithProgress({
  line,
  progress,
}: {
  line: FocusedLine
  progress: number
}) {
  return (
    <div
      style={{
        display: "inline-block",
        width: "100%",
      }}
    >
      {line.tokens.map((token, i) => {
        const opacity = getTokenOpacity(line, token)
        return (
          <span
            {...token.props}
            style={{
              ...token.props?.style,
              opacity: tween(
                opacity.prev,
                opacity.next,
                progress
              ),
            }}
            key={i + 1}
          >
            {token.content}
          </span>
        )
      })}
      <br />
    </div>
  )
}

const OFF_OPACITY = 0.33
function getTokenOpacity(
  line: FocusedLine,
  token: FocusedLine["tokens"][number]
) {
  return {
    prev: !line.focused.prev
      ? 0.99 // because the line is already transparent
      : line.focused.prev === true || token.focused.prev
      ? 0.99
      : OFF_OPACITY,
    next: !line.focused.next
      ? 0.99 // because the line is already transparent
      : line.focused.next === true || token.focused.next
      ? 0.99
      : OFF_OPACITY,
  }
}

function tween(p: number, n: number, t: number) {
  return (n - p) * t + p
}
