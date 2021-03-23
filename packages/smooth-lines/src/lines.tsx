import { tween } from "./tween"
import { LineTransition } from "./line-transitions"
import React from "react"

export { Lines }

function Lines({
  lines,
  prevFocusKeys,
  nextFocusKeys,
  focusWidth,
  lineHeight,
  progress,
}: {
  lines: LineTransition[]
  prevFocusKeys: number[]
  nextFocusKeys: number[]
  focusWidth: number
  lineHeight: number
  progress: number
}) {
  return (
    <>
      {lines.map(
        ({
          element,
          key,
          tweenX,
          tweenY,
          elementWithProgress,
        }) => {
          const dx = tween(tweenX, progress)
          const dy = tween(tweenY, progress)

          const opacity = getOpacity(
            prevFocusKeys,
            key,
            nextFocusKeys,
            progress,
            dx
          )

          return (
            <LineContainer
              key={key}
              dx={dx * focusWidth}
              dy={dy * lineHeight}
              opacity={opacity}
              width={focusWidth}
            >
              {elementWithProgress
                ? elementWithProgress(progress)
                : element}
            </LineContainer>
          )
        }
      )}
    </>
  )
}

function LineContainer({
  children,
  dx,
  dy,
  opacity,
  width,
}: {
  children: React.ReactNode
  dx: number
  dy: number
  opacity: number
  width: number
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        transform: `translate(${dx}px, ${dy}px)`,
        opacity,
        width,
      }}
    >
      {children}
    </div>
  )
}

const OFF_OPACITY = 0.33

function getOpacity(
  prevFocusKeys: number[],
  key: number,
  nextFocusKeys: number[],
  progress: number,
  dx: number
) {
  return (
    tween(
      {
        fixed: false,
        extremes: [
          prevFocusKeys.includes(key) ? 0.99 : OFF_OPACITY,
          nextFocusKeys.includes(key) ? 0.99 : OFF_OPACITY,
        ],
        interval: [0, 1],
      },
      progress
    ) -
    Math.abs(dx) * 1
  )
}
