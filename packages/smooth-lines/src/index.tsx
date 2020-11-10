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
  lineWidth: number | [number, number]
  prevLines: Line[]
  nextLines: Line[]
  prevFocus: number[]
  nextFocus: number[]
  overscroll?: boolean
  center?: boolean
  maxZoom?: number
}

const OFF_OPACITY = 0.33

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
  const prevExtremes = [
    Math.min(...prevFocus),
    Math.max(...prevFocus),
  ]
  const nextExtremes = [
    Math.min(...nextFocus),
    Math.max(...nextFocus),
  ]
  const prevCenter =
    (prevExtremes[0] + prevExtremes[1] + 1) / 2
  const nextCenter =
    (nextExtremes[0] + nextExtremes[1] + 1) / 2
  const yCenter =
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
    (prevExtremes[1] - prevExtremes[0] + 3) * lineHeight
  const nextFocusHeight =
    (nextExtremes[1] - nextExtremes[0] + 3) * lineHeight
  const focusHeight = tween(
    {
      fixed: false,
      interval: [0, 1],
      extremes: [prevFocusHeight, nextFocusHeight],
    },
    progress
  )

  const lw = Array.isArray(lineWidth)
    ? tween(
        {
          fixed: false,
          interval: [0, 1],
          extremes: lineWidth,
        },
        progress
      )
    : lineWidth

  const zoom = Math.min(
    containerWidth / lw,
    containerHeight / focusHeight,
    maxZoom
  )

  const left = center
    ? containerWidth / 2 - (lw * zoom) / 2
    : 0

  const prevFocusKeys = prevFocus.map(
    index => prevLines[index]?.key
  )
  const nextFocusKeys = nextFocus.map(
    index => nextLines[index]?.key
  )

  return (
    <div
      style={{
        width: containerWidth,
        height: containerHeight,
        // background: "salmon",
        position: "relative",
        outline: "1px solid pink",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          transform: `translateY(${
            containerHeight / 2 - yCenter * zoom
          }px) translateX(${left}px) scale(${zoom})`,
          // outline: "5px solid green",
        }}
      >
        {lines.map(({ element, key, tweenX, tweenY }) => {
          const dx = tween(tweenX, progress)
          const dy = tween(tweenY, progress)

          const opacity =
            tween(
              {
                fixed: false,
                extremes: [
                  prevFocusKeys.includes(key)
                    ? 0.99
                    : OFF_OPACITY,
                  nextFocusKeys.includes(key)
                    ? 0.99
                    : OFF_OPACITY,
                ],
                interval: [0, 1],
              },
              progress
            ) -
            Math.abs(dx) * 1

          return (
            <div
              key={key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                transform: `translate(${dx * lw}px, ${
                  dy * lineHeight
                }px)`,
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
