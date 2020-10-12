import React from "react"
import {
  Line,
  useLineTransitions,
} from "./line-transitions"
import { tween } from "./tween"

export { SmoothLines }

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
        fixed: false,
        // TODO use verticalInterval
        interval: [0, 1],
        extremes: [prevCenter, nextCenter],
      },
      progress
    ) * lineHeight
  console.log(lines)
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
