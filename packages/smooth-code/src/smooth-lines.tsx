import React from "react"
import { Dimensions } from "./use-dimensions"
import { CodeStep } from "./step-parser"
import { SmoothContainer } from "./smooth-container"
import { tween } from "./tween"
import { FullTween, map } from "@code-hike/utils"

type SmoothLinesProps = {
  progress: number
  dimensions: Dimensions
  minZoom?: number
  maxZoom?: number
  center?: boolean
  codeStep: CodeStep
}

export function SmoothLines(props: SmoothLinesProps) {
  return (
    <SmoothContainer {...props}>
      {focusWidth => (
        <Lines
          codeStep={props.codeStep}
          focusWidth={focusWidth}
          lineHeight={props.dimensions!.lineHeight}
          progress={props.progress}
        />
      )}
    </SmoothContainer>
  )
}

function Lines({
  codeStep,
  progress,
  focusWidth,
  lineHeight,
}: {
  codeStep: CodeStep
  focusWidth: number
  lineHeight: number
  progress: number
}) {
  // TODO annotated:
  // if (codeStep.groups.prev && progress < 0.1) {
  // }

  return (
    <LineGroup
      lines={codeStep.lines}
      t={progress}
      focusWidth={focusWidth}
      lineHeight={lineHeight}
    />
  )
}

function LineGroup({
  lines,
  focusWidth,
  lineHeight,
  t,
  startY = 0,
}: {
  lines: CodeStep["lines"]
  focusWidth: number
  lineHeight: number
  t: number
  startY?: number
}) {
  return (
    <>
      {lines.map((line, key) => {
        const { tweenX, tweenY, focused } = line
        const dx = tween(tweenX, t)
        const dy = tween(tweenY, t)
        const opacity = getOpacity(
          map(focused, focused => !!focused),
          t,
          dx
        )

        return (
          <LineContainer
            key={key}
            dx={dx * focusWidth}
            dy={(dy - startY) * lineHeight}
            width={focusWidth}
            opacity={opacity}
          >
            <LineContent line={line} progress={t} dx={dx} />
          </LineContainer>
        )
      })}
    </>
  )
}

function LineContent({
  line,
  progress,
  dx,
}: {
  line: CodeStep["lines"][number]
  progress: number
  dx: number
}) {
  return (
    <div
      style={{
        display: "inline-block",
        width: "100%",
      }}
    >
      {line.groups.map((group, i) => {
        const opacity = getOpacity(
          group.focused,
          progress,
          dx
        )
        return (
          <span style={{ opacity }} key={i + 1}>
            {group.element}
          </span>
        )
      })}
      <br />
    </div>
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
  width: number
  opacity: number
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        transform: `translate(${dx}px, ${dy}px)`,
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
  focused: FullTween<boolean>,
  progress: number,
  dx: number
) {
  return (
    tween(
      {
        fixed: false,
        extremes: [
          focused.prev ? 0.99 : OFF_OPACITY,
          focused.next ? 0.99 : OFF_OPACITY,
        ],
        interval: [0, 1],
      },
      progress
    ) -
    Math.abs(dx) * 1
  )
}
