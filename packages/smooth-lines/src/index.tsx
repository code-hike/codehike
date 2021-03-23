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
  minZoom = 0, // TODO use minZoom
  maxZoom = 1.2,
}: Props) {
  const lines = useLineTransitions(prevLines, nextLines)

  const focusWidth = Array.isArray(lineWidth)
    ? tweenProp(lineWidth[0], lineWidth[1], progress)
    : lineWidth

  const prevFocusKeys = prevFocus.map(
    index => prevLines[index]?.key
  )
  const nextFocusKeys = nextFocus.map(
    index => nextLines[index]?.key
  )

  const [prevZoom, prevDX, prevDY] = getContentProps({
    containerWidth,
    containerHeight,
    lineWidth: Array.isArray(lineWidth)
      ? lineWidth[0]
      : lineWidth,
    lineHeight,
    maxZoom,
    horizontalCenter: !!center,
    focusLineIndexList: prevFocus,
    originalContentHeight: prevLines.length * lineHeight,
  })
  const [nextZoom, nextDX, nextDY] = getContentProps({
    containerWidth,
    containerHeight,
    lineWidth: Array.isArray(lineWidth)
      ? lineWidth[1]
      : lineWidth,
    lineHeight,
    maxZoom,
    horizontalCenter: !!center,
    focusLineIndexList: nextFocus,
    originalContentHeight: nextLines.length * lineHeight,
  })

  const zoom = tweenProp(prevZoom, nextZoom, progress)
  const dx = tweenProp(prevDX, nextDX, progress)
  const dy = tweenProp(prevDY, nextDY, progress)

  return (
    <Container
      width={containerWidth}
      height={containerHeight}
    >
      <Content dx={dx} dy={dy} scale={zoom}>
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

function getContentProps({
  containerWidth,
  containerHeight,
  lineWidth,
  lineHeight,
  maxZoom,
  focusLineIndexList,
  originalContentHeight,
  horizontalCenter,
}: {
  containerWidth: number
  containerHeight: number
  lineWidth: number
  lineHeight: number
  maxZoom: number
  focusLineIndexList: number[]
  originalContentHeight: number
  horizontalCenter: boolean
}) {
  const extremes = [
    Math.min(...focusLineIndexList),
    Math.max(...focusLineIndexList),
  ]
  const originalFocusHeight =
    (extremes[1] - extremes[0] + 3) * lineHeight
  const zoom = Math.min(
    containerWidth / lineWidth,
    containerHeight / originalFocusHeight,
    maxZoom
  )

  const contentHeight = originalContentHeight * zoom

  const focusStart = (extremes[0] - 1) * lineHeight * zoom
  const focusEnd = (extremes[1] + 2) * lineHeight * zoom
  const focusCenter = (focusEnd + focusStart) / 2

  const dy =
    containerHeight > contentHeight
      ? (containerHeight - contentHeight) / 2
      : clamp(
          containerHeight / 2 - focusCenter,
          containerHeight - contentHeight,
          0
        )

  const dx = horizontalCenter
    ? containerWidth / 2 - (lineWidth * zoom) / 2
    : 0

  return [zoom, dx, dy] as const
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

function tweenProp(
  start: number,
  end: number,
  progress: number
) {
  return tween(
    {
      fixed: false,
      interval: [0, 1],
      extremes: [start, end],
      ease: easing.easeInOutCubic,
    },
    progress
  )
}

function clamp(num: number, min: number, max: number) {
  return num <= min ? min : num >= max ? max : num
}
