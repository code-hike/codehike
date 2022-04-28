import React from "react"
import { useDimensions, Dimensions } from "./use-dimensions"
import { IRawTheme } from "vscode-textmate"
import {
  FullTween,
  Code,
  map,
  FocusString,
  getCodeColors,
  getColor,
  ColorName,
  getColorScheme,
} from "../utils"
import {
  useStepParser,
  CodeAnnotation,
  CodeShift,
} from "./partial-step-parser"
import { SmoothLines } from "./smooth-lines"

type HTMLProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>

export type CodeTweenProps = {
  tween: FullTween<CodeStep>
  progress: number
  config: CodeConfig
} & HTMLProps

export type CodeStep = {
  code: Code
  focus: FocusString
  annotations?: CodeAnnotation[]
}
export type CodeConfig = {
  /* not really the height, when this changes we measure everything again */
  parentHeight?: any
  minColumns?: number
  minZoom?: number
  maxZoom?: number
  horizontalCenter?: boolean
  theme: IRawTheme
  lineNumbers?: boolean
}

function useCodeShift({
  tween,
  theme,
}: {
  tween: FullTween<CodeStep>
  theme: IRawTheme
}) {
  return useStepParser({
    highlightedLines: map(tween, tween => tween.code.lines),
    theme,
    focus: map(tween, tween => tween.focus),
    annotations: map(tween, tween => tween.annotations),
  })
}

const DEFAULT_MIN_COLUMNS = 10

export function CodeTween({
  tween,
  progress,
  config,
  ...preProps
}: CodeTweenProps) {
  const stepInfo = useCodeShift({
    tween,
    theme: config.theme,
  })

  const { element, dimensions } = useDimensions(
    stepInfo.code,
    map(tween, tween => tween.focus),
    config.minColumns || DEFAULT_MIN_COLUMNS,
    config.lineNumbers || false,
    [config.parentHeight]
  )
  // return (
  //   <BeforeDimensions
  //     element={element}
  //     htmlProps={preProps}
  //   />
  // )

  return !dimensions ? (
    <BeforeDimensions
      element={element}
      htmlProps={preProps}
    />
  ) : (
    <AfterDimensions
      dimensions={dimensions}
      stepInfo={stepInfo}
      config={config}
      progress={progress}
      htmlProps={preProps}
    />
  )
}

function BeforeDimensions({
  element,
  htmlProps,
}: {
  element: React.ReactNode
  htmlProps?: HTMLProps
}) {
  return (
    <Wrapper
      htmlProps={htmlProps}
      // avoid scrollbars when measuring
      style={{ overflow: "hidden", opacity: 0 }}
    >
      {element}
    </Wrapper>
  )
}

function AfterDimensions({
  config: {
    minZoom = 1,
    maxZoom = 1,
    horizontalCenter = false,
    theme,
  },
  dimensions,
  stepInfo,
  progress,
  htmlProps,
}: {
  dimensions: NonNullable<Dimensions>
  stepInfo: CodeShift
  config: CodeConfig
  progress: number
  htmlProps: HTMLProps
}) {
  const { bg, fg } = getCodeColors(theme)
  return (
    <Wrapper
      htmlProps={htmlProps}
      style={{
        opacity: 1,
        backgroundColor: bg,
        color: fg,
        ["colorScheme" as any]: getColorScheme(theme),
        ["--ch-selection-background" as any]: getColor(
          theme,
          ColorName.SelectionBackground
        ),
      }}
    >
      <SmoothLines
        codeStep={stepInfo}
        progress={progress}
        dimensions={dimensions}
        // TODO move to dimensions?
        minZoom={minZoom}
        maxZoom={maxZoom}
        center={horizontalCenter}
        theme={theme}
      />
    </Wrapper>
  )
}

function Wrapper({
  htmlProps,
  style,
  children,
}: {
  htmlProps?: HTMLProps
  style: React.CSSProperties
  children: React.ReactNode
}) {
  return (
    <div
      {...htmlProps}
      style={{
        margin: 0,
        padding: 0,
        // using this instead of <pre> because https://github.com/code-hike/codehike/issues/120
        whiteSpace: "pre",
        ...style,
        ...htmlProps?.style,
      }}
      children={children}
    />
  )
}
