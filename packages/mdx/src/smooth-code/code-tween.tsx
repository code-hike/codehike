import React from "react"
import { useDimensions, Dimensions } from "./use-dimensions"
import {
  FullTween,
  Code,
  map,
  FocusString,
  anyValue,
} from "../utils"
import {
  useStepParser,
  CodeAnnotation,
  CodeShift,
} from "./partial-step-parser"
import { SmoothLines } from "./smooth-lines"
import { CopyButton } from "./copy-button"
import { CodeExpandButton } from "mini-editor/expand-button"
import { CodeSettings } from "../core/types"

type HTMLProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>

type TriggerPosition = `${number}px` | `${number}%`

export type CodeTweenProps = {
  tween: FullTween<CodeStep>
  progress: number
  config: CodeSettings
} & HTMLProps

export type CodeStep = {
  code: Code
  focus: FocusString
  annotations?: CodeAnnotation[]
}

function useCodeShift({
  tween,
}: {
  tween: FullTween<CodeStep>
}) {
  return useStepParser({
    highlightedLines: map(tween, tween => tween.code.lines),
    focus: map(tween, tween => tween.focus),
    annotations: map(tween, tween => tween.annotations),
    lang: anyValue(tween, tween => tween?.code?.lang),
  })
}

const DEFAULT_MIN_COLUMNS = 10

export function CodeTween({
  tween,
  progress,
  config,
  ...preProps
}: CodeTweenProps) {
  const stepInfo = useCodeShift({ tween })

  const { element, dimensions } = useDimensions(
    stepInfo.code,
    map(tween, tween => tween.focus),
    config.minColumns || DEFAULT_MIN_COLUMNS,
    config.lineNumbers || false,
    config.rows as number | "focus",
    [config.parentHeight]
  )

  return !dimensions || config.debug ? (
    <BeforeDimensions
      element={element}
      htmlProps={preProps}
      debug={config.debug}
    />
  ) : (
    <AfterDimensions
      dimensions={dimensions}
      stepInfo={stepInfo}
      config={config}
      progress={progress}
      htmlProps={preProps}
      tween={tween}
    />
  )
}

function BeforeDimensions({
  element,
  htmlProps,
  debug,
}: {
  element: React.ReactNode
  htmlProps?: HTMLProps
  debug?: boolean
}) {
  return (
    <Wrapper htmlProps={htmlProps} measured={false}>
      {element}
    </Wrapper>
  )
}

function AfterDimensions({
  config: {
    minZoom = 1,
    maxZoom = 1,
    horizontalCenter = false,
  },
  dimensions,
  stepInfo,
  progress,
  htmlProps,
  config,
  tween,
}: {
  dimensions: NonNullable<Dimensions>
  stepInfo: CodeShift
  config: CodeSettings
  progress: number
  htmlProps: HTMLProps
  tween: FullTween<CodeStep>
}) {
  return (
    <Wrapper htmlProps={htmlProps} measured={true}>
      <SmoothLines
        codeStep={stepInfo}
        progress={progress}
        dimensions={dimensions}
        // TODO move to dimensions?
        minZoom={minZoom}
        maxZoom={maxZoom}
        center={horizontalCenter}
      />
      <div className="ch-code-buttons">
        {config.showCopyButton ? (
          <CopyButton
            className="ch-code-button"
            content={stepInfo?.code?.prev}
          />
        ) : undefined}
        {config.showExpandButton ? (
          <CodeExpandButton
            className="ch-code-button"
            step={tween.prev}
          />
        ) : undefined}
      </div>
    </Wrapper>
  )
}

function Wrapper({
  htmlProps,
  children,
  measured,
}: {
  htmlProps?: HTMLProps
  children: React.ReactNode
  measured: boolean
}) {
  return (
    // not using <pre> because https://github.com/code-hike/codehike/issues/120
    <div
      {...htmlProps}
      className={`ch-code-wrapper ${
        htmlProps?.className || ""
      }`}
      data-ch-measured={measured}
      children={children}
    />
  )
}
