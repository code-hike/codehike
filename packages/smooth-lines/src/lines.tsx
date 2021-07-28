import { tween } from "./tween"
import { LineTransition } from "./line-transitions"
import { FullTween } from "@code-hike/utils"
import React from "react"

export { Lines }

export type LinesAnnotation = {
  startIndex: number
  endIndex: number
  Component: (props: {
    style: React.CSSProperties
    children: React.ReactNode
  }) => React.ReactElement
}

type GroupedLines = {
  annotation: LinesAnnotation | undefined
  lines: LineTransition[]
}

function Lines({
  lines,

  progress,
  annotations,
  ...rest
}: {
  lines: LineTransition[]
  prevFocusKeys: number[]
  nextFocusKeys: number[]
  focusWidth: number
  lineHeight: number
  progress: number
  annotations: FullTween<LinesAnnotation[]>
}) {
  const start = annotations.prev.length ? 0.1 : 0
  const end = annotations.next.length ? 0.9 : 1
  const t = tween(
    {
      extremes: [0, 1],
      interval: [start, end],
      fixed: false,
    },
    progress
  )

  if (annotations.prev.length && progress < 0.1) {
    return (
      <WithAnnotations
        lines={lines}
        annotations={annotations.prev}
        t={0}
        {...rest}
      />
    )
  }

  if (annotations.next.length && progress > 0.9) {
    return (
      <WithAnnotations
        lines={lines}
        annotations={annotations.next}
        t={1}
        {...rest}
      />
    )
  }

  return <LineGroup lines={lines} {...rest} t={t} />
}

function LineGroup({
  lines,
  prevFocusKeys,
  nextFocusKeys,
  focusWidth,
  lineHeight,
  t,
  startY = 0,
}: {
  lines: LineTransition[]
  prevFocusKeys: number[]
  nextFocusKeys: number[]
  focusWidth: number
  lineHeight: number
  t: number
  startY?: number
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
          const dx = tween(tweenX, t)
          const dy = tween(tweenY, t)

          const opacity = getOpacity(
            prevFocusKeys,
            key,
            nextFocusKeys,
            t,
            dx
          )
          return (
            <LineContainer
              key={key}
              dx={dx * focusWidth}
              dy={(dy - startY) * lineHeight}
              opacity={opacity}
              width={focusWidth}
            >
              {elementWithProgress
                ? elementWithProgress(t)
                : element}
            </LineContainer>
          )
        }
      )}
    </>
  )
}

function groupLines(
  lines: LineTransition[],
  annotations: LinesAnnotation[],
  prev: boolean
) {
  const getIndex = (x: LineTransition) =>
    prev ? x.prevIndex : x.nextIndex
  const currentLines = lines.filter(
    l => getIndex(l) != null
  )

  let index = 0
  const groups = [] as GroupedLines[]
  while (index < currentLines.length) {
    const group: GroupedLines = {
      lines: [] as LineTransition[],
      annotation: annotations.find(
        a => a.startIndex === index
      ),
    }

    groups.push(group)

    const groupEndingCondition = (i: number) =>
      group.annotation
        ? i > group.annotation.endIndex ||
          i >= currentLines.length
        : annotations.some(a => a.startIndex === i) ||
          i >= currentLines.length

    while (!groupEndingCondition(index)) {
      group.lines.push(
        currentLines.find(l => getIndex(l) === index)!
      )
      index++
    }
  }
  return groups
}

function WithAnnotations({
  lines,
  annotations,
  t,
  ...rest
}: {
  lines: LineTransition[]
  prevFocusKeys: number[]
  nextFocusKeys: number[]
  focusWidth: number
  lineHeight: number
  annotations: LinesAnnotation[]
  t: number
}) {
  const groups = groupLines(lines, annotations, t === 0)

  return (
    <>
      {groups.map(group => {
        const { annotation } = group

        if (!annotation) {
          return (
            <LineGroup
              lines={group.lines}
              {...rest}
              t={t}
            />
          )
        }

        const lineCount =
          annotation.endIndex - annotation.startIndex + 1
        const { lineHeight } = rest

        const startY = tween(group.lines[0]!.tweenY, t)
        const { Component } = annotation

        return (
          <Component
            style={{
              position: "absolute",
              background: "#ff555588",
              height: lineCount * lineHeight,
              width: "100%",
              transform: `translateY(${
                startY * lineHeight
              }px)`,
            }}
          >
            <LineGroup
              lines={group.lines}
              {...rest}
              t={t}
              startY={startY}
            />
          </Component>
        )
      })}
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
        display: opacity <= 0 ? "none" : undefined,
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
