import React from "react"
import { useDimensions, Dimensions } from "./use-dimensions"
import { IRawTheme } from "vscode-textmate"
import { DEFAULT_THEME } from "./themes"
import { FocusString } from "./focus-parser"
import {
  Tween,
  FullTween,
  Code,
  map,
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
}

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
  htmlProps?: HTMLProps
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

const DEFAULT_MIN_COLUMNS = 40

export function CodeTween({
  tween,
  progress,
  config,
}: CodeTweenProps) {
  const stepInfo = useCodeShift({
    tween,
    theme: config.theme,
  })

  const defaultHeight = React.useMemo(() => {
    const focusedLinesCount =
      stepInfo.lastFocusedLineNumber.prev -
      stepInfo.firstFocusedLineNumber.prev +
      3
    return `${focusedLinesCount * 1}rem`
  }, [])
  const htmlProps = {
    ...config?.htmlProps,
    style: {
      height: defaultHeight,
      ...config?.htmlProps?.style,
    },
  }

  const { element, dimensions } = useDimensions(
    stepInfo.code,
    map(tween, tween => tween.focus),
    config.minColumns || DEFAULT_MIN_COLUMNS,
    [config.parentHeight]
  )

  return !dimensions ? (
    <BeforeDimensions
      element={element}
      htmlProps={htmlProps}
    />
  ) : (
    <AfterDimensions
      dimensions={dimensions}
      stepInfo={stepInfo}
      config={{ ...config, htmlProps }}
      progress={progress}
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
    htmlProps,
    theme = (DEFAULT_THEME as unknown) as IRawTheme,
  },
  dimensions,
  stepInfo,
  progress,
}: {
  dimensions: NonNullable<Dimensions>
  stepInfo: CodeShift
  config: CodeConfig
  progress: number
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
        ...style,
        ...htmlProps?.style,
      }}
      // TODO use classer
      className="ch-code-wrapper"
    >
      <code>{children}</code>
    </pre>
  )
}
