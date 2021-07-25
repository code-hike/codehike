import React from "react"
import { SmoothLines } from "@code-hike/smooth-lines"
import { useDimensions, Dimensions } from "./use-dimensions"
import { useLineProps } from "line-props"
import { IRawTheme } from "vscode-textmate"
import DEFAULT_THEME from "shiki/themes/dark-plus.json"
import { FocusString } from "./focus-parser"
import { Tween } from "@code-hike/utils"

type HTMLProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLPreElement>,
  HTMLPreElement
>

export type CodeProps = {
  code: Tween<string>
  focus: Tween<FocusString>
  progress: number
  language: string
  parentHeight?: number
  minColumns?: number
  minZoom?: number
  maxZoom?: number
  horizontalCenter?: boolean
  theme?: IRawTheme
  htmlProps?: HTMLProps
}

export function Code({
  code,
  focus,
  parentHeight,
  htmlProps,
  ...rest
}: CodeProps) {
  const { element, dimensions } = useDimensions(
    code,
    focus,
    [parentHeight]
  )

  return dimensions ? (
    <AfterDimensions
      {...{
        code,
        focus,
        dimensions,
        htmlProps,
      }}
      {...rest}
    />
  ) : (
    <BeforeDimensions
      element={element}
      htmlProps={htmlProps}
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
  code,
  focus,
  progress,
  language,
  minColumns = 40,
  minZoom = 0.5,
  maxZoom = 1.5,
  horizontalCenter = false,
  htmlProps,
  theme = (DEFAULT_THEME as unknown) as IRawTheme,
  dimensions,
}: CodeProps & { dimensions: NonNullable<Dimensions> }) {
  const {
    prevLines,
    nextLines,
    prevFocusIndexes,
    nextFocusIndexes,
    backgroundColor,
    color,
  } = useLineProps(code, focus, language, theme)

  return (
    <Wrapper
      htmlProps={htmlProps}
      style={{ opacity: 1, backgroundColor, color }}
    >
      <SmoothLines
        progress={progress}
        containerWidth={dimensions.width}
        containerHeight={dimensions.height}
        lineHeight={dimensions.lineHeight}
        lineWidth={
          dimensions.lineWidths.map(lw =>
            Math.max(lw, dimensions.colWidth * minColumns)
          ) as [number, number]
        }
        prevLines={prevLines}
        nextLines={nextLines}
        prevFocus={prevFocusIndexes}
        nextFocus={nextFocusIndexes}
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
