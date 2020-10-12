import React from "react"
import {
  tween,
  useLineTransitions,
} from "./line-transitions"

export { SmoothLines }

type Line = {
  element: React.ReactNode
  key: number
}

type Props = {
  progress: number
  containerWidth: number
  containerHeight: number
  lineHeight: number
  lineWidth: number
  prevLines: Line[]
  nextLines: Line[]
  prevFocus: [number, number]
  nextFocus: [number, number]
}

type LineTransition = {
  element: React.ReactNode
  key: number
  state: "stay" | "exit" | "enter"
  prevIndex: number
  nextIndex: number
}

function SmoothLines({
  progress,
  containerHeight,
  containerWidth,
  lineHeight,
  lineWidth,
  prevLines = [],
  nextLines = [],
  prevFocus,
  nextFocus,
}: Props) {
  const lines = useLineTransitions(prevLines, nextLines)
  const prevCenter = (prevFocus[0] + prevFocus[1]) / 2
  const nextCenter = (nextFocus[0] + nextFocus[1]) / 2
  const top = containerHeight / 2 - lineHeight / 2
  const left = containerWidth / 2 - lineWidth / 2
  const dy =
    tween(
      {
        from: prevCenter,
        to: nextCenter,
        start: 0.25,
        end: 0.75,
        fixed: false,
      },
      progress
    ) * lineHeight

  return (
    <div
      style={{
        width: containerWidth,
        height: containerHeight,
        background: "salmon",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: top - dy,
          left,
        }}
      >
        {lines.map(({ element, key, tweenX, tweenY }) => {
          const dx = tween(tweenX, progress)
          const dy = tween(tweenY, progress)

          const opacity = 0.99 - Math.abs(dx) * 0.6

          return (
            <div
              key={key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                transform: `translate(${
                  dx * lineWidth
                }px, ${dy * lineHeight}px)`,
                opacity,
              }}
            >
              {element}
            </div>
          )
        })}
      </div>
    </div>
  )
}
