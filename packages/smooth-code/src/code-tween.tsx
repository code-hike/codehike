import React from "react"
import { useDimensions, Dimensions } from "./use-dimensions"
import { IRawTheme } from "vscode-textmate"
import { DEFAULT_THEME } from "./themes"
import {
  FullTween,
  Code,
  map,
  FocusString,
} from "@code-hike/utils"
import {
  useStepParser,
  CodeAnnotation,
  CodeShift,
} from "./partial-step-parser"
import { SmoothLines } from "./smooth-lines"
import { getThemeDefaultColors } from "./themes"

type HTMLProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLPreElement>,
  HTMLPreElement
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

    theme = (DEFAULT_THEME as unknown) as IRawTheme,
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
  const { bg, fg } = getThemeDefaultColors(theme)

  return (
    <Wrapper
      htmlProps={htmlProps}
      style={{ opacity: 1, backgroundColor: bg, color: fg }}
    >
      <SmoothLines
        codeStep={stepInfo}
        progress={progress}
        dimensions={dimensions}
        // TODO move to dimensions?
        minZoom={minZoom}
        maxZoom={maxZoom}
        center={horizontalCenter}
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
    <pre
      {...htmlProps}
      style={{
        overflow: "auto",
        margin: 0,

        // hack https://code.iamkate.com/html-and-css/fixing-browsers-broken-monospace-font-handling/
        // fontSize: "1em",
        // fontFamily: "monospace,monospace",
        // lineHeight: `${LINE_HEIGHT}em`,
        ...style,
        ...htmlProps?.style,
      }}
    >
      {children}
    </pre>
  )
}
