import React from "react"
import { map } from "@code-hike/utils"
import { CodeStep } from "./step-parser"
import { Dimensions } from "./use-dimensions"
import { tween, easing } from "./tween"

export function SmoothContainer({
  dimensions,
  codeStep,
  children,
  minZoom = 0,
  maxZoom = 1.2,
  center = false,
  progress,
}: {
  dimensions: Dimensions
  minZoom?: number
  maxZoom?: number
  center?: boolean
  codeStep: CodeStep
  children: (focusWidth: number) => React.ReactNode
  progress: number
}) {
  const { prev, next } = getTweenContentProps({
    codeStep,
    dimensions,
    minZoom,
    maxZoom,
    horizontalCenter: center,
  })

  // all these tweens depends on annotations now (t instead of progress)
  const zoom = tweenProp(prev.zoom, next.zoom, progress)
  const dx = tweenProp(prev.dx, next.dx, progress)
  const dy = tweenProp(
    prev.dy,
    next.dy,
    progress,
    codeStep.verticalInterval
  )
  const focusHeight = tweenProp(
    prev.focusHeight,
    next.focusHeight,
    progress
  )
  const focusWidth = tweenProp(
    prev.focusWidth,
    prev.focusWidth,
    progress
  )

  return (
    <Container
      width={dimensions!.containerWidth}
      height={dimensions!.containerHeight}
    >
      <Content
        dx={dx}
        dy={dy}
        scale={zoom}
        height={Math.max(
          focusHeight,
          dimensions!.containerHeight
        )}
        width={Math.max(
          focusWidth,
          dimensions!.containerWidth
        )}
      >
        {children(focusWidth)}
      </Content>
    </Container>
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
        // overflow: "auto",
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
  height,
  width,
  children,
}: {
  dx: number
  dy: number
  scale: number
  height: number
  width: number
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        transformOrigin: "top left",
        width: width,
        height: height,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          transform: `translateX(${dx}px) translateY(${dy}px) scale(${scale})`,
          transformOrigin: "top left",
          width: "100%",
        }}
      >
        {children}
      </div>
    </div>
  )
}

function getTweenContentProps({
  codeStep,
  ...rest
}: {
  dimensions: Dimensions
  minZoom: number
  maxZoom: number
  horizontalCenter: boolean
  codeStep: CodeStep
}) {
  const { lineHeight, lineWidth } = rest.dimensions!
  const paramTween = {
    prev: {
      extremes: [
        codeStep.firstFocusedLineNumber.prev - 1,
        codeStep.lastFocusedLineNumber.prev - 1,
      ],
      originalContentHeight:
        codeStep.lines.filter(
          l => l.lineNumber.prev != null
        ).length * lineHeight,
      lineWidth: lineWidth[0],
    },
    next: {
      extremes: [
        codeStep.firstFocusedLineNumber.next - 1,
        codeStep.lastFocusedLineNumber.next - 1,
      ],
      originalContentHeight:
        codeStep.lines.filter(
          l => l.lineNumber.next != null
        ).length * lineHeight,
      lineWidth: lineWidth[1],
    },
  }

  return map(
    paramTween,
    ({ extremes, originalContentHeight, lineWidth }) =>
      getContentProps({
        extremes,
        originalContentHeight,
        lineWidth,
        ...rest,
      })
  )
}

function getContentProps({
  dimensions,
  lineWidth,
  minZoom,
  maxZoom,
  extremes,
  originalContentHeight,
  horizontalCenter,
}: {
  dimensions: Dimensions
  lineWidth: number
  minZoom: number
  maxZoom: number
  extremes: number[]
  originalContentHeight: number
  horizontalCenter: boolean
}) {
  const {
    containerWidth,
    containerHeight,
    lineHeight,
  } = dimensions!
  const originalFocusHeight =
    (extremes[1] - extremes[0] + 3) * lineHeight
  const zoom = Math.max(
    Math.min(
      containerWidth / lineWidth,
      containerHeight / originalFocusHeight,
      maxZoom
    ),
    minZoom
  )

  const contentHeight = originalContentHeight * zoom

  const focusStart = (extremes[0] - 1) * lineHeight * zoom
  const focusEnd = (extremes[1] + 2) * lineHeight * zoom
  const focusCenter = (focusEnd + focusStart) / 2
  const focusHeight = focusEnd - focusStart

  const dy =
    containerHeight > contentHeight
      ? (containerHeight - contentHeight) / 2
      : clamp(
          containerHeight / 2 - focusCenter,
          Math.max(
            containerHeight - contentHeight,
            -focusStart // to ensure first focus line is shown when focus is bigger than container
          ),
          0
        )

  const dx = horizontalCenter
    ? Math.max(
        containerWidth / 2 - (lineWidth * zoom) / 2,
        0
      )
    : 0

  return {
    zoom,
    dx,
    dy,
    focusHeight: focusHeight,
    focusWidth: lineWidth * zoom,
  }
}

function clamp(num: number, min: number, max: number) {
  return num <= min ? min : num >= max ? max : num
}
function tweenProp(
  start: number,
  end: number,
  progress: number,
  interval: [number, number] = [0, 1]
) {
  return tween(
    {
      fixed: false,
      interval,
      extremes: [start, end],
      ease: easing.easeInOutCubic,
    },
    progress
  )
}
