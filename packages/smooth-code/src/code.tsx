import React from "react"
import { useDimensions, Dimensions } from "./use-dimensions"
import { IRawTheme } from "vscode-textmate"
import DEFAULT_THEME from "shiki/themes/dark-plus.json"
import { FocusString } from "./focus-parser"
import { Tween } from "@code-hike/utils"
import {
  useStepParser,
  CodeAnnotation,
  CodeStep,
} from "./step-parser"
import { SmoothLines } from "./smooth-lines"
import { getThemeDefaultColors } from "./themes"

type HTMLProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLPreElement>,
  HTMLPreElement
>

export type CodeProps = {
  code: Tween<string>
  focus: Tween<FocusString>
  progress: number
  language: string
  /* not really the height, when this changes we measure everything again */
  parentHeight?: any
  minColumns?: number
  minZoom?: number
  maxZoom?: number
  horizontalCenter?: boolean
  theme?: IRawTheme
  htmlProps?: HTMLProps
  annotations?: Tween<CodeAnnotation[]>
}

const DEFAULT_MIN_COLUMNS = 40

export function Code(props: CodeProps) {
  const {
    code,
    focus,
    parentHeight,
    htmlProps,
    theme = (DEFAULT_THEME as unknown) as IRawTheme,
    language,
    annotations,
    minColumns = DEFAULT_MIN_COLUMNS,
  } = props

  const { element, dimensions } = useDimensions(
    code,
    focus,
    minColumns,
    [parentHeight]
  )

  const stepInfo = useStepParser({
    code,
    theme,
    lang: language,
    focus,
    annotations,
  })

  return !dimensions ? (
    <BeforeDimensions
      element={element}
      htmlProps={htmlProps}
    />
  ) : (
    <AfterDimensions
      dimensions={dimensions}
      stepInfo={stepInfo}
      {...props}
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
  progress,
  minZoom = 0.5,
  maxZoom = 1.5,
  horizontalCenter = false,
  htmlProps,
  theme = (DEFAULT_THEME as unknown) as IRawTheme,
  dimensions,
  stepInfo,
}: CodeProps & {
  dimensions: NonNullable<Dimensions>
  stepInfo: CodeStep
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
        margin: 0,
        ...style,
        ...htmlProps?.style,
      }}
    >
      <code>{children}</code>
    </pre>
  )
}
