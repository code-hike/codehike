import React from "react"
import {
  Line,
  useLineTransitions,
} from "./line-transitions"
import { Lines } from "./lines"
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
  minZoom?: number
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
  minZoom = 0,
  maxZoom = 1.2,
}: Props) {
  const lines = useLineTransitions(prevLines, nextLines)

  const focusWidth = Array.isArray(lineWidth)
    ? tween(
        {
          fixed: false,
          interval: [0, 1],
          extremes: lineWidth,
        },
        progress
      )
    : lineWidth

  const prevExtremes = [
    Math.min(...prevFocus),
    Math.max(...prevFocus),
  ]
  const nextExtremes = [
    Math.min(...nextFocus),
    Math.max(...nextFocus),
  ]
  const prevFocusHeight =
    prevExtremes[1] - prevExtremes[0] + 3
  const nextFocusHeight =
    nextExtremes[1] - nextExtremes[0] + 3
  const focusHeight =
    tween(
      {
        fixed: false,
        interval: [0, 1],
        extremes: [prevFocusHeight, nextFocusHeight],
        ease: easing.easeInOutCubic,
      },
      progress
    ) * lineHeight

  const zoom = Math.min(
    containerWidth / focusWidth,
    containerHeight / focusHeight,
    maxZoom
  )

  const contentHeight =
    tween(
      {
        fixed: false,
        interval: [0, 1],
        extremes: [prevLines.length, nextLines.length],
        ease: easing.easeInOutCubic,
      },
      progress
    ) *
    lineHeight *
    zoom
  const focusStart =
    tween(
      {
        fixed: false,
        interval: [0, 1],
        extremes: [
          prevExtremes[0] - 1,
          nextExtremes[0] - 1,
        ],
        ease: easing.easeInOutCubic,
      },
      progress
    ) *
    lineHeight *
    zoom
  const focusEnd =
    tween(
      {
        fixed: false,
        interval: [0, 1],
        extremes: [
          prevExtremes[1] + 2,
          nextExtremes[1] + 2,
        ],
        ease: easing.easeInOutCubic,
      },
      progress
    ) *
    lineHeight *
    zoom

  const dy = getDY(
    containerHeight,
    contentHeight,
    focusStart,
    focusEnd
  )

  const left = center
    ? containerWidth / 2 - (focusWidth * zoom) / 2
    : 0

  const prevFocusKeys = prevFocus.map(
    index => prevLines[index]?.key
  )
  const nextFocusKeys = nextFocus.map(
    index => nextLines[index]?.key
  )

  return (
    <Container
      width={containerWidth}
      height={containerHeight}
    >
      <Content dx={left} dy={dy} scale={zoom}>
        <Lines
          lines={lines}
          prevFocusKeys={prevFocusKeys}
          nextFocusKeys={nextFocusKeys}
          focusWidth={focusWidth}
          lineHeight={lineHeight}
          progress={progress}
        />
      </Content>
    </Container>
  )
}

function getDY(
  containerHeight: number,
  contentHeight: number,
  focusStart: number,
  focusEnd: number
) {
  if (containerHeight > contentHeight) {
    return (containerHeight - contentHeight) / 2
  }
  const focusCenter = (focusEnd + focusStart) / 2
  return clamp(
    containerHeight / 2 - focusCenter,
    containerHeight - contentHeight,
    0
  )
}

function Container({
  width,
  height,
  children,
}: {
  width: number
  height: number
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        width,
        height,
        position: "relative",
      }}
    >
      {children}
    </div>
  )
}

function Content({
  dx,
  dy,
  scale,
  children,
}: {
  dx: number
  dy: number
  scale: number
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        transform: `translateX(${dx}px) translateY(${dy}px) scale(${scale})`,
      }}
    >
      {children}
    </div>
  )
}

function clamp(num: number, min: number, max: number) {
  return num <= min ? min : num >= max ? max : num
}
