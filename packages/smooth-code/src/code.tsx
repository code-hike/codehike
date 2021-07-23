import React from "react"
import { SmoothLines } from "@code-hike/smooth-lines"
import { useDimensions } from "./use-dimensions"
import { useLineProps } from "line-props"
import { IRawTheme } from "vscode-textmate"
import DEFAULT_THEME from "shiki/themes/dark-plus.json"

export type CodeProps = {
  prevCode: string
  prevFocus: string | null
  nextCode: string
  nextFocus: string | null
  progress: number
  language: string
  parentHeight?: number
  minColumns?: number
  minZoom?: number
  maxZoom?: number
  horizontalCenter?: boolean
  theme: IRawTheme
  htmlProps?: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLPreElement>,
    HTMLPreElement
  >
}

export function Code({
  prevCode,
  prevFocus,
  nextCode,
  nextFocus,
  progress,
  language,
  parentHeight,
  minColumns = 40,
  minZoom = 0.5,
  maxZoom = 1.5,
  horizontalCenter = false,
  htmlProps,
  theme = (DEFAULT_THEME as unknown) as IRawTheme,
}: CodeProps) {
  const { element, dimensions } = useDimensions(
    { prev: prevCode, next: nextCode },
    { prev: prevFocus, next: nextFocus },
    [parentHeight]
  )

  const {
    prevLines,
    nextLines,
    prevFocusIndexes,
    nextFocusIndexes,
    backgroundColor,
    color,
  } = useLineProps(
    prevCode,
    nextCode,
    language,
    prevFocus,
    nextFocus,
    theme
  )

  return (
    <pre
      {...htmlProps}
      className={`language-${language}`}
      style={{
        backgroundColor,
        color,
        margin: 0,
        opacity: dimensions ? 1 : 0,
        overflow: dimensions ? undefined : "hidden", // avoid scrollbars when measuring
        ...htmlProps?.style,
      }}
    >
      <code>
        {dimensions ? (
          <SmoothLines
            progress={progress}
            containerWidth={dimensions.width}
            containerHeight={dimensions.height}
            lineHeight={dimensions.lineHeight}
            lineWidth={
              dimensions.lineWidths.map(lw =>
                Math.max(
                  lw,
                  dimensions.colWidth * minColumns
                )
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
        ) : (
          element
        )}
      </code>
    </pre>
  )
}
