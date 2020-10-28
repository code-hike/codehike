import React from "react"
import {
  Line,
  useLineTransitions,
} from "./line-transitions"
import { easing, tween } from "./tween"

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
  overscroll?: boolean
  center?: boolean
  maxZoom?: number
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
  center,
  maxZoom = 1.2,
}: Props) {
  const lines = useLineTransitions(prevLines, nextLines)
  const prevCenter = (prevFocus[0] + prevFocus[1]) / 2
  const nextCenter = (nextFocus[0] + nextFocus[1]) / 2
  const top = containerHeight / 2 - lineHeight / 2
  const dy =
    tween(
      {
        fixed: false,
        // TODO use verticalInterval
        interval: [0, 1],
        extremes: [prevCenter, nextCenter],
        ease: easing.easeInOutCubic,
      },
      progress
    ) * lineHeight

  const prevFocusHeight =
    (prevFocus[1] - prevFocus[0] + 1) * lineHeight
  const nextFocusHeight =
    (nextFocus[1] - nextFocus[0] + 1) * lineHeight
  const focusHeight = tween(
    {
      fixed: false,
      interval: [0, 1],
      extremes: [prevFocusHeight, nextFocusHeight],
    },
    progress
  )

  const zoom = Math.min(
    containerWidth / lineWidth,
    containerHeight / focusHeight,
    maxZoom
  )

  const left = center
    ? containerWidth / 2 - (lineWidth * zoom) / 2
    : 0

  return (
    <div
      style={{
        width: containerWidth,
        height: containerHeight,
        // background: "salmon",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          transform: `translateY(${
            top - dy * zoom
          }px) translateX(${left}px) scale(${zoom})`,
          transformOrigin: `${center ? "center" : "left"}`,
          // outline: "5px solid green",
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
